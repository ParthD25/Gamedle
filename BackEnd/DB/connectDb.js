import sqlite3 from 'sqlite3'

const sql3 = sqlite3.verbose()

const DB = new sql3.Database('./games.db', sqlite3.OPEN_READWRITE, connectedToDB)

function connectedToDB(err){
    if(err){
        console.log('--ERROR connecting to DB--')
        return
    }
    console.log(`Connected to the DB.`)
}

let sql = `CREATE TABLE IF NOT EXISTS game(
    game_title TEXT PRIMARY KEY,
    game_year INTEGER NOT NULL
)`

DB.run(sql, [], (err)=>{
    if(err){
        console.log('--ERROR creating table--')
        return
    }
    console.log(`Table Created`)
})

export { DB }