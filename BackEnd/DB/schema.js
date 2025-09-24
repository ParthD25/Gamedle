import sqlite3 from 'sqlite3'

const sql3 = sqlite3.verbose ()

// Create  connection for database
// Source: SQLite Tutorial. "SQLite Node.js: Connecting to SQLite Database." 
// SQLite Tutorial, https://www.sqlitetutorial.net/sqlite-nodejs/connect/. 
// Accessed 22 Sept. 2025.
//Source used for  error handling.
const DB = new sql3.Database('./games.db', (err) => 
    {
    if (err) {
        console.log('Error connecting to database:', err)
        return
    }
    console.log('Connected to database')
})

// Create tables
function createTables() {
    // Games table
    let sql = `CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        release_date INTEGER,
        rating REAL
    )`
    
    DB.run(sql, [], (err) => {
        if (err) {
            console.log('Error creating games table:', err)
            return
        }
        console.log('Games table created')
    } )

    // Genres table
    sql = `CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`
    
    DB.run(sql, [], (err) => {
        if (err) {
            console.log('Error creating genres table:', err)
            return
        }
        console.log('Genres table hhas been created')
    } )

    // Companies table
    sql = `CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`
    
    DB.run(sql, [], (err) => {
        if (err) {
            console.log('Error while creating companies table:', err)
            return
        }
        console.log('Companies table created')
    }  )

    // Platforms table
    sql = `CREATE TABLE IF NOT EXISTS platforms (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`
    
    DB.run(sql, [], (err) => {
        if (err) {
            console.log('Error has occured while creating the platforms table:', err)
            return
        }
        console.log('Platforms table created')
    } )

    // Game genres relationship
    sql = `CREATE TABLE IF NOT EXISTS game_genres (
        game_id INTEGER,
        genre_id INTEGER
    )`
    
    DB.run(sql, [], (err) => 
        {
        if (err) {
            console.log('Error creating game_genres table:', err)
            return
        }
        console.log('Game genres table created')
    })

    // Game companies relationship
    sql = `CREATE TABLE IF NOT EXISTS game_companies (
        game_id INTEGER,
        company_id INTEGER
    )`
    
    DB.run(sql, [], (err) => 
        {
        if (err) {
            console.log('Error has occured while creating game_companies table:', err)
            return
        }
        console.log('Game companies table created')
    } )

    // Game platforms relationship
    sql = `CREATE TABLE IF NOT EXISTS game_platforms (
        game_id INTEGER,
        platform_id INTEGER
    )`
    
    DB.run(sql, [], (err) => 
        {
        if (err) {
            console.log('Error creating game_platforms table:', err)
            return
        }
        console.log('Game platforms table created')
    })
}

// Run the function to create tables
createTables()

export { DB }