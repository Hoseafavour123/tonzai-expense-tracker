import CronReminder from '../models/CronReminder'
import { startReminderSchedule } from './manageCronReminders'

export const recreateReminders = async () => {
  const reminders = await CronReminder.find({ isActive: true })
    .populate({ path: 'user', select: '-password -createdAt -updatedAt' })
    .exec()

  reminders.forEach((reminder) => {
    startReminderSchedule({
      newReminder: reminder,
      email: reminder.email,
      name: '', //
      time: reminder.time,
    })
  })
}

