import { Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { Dispatch, SetStateAction, useState } from 'react'
import { notification, profilepic } from '../assets/icons'
import * as apiClient from '../api-client'
import { useQuery } from 'react-query'
import { useNotification } from '../context/NotificationContext'
import { FaTimes } from 'react-icons/fa'
type props = {
  sideBarToggle: boolean
  setSideBarToggle: Dispatch<SetStateAction<boolean>>
}

const Header = ({ sideBarToggle, setSideBarToggle }: props) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 container h-16 bg-white flex justify-between items-center shadow-md z-500 overflow-hidden`}>
      <div className="flex gap-3 items-center cursor-pointer">
        <Link
          to="/"
          className={`whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white ml-3  ${
            sideBarToggle ? 'hidden' : ''
          }`}
        >
          <span className="px-4 py-1 rounded bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 text-bold md:text-2xl max-lg:text-xl sm:text-2x text-white max-lg:px-1">
            Tonzai
          </span>
          Expense Tracker
        </Link>
        <FaBars
          className={`w-6 h-5 lg:w-7 lg:h-6 hover:bg-gray-200 transition-all ease-in-out ${
            sideBarToggle ? 'ml-3' : ''
          }`}
          onClick={() => {
            setSideBarToggle(!sideBarToggle)
          }}
        />
      </div>
      {/* <div className={`flex gap-5 max-lg:gap-2 items-center`}>
        <div className="p-1 relative cursor-pointer mr-3">
          <img
            src={notification}
            width={25}
            height={25}
            alt=""
            onClick={() => setAlertDropDown(!alertDropDown)}
            className="rounded-full md:w-6 md:h-6 max-lg:w-5 max-lg:h-5 "
          />{' '}
          {alertDropDown && (
            <>
              <div className="absolute top-12 right-3 bg-blue-200 shadow-lg rounded-lg p-4 w-[300px] h-[200px] overflow-y-auto transition-all ease-in-out z-100">
                {notifications?.length === 0 ? (
                  <p>No notifications</p>
                ) : (
                  notifications?.map((notification) => (
                    <div
                      key={notification._id}
                      className="flex justify-between items-center"
                    >
                      <p className='text-sm'>{notification.message}</p>
                      <button
                        onClick={() => deleteNotification(notification._id)}
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          {notifications && notifications?.length > 0 && (
            <>
              <div
                className={`absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500  animate-ping`}
              ></div>
            </>
          )}
        </div>
        <div className="p-1 relative cursor-pointer border-green-400 max-lg:mr-4">
          <img
            src={`${user?.image?.url ? user?.image?.url : profilepic}`}
            width={25}
            height={25}
            alt=""
            className="rounded-full md:h-6 md:w-6 max-lg:w-5 max-lg:h-5 "
            onClick={() => setDropDown(!dropDown)}
          />
          <div className={`absolute top-12 right-3 bg-blue-200 rounded-md`}>
            {dropDown && (
              <ul className="flex flex-col gap-3 transition-all bg-gray-800 p-3 text-white ">
                <li>Settings</li>
                <li>More...</li>
              </ul>
            )}
          </div>
        </div>
      </div> */}
    </nav>
  )
}

export default Header
