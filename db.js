// db.js

const sqlite3 = require('sqlite3').verbose();
const DB_PATH = process.env.DB_PATH || 'guardimoto.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log(`Connected to the SQLite database: ${DB_PATH}`);
        db.run(`
        CREATE TABLE IF NOT EXISTS User (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE NOT NULL,
            first_name TEXT,
            last_name TEXT,
            email TEXT UNIQUE,
            phone_number TEXT UNIQUE,
            password TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS Device (
                device_id INTEGER PRIMARY KEY AUTOINCREMENT,
                unique_serial_number TEXT UNIQUE NOT NULL,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                battery_level INTEGER,
                gsm_signal INTEGER,
                firmware_version TEXT,
                is_paired BOOLEAN DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(user_id)
            );
        `);
    }
});

module.exports = db;