import { DB } from '../DB/connectDb.js'


//this gets the leaderboard
//it shows top players with their stats
export const getLeaderboard = (req, res) => {
    const sql = `
        SELECT u.username,COUNT(s.id) as games_completed,AVG(s.guesses_used) as avg_guesses,MAX(s.score) as best_score
        FROM users u
        JOIN scores s ON u.id = s.user_id
        GROUP BY u.id, u.username
        ORDER BY best_score DESC,avg_guesses ASC
        LIMIT 10`


        DB.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err)
            return res.status(500).send({ error: 'Database error' })
        }
        res.status(200).send(rows)
    })
}

//this submits a score
//it saves the score to database
//requires user to be logged in
export const submitScore = (req, res) => {
    console.log(' Score submission request received:', req.body)
    console.log(' User from token:', req.user)

    const { gameId, score, guessesUsed } = req.body
    const userId = req.user?.id //  authenticate using middleware

    if (!userId) {
        console.log(' No user ID found in token')
        return res.status(401).send({ error: 'Authentication required' })
    }

    console.log(' Saving score for user', userId, ':', { gameId, score, guessesUsed })
    const sql = `INSERT INTO scores (user_id, game_id, score, guesses_used, completed_at)
        VALUES (?,?,?,?, CURRENT_TIMESTAMP)`

    DB.run(sql, [userId, gameId, score, guessesUsed], function(err) {
        if (err) {
            console.error('💥 Database error when saving scores:', err)
            return res.status(500).send({ error: 'Failed to save score' })
        }
        console.log('✅ Score saved successfully, ID:', this.lastID)
        res.status(201).send({ message: 'Score saved successfully', scoreId: this.lastID })
    })
}