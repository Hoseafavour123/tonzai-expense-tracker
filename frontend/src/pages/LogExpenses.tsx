import { FloatingLabel, Textarea, Button } from 'flowbite-react'
import { useMutation, useQuery } from 'react-query'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import * as apiClient from '../api-client'
import { useAppContext } from '../context/AppContext'
import { expensesCategories, incomeCategories } from '../assets/constants.'

type prop = {
  sideBarToggle: boolean
}

export type TransactionLogForm = {
  title: string
  amount: number
  category: string
  description: string
  date: Date
  type: 'income' | 'expenses'
}

const LogExpenses = ({ sideBarToggle }: prop) => {
  const { showToast } = useAppContext()

  const { data: totalAmount } = useQuery('getTotalAmount', () =>
    apiClient.getTotalAmount('expenses')
  )

  const {
    register,
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TransactionLogForm>()

  const { mutate, isLoading } = useMutation(apiClient.LogTransaction, {
    onSuccess: async () => {
      showToast({ message: 'successful', type: 'SUCCESS' })
      window.location.reload()
      reset()
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' })
    },
  })

  const onSubmit = (data: TransactionLogForm) => {
    const formData = new FormData()
    formData.append('date', data.date.toLocaleDateString('en-GB'))
    formData.append('amount', data.amount.toString())
    formData.append('title', data.title)
    formData.append('type', data.type)
    formData.append('category', data.category)
    formData.append('description', data.description)
    console.log(formData)
    mutate(data)
  }

  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 7)

  return (
    <div
      className={`${
        sideBarToggle ? 'm-5' : 'md:ml-[310px]'
      } min-h-screen mt-20 mb-20 `}
    >
      <h1 className="text-3xl font-bold">Expenses</h1>
      <div className="py-3 mt-2 w-full bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center">
          Total Expenses:{' '}
          <span className={`text-red-500 font-bold`}>
            {' '}
            $ {totalAmount?.totalAmount}{' '}
          </span>
        </h1>
      </div>

      <div className="grid gap-2  mt-5 grid-cols-3 grid-rows-3 max-lg:grid-cols-1 max-lg:p-4">
        <div className="col-span-1 row-span-2 bg-white">
          <h2 className="font-semibold text-xl p-2">Log Expenses</h2>

          <form
            className="flex flex-col gap-4 max-lg:p-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              defaultValue={'expenses'}
              type="text"
              {...register('type', { required: true })}
              className="ml-3 mt-3 mr-3 p-2 bg-gray-100 rounded-lg lg:w-[60%]"
            />
            {errors.type && (
              <span className="text-red-500">{errors.type.message}</span>
            )}

            <div className="ml-3 mr-3 lg:w-[60%]">
              <FloatingLabel
                variant="outlined"
                label="Title"
                className=""
                {...register('title', { required: 'This field is required' })}
              />
              {errors.title && (
                <span className="text-red-500">{errors.title.message}</span>
              )}
            </div>

            <div className="ml-3 mr-3 lg:w-[60%]">
              <FloatingLabel
                variant="outlined"
                label="Amount"
                min={0}
                type="number"
                className=""
                {...register('amount', {
                  required: 'This field is required',
                })}
              />
              {errors.amount && (
                <span className="text-red-500">{errors.amount.message}</span>
              )}
            </div>

            <div className="ml-3 mr-3 lg:w-[60%]">
              <label htmlFor="" className="block text-gray-500">
                Category
              </label>

              <select
                {...register('category', { required: true })}
                className=" mt-2 p-2 border border-gray-300 rounded-lg w-full"
              >
                {expensesCategories.map((expense, idx) => (
                  <option key={idx} value={expense.name}>
                    {expense.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>

            <div className="ml-3 mr-3 lg:w-[60%]">
              <Textarea
                style={{ resize: 'none' }}
                rows={4}
                placeholder="Description..."
                className="bg-white"
                {...register('description', { required: true })}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="ml-3 mr-3 lg:w-[60%] mx-auto">
              <Controller
                control={control}
                defaultValue={new Date()}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    onChange={field.onChange}
                    selected={field.value}
                    minDate={sevenDaysAgo}
                    maxDate={today}
                    dateFormat={'yyyy-MM-dd'}
                  />
                )}
              />
              {errors.date && (
                <span className="text-red-500">{errors.date.message}</span>
              )}
            </div>

            <Button
              type="submit"
              outline
              gradientDuoTone="pinkToOrange"
              className="whitespace-nowrap text-bold text-xl lg:w-[60%] ml-3 mb-4"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Log Expense'}
            </Button>
          </form>
        </div>

        <div className="col-span-2 row-span-1 w-full h-full bg-white">1</div>
      </div>
    </div>
  )
}

export default LogExpenses
