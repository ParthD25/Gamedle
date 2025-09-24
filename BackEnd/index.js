import express from 'express'
import dotenv from 'dotenv'
// import { DB } from './connectDb.js'
import gameRoutes from './Routes/gameRoutes.js'


dotenv.config()

const port = process.env.PORT || 8000
const app = express()
app.use(express.json())

//Routes
app.use('/api/game', gameRoutes)
// app.use('/api/user', userRoutes)




app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
