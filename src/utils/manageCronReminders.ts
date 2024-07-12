import cron from 'node-cron'
import { CronReminderType } from '../models/CronReminder'
import { sendMail } from './sendMail'
import {
  addReminderObject,
  deleteReminderObject,
  getActiveReminders,
} from './activeReminderObjects'


type StartReminderProps = {
  newReminder: CronReminderType,
  email: string | undefined,
  name: string | undefined,
  time: string
}
// parse time to valid cron time format
const parseTime = (timeStr: string): string => {
  const [time, period] = timeStr.split(' ')
  const [hour, minute] = time.split(':')

  let cronHour = parseInt(hour)
  const cronMinute = parseInt(minute)

  if (period.toLowerCase() === 'pm' && cronHour !== 12) {
    cronHour += 12
  } else if (period.toLowerCase() === 'am' && cronHour === 12) {
    cronHour = 0
  }
  return `${cronMinute || 0} ${cronHour} * * *`
}


export const startReminderSchedule = ({ newReminder, email, name, time }: StartReminderProps) => {
  const cronTime = parseTime(time)

  const scheduledTask = cron.schedule(`${cronTime}`, () =>
    sendMail({
      email,
      subject: 'Log Your Expenses',
      html: `Hello <strong>${name}!</strong> <p>Log in to Tonzai Expense Tracker and track your expenses for the day!</p>`,
    })
  )
  scheduledTask.start()
  addReminderObject(newReminder._id, scheduledTask)
}

export const stopReminderSchedule = (reminder: CronReminderType) => {
  const { _id } = reminder
  deleteReminderObject(_id)
}
