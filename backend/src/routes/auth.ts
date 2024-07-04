import express, { Request, Response } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { check, validationResult } from 'express-validator'
import verifyToken from '../middleware/auth'

const router = express.Router()


router.post(
  '/register',
  [
    check('firstName', 'First name required').isString(),
    check('lastName', 'Last name is required').isString(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required and must be > 6').isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      })
      if (user) {
        return res.status(400).json({ message: 'User already exists!' })
      }
      user = new User(req.body)
      await user.save()

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1d',
        }
      )
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
      })
      return res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Something went wrong' })
    }
  }
)



router.post(
  '/login',
  [
    check('email', 'Email required').isEmail(),
    check('password', 'Password is required, must be > 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      )
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
      })
      return res.status(200).json({ userId: user._id })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
)

router.get('/validate-token', verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId })
})



router.post('/logout', (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    expires: new Date(0),
  })
  res.send()
})


export default router
