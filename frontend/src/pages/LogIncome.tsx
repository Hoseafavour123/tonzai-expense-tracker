import { FloatingLabel, Textarea } from 'flowbite-react'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'

type prop = {
  sideBarToggle: boolean
}

export interface TransactionLogForm {
  title: string
  amount: number
  category: string
  description: string
  date: Date
}

const LogIncome = ({ sideBarToggle }: prop) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TransactionLogForm>()
  return (
    <div
      className={`${
        sideBarToggle ? 'm-5' : 'md:ml-[310px]'
      } min-h-screen mt-20 mb-20 `}
    >
      <h1 className="text-3xl font-bold">Incomes</h1>
      <div className="py-3 mt-2 w-full bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center">
          Total Income: <span className={`text-green-500`}> $400 </span>
        </h1>
      </div>

      <div className="grid gap-2  mt-5 grid-cols-3 grid-rows-3">
        <div className="col-span-1 row-span-2 bg-white">
          <h2 className="font-semibold text-xl p-2">Log Income</h2>
          <form className="flex flex-col gap-4">
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
              <FloatingLabel
                variant="outlined"
                label="Category"
                className=""
                {...register('category', {
                  required: 'This field is required',
                })}
              />
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>
            <div className="ml-3 mr-3 lg:w-[60%]">
             
            </div>
            <div className="ml-3 mr-3 lg:w-[60%]">
              <Textarea
                id="description"
                style={{ resize: 'none' }}
                rows={4}
                placeholder="Description..."
                className="bg-white"
                {...register('description')}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
          </form>
        </div>
        <div className="col-span-2 row-span-1 w-full h-full bg-white">1</div>
      </div>
    </div>
  )
}

export default LogIncome
