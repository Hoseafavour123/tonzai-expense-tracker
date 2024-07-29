import express, { Request, Response } from 'express'
import cron from 'node-cron'
import { check, validationResult } from 'express-validator'
import CronReminder from '../models/CronReminder'
import User from '../models/User'
import verifyToken from '../middleware/auth'
import {
  startReminderSchedule,
  stopReminderSchedule,
} from '../utils/manageCronReminders'

const router = express.Router()

router.post(
  '/create',
  [check('time', 'time is required, format(9:00 am)').isString()],
  verifyToken,
  async (req: Request, res: Response) => {
    console.log(req.body)
    try {
      const user = await User.findById(req.userId).select('-password -createdAt -updatedAt')

      await CronReminder.deleteMany({})
      
      const newReminder = await CronReminder.create({
        time: req.body.time,
        email: user?.email,
        user,
      })

      startReminderSchedule({ newReminder, time: req.body.time, email: user?.email, name: user?.name })
      return res
        .status(200)
        .json({
          reminder: newReminder,
        })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
)


router.get('/get-all', verifyToken, async(req: Request, res: Response) => {
  try {
    const reminders = await CronReminder.find({ user: req.userId })
    return res.status(200).json({reminders})
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something went wrong'})
  }
})


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const reminder = await CronReminder.findById(req.params.id)
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' })
    }
    stopReminderSchedule(reminder)
    await CronReminder.findByIdAndDelete(req.params.id)
    return res
      .status(200)
      .json({ message: 'Successfully disabled email expense reminder' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something wrong happened...' })
  }
})

export default router