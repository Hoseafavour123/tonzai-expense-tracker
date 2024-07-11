import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import Activation from './pages/Activation'

function App() {
 const { isLoggedIn } = useAppContext()
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn && (
          <Route path="/dashboard" element={<Dashboard />}></Route>
        )}
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/activation" element={<Activation />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
