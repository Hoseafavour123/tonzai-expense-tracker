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
        res.status(500).json({ message: 'Something went wrong'})
    }
})


router.post('/update', verifyToken, async (req: Request, res: Response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.userId, {...req.body})
        if (!updatedUser) {
             res.status(400).json({ message: 'Failed to update' })
        }
         return res.status(200).json({ message: 'success', updatedUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Something went wrong '})
    }
})

export default router
