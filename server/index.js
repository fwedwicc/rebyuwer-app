import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoute from './route/authRoute.js'
import userRoute from './route/userRoute.js'
import cardSetRoute from './route/cardSetRoute.js'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/cardSet', cardSetRoute)

app.listen(port, () => {
  connectDB()
  console.log(`Server is running on port ${port}`)
})