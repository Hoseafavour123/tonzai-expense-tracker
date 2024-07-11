import { Button, FloatingLabel } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '../context/AppContext'


export type Activation = {
    otpString: string
}

const Activation = () => {
  const { showToast } = useAppContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Activation>()

  const { mutate, isLoading } = useMutation(apiClient.activation, {
    onSuccess: async () => {
      showToast({ message: 'Login successful', type: 'SUCCESS' })
      await queryClient.invalidateQueries('validateToken')
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' })
    },
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    mutate(data)
  })

  return (
    <div className="min-h-screen mt-20 p-4">
      <div className="flex flex-col max-w-4xl mx-auto md:flex-row md:items-center max-lg:p-3 shadow-lg bg-white rounded-xl">
        <div className="flex-1 p-3 mt-5">
          <Link to="/" className="sm:text-xl font-bold dark:text-white">
            <span className="px-4 py-1 rounded bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-bold text-4xl text-white">
              Tonzai
            </span>
            Expense Tracker
          </Link>
          <p className="mt-5 text-xl">
            <em> Make wiser finacial decisions </em>
          </p>
        </div>
        <div className="md:mx-5 flex-1 max-lg:p-5">
          <form onSubmit={onSubmit}>
            <h2 className="mt-5 text-3xl text-bold max-lg:text-center">
              Verify your email
            </h2>
            <small>An OTP has been sent to your email, <strong>expires in 10min</strong></small>
            <div className="mt-5">
              <FloatingLabel
                type="text"
                label="OTP"
                variant="outlined"
                {...register('otpString', { required: 'This field is required' })}
              />
              {errors.otpString && (
                <span className="text-red-500">{errors.otpString.message}</span>
              )}
            </div>
            <Button
              type="submit"
              outline
              gradientDuoTone="pinkToOrange"
              className="whitespace-nowrap text-bold text-xl mx-auto w-full mt-4"
              disabled = {isLoading}
            >
             { isLoading ? 'Verifying...' : 'Verify' }
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Activation
