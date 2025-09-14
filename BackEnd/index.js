import express from 'express'
import dotenv from 'dotenv'
// import DB from './connectDb'

dotenv.config()

const port = process.env.PORT || 8000
const app = express()

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
