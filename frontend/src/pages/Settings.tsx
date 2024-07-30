import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '../context/AppContext'
import { Button, FloatingLabel } from 'flowbite-react'
import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { storage } from '../config/firebase.config'
import { deleteObject, ref } from 'firebase/storage'
import FileUploader from '../components/FileUploader'
import FileLoader from '../components/FileLoader'
import { FaTimes } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useModal } from '../context//ModalContext'


type props = {
  sideBarToggle: boolean
}

type deleteProps = {
  url: string
  setIsImageLoading: Dispatch<SetStateAction<boolean>>
  setImageURL: Dispatch<SetStateAction<string>>
}

export type UpdateFormData = {
  image: FileList
  name: string
  email: string
  password: string
}

const Settings = ({ sideBarToggle }: props) => {
  const { showToast } = useAppContext()
  const [time, setTime] = useState<string>('')

  const { data: user } = useQuery('getUser', apiClient.getUser)
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false)
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)
  const [imgURL, setImageURL] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const logout = useMutation(apiClient.logout, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('validateToken')
      closeModal()
      showToast({ message: 'deleted', type: 'SUCCESS' })
      navigate('/login')
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' })
    },
  })

  const deleteUser =  useMutation(apiClient.deleteUser, {
    onSuccess: async () => {
      logout.mutate()
      //navigate('/login')
      //window.location.reload()
    },
    onError: (err: Error) => {
      showToast({ message: err.message, type: 'ERROR' })
    },
  })

  const handleDelete = async () => {
    deleteUser.mutate()
  }


  const showDeleteModal = () => {
    openModal(
      <div className="text-center">
        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          Are you sure you want to delete this account?
        </h3>
        <div className="flex justify-center gap-4">
          <Button color="failure" onClick={handleDelete}>
            Yes, I'm sure
          </Button>
          <Button color="gray" onClick={closeModal}>
            No, cancel
          </Button>
        </div>
      </div>
    )
  }



  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<UpdateFormData>()

  const deleteFileObject = (
    url: deleteProps['url'],
    setIsImageLoading: deleteProps['setIsImageLoading'],
    setImageURL: deleteProps['setImageURL']
  ) => {
    setIsImageLoading(true)
    const deleteRef = ref(storage, url)
    deleteObject(deleteRef).then(() => {
      setImageURL('')
      setIsImageLoading(false)
      setIsDeleting(true)
      setValue(`image`, null as any)
    })
  }

  const mutation = useMutation('updateUser', apiClient.UpdateUser, {
    onSuccess: () => {
      showToast({ message: 'profile updated successfully', type: 'SUCCESS' })
      window.location.reload()
    },
    onError: (err: Error) => {
      showToast({ message: err.message, type: 'ERROR' })
    },
  })

  const onSubmit = (data: UpdateFormData) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('image', imgURL)

    mutation.mutate(formData)
  }

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
      <div className="grid gap-2 mt-5 grid-cols-4 max-lg:grid-cols-1 max-lg:p-2">
        <div className="col-span-1 md:col-span-2 md:col-start-1 lg:col-start-2 bg-white shadow-md">
          <h2 className="sm:text-xl max-lg:text-sm p-2 max-lg:pl-3">
            Email Reminders
          </h2>
          <p className="text-xs p-2 max-lg:pl-3">
            Choose time for daily incomes/expenses logging reminder
          </p>
          <p className="max-lg:pl-3 mt-2 text-center">
            {isLoading ? 'Updating' : ''}
          </p>
          <div className="flex flex-wrap gap-4 mt-3 mb-4 p-3">
            <Button
              outline
              gradientDuoTone="tealToLime"
              size={'xs'}
              onClick={() => setTime('6:00 pm')}
            >
              6:00 pm
            </Button>
            <Button
              outline
              gradientDuoTone="tealToLime"
              size={'xs'}
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
              size={'xs'}
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
            <Button
              outline
              gradientDuoTone="tealToLime"
              className="p-0.5"
              onClick={() => setTime('12:00 am')}
            >
              12:00 am
            </Button>
          </div>
        </div>
        <div className="mt-3 col-span-1 md:col-span-2 md:col-start-1 lg:col-start-2 bg-white shadow-md opacity-65">
          <h2 className="sm:text-xl max-lg:text-sm p-2 max-lg:pl-3">
            SMS Reminder (coming soon...)
            <p className="text-xs p-2 max-lg:pl-3">
              Choose time for daily incomes/expenses logging reminder (GMT + 1)
            </p>
          </h2>
        </div>
        <div className="mt-3 col-span-1 md:col-span-2 md:col-start-1 lg:col-start-2 bg-white shadow-md ">
          <h2 className="sm:text-xl max-lg:text-sm p-2 max-lg:pl-3 mt-3">
            Update Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mb-5 ml-5 mr-5">
            <div className="flex justify-center items-center">
              <div className="  bg-gray-100 backdrop-blur-md md:w-[300px] md:h-[300px] max-lg:w-[200px] max-lg:h-[200px] rounded-full border-2 border-dotted border-gray-300 cursor-pointer mt-5">
              {isImageUploading && (
                  <FileLoader progress={imageUploadProgress} />
                )}

          
                
                {!isImageUploading && (
                  <>
                    {!imgURL ? (
                      <FileUploader
                        updateState={setImageURL}
                        setProgress={setImageUploadProgress}
                        isLoading={setIsImageUploading}
                        isDeleting={isDeleting}
                        setIsDeleting={setIsDeleting}
                        register={register}
                        watch={watch}
                      />
                    ) : (
                      <div className="relative h-full w-full rounded-full">
                        <img
                          src={imgURL}
                          alt="image"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <button
                          className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out z-10"
                          onClick={() => {
                            deleteFileObject(
                              imgURL,
                              setIsImageUploading,
                              setImageURL
                            )
                          }}
                        >
                          <FaTimes className="white" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-5">
              <FloatingLabel
                type="text"
                label="Full name"
                defaultValue={user?.name}
                variant="outlined"
                {...register('name', {
                  required: true,
                })}
              />
            </div>

            <div className="mt-5">
              <FloatingLabel
                type="email"
                label="Email"
                defaultValue={user?.email}
                variant="outlined"
                {...register('email', { required: true })}
              />
            </div>
            <div className="mt-5">
              <FloatingLabel
                type="password"
                label="New password"
                variant="outlined"
                {...register('password', {
                  required: false,
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
              gradientDuoTone="tealToLime"
              className="whitespace-nowrap text-bold text-xl mx-auto w-full mt-4"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Processing...' : 'Update'}
            </Button>
          </form>

          <div className="p-3">
            <h2 className="sm:text-xl max-lg:text-sm p-2 max-lg:pl-3">
              Danger Zone
            </h2>
            <Button gradientMonochrome="failure" size={'xs'} className="ml-3" onClick={showDeleteModal}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
