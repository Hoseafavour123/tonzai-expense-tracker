import mongoose from 'mongoose'
import { UserType } from './User'

export interface CronReminderType {
  _id: string
  time: string
  isActive: boolean
  email: string
  user: mongoose.Types.ObjectId | UserType
}

const cronReminderSchema = new mongoose.Schema<CronReminderType>(
  {
    time: { type: String, required: true },
    isActive: {type: Boolean, default: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
)

const CronReminder = mongoose.model<CronReminderType>(
  'CronReminder',
  cronReminderSchema
)

export default CronReminder
