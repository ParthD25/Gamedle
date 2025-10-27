import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import { DB } from './connectDb.js'
import gameRoutes from './Routes/gameRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import leaderboardRoutes from './Routes/leaderboardRoutes.js'


dotenv.config()

const port = process.env.PORT || 3000
const app = express()

//Middleware
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))

//Routes
app.use('/api/game', gameRoutes)
app.use('/api/users', userRoutes)
app.use('/api/leaderboard', leaderboardRoutes)




app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
