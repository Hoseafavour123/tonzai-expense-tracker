import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRoute from './routes/auth'
import transactionsRoute from './routes/transactions'
import usersRoute from './routes/users'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import morgan from "morgan"


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'));


//Routes
app.use('/api/auth', authRoute)
app.use('/api/v1/transactions', transactionsRoute)
app.use('/api/v1/users', usersRoute)

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from express endpoint '})
})

const server = ()  => {
    mongoose.connect(process.env.MONGO_URI as string)
    app.listen(7000, () => console.log('App listening on port 7000'))
}

server()