import sqlite3 from 'sqlite3'

const sql3 = sqlite3.verbose()

const DB = new sql3.Database('./DB/games.db', sqlite3.OPEN_READWRITE, connectedToDB)

function connectedToDB(err){
    if(err){
        console.log('--ERROR connecting to DB--')
        return
    }
    console.log(`Connected to the DB.`)
}


// DB.run(sql, [], (err) => {
//     if (err) {
//         console.log('Error creating users table:', err)
//         return
//     }
//     console.log('Users table created')
// })

export { DB }
// sql = `CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     email TEXT UNIQUE NOT NULL,
//     password TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// )`