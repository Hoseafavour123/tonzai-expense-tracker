import { getDownloadURL, ref, uploadBytesResumable, UploadMetadata } from 'firebase/storage'
import { storage } from '../config/firebase.config.js'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { UseFormRegister, UseFormWatch } from 'react-hook-form'
import { UpdateFormData } from '../pages/Settings.ts'
import { BiCloudUpload } from 'react-icons/bi'


type props = {
  updateState: Dispatch<SetStateAction<string>>
  setProgress: Dispatch<SetStateAction<number>>
  isLoading: Dispatch<SetStateAction<boolean>>
  isDeleting: boolean
  setIsDeleting: Dispatch<SetStateAction<boolean>>
  register: UseFormRegister<UpdateFormData>
  watch: UseFormWatch<UpdateFormData>
  userImg: string | undefined
}

const FileUploader = ({
  updateState,
  setProgress,
  isLoading,
  isDeleting,
  setIsDeleting,
  register,
  watch,
  userImg
}: props) => {

const watchFile = watch(`image`)

useEffect(() => {
  if (watchFile && watchFile.length > 0 && !isDeleting) {
    isLoading(true)
    const storageRef = ref(
      storage,
      `Images/${Date.now()}-${watchFile}`
    )
    const uploadTask = uploadBytesResumable(storageRef, watchFile[0])
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateState(downloadURL)
          console.log(downloadURL)
          isLoading(false)
        })
      }
    )
  }
  setIsDeleting(false)
}, [watchFile, isDeleting, storage])

  return (
    <label>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <p className="font-bold text-2xl mt-10">
            <BiCloudUpload />
          </p>
          <p className="md:text-lg max-lg:text-sm">
            Upload profile picture
          </p>
        </div>
      </div>
      <input
        type="file"
        accept={`image/*`}
        className={'w-0 h-0'}
        {...register(`image`, {
          required: false,
        })}
      />
    </label>
  )
}

export default FileUploader
