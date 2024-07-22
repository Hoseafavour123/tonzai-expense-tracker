import { Card } from 'flowbite-react'
import Chart from '../components/Chart'
import HistoryCard from '../components/HistoryCard'
import SideBar from '../components/SideBar'

const Dashboard = () => {
  return (
    <div className="flex gap-5 min-h-screen ">
      <div className='bg-red-600'>
        <SideBar />
      </div>
      <div className="bg-red-200 w-[100%]">
        <h1>HELLLO</h1>
        <div className="grid grid-cols-3 gap-3 bg-black">
          <div className="row-span-full col-span-2 bg-blue-300">DIV1</div>
          <div className="bg-green"></div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
