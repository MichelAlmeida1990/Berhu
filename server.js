// Backend Server for Berhu Platform
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import database
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';
const allowedOriginsFromEnv = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const devOrigins = [
  'http://localhost:8000', 
  'http://127.0.0.1:8000', 
  'http://localhost:3001', 
  'http://127.0.0.1:3001',
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^http:\/\/localhost:\d+$/
];
const allowedOrigins = IS_PROD
  ? (allowedOriginsFromEnv.length ? allowedOriginsFromEnv : true)
  : devOrigins;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'wasm-unsafe-eval'",
        "https://cdn.jsdelivr.net",
        ...(!IS_PROD ? [
          "http://localhost:3001",
          "http://127.0.0.1:3001",
          "http://localhost:8000",
          "http://127.0.0.1:8000",
          /^http:\/\/127\.0\.0\.1:\d+\/@excalidraw/,
          /^http:\/\/localhost:\d+\/.*$/,
          /^http:\/\/127\.0\.0\.1:\d+\/.*$/
        ] : [])
      ],
      imgSrc: ["'self'", "data:", "https://picsum.photos", "https://www.w3schools.com"],
      connectSrc: [
        "'self'",
        ...(!IS_PROD ? [
          "http://localhost:3001",
          "http://127.0.0.1:3001",
          "http://localhost:8000",
          "http://127.0.0.1:8000",
          /^http:\/\/127\.0\.0\.1:\d+$/
        ] : [])
      ],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https://www.w3schools.com"],
      frameSrc: ["'none'"],
    },
  },
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Muitas tentativas. Tente novamente mais tarde.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Explicit Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirect aliases
app.get(['/home', '/inicio'], (req, res) => {
  res.redirect('/');
});

// Helper Functions
const generateToken = (user) => {
  return Buffer.from(JSON.stringify({
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  })).toString('base64');
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.exp < Date.now()) {
      return res.status(401).json({ error: 'Token expirado' });
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Email ou senha incorretos' });
  }

  // Check password
  const bcrypt = require('bcryptjs');
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Email ou senha incorretos' });
  }

  const token = generateToken(user);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    token
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (db.getUserByEmail(email)) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  const userId = db.createUser(name, email, password);
  const user = db.getUserById(userId);
  const token = generateToken(user);
  
  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    token
  });
});

// User Routes
app.get('/api/user/profile', verifyToken, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json(user);
});

app.put('/api/user/profile', verifyToken, (req, res) => {
  const { name, avatar } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  db.updateUser(req.user.id, updates);
  const updatedUser = db.getUserById(req.user.id);

  res.json(updatedUser);
});

// Courses Routes
app.get('/api/courses', (req, res) => {
  const courses = db.getAllCourses();
  res.json(courses.map(course => ({
    ...course,
    highlights: course.highlights ? JSON.parse(course.highlights) : []
  })));
});

app.get('/api/courses/:id', (req, res) => {
  const course = db.getCourseById(parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ error: 'Curso não encontrado' });
  }
  res.json({
    ...course,
    highlights: course.highlights ? JSON.parse(course.highlights) : []
  });
});

// Appointments Routes
app.get('/api/appointments', verifyToken, (req, res) => {
  const userAppointments = db.getUserAppointments(req.user.id);
  res.json(userAppointments);
});

app.post('/api/appointments', verifyToken, (req, res) => {
  const { date, time, service, notes } = req.body;
  
  const appointmentId = db.createAppointment(req.user.id, date, time, service, notes);
  const appointment = db.getUserAppointments(req.user.id).find(a => a.id === appointmentId);

  res.status(201).json(appointment);
});

app.get('/api/therapist/appointments', verifyToken, (req, res) => {
  if (req.user.plan !== 'therapist' && req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a terapeutas' });
  }
  const appointments = db.getAllAppointments();
  res.json(appointments);
});

