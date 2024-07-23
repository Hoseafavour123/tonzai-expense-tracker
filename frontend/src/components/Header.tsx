import { Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { Dispatch, SetStateAction } from 'react'
import { notification, profilepic } from '../assets/icons'

type props = {
  sideBarToggle: boolean
  setSideBarToggle: Dispatch<SetStateAction<boolean>>
}

const Header = ({ sideBarToggle, setSideBarToggle }: props) => {
  return (
    <nav className="fixed top-0 left-0 right-0 container h-16 bg-white flex justify-between items-center shadow-md z-200">
      <div className="flex gap-3 items-center cursor-pointer">
        <Link
          to="/"
          className="whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white ml-3"
        >
          <span className="px-4 py-1 rounded bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 text-bold text-2xl text-white">
            Tonzai
          </span>
          Expense Tracker
        </Link>
        <FaBars
          className="w-6 h-5 hover:bg-gray-200 hover:"
          onClick={() => setSideBarToggle(!sideBarToggle)}
        />
      </div>
      <div className='flex gap-5 items-center mr-5'>
        <div className='p-1 relative cursor-pointer'><img src={notification} width={25} height={25} alt="" /> <div className='absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500  hover:animate-ping'></div></div>
        <div className='p-1 cursor-pointer rounded-full border-2 border-green-400'><img src={profilepic} width={20} height={20} alt="" /></div>
      </div>
    </nav>
  )
}

export default Header
