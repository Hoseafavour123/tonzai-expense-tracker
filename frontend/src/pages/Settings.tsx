import { useQuery } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '../context/AppContext'
import { Button } from 'flowbite-react'
import { useState } from 'react'

type props = {
  sideBarToggle: boolean
}

const Settings = ({ sideBarToggle }: props) => {
  const { showToast } = useAppContext()
  const [time, setTime] = useState<string>('')

  const { data, isLoading } = useQuery(
    ['createReminder', time],
    () => apiClient.createReminder(time as string),
    {
      enabled: !!time,
      onSuccess: () => {
        showToast({
          message: `successfully set email reminder`,
          type: 'SUCCESS',
        })
      },
      onError: (err: Error) => {
        showToast({ message: err.message, type: 'ERROR' })
      },
    }
  )

  return (
    <div
      className={`${
        sideBarToggle ? 'm-5' : 'md:ml-[310px]'
      } min-h-screen mt-20 mb-20 `}
    >
      <div className="py-3 mt-2 w-full bg-white rounded-md shadow-md">
        <h1 className="md:text-2xl sm:text-xl font-bold text-center">
          Settings & Account Management
        </h1>
      </div>
      <div className="grid gap-2 mt-5 grid-cols-3 max-lg:grid-cols-1 max-lg:p-1">
        <div className="col-span-1 md:col-span-1 md:col-start-1 lg:col-span-1 lg:col-start-2 bg-white">
          <h2 className="sm:text-xl max-lg:text-sm p-2 max-lg:pl-3">
            Email Reminders
          </h2>
          <span className="text-xs p-2 max-lg:pl-3">
            Choose time for daily incomes/expenses logging reminder
          </span>
          <p className='max-lg:pl-3 mt-2 text-center'>
            {isLoading ? 'Updating': ''}
            </p>
          <div className="flex flex-wrap gap-4 mt-3 mb-4 p-3">
            <Button
              outline
              gradientDuoTone="tealToLime"
              className="p-0.5"
              onClick={() => setTime('6:00 pm')}
            >
              6:00 pm
            </Button>
            <Button
              outline
              gradientDuoTone="tealToLime"
              className="p-0.5"
              onClick={() => setTime('7:00 pm')}
            >
              7:00 pm
            </Button>
            <Button
              outline
              gradientDuoTone="tealToLime"
              className="p-0.5"
              onClick={() => setTime('8:00 pm')}
            >
              8:00 pm
            </Button>
            <Button
              outline
              gradientDuoTone="tealToLime"
              className="p-0.5"
              onClick={() => setTime('9:00 pm')}
            >
              9:00 pm
            </Button>
            <Button
              outline
              gradientDuoTone="tealToLime"
              className="p-0.5"
              onClick={() => setTime('10:00 pm')}
            >
              10:00 pm
            </Button>
            <Button
              outline
              gradientDuoTone="tealToLime"
              className="p-0.5"
              onClick={() => setTime('11:00 pm')}
            >
              11:00 pm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
