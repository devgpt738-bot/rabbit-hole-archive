import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const db = new Database(path.join(__dirname, 'rabbit_hole.db'), { verbose: console.log });

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    auth_provider TEXT DEFAULT 'manual',
    scrolling_time_seconds INTEGER DEFAULT 0,
    reading_time_seconds INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    theory_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, theory_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS read_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    theory_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, theory_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS visitor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    os TEXT,
    device TEXT,
    country TEXT,
    city TEXT,
    threat_score INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepared Statements
export const statements = {
  // Users
  createUser: db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)'),
  getUserByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  getUserById: db.prepare('SELECT id, username, score, auth_provider, scrolling_time_seconds, reading_time_seconds, created_at FROM users WHERE id = ?'),
  updateUserScore: db.prepare('UPDATE users SET score = score + ? WHERE id = ?'),
  updateUserTime: db.prepare('UPDATE users SET scrolling_time_seconds = scrolling_time_seconds + ?, reading_time_seconds = reading_time_seconds + ? WHERE id = ?'),
  
  // Bookmarks
  addBookmark: db.prepare('INSERT INTO bookmarks (user_id, theory_id) VALUES (?, ?)'),
  removeBookmark: db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND theory_id = ?'),
  getUserBookmarks: db.prepare('SELECT theory_id FROM bookmarks WHERE user_id = ?'),
  
  // Read History
  addReadHistory: db.prepare('INSERT INTO read_history (user_id, theory_id) VALUES (?, ?)'),
  getUserReadHistory: db.prepare('SELECT theory_id FROM read_history WHERE user_id = ?'),

  // Analytics
  logVisitor: db.prepare('INSERT INTO visitor_logs (ip_address, os, device, country, city, threat_score) VALUES (?, ?, ?, ?, ?, ?)'),
};

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

export default db;
