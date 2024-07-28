import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import Activation from './pages/Activation'
import SideBar from './components/SideBar'
import { useState } from 'react'
import Header from './components/Header'
import LogIncome from './pages/LogIncome'
import LogExpenses from './pages/LogExpenses'

function App() {
  const { isLoggedIn } = useAppContext()
  const [sideBarToggle, setSideBarToggle] = useState<boolean>(true)
  return (
    <BrowserRouter>
      {isLoggedIn && (
        <div className="">
          <Header
            sideBarToggle={sideBarToggle}
            setSideBarToggle={setSideBarToggle}
          />
          <SideBar sideBarToggle={sideBarToggle} setSideBarToggle={setSideBarToggle} />
        </div>
      )}

      <Routes>
        {isLoggedIn && (
          <Route
            path="/dashboard"
            element={<Dashboard sideBarToggle={sideBarToggle} />}
          ></Route>
        )}
        {isLoggedIn && (
          <Route
            path="/dashboard/income"
            element={<LogIncome sideBarToggle={sideBarToggle} />}
          />
        )}
        { isLoggedIn && (
          <Route
            path="/dashboard/expenses"
            element={<LogExpenses sideBarToggle={sideBarToggle} />}
          />
        )}

        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/activation" element={<Activation />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
