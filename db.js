import sqlite3pkg from 'sqlite3';
import { config } from "dotenv";

config();

const { verbose } = sqlite3pkg;
const sqlite3 = verbose();
const DB_PATH = process.env.DB_PATH || 'guardimoto.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(
      `[\x1b[41m\x1b[30mError\x1b[0m   ] Error connecting to database ${err.message}`
    );
  } else {
    console.log(
      `[\x1b[36mDATABASE\x1b[0m] Connected to the SQLite database [ \x1b[2m${DB_PATH}\x1b[0m ]`
    );
    db.run(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        firebase_uid TEXT UNIQUE NOT NULL,
        first_name TEXT,
        last_name TEXT,
        profile_picture TEXT,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT UNIQUE,
        password TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Device (
        device_id INTEGER PRIMARY KEY AUTOINCREMENT,
        unique_serial_number TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        battery_level INTEGER,
        gsm_signal INTEGER,
        firmware_version TEXT,
        last_online TEXT,
        is_paired BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Alert_Log (
        alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER NOT NULL,
        alert_type TEXT,
        alert_message TEXT,
        alert_level TEXT DEFAULT 'info',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES Device(device_id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Device_Config (
        config_id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER NOT NULL,
        relay_ignition BOOLEAN DEFAULT 0,
        relay_siren BOOLEAN DEFAULT 0,
        gyroscope_sensitivity REAL DEFAULT 1.0,
        sms_enabled BOOLEAN DEFAULT 1,
        rfid_required BOOLEAN DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES Device(device_id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Device_Sensor_Log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER NOT NULL,
        latitude REAL,
        longitude REAL,
        gyroscope_x REAL,
        gyroscope_y REAL,
        gyroscope_z REAL,
        rfid_tag TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES Device(device_id)
      );
    `);
  }
});

export default db;
