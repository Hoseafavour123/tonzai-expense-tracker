import express, { Request, Response} from 'express'
import cors from 'cors'
import path from 'path'
import 'dotenv/config'
import authRoute from './routes/auth'
import transactionsRoute from './routes/transactions'
import usersRoute from './routes/users'
import reminderRoute from './routes/reminders'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { recreateReminders } from './utils/recreateReminders'
import { getActiveReminders } from './utils/activeReminderObjects'

const app = express()

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL as string,
      process.env.PRODUCTION_URL as string,
    ],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.use(morgan('dev'))
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/transactions', transactionsRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/reminders', reminderRoute)


app.use('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname+'/../../frontend/dist/index.html'))
})

const server = async () => {
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to db.'))
    .catch((e) => console.log(e))
  recreateReminders()
  app.listen(3000, () => console.log('App listening on port 3000'))
}

server()