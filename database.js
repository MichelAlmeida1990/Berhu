// SQLite Database for Berhu Platform
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, 'berhu.db');

// Ensure parent directory exists (useful for Render persistent disk mounts)
const dbDir = path.dirname(dbPath);
if (dbDir && dbDir !== '.' && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Initialize database tables
function initializeDatabase() {
    console.log(' Initializing SQLite database...');
    
    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            plan TEXT DEFAULT 'basic',
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Courses table
    db.exec(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            original_price REAL,
            rating REAL DEFAULT 0,
            students INTEGER DEFAULT 0,
            duration TEXT,
            level TEXT,
            image TEXT,
            video TEXT,
            description TEXT,
            instructor TEXT,
            lessons INTEGER DEFAULT 0,
            certificate BOOLEAN DEFAULT 0,
            highlights TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Appointments table
    db.exec(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            service TEXT NOT NULL,
            notes TEXT,
            status TEXT DEFAULT 'scheduled',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Therapy sessions table (expanded for evaluations)
    db.exec(`
        CREATE TABLE IF NOT EXISTS therapy_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            therapist_id INTEGER,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            notes TEXT,
            metrics TEXT,
            recommendations TEXT,
            next_session TEXT,
            improvements TEXT,
            challenges TEXT,
            rating INTEGER,
            is_visible_to_client INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (therapist_id) REFERENCES users (id)
        )
    `);

    // User progress table
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            course_id INTEGER,
            progress_percentage REAL DEFAULT 0,
            completed_lessons INTEGER DEFAULT 0,
            total_lessons INTEGER DEFAULT 0,
            last_accessed DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    `);

    // Radionic treatments table
    db.exec(`
        CREATE TABLE IF NOT EXISTS radionic_treatments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            client_name TEXT NOT NULL,
            treatment_date TEXT NOT NULL,
            group_name TEXT,
            objective TEXT,
            execution_days INTEGER DEFAULT 21,
            therapist_id INTEGER,
            is_visible_to_client INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (therapist_id) REFERENCES users (id)
        )
    `);

    // Quantum commands table
    db.exec(`
        CREATE TABLE IF NOT EXISTS quantum_commands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            treatment_id INTEGER NOT NULL,
            command_name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'enviado',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (treatment_id) REFERENCES radionic_treatments (id)
        )
    `);

    // Life sectors table
    db.exec(`
        CREATE TABLE IF NOT EXISTS life_sectors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            treatment_id INTEGER NOT NULL,
            sector_number INTEGER NOT NULL,
            sector_name TEXT NOT NULL,
            activated BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (treatment_id) REFERENCES radionic_treatments (id)
        )
    `);

    // Emotional frequencies table
    db.exec(`
        CREATE TABLE IF NOT EXISTS emotional_frequencies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            god_vision TEXT,
            life_vision TEXT,
            level TEXT,
            frequency_range TEXT,
            emotion TEXT,
            process TEXT,
            color_code TEXT
        )
    `);

    // Insert default admin user if not exists
    const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@berhu.com');
    if (!existingAdmin) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.prepare(`
            INSERT INTO users (name, email, password, plan) 
            VALUES (?, ?, ?, ?)
        `).run('Fabiana Berkana', 'admin@berhu.com', hashedPassword, 'admin');
        console.log('👤 Default admin user created');
    }

    // Insert demo therapist user if not exists
    const existingTherapist = db.prepare('SELECT id FROM users WHERE email = ?').get('therapist@berhu.com');
    if (!existingTherapist) {
        const hashedPassword = bcrypt.hashSync('therapist123', 10);
        db.prepare(`
            INSERT INTO users (name, email, password, plan) 
            VALUES (?, ?, ?, ?)
        `).run('Terapeuta Demo', 'therapist@berhu.com', hashedPassword, 'therapist');
        console.log('👤 Default therapist user created');
    }

    // Insert demo user if not exists
    const existingDemo = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@berhu.com');
    if (!existingDemo) {
        const hashedPassword = bcrypt.hashSync('demo123', 10);
        db.prepare(`
            INSERT INTO users (name, email, password, plan) 
            VALUES (?, ?, ?, ?)
        `).run('Usuária Demo', 'demo@berhu.com', hashedPassword, 'basic');
        console.log('👤 Default demo user created');
    }

    // Insert sample courses if table is empty
    const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    if (courseCount === 0) {
        const sampleCourses = [
            {
                title: "Meditação para Iniciantes",
                category: "meditation",
                price: 197,
                original_price: 297,
                rating: 4.8,
                students: 1234,
                duration: "6 semanas",
                level: "Iniciante",
                image: "https://picsum.photos/seed/meditation1/400/300.jpg",
                video: "https://www.w3schools.com/html/mov_bbb.mp4",
                description: "Aprenda as bases da meditação e transforme sua vida com práticas simples e eficazes.",
                instructor: "Fabiana Berkana",
                lessons: 24,
                certificate: 1,
                highlights: JSON.stringify(["Técnicas de respiração", "Meditação guiada", "Mindfulness", "Redução de estresse"])
            },
            {
                title: "Reiki Nível 1 - Iniciação",
                category: "therapy",
                price: 297,
                original_price: 397,
                rating: 4.9,
                students: 892,
                duration: "8 semanas",
                level: "Iniciante",
                image: "https://picsum.photos/seed/reiki1/400/300.jpg",
                video: "https://www.w3schools.com/html/mov_bbb.mp4",
                description: "Iniciação completa em Reiki, incluindo alinhamento dos chakras e técnicas de cura.",
                instructor: "Fabiana Berkana",
                lessons: 32,
                certificate: 1,
                highlights: JSON.stringify(["História do Reiki", "Posicionamento das mãos", "Auto-aplicação", "Cura em outros"])
            }
        ];

        const insertCourse = db.prepare(`
            INSERT INTO courses (title, category, price, original_price, rating, students, duration, level, image, video, description, instructor, lessons, certificate, highlights)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleCourses.forEach(course => {
            insertCourse.run(
                course.title, course.category, course.price, course.original_price,
                course.rating, course.students, course.duration, course.level,
                course.image, course.video, course.description, course.instructor,
                course.lessons, course.certificate, course.highlights
            );
        });
        console.log('📚 Sample courses inserted');
    }

    console.log('✅ Database initialized successfully');
}

