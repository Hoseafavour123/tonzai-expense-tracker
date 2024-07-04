import express, { Request, Response } from 'express'
import verifyToken from '../middleware/auth'
import { body, validationResult } from 'express-validator'
import User from '../models/User'

const router = express.Router()


router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).limit(10)
        res.status(200).json({ users })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Something went wrong'})
    }
})

export default router
