import { Button, FloatingLabel } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '../context/AppContext'

export type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Register = () => {
  const { showToast } = useAppContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormData>()

  const { mutate, isLoading } = useMutation(apiClient.register, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('validateToken')
      navigate('/activation')
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
      <div className="flex max-w-4xl mx-auto flex-col md:flex-row md:items-center max-lg:p-3 shadow-lg bg-white rounded-xl">
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
            <h2 className="mt-5 text-3xl text-bold max-lg:text-center">Register</h2>
            <div className="mt-5">
              <FloatingLabel
                type="text"
                label="Full name"
                variant="outlined"
                {...register('name', {
                  required: 'This field is required',
                })}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            <div className="mt-5">
              <FloatingLabel
                type="email"
                label="Email"
                variant="outlined"
                {...register('email', { required: 'This field is required' })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="mt-5">
              <FloatingLabel
                type="password"
                label="Password"
                variant="outlined"
                {...register('password', {
                  required: 'This field is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            <div className="mt-5">
              <FloatingLabel
                type="password"
                label="Confirm Password"
                variant="outlined"
                {...register('confirmPassword', {
                  validate: (val) => {
                    if (!val) {
                      return 'This field is required'
                    } else if (watch('password') !== val) {
                      return 'Your passwords do not match'
                    }
                  },
                })}
              />
              {errors.confirmPassword && (
                <span className="text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <Button
              type="submit"
              outline
              gradientDuoTone="pinkToOrange"
              className="whitespace-nowrap text-bold text-xl mx-auto w-full mt-4"
              disabled = {isLoading}
            >
              { isLoading ? 'Processing...' : 'Register'}
            </Button>
            <p className="tex-xl mt-3  mb-5">
              Already in?{' '}
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Register
