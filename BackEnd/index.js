import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import { DB } from './connectDb.js'
import gameRoutes from './Routes/gameRoutes.js'
import userRoutes from './Routes/userRoutes.js'


dotenv.config()

const port = process.env.PORT || 3000
const app = express()

// Allow both potential frontend ports
//Middleware
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))

//Routes
app.use('/api/game', gameRoutes)
app.use('/api/users', userRoutes)




app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
