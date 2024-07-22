import { Sidebar } from 'flowbite-react'
import { BiBuoy } from 'react-icons/bi'
import { HiArrowSmRight, HiChartPie, HiTable } from 'react-icons/hi'

const SideBar = () => {
  return (
    <Sidebar
      aria-label="Sidebar with content separator example"
      className="bottom-0 shadow-md rounded-lg"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-5 text-xl h-full">
          <Sidebar.Item href="#" icon={HiChartPie} className="text-2xl mt-5">
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight} className="text-2xl">
            Income
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable} className="text-2xl">
            Expenses
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable} className="text-2xl">
            Budget
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable} className="text-2xl">
            History
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable} className="text-2xl">
            Settings
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default SideBar
