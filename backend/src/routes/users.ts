import express, { Request, Response } from 'express'
import verifyToken from '../middleware/auth'
import { body, validationResult } from 'express-validator'
import User from '../models/User'
import multer from 'multer'
import bcrypt from 'bcryptjs'
import Transaction from '../models/Transaction'
import CronReminder from '../models/CronReminder'
import cloudinary, { UploadApiResponse } from 'cloudinary'

const storage = multer.memoryStorage()
const upload = multer({ storage })

type UploadResponse = {
  url?: string
  id?: string
}

// Define User interface based on your User model schema
interface IUser {
  name: string
  email: string
  image: { url?: string; id?: string }
  password: string
  currency: string
}

const router = express.Router()
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).limit(10)
    res.status(200).json({ users })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/me', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select(
      '-__v -createdAt -updatedAt'
    )
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.put(
  '/update',
  verifyToken,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const updates: Partial<IUser> = {}

      if (req.body.name !== undefined && req.body.name.trim() !== '') {
        updates.name = req.body.name
      }

      if (req.body.email !== undefined && req.body.email.trim() !== '') {
        updates.email = req.body.email
      }

      if (req.body.password !== undefined && req.body.password.trim() !== '') {
        try {
          const saltRounds = 8
          const hashedPassword = await bcrypt.hash(
            req.body.password,
            saltRounds
          )
          updates.password = hashedPassword
        } catch (err) {
          return res.status(500).json({ error: 'Error hashing password' })
        }
      }

      
      if (req.body.currency !== undefined && req.body.name.trim() !== '') {
        updates.currency = req.body.currency
      }

      if (req.file) {
        const imageResult: UploadResponse = await new Promise(
          (resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
              { resource_type: 'image' },
              (error, result) => {
                if (error) reject(error)
                resolve({
                  url: result?.secure_url || '',
                  id: result?.public_id || '',
                })
              }
            )
            stream.end(req.file?.buffer)
          }
        )
        
        updates.image = { url: imageResult.url, id: imageResult.id }

        const user = await User.findById(req.userId)
        if (user?.image.id) {
          await cloudinary.v2.uploader.destroy(user.image.id)
        }
        
      }
      const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
        new: true,
      }).select('-password -__v -createdAt -updatedAt')

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json(updatedUser)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Something went wrong ' })
    }
  }
)

router.delete('/delete', verifyToken, async (req: Request, res: Response) => {
  try {
    await Transaction.deleteMany({ user: req.userId })
    await CronReminder.deleteMany({ user: req.userId })
    await User.findByIdAndDelete(req.userId)
    return res.status(200).json({ message: 'User Deleted!' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})
export default router
