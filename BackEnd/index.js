import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import { DB } from './connectDb.js'
import gameRoutes from './Routes/gameRoutes.js'


dotenv.config()

const port = process.env.PORT || 8000
const app = express()

const ORIGIN_URL = 'http://localhost:5173'

//Middleware
app.use(express.json())
app.use(cors({origin: ORIGIN_URL}))

//Routes
app.use('/api/game', gameRoutes)
// app.use('/api/user', userRoutes)




app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
