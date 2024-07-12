import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRoute from './routes/auth'
import transactionsRoute from './routes/transactions'
import usersRoute from './routes/users'
import reminderRoute from './routes/reminders'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { recreateReminders } from './utils/recreateReminders'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    credentials: true,
  })
)

app.use(morgan('dev'))
app.use('/api/auth', authRoute)
app.use('/api/v1/transactions', transactionsRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/reminders', reminderRoute)


app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from express endpoint ' })
})

const server = async () => {
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to db.'))
    .catch((e) => console.log(e))
  recreateReminders()
  app.listen(7000, () => console.log('App listening on port 7000'))
}

server()
