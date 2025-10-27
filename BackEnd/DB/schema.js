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
}

// Run the function to create tables
createTables()

const statements = [
  // CREATE TABLE ... statements
]

// Run sequentially (optional)
DB.serialize(() => {
  statements.forEach((stmt) => {
    DB.run(stmt, [], (err) => {
      if (err) {
        console.error('Error running SQL:', stmt, err)
      }
    })
  })
})

export { DB }