import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import Activation from './pages/Activation'
import SideBar from './components/SideBar'
import { useState } from 'react'
import Header from './components/Header'

function App() {
  const { isLoggedIn } = useAppContext()
  const [sideBarToggle, setSideBarToggle] = useState<boolean>(false)
  return (
    <BrowserRouter>
      {/*} {!isLoggedIn && (
        <div className="">
          <Header
            sideBarToggle={sideBarToggle}
            setSideBarToggle={setSideBarToggle}
          />
          <SideBar sideBarToggle={sideBarToggle} />
        </div>
      )}*/}
      <div className="">
        <Header
          sideBarToggle={sideBarToggle}
          setSideBarToggle={setSideBarToggle}
        />
        <SideBar sideBarToggle={sideBarToggle} />
      </div>

      <Routes>
       {/* {!isLoggedIn && (
          <Route
            path="/dashboard"
            element={<Dashboard sideBarToggle={sideBarToggle} />}
          ></Route>
        )}*/}
        <Route
          path="/dashboard"
          element={<Dashboard sideBarToggle={sideBarToggle} />}
        ></Route>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activation" element={<Activation />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
