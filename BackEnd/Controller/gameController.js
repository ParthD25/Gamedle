import {DB } from '../DB/connectDb.js'


//return the game of the day randomly selected 
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
    } )
}



//return a game based on the title
export const searchGameByTitle = (req, res) =>{
    const { title } = req.body

    if (!title || title.trim() === '') {
        return res.status(400).send({ error: 'Title is required ' })
    }
DB.get('SELECT * FROM games WHERE LOWER (name) = LOWER(?)', [title], (err, row) => {
    // only find game titles with exact title lowercase of case sensitivity.
    if (err) {
        //handles error for database issues
        console.error('Database error:', err)
        return res.status(500).send({ error: 'Database error' });
    }
    if (!row) {
        //if no games were found throw an error
        return res.status(404).send({ error: ' Game not found' });
    }
    res.status(200).send(row);
}
);



}