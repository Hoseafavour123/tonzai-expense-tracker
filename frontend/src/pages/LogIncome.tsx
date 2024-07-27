import { FloatingLabel, Textarea, Button } from 'flowbite-react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import * as apiClient from '../api-client'
import { useAppContext } from '../context/AppContext'
import { incomeCategories, IncomeImgObj } from '../assets/constants.'
import moment from 'moment'
import {
  commentIcon,
  dateIcon,
  deleteIcon,
  dollarSign,
  editIcon,
  nextIcon,
  prevIcon,
} from '../assets/icons'

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

const LogIncome = ({ sideBarToggle }: prop) => {
  const { showToast } = useAppContext()
  const queryClient = useQueryClient()

  const [page, setPage] = useState<number>(1)

  const { data: paginatedTransaction } = useQuery(
    ['getPaginatedTransaction', page],
    () => apiClient.getPaginatedTransaction({ page, type: 'income' }),
    {
      keepPreviousData: true,
    }
  )

  const { data: totalAmount } = useQuery('getTotalAmount', () =>
    apiClient.getTotalAmount('income')
  )

  const { mutate: deleteTransaction } = useMutation(
    apiClient.deleteTransaction,
    {
      onSuccess: () => {
        showToast({ message: 'Transaction deleted', type: 'SUCCESS' })
        queryClient.invalidateQueries('getPaginatedTransaction')
        queryClient.invalidateQueries('getTotalAmount')
        //window.location.reload()
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: 'ERROR' })
      },
    }
  )
  const handleDelete = (id: string) => {
    deleteTransaction(id)
  }

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
      queryClient.invalidateQueries('getPaginatedTransaction')
      queryClient.invalidateQueries('getTotalAmount')
      //window.location.reload()
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

  let totalPages: number = paginatedTransaction?.totalPages || 0

  const nextPage = () => {
    setPage(page + 1)
  }

  const prevPage = () => {
    setPage(page - 1)
  }

  return (
    <div
      className={`${
        sideBarToggle ? 'm-5' : 'md:ml-[310px]'
      } min-h-screen mt-20 mb-20 `}
    >
      <h1 className="md:text-3xl sm:text-2xl font-bold">Incomes</h1>
      <div className="py-3 mt-2 w-full bg-white rounded-md shadow-md">
        <h1 className="md:text-2xl sm:text-xl font-bold text-center">
          Total Income:{' '}
          <span className={`text-green-500 font-bold`}>
            {totalAmount && totalAmount?.totalAmount > 0 ? (
              <>$ {totalAmount?.totalAmount}</>
            ) : (
              <>$0</>
            )}
          </span>
        </h1>
      </div>

      <div className="grid gap-2  mt-5 grid-cols-3 grid-rows-3 max-lg:grid-cols-1 max-lg:p-1">
        <div className="col-span-1 bg-white">
          <h2 className="font-semibold text-xl p-2 max-lg:pl-3">Log Income</h2>

          <form
            className="flex flex-col gap-4 max-lg:p-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              defaultValue={'income'}
              type="text"
              {...register('type', { required: true })}
              className="md:ml-3 sm:ml-2 mt-3 md:mr-3 sm:mr-2 md:p-2 sm:p-1 bg-gray-100 rounded-lg lg:w-[60%]"
            />
            {errors.type && (
              <span className="text-red-500">{errors.type.message}</span>
            )}

            <div className="md:ml-3 sm:ml-2 mt-3 md:mr-3 sm:mr-2 md:p-2 sm:p-1 rounded-lg lg:w-[60%]">
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

            <div className="md:ml-3 sm:ml-2 mt-3 md:mr-3 sm:mr-2 md:p-2 sm:p-1 rounded-lg lg:w-[60%]">
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

            <div className="md:ml-3 sm:ml-2 mt-3 md:mr-3 sm:mr-2 md:p-2 sm:p-1 rounded-lg lg:w-[60%]">
              <label htmlFor="" className="block text-gray-500">
                Category
              </label>

              <select
                {...register('category', { required: true })}
                className=" mt-2 p-2 border border-gray-300 rounded-lg w-full"
              >
                {incomeCategories.map((income, idx) => (
                  <option key={idx} value={income}>
                    {income}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>

            <div className="md:ml-3 sm:ml-2 mt-3 md:mr-3 sm:mr-2 md:p-2 sm:p-1 rounded-lg lg:w-[60%]">
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

            <div className="md:ml-3 sm:ml-2 mt-3 md:mr-3 sm:mr-2 md:p-2 sm:p-1 rounded-lg md:w-[60%]">
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
              className="md:ml-3 sm:ml-2 mt-3 md:mr-3 sm:mr-2 md:p-2 sm:p-1 rounded-lg lg:w-[60%] mb-5"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Log Income'}
            </Button>
          </form>
        </div>
        {paginatedTransaction && paginatedTransaction?.transactions.length > 0 ? (
          <>
            <div className={`col-span-2 row-span-1 w-full h-full bg-white`}>
              <h1 className="text-center sm:text-2xl max-lg:text-xl font-bold">
                Manage
              </h1>
              <div className="flex flex-col gap-5 sm:p-3 max-lg:p-2">
                {paginatedTransaction?.transactions.map((transaction) => (
                  <div className="shadow-md max-lg:pb-3">
                    {IncomeImgObj[transaction.category] && (
                      <div className="flex  md:flex-row max-lg:flex-row md:gap-3 md:p-2 justify-between max-lg:p-1">
                        <div className="md:flex sm:flex-col md:flex-row gap-5 md:ml-5 items-center md:items-start">
                          <div className="">
                            <img
                              src={`${IncomeImgObj[transaction.category]}`}
                              className=" bg-gray-100 md:min-w-14 h-14 max-lg:w-12 max-lg:h-12 rounded-full p-2"
                              alt=""
                            />
                          </div>

                          <div className="flex flex-col gap-2 max-lg:gap-1">
                            <div className="flex items-center md:gap-2 max-lg:gap-1">
                              <div className="w-2 h-2 bg-green-500  rounded-full"></div>
                              <h3 className="sm:text-xl max-lg:text-sm font-bold">
                                {transaction.category}
                              </h3>
                            </div>

                            <div className="flex max-lg:flex-col md:flex-row gap-5 max-lg:gap-3 sm:text-sm max-lg:text-xs text-gray-700">
                              <div className="flex gap-1 items-center">
                                <img
                                  src={dollarSign}
                                  className="w-4 h-4"
                                  alt=""
                                />
                                <span className="">{transaction.amount} </span>
                              </div>
                              <div className="flex gap-1 items-center">
                                <img
                                  src={dateIcon}
                                  className="w-4 h-4"
                                  alt=""
                                />
                                <span>
                                  {' '}
                                  {moment(transaction.date).format(
                                    'YYYY MMM DD'
                                  )}
                                </span>
                              </div>
                              <div className="flex gap-1 items-center">
                                <img
                                  src={commentIcon}
                                  className="w-3 h-3"
                                  alt=""
                                />
                                <span>{transaction.description}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 max-lg:mt-5 sm:mt-2 max-lg:ml-2 max-lg:mb-3">
                          <button className="cursor-pointer md:w-12 md:h-12 sm:w-8 sm:h-8 max-lg:h-5 max-lg:w-5">
                            {' '}
                            <img
                              src={editIcon}
                              className="bg-blue-100 rounded-full md:p-2 sm:p-1"
                              alt=""
                            />{' '}
                          </button>
                          <button
                            className="cursor-pointer md:w-12 md:h-12 sm:w-8 s max-lg:h-5 max-lg:w-5"
                            onClick={() => handleDelete(transaction._id)}
                          >
                            {' '}
                            <img
                              src={deleteIcon}
                              className="bg-red-100 rounded-full md:p-2 sm:p-1"
                              alt=""
                            />{' '}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-2 mt-4 mb-7 static">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className="bg-gray-300 hover:bg-gray-700 text-white font-bold py-2 px-4 max-lg:px-3 rounded"
                >
                  <img src={prevIcon} className="w-8 h-8 max-lg:w-6" alt="" />
                </button>
                <button
                  onClick={nextPage}
                  disabled={page === totalPages}
                  className="bg-gray-300 hover:bg-gray-700 text-white font-bold py-2 px-4 max-lg:px-3 rounded"
                >
                  <img src={nextIcon} className="w-8 h-8 max-lg:w-6" alt="" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="md:col-span-2 md:col-start-2 md:col-end-4 row-span-1 w-full bg-white flex items-center justify-center max-lg:h-[300px] max-lg:p-3 md:h-[400px]">
              <h1 className="text-center text-sm text-gray-600">
                Log an income to manage...
              </h1>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LogIncome
