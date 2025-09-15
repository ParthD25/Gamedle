import express from 'express'
import dotenv from 'dotenv'
import { DB } from './connectDb.js'

dotenv.config()

const port = process.env.PORT || 8000
const app = express()

app.get('/', (req, res) =>{
    res.status(200).send('Games DB is available.')
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
