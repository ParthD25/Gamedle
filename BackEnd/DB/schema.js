import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql3 = sqlite3.verbose();

// Use the existing games.db or create new one
const dbPath = path.join(__dirname, 'games.db');
const DB = new sql3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to SQLite database for schema setup.');
});

// Enable foreign keys
DB.run('PRAGMA foreign_keys = ON');

const createTablesSQL = `
-- Games table (main table)
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    first_release_date INTEGER,
    rating REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Companies table  
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Platforms table
CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Junction tables for many-to-many relationships

-- Game-Genre relationship
CREATE TABLE IF NOT EXISTS game_genres (
    game_id INTEGER,
    genre_id INTEGER,
    PRIMARY KEY (game_id, genre_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- Game-Company relationship
CREATE TABLE IF NOT EXISTS game_companies (
    game_id INTEGER,
    company_id INTEGER,
    PRIMARY KEY (game_id, company_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Game-Platform relationship
CREATE TABLE IF NOT EXISTS game_platforms (
    game_id INTEGER,
    platform_id INTEGER,
    PRIMARY KEY (game_id, platform_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_name ON games(name);
CREATE INDEX IF NOT EXISTS idx_games_rating ON games(rating);
CREATE INDEX IF NOT EXISTS idx_games_release_date ON games(first_release_date);
CREATE INDEX IF NOT EXISTS idx_genres_name ON genres(name);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_platforms_name ON platforms(name);
`;

export function createDatabaseSchema() {
    return new Promise((resolve, reject) => {
        DB.exec(createTablesSQL, (err) => {
            if (err) {
                console.error('Error creating database schema:', err.message);
                reject(err);
                return;
            }
            console.log('Database schema created successfully.');
            resolve();
        });
    });
}

export function getDatabase() {
    return DB;
}

// If run directly, create the schema
if (import.meta.url === `file://${process.argv[1]}`) {
    createDatabaseSchema()
        .then(() => {
            console.log('Schema setup complete.');
            DB.close();
        })
        .catch((err) => {
            console.error('Schema setup failed:', err);
            DB.close();
            process.exit(1);
        });
}