app.patch('/api/appointments/:id', verifyToken, (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const existing = db.getAppointmentById(appointmentId);
  if (!existing) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }

  const { status, notes } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const isTherapist = req.user.plan === 'therapist' || req.user.plan === 'admin';
  const isOwner = existing.user_id === req.user.id;

  if (isTherapist) {
    if (status && !['scheduled', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    db.updateAppointment(appointmentId, updates);
    return res.json(db.getAppointmentById(appointmentId));
  }

  if (isOwner) {
    if (status && status !== 'cancelled') {
      return res.status(403).json({ error: 'Ação não permitida' });
    }
    db.updateAppointment(appointmentId, { status: 'cancelled', ...(notes !== undefined ? { notes } : {}) });
    return res.json(db.getAppointmentById(appointmentId));
  }

  return res.status(403).json({ error: 'Acesso negado' });
});

// Therapy Sessions Routes
// Cliente: listar apenas sessões visíveis
app.get('/api/therapy-sessions', verifyToken, (req, res) => {
  const userSessions = db.getUserTherapySessions(req.user.id, true);
  const radionicTreatments = db.getClientRadionicTreatments(req.user.id);
  
  // Combinar sessões de terapia e tratamentos radiônicos
  const allSessions = [...userSessions, ...radionicTreatments]
    .sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
  
  res.json(allSessions);
});

// Terapeuta: criar avaliação para cliente
app.post('/api/therapy-sessions', verifyToken, (req, res) => {
  // Só terapeuta ou admin pode criar avaliação
  if (req.user.plan !== 'therapist' && req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a terapeutas' });
  }
  const {
    user_id, // id do cliente avaliado
    date,
    type,
    notes,
    metrics,
    recommendations,
    next_session,
    improvements,
    challenges,
    rating,
    is_visible_to_client
  } = req.body;
  if (!user_id || !date || !type) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  const sessionId = db.createTherapySession({
    user_id,
    therapist_id: req.user.id,
    date,
    type,
    notes,
    metrics,
    recommendations,
    next_session,
    improvements,
    challenges,
    rating,
    is_visible_to_client
  });
  const session = db.getTherapistSessions(req.user.id).find(s => s.id === sessionId);
  res.status(201).json(session);
});

// Radionic Map Routes
app.get('/api/emotional-frequencies', (req, res) => {
  const frequencies = db.getEmotionalFrequencies();
  res.json(frequencies);
});

app.get('/api/radionic-treatments', verifyToken, (req, res) => {
  // Apenas terapeutas e admin podem ver todos os tratamentos
  if (req.user.plan !== 'therapist' && req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a terapeutas' });
  }
  const treatments = db.getAllRadionicTreatments();
  res.json(treatments);
});

app.post('/api/radionic-treatments', verifyToken, (req, res) => {
  // Apenas terapeutas e admin podem criar tratamentos
  if (req.user.plan !== 'therapist' && req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a terapeutas' });
  }
  
  const { userId, clientName, treatmentDate, groupName, objective, executionDays, commands, sectors, is_visible_to_client } = req.body;
  
  if (!clientName || !treatmentDate || !objective) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  
  // Criar tratamento
  const treatmentResult = db.createRadionicTreatment({
    userId: userId || null, // Se não especificado, fica null (cliente não cadastrado)
    clientName,
    treatmentDate,
    groupName,
    objective,
    executionDays,
    therapistId: req.user.id,
    is_visible_to_client
  });
  
  const treatmentId = treatmentResult.lastInsertRowid;
  
  // Adicionar comandos quânticos
  if (commands && commands.length > 0) {
    commands.forEach(cmd => {
      db.addQuantumCommand({
        treatmentId,
        commandName: cmd.name,
        description: cmd.description,
        status: cmd.status || 'enviado'
      });
    });
  }
  
  // Adicionar setores da vida
  if (sectors && sectors.length > 0) {
    sectors.forEach(sector => {
      db.addLifeSector({
        treatmentId,
        sectorNumber: sector.number,
        sectorName: sector.name,
        activated: sector.activated
      });
    });
  }
  
  const treatment = db.getRadionicTreatment(treatmentId);
  res.status(201).json(treatment);
});

app.get('/api/radionic-treatments/:id', verifyToken, (req, res) => {
  // Apenas terapeutas e admin podem ver detalhes
  if (req.user.plan !== 'therapist' && req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a terapeutas' });
  }
  
  const treatment = db.getRadionicTreatment(req.params.id);
  if (!treatment) {
    return res.status(404).json({ error: 'Tratamento não encontrado' });
  }
  res.json(treatment);
});

// Rota para terapeutas obterem lista de clientes
app.get('/api/clients', verifyToken, (req, res) => {
  // Apenas terapeutas e admin podem ver lista de clientes
  if (req.user.plan !== 'therapist' && req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a terapeutas' });
  }
  
  const clients = db.prepare('SELECT id, name, email, created_at FROM users WHERE plan != "admin" AND plan != "therapist" ORDER BY name').all();
  res.json(clients);
});

// Terapeuta: listar avaliações feitas por ele
app.get('/api/therapist/sessions', verifyToken, (req, res) => {
  if (req.user.plan !== 'therapist' && req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a terapeutas' });
  }
  const sessions = db.getTherapistSessions(req.user.id);
  res.json(sessions);
});

// Admin Routes
app.get('/api/admin/users', verifyToken, (req, res) => {
  if (req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const users = db.getAllUsers();
  res.json(users);
});

app.get('/api/admin/appointments', verifyToken, (req, res) => {
  if (req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const appointments = db.getAllAppointments();
  res.json(appointments);
});

app.get('/api/admin/stats', verifyToken, (req, res) => {
  if (req.user.plan !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const stats = db.getStats();
  res.json(stats);
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌟 Berhu Backend Server running on port ${PORT}`);
  console.log(`📱 Frontend available at: http://localhost:8000`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
});

module.exports = app;
