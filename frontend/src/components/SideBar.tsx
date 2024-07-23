import {FaMoneyBillAlt, FaMoneyCheckAlt, FaCog, FaCrown, FaSignOutAlt} from 'react-icons/fa'
import { IoMdAnalytics } from 'react-icons/io'
import { Link } from 'react-router-dom'

type props = {
  sideBarToggle: boolean
}

const SideBar = ({ sideBarToggle }: props) => {
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
            <Link to={'/dashboard'}>Dashboard</Link>
          </li>
          <li className=" hover:bg-gray-50 flex items-center gap-2 p-1">
            <FaMoneyBillAlt className="h-6 w-6" />
            <Link to={'/log-income'}>Income</Link>
          </li>
          <li className=" hover:bg-gray-50 flex items-center gap-2 p-1">
            <FaMoneyCheckAlt className="h-6 w-6" />
            <Link to={'/log-expenes'}>Expenses</Link>
          </li>
        </ul>

        <div className="border-t-2 hover:bg-gray-50 p-1 mt-5 flex items-center gap-3 cursor-pointer">
          <FaCrown className="h-6 w-6 text-purple-500" />
          <p className="text-xl ">Go Premium</p>
        </div>

        <ul className="flex flex-col gap-4 text-xl border-t-2 mt-5">
          <li className=" hover:bg-gray-50 flex items-center gap-2 p-1 mt-1">
            <FaCog className='h-6 w-6'/>
            <Link to={'/settings'}>Settings</Link>
          </li>
          <li className="hover:bg-gray-50 flex items-center gap-2 mt-5 p-1">
            <FaSignOutAlt className='h-6 w-6'/>
            <Link to={'/logout'}>Logout</Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default SideBar
