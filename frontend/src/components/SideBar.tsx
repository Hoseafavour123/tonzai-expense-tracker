import {FaMoneyBillAlt, FaMoneyCheckAlt, FaCog, FaCrown, FaSignOutAlt} from 'react-icons/fa'
import { IoMdAnalytics } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import * as apiClient from '../api-client'
import { useMutation, useQueryClient } from 'react-query'
import { useAppContext } from '../context/AppContext'
import { Dispatch, SetStateAction } from 'react'

type props = {
  sideBarToggle: boolean
  setSideBarToggle: Dispatch<SetStateAction<boolean>>
}


const SideBar = ({ sideBarToggle, setSideBarToggle }: props) => {
  const queryClient = useQueryClient()
  const { showToast } = useAppContext()
  const navigate = useNavigate()

const mutation = useMutation(apiClient.logout, {
  onSuccess: async () => {
    await queryClient.invalidateQueries('validateToken')
    showToast({ message: 'Logged Out', type: 'SUCCESS' })
    navigate('/login')
  },
  onError: (error: Error) => {
    showToast({ message: error.message, type: 'ERROR' })
  },
})

const handleClick = () => {
  mutation.mutate()
}


  return (
    <aside
      className={`${
        sideBarToggle ? '-translate-x-full ' : 'translate-x-0'
      } min-h-screen bg-white w-[300px] transition-all ease-in-out fixed -mt-3 z-50`}
    >
      <div className="flex flex-col gap-4 p-3">
        <ul className="flex flex-col gap-4 text-xl">
          <li className="hover:bg-gray-50 flex items-center gap-2 p-1">
            <IoMdAnalytics className="h-6 w-6" />
            <Link
              to={'/dashboard'}
              onClick={() => window.screen.width < 1024 && setSideBarToggle(!sideBarToggle)}
            >
              Dashboard
            </Link>
          </li>
          <li className=" hover:bg-gray-50 flex items-center gap-2 p-1">
            <FaMoneyBillAlt className="h-6 w-6" />
            <Link
              to={'/dashboard/income'}
              onClick={() => window.screen.width < 1024 && setSideBarToggle(!sideBarToggle)}
            >
              Income
            </Link>
          </li>
          <li className=" hover:bg-gray-50 flex items-center gap-2 p-1">
            <FaMoneyCheckAlt className="h-6 w-6" />
            <Link
              to={'/dashboard/expenses'}
              onClick={() => window.screen.width < 1024 && setSideBarToggle(!sideBarToggle)}
            >
              Expenses
            </Link>
          </li>
        </ul>

        <div className="border-t-2 hover:bg-gray-50 p-1 mt-5 flex items-center gap-3 cursor-pointer">
          <Link
            to={'/dashboard/premium'}
            className="flex gap-2"
            onClick={() => window.screen.width < 1024 && setSideBarToggle(!sideBarToggle)}
          >
            <FaCrown className="h-6 w-6 text-purple-500" />
            <p className="text-xl ">Go Premium</p>
          </Link>
        </div>

        <ul className="flex flex-col gap-4 text-xl border-t-2 mt-5">
          <li className=" hover:bg-gray-50 flex items-center gap-2 p-1 mt-1">
            <FaCog className="h-6 w-6" />
            <Link
              to={'/settings'}
              onClick={() => window.screen.width < 1024 && setSideBarToggle(!sideBarToggle)}
            >
              Settings
            </Link>
          </li>
          <button
            onClick={handleClick}
            className="hover:bg-gray-50 flex items-center gap-2 mt-5 p-1"
          >
            <FaSignOutAlt className="h-6 w-6" />
            <Link to={'/logout'}  >Logout</Link>
          </button>
        </ul>
      </div>
    </aside>
  )
}

export default SideBar