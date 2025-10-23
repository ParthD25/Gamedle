import sqlite3 from 'sqlite3'

const sql3 = sqlite3.verbose()

const DB = new sql3.Database('./DB/games.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, connectedToDB)

function connectedToDB(err){
    if(err){
        console.error('Database connection error:', err)
        return
    }
    console.log(`Connected to the DB.`)
    ensureSchema()
}

function ensureSchema(){
    // Ensure users table exists with username column
    const createUsers = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT
    )`
    DB.run(createUsers, [], (err) => {
        if (err) {
            console.error('Error ensuring users table:', err)
            return
        }
        // If table existed previously without username, add it
        DB.all(`PRAGMA table_info(users)`, [], (err, rows) => {
            if (err) {
                console.error('Error reading users table info:', err)
                return
            }
            const hasUsername = rows?.some(r => r.name === 'username')
            if (!hasUsername) {
                DB.run(`ALTER TABLE users ADD COLUMN username TEXT`, [], (err) => {
                    if (err) {
                        console.error('Error adding username column to users table:', err)
                    } else {
                        console.log('Added username column to users table')
                    }
                })
            }
        })
    })
}

export { DB }
