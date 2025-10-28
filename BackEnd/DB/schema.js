import sqlite3 from 'sqlite3'

const sql3 = sqlite3.verbose ()

// Create  connection for database
// Source: SQLite Tutorial. "SQLite Node.js: Connecting to SQLite Database." 
// SQLite Tutorial, https://www.sqlitetutorial.net/sqlite-nodejs/connect/. 
// Accessed 22 Sept. 2025.
//Source used for  error handling.
const DB = new sql3.Database('./DB/games.db', (err) => 
    {
    if (err) {
        console.log('Error connecting to database:', err)
        return
    }
    console.log('Connected to database')
})

// Create tables
function createTables() {
    // Users table
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`

    
    // Scores table
    const createScoresTable = `CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        guesses_used INTEGER NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (game_id) REFERENCES games(id)
    )`
    
    DB.run(createUsersTable, [], (err) => {
        if (err) {
            console.log('Error creating users table:', err)
            return
        }
        console.log('Users table created')
    })
    
    DB.run(createScoresTable, [], (err) => {
        if (err) {
            console.log('Error creating scores table:', err)
            return
        }
        console.log('Scores table created')
    })

    // Games table
    const createGamesTable = `CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        release_date INTEGER,
        rating REAL
    )`
    
    DB.run(createGamesTable, [], (err) => {
        if (err) {
            console.log('Error creating games table:', err)
            return
        }
        console.log('Games table created')
    } )

    // Genres table
    const createGenresTable = `CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`
    
    DB.run(createGenresTable, [], (err) => {
        if (err) {
            console.log('Error creating genres table:', err)
            return
        }
        console.log('Genres table created')
    } )

    // Companies table
    const createCompaniesTable = `CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`
    
    DB.run(createCompaniesTable, [], (err) => {
        if (err) {
            console.log('Error creating companies table:', err)
            return
        }
        console.log('Companies table created')
    } )
    DB.run(createCompaniesTable, [], (err) => {
        if (err) {
            console.log('Error while creating companies table:', err)
            return
        }
        console.log('Companies table created')
    } )

    // Platforms table
    const createPlatformsTable = `CREATE TABLE IF NOT EXISTS platforms (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`
    
    DB.run(createPlatformsTable, [], (err) => {
        if (err) {
            console.log('Error has occured while creating the platforms table:', err)
            return
        }
        console.log('Platforms table created')
    } )

    // Game genres relationship
    const createGameGenresTable = `CREATE TABLE IF NOT EXISTS game_genres (
        game_id INTEGER,
        genre_id INTEGER
    )`
    
    DB.run(createGameGenresTable, [], (err) => 
        {
        if (err) {
            console.log('Error creating game_genres table:', err)
            return
        }
        console.log('Game genres table created')
    })

    // Game companies relationship
    const createGameCompaniesTable = `CREATE TABLE IF NOT EXISTS game_companies (
        game_id INTEGER,
        company_id INTEGER
    )`
    
    DB.run(createGameCompaniesTable, [], (err) => 
        {
        if (err) {
            console.log('Error has occured while creating game_companies table:', err)
            return
        }
        console.log('Game companies table created')
    })

    // Game platforms relationship
    const createGamePlatformsTable = `CREATE TABLE IF NOT EXISTS game_platforms (
        game_id INTEGER,
        platform_id INTEGER
    )`
    
    DB.run(createGamePlatformsTable, [], (err) => 
        {
        if (err) {
            console.log('Error has occured while creating game_platforms table:', err)
            return
        }
        console.log('Game platforms table created')
    })
    addImprovements();

}

function addImprovements() {
    // Adding fast search for scores
    DB.run(`CREATE INDEX IF NOT EXISTS user_scores_idx ON scores(user_id)`, [], (err) => {
        if (err) console.log('Could not add user scores search:', err);
        else console.log('Added fast search for user scores');
    });

    DB.run(`CREATE INDEX IF NOT EXISTS time_scores_idx ON scores(completed_at)`, [], (err) => {
        if (err) console.log('Could not add time search:', err);
        else console.log('Added fast search for score times');
    });

    // Add username ifthey are  missing
    DB.run(`ALTER TABLE users ADD COLUMN username TEXT`, [], (err) => {
        // skip if  it already exists
        if (err && !err.message.includes('duplicate')) {
            console.log('Could not add username:', err);
        } else {
            console.log('Username column ready');
        }
    });

    console.log('Database improvements done');
}

// Run the function to create tables
createTables()