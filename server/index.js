import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import connectDB from './config/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.listen(port, () => {
  // connectDB()
  console.log(`Server is running on port ${port}`)
})