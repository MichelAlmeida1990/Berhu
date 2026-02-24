// SQLite Database for Berhu Platform
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Database file path
const dbPath = path.join(__dirname, 'berhu.db');

// Create database connection
const db = new Database(dbPath);

// Initialize database tables
function initializeDatabase() {
    console.log('🗄️ Initializing SQLite database...');
    
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

    // Insert demo user if not exists
    const existingDemo = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@berhu.com');
    if (!existingDemo) {
        const hashedPassword = bcrypt.hashSync('demo123', 10);
        db.prepare(`
            INSERT INTO users (name, email, password, plan) 
            VALUES (?, ?, ?, ?)
        `).run('Usuária Demo', 'demo@berhu.com', hashedPassword, 'premium');
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
    }
};

// Close database connection
function closeDatabase() {
    db.close();
    console.log('📁 Database connection closed');
}

// Initialize database on module load
initializeDatabase();

module.exports = {
    db,
    initializeDatabase,
    closeDatabase,
    ...dbHelpers
};
