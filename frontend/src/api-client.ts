import { Activation } from "./pages/Activation"
import { LoginFormData } from "./pages/Login"
import { RegisterFormData } from "./pages/Register"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''



export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  const responseBody = await response.json()

  if (!response.ok) {
    throw new Error(responseBody.message)
  }
}

export const activation = async (otpString: Activation) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/activation`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(otpString),
  })
  const responseBody = await response.json()

  if (!response.ok) {
    throw new Error(responseBody)
  }
}


export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Token invalid')
  }
}




export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: 'include',
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(' Error during sign out')
  }
}

export const login = async (formData: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error(body.message)
  }
  return body
}
