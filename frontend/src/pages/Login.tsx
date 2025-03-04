import { Button, FloatingLabel } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '../context/AppContext'

export type  LoginFormData = {
  email: string
  password: string
}

const Login = () => {
  const { showToast } = useAppContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>()

  const { mutate, isLoading } = useMutation(apiClient.login, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('validateToken')
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' })
    },
  })

  const onSubmit = handleSubmit((data) => {
    mutate(data)
  })

  return (
    <div className="min-h-screen mt-20 p-4">
      <div className="flex max-w-4xl mx-auto flex-col md:flex-row md:items-center max-lg:p-3 shadow-lg bg-white rounded-xl">
        <div className="flex-1 p-3 mt-5">
          <Link to="/" className="sm:text-xl font-bold dark:text-white">
            <span className="px-4 py-1 rounded bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-bold md:text-4xl sm:text-3xl text-white">
              Tonzai
            </span>
            Expense Tracker
          </Link>
          <p className="md:mt-5 sm:mt-4 max-lg:text-sm text-xl">
            <em> Make wiser financial decisions </em>
          </p>
        </div>
        <div className="md:mx-5 flex-1 max-lg:p-5">
          <form onSubmit={onSubmit}>
            <h2 className="mt-5 md:text-3xl sm:text-2xl text-bold max-lg:text-center">
              Login
            </h2>
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
            <Button
              type="submit"
              outline
              gradientDuoTone="pinkToOrange"
              className="whitespace-nowrap text-bold text-xl mx-auto w-full mt-4"
              disabled = {isLoading}
            >
              { isLoading ? 'Processing...' : 'Login'}
            </Button>
            <p className="tex-xl max-lg:text-sm mt-3 mb-5">
              Not a member?{' '}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login