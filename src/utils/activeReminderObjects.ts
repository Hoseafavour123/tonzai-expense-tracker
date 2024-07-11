import { ScheduledTask } from 'node-cron'
import { CronReminderType } from '../models/CronReminder'

let activeReminderObjects: { [id: string]: ScheduledTask } = {}

export const getActiveReminders = (): { [id: string]: ScheduledTask } => {
  return activeReminderObjects
}

export const addReminderObject = (id: string, scheduledTask: ScheduledTask) => {
  activeReminderObjects[id] = scheduledTask
}

export const deleteReminderObject = (id: string) => {
  if (activeReminderObjects[id]) {
    delete activeReminderObjects[id]
  }
}
