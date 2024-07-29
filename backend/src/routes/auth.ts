import express, { Request, Response } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {check, validationResult } from 'express-validator'
import verifyToken from '../middleware/auth'
import { createOTPToken } from '../utils/createOTPToken'
import { generateOTP } from '../utils/generateOTP'
import { sendMail } from '../utils/sendMail'
import { generateAndSendReport } from '../utils/generateAndSendReport'


type PayLoadType = {
  name: string
  email: string
  code: string
  password: string
}

const router = express.Router()

router.post(
  '/register',
  [
    check('name', 'name is required').isString(),
    check('email', 'Valid email is required').isEmail(),
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

      const code = generateOTP()
      const userToConfirm = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        code,
      }

      const otpToken = createOTPToken(userToConfirm)
      
      try {
        await sendMail({
          email: userToConfirm.email,
          subject: 'Activate your account',
          html: `<p>Your 2FA verification code is: <strong>${code}</strong></p>`,
        })

        return res
          .status(201)
          .cookie('code', otpToken, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          })
          .json({
            success: true,
            message: `An OTP has been sent to ${userToConfirm.email}`,
          })
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Something went wrong' })
      }

    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Something went wrong' })
    }
  }
)

router.post(
  '/activation',
  [check('otpString', 'OTP is required').isString()],
  async (req: Request, res: Response) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }


    try {

      const code = req.cookies.code

      if (!code) {
        return res
          .status(401)
          .json({ error: 'Please create an account or login to continue' })
      }

      const decoded = jwt.verify(code, process.env.JWT_SECRET as string) as PayLoadType
      
      const decodedCode = parseInt(decoded.code)
      const otpStringAsInt = parseInt(req.body.otpString)

      if (decodedCode !== otpStringAsInt) {
        return res.status(400).json({ error: 'Please input the correct code' })
      } else {
        const { name, email, password } = decoded

        let user = await User.findOne({ email })

        if (user) {
          res.clearCookie('code')
          return res.status(400).json({ error: 'User already exists' })
        }

        // Delete the 'code' cookie
        res.clearCookie('code')

         let newUser = new User({ name, email, password, image: ''})
         newUser = await newUser.save()

         const token = jwt.sign(
           { userId: newUser._id },
           process.env.JWT_SECRET as string,
           {
             expiresIn: '1d',
           }
         )

         //schedule income/expense report
         //generateAndSendReport(newUser._id)
         res.cookie('auth_token', token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           maxAge: 86400000,
         })
         return res.status(200).json({ message: 'Success' })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Something went wrong' })
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
      //generateAndSendReport(user._id)
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
