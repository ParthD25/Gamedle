import {DB } from '../DB/connectDb.js'


//return the game of the day 
export const getDailyGame = (req, res)=>{
    DB.get( 'SELECT * FROM games ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
        if (err) {
          //error handling for database issues
            console.error('Database error:', err)
              return res.status(500).send( { error: 'Database error' } )
        }
        if (!row) {
          //if no game found throw error

            return res.status(404).send( { error: 'No games found' } )
        }


        res.status(200).send(row)
    })
}

//return a game based on the title
export const searchGameByTitle = (req, res) =>{
    const { title } = req.body
    //check if game exists
    const gameData = lookUpByTitle(title)
    //return if exists
        res.status(200).send(gameData)
    //error handling
}



    