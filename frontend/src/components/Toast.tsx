
import { useEffect } from 'react'

type ToastProps = {
  message: string
  type: 'SUCCESS' | 'ERROR'
  onClose: () => void
}

const ToastComponent = ({message, type, onClose}: ToastProps) => {

    useEffect(() => {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => {
        clearTimeout(timer)
      }
    }, [onClose])

   const styles =
     type === 'SUCCESS'
       ? 'fixed top-4 right-20 z-50 pl-4 pr-4 pt-1 pb-1 rounded-md bg-green-600 text-white'
       : 'fixed top-4 right-20 z-50 pl-4 pr-4 pt-1 pb-1 rounded-md bg-red-600 text-white'
   return (
     <div className={styles}>
       <div className="flex justify-center items-center">
         <span className="text-lg font-semibold max-lg:text-sm">{message}</span>
       </div>
     </div>
   )
}

export default ToastComponent