// Insert demo data for demo user only
function insertDemoData() {
    // Get demo user ID
    const demoUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@berhu.com');
    if (!demoUser) return;

    // Check if demo data already exists
    const existingAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE user_id = ?').get(demoUser.id).count;
    const existingSessions = db.prepare('SELECT COUNT(*) as count FROM therapy_sessions WHERE user_id = ?').get(demoUser.id).count;
    
    if (existingAppointments > 0 || existingSessions > 0) {
        return; // Demo data already exists
    }

    // Insert demo appointments
    const demoAppointments = [
        {
            date: '2024-03-15',
            time: '14:00',
            service: 'Reiki',
            notes: 'Sessão de alinhamento energético'
        },
        {
            date: '2024-03-22',
            time: '16:00',
            service: 'Meditação Guiada',
            notes: 'Técnica de respiração e mindfulness'
        },
        {
            date: '2024-04-05',
            time: '10:00',
            service: 'Consulta Terapêutica',
            notes: 'Avaliação geral e acompanhamento'
        }
    ];

    demoAppointments.forEach(apt => {
        db.prepare(`
            INSERT INTO appointments (user_id, date, time, service, notes) 
            VALUES (?, ?, ?, ?, ?)
        `).run(demoUser.id, apt.date, apt.time, apt.service, apt.notes);
    });

    // Insert demo therapy sessions
    const therapistId = db.prepare('SELECT id FROM users WHERE email = ?').get('therapist@berhu.com')?.id || 1;
    
    const demoSessions = [
        {
            date: '2024-03-15',
            type: 'Reiki',
            notes: 'Paciente apresentou boa receptividade à energia. Chakras alinhados ao final da sessão.',
            metrics: { energy: 8, stress: 3, clarity: 7 },
            recommendations: 'Continuar com meditação diária e beber mais água.',
            improvements: ['Melhora na qualidade do sono', 'Redução da ansiedade'],
            challenges: ['Dificuldade em manter foco durante meditação'],
            rating: 5
        },
        {
            date: '2024-03-22',
            type: 'Meditação Guiada',
            notes: 'Sessão focada em técnicas de respiração. Paciente conseguiu manter concentração por 20 minutos.',
            metrics: { energy: 7, stress: 2, clarity: 8 },
            recommendations: 'Praticar respiração profunda 3x ao dia.',
            improvements: ['Maior clareza mental', 'Melhora na respiração'],
            challenges: ['Mente ainda um pouco agitada no início'],
            rating: 4
        }
    ];

    demoSessions.forEach(session => {
        db.prepare(`
            INSERT INTO therapy_sessions (
                user_id, therapist_id, date, type, notes, metrics, recommendations, next_session, improvements, challenges, rating, is_visible_to_client
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            demoUser.id,
            therapistId,
            session.date,
            session.type,
            session.notes,
            JSON.stringify(session.metrics),
            session.recommendations,
            null,
            JSON.stringify(session.improvements),
            JSON.stringify(session.challenges),
            session.rating,
            1
        );
    });

    console.log('📊 Demo data inserted for demo user');
}

// Database helper functions
const dbHelpers = {
    // User operations
    getUserByEmail: (email) => {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    },

    getUserById: (id) => {
        return db.prepare('SELECT id, name, email, plan, avatar, created_at FROM users WHERE id = ?').get(id);
    },

    createUser: (name, email, password) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = db.prepare(`
            INSERT INTO users (name, email, password) 
            VALUES (?, ?, ?)
        `).run(name, email, hashedPassword);
        return result.lastInsertRowid;
    },

    updateUser: (id, updates) => {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(id);
        return db.prepare(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    },

    // Course operations
    getAllCourses: () => {
        return db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
    },

    getCourseById: (id) => {
        return db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    },

    // Appointment operations
    createAppointment: (userId, date, time, service, notes) => {
        const result = db.prepare(`
            INSERT INTO appointments (user_id, date, time, service, notes) 
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, date, time, service, notes);
        return result.lastInsertRowid;
    },

    getAppointmentById: (id) => {
        return db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    },

    updateAppointment: (id, updates) => {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(id);
        return db.prepare(`UPDATE appointments SET ${fields} WHERE id = ?`).run(...values);
    },

    getUserAppointments: (userId) => {
        return db.prepare('SELECT * FROM appointments WHERE user_id = ? ORDER BY date DESC').all(userId);
    },

    getAllAppointments: () => {
        return db.prepare(`
            SELECT a.*, u.name as user_name, u.email as user_email 
            FROM appointments a 
            JOIN users u ON a.user_id = u.id 
            ORDER BY a.date DESC
        `).all();
    },

    // Therapy session operations
    createTherapySession: (session) => {
        const result = db.prepare(`
            INSERT INTO therapy_sessions (
                user_id, therapist_id, date, type, notes, metrics, recommendations, next_session, improvements, challenges, rating, is_visible_to_client
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            session.user_id,
            session.therapist_id,
            session.date,
            session.type,
            session.notes || null,
            session.metrics ? JSON.stringify(session.metrics) : null,
            session.recommendations || null,
            session.next_session || null,
            session.improvements ? JSON.stringify(session.improvements) : null,
            session.challenges ? JSON.stringify(session.challenges) : null,
            session.rating || null,
            session.is_visible_to_client !== undefined ? session.is_visible_to_client : 1
        );
        return result.lastInsertRowid;
    },

    getUserTherapySessions: (userId, onlyVisible = false) => {
        let query = 'SELECT * FROM therapy_sessions WHERE user_id = ?';
        if (onlyVisible) query += ' AND is_visible_to_client = 1';
        query += ' ORDER BY date DESC';
        const sessions = db.prepare(query).all(userId);
        return sessions.map(session => ({
            ...session,
            metrics: session.metrics ? JSON.parse(session.metrics) : null,
            improvements: session.improvements ? JSON.parse(session.improvements) : [],
            challenges: session.challenges ? JSON.parse(session.challenges) : []
        }));
    },
    getTherapistSessions: (therapistId) => {
        const sessions = db.prepare('SELECT * FROM therapy_sessions WHERE therapist_id = ? ORDER BY date DESC').all(therapistId);
        return sessions.map(session => ({
            ...session,
            metrics: session.metrics ? JSON.parse(session.metrics) : null,
            improvements: session.improvements ? JSON.parse(session.improvements) : [],
            challenges: session.challenges ? JSON.parse(session.challenges) : []
        }));
    },

    // Progress operations
    updateProgress: (userId, courseId, progressPercentage, completedLessons, totalLessons) => {
        const existing = db.prepare(`
            SELECT id FROM user_progress 
            WHERE user_id = ? AND course_id = ?
        `).get(userId, courseId);

        if (existing) {
            return db.prepare(`
                UPDATE user_progress 
                SET progress_percentage = ?, completed_lessons = ?, total_lessons = ?, 
                    updated_at = CURRENT_TIMESTAMP, last_accessed = CURRENT_TIMESTAMP
                WHERE user_id = ? AND course_id = ?
            `).run(progressPercentage, completedLessons, totalLessons, userId, courseId);
        } else {
            const result = db.prepare(`
                INSERT INTO user_progress (user_id, course_id, progress_percentage, completed_lessons, total_lessons, last_accessed)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `).run(userId, courseId, progressPercentage, completedLessons, totalLessons);
            return result;
        }
    },

    getUserProgress: (userId) => {
        return db.prepare(`
            SELECT up.*, c.title as course_title, c.image as course_image
            FROM user_progress up
            JOIN courses c ON up.course_id = c.id
            WHERE up.user_id = ?
            ORDER BY up.updated_at DESC
        `).all(userId);
    },

    // Admin operations
    getAllUsers: () => {
        return db.prepare('SELECT id, name, email, plan, avatar, created_at FROM users ORDER BY created_at DESC').all();
    },

    getStats: () => {
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
        const appointmentCount = db.prepare('SELECT COUNT(*) as count FROM appointments').get().count;
        const sessionCount = db.prepare('SELECT COUNT(*) as count FROM therapy_sessions').get().count;

        return {
            users: userCount,
            courses: courseCount,
            appointments: appointmentCount,
            therapySessions: sessionCount
        };
    },

    // Initialize emotional frequencies
    initializeEmotionalFrequencies: () => {
        const existingFreqs = db.prepare('SELECT COUNT(*) as count FROM emotional_frequencies').get().count;
        if (existingFreqs === 0) {
            const frequencies = [
                { god_vision: 'Eu', life_vision: 'Iluminação', level: '700-1000', frequency_range: '700-1000', emotion: 'Inefável', process: 'Consciência Pura', color_code: '#9333ea' },
                { god_vision: 'Amor Incondicional', life_vision: 'Paz', level: '600', frequency_range: '600', emotion: 'Bem-aventurança', process: 'Revelação', color_code: '#a855f7' },
                { god_vision: 'Alegria', life_vision: 'Serena', level: '540', frequency_range: '540', emotion: 'Júbilo', process: 'Intenção Consciente', color_code: '#c084fc' },
                { god_vision: 'Amor', life_vision: 'Harmonia', level: '500', frequency_range: '500', emotion: 'Reverência', process: 'Revelação', color_code: '#d8b4fe' },
                { god_vision: 'Razão', life_vision: 'Compreensão', level: '400', frequency_range: '400', emotion: 'Serenidade', process: 'Abstração', color_code: '#e9d5ff' },
                { god_vision: 'Aceitação', life_vision: 'Perdão', level: '350', frequency_range: '350', emotion: 'Vontade', process: 'Transcendência', color_code: '#f3e8ff' },
                { god_vision: 'Vontade', life_vision: 'Otimismo', level: '310', frequency_range: '310', emotion: 'Intencionalidade', process: 'Intenção', color_code: '#faf5ff' },
                { god_vision: 'Neutralidade', life_vision: 'Confiança', level: '250', frequency_range: '250', emotion: 'Confiança', process: 'Satisfação', color_code: '#fef3c7' },
                { god_vision: 'Coragem', life_vision: 'Afirmação', level: '200', frequency_range: '200', emotion: 'Empoderamento', process: 'Afirmação', color_code: '#fde68a' },
                { god_vision: 'Pride', life_vision: 'Desdém', level: '175', frequency_range: '175', emotion: 'Desprezo', process: 'Agressão', color_code: '#fcd34d' },
                { god_vision: 'Raiva', life_vision: 'Ódio', level: '150', frequency_range: '150', emotion: 'Raiva', process: 'Agitação', color_code: '#fbbf24' },
                { god_vision: 'Desejo', life_vision: 'Apego', level: '125', frequency_range: '125', emotion: 'Desejo', process: 'Escravização', color_code: '#f59e0b' },
                { god_vision: 'Medo', life_vision: 'Ansiedade', level: '100', frequency_range: '100', emotion: 'Medo', process: 'Retraimento', color_code: '#ea580c' },
                { god_vision: 'Tristeza', life_vision: 'Arrependimento', level: '75', frequency_range: '75', emotion: 'Tristeza', process: 'Desespero', color_code: '#dc2626' },
                { god_vision: 'Apatia', life_vision: 'Desespero', level: '50', frequency_range: '50', emotion: 'Desesperança', process: 'Abandono', color_code: '#b91c1c' },
                { god_vision: 'Culpa', life_vision: 'Autodestruição', level: '30', frequency_range: '30', emotion: 'Culpa', process: 'Destruição', color_code: '#991b1b' },
                { god_vision: 'Vergonha', life_vision: 'Miséria', level: '20', frequency_range: '20', emotion: 'Humilhação', process: 'Eliminação', color_code: '#7f1d1d' }
            ];

            frequencies.forEach(freq => {
                db.prepare(`
                    INSERT INTO emotional_frequencies (god_vision, life_vision, level, frequency_range, emotion, process, color_code)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `).run(freq.god_vision, freq.life_vision, freq.level, freq.frequency_range, freq.emotion, freq.process, freq.color_code);
            });
            console.log('🎵 Emotional frequencies initialized');
        }
    },

    // Radionic treatments operations
    createRadionicTreatment: (treatmentData) => {
        const result = db.prepare(`
            INSERT INTO radionic_treatments (user_id, client_name, treatment_date, group_name, objective, execution_days, therapist_id, is_visible_to_client)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(treatmentData.userId, treatmentData.clientName, treatmentData.treatmentDate, treatmentData.groupName, 
                treatmentData.objective, treatmentData.executionDays || 21, treatmentData.therapistId, treatmentData.is_visible_to_client !== false ? 1 : 0);
        return result;
    },

    addQuantumCommand: (commandData) => {
        return db.prepare(`
            INSERT INTO quantum_commands (treatment_id, command_name, description, status)
            VALUES (?, ?, ?, ?)
        `).run(commandData.treatmentId, commandData.commandName, commandData.description, commandData.status || 'enviado');
    },

    addLifeSector: (sectorData) => {
        return db.prepare(`
            INSERT INTO life_sectors (treatment_id, sector_number, sector_name, activated)
            VALUES (?, ?, ?, ?)
        `).run(sectorData.treatmentId, sectorData.sectorNumber, sectorData.sectorName, sectorData.activated ? 1 : 0);
    },

    getRadionicTreatment: (treatmentId) => {
        const treatment = db.prepare('SELECT * FROM radionic_treatments WHERE id = ?').get(treatmentId);
        if (treatment) {
            treatment.commands = db.prepare('SELECT * FROM quantum_commands WHERE treatment_id = ?').all(treatmentId);
            treatment.sectors = db.prepare('SELECT * FROM life_sectors WHERE treatment_id = ? ORDER BY sector_number').all(treatmentId);
        }
        return treatment;
    },

    getAllRadionicTreatments: () => {
        return db.prepare('SELECT * FROM radionic_treatments ORDER BY created_at DESC').all();
    },

    getEmotionalFrequencies: () => {
        return db.prepare('SELECT * FROM emotional_frequencies ORDER BY frequency_range DESC').all();
    },

    getClientRadionicTreatments: (userId) => {
        const treatments = db.prepare('SELECT * FROM radionic_treatments WHERE user_id = ? AND is_visible_to_client = 1 ORDER BY created_at DESC').all(userId);
        return treatments.map(treatment => {
            const commands = db.prepare('SELECT * FROM quantum_commands WHERE treatment_id = ?').all(treatment.id);
            const sectors = db.prepare('SELECT * FROM life_sectors WHERE treatment_id = ? ORDER BY sector_number').all(treatment.id);
            return {
                ...treatment,
                commands,
                sectors,
                type: 'Mapa Radiônico'
            };
        });
    }
};

// Close database connection
function closeDatabase() {
    db.close();
    console.log('📁 Database connection closed');
}

// Initialize database on module load
initializeDatabase();
dbHelpers.initializeEmotionalFrequencies();
insertDemoData();

module.exports = {
    db,
    initializeDatabase,
    closeDatabase,
    ...dbHelpers
};
