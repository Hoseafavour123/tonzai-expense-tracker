import { Activation } from './pages/Activation'
import { LoginFormData } from './pages/Login'
import { TransactionLogForm } from './pages/LogIncome'
import { RegisterFormData } from './pages/Register'
import { Notification } from './context/NotificationContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export interface UserType {
  _id: string
  name: string
  email: string
  image: { url: string, id: string }
  password: string
  currency: string
}

export interface Reminder {
  time: string
}

export interface TransactionType {
  _id: string
  title: string
  amount: number
  type: string
  date: Date
  category: string
  description: string
  user: string
  createdAt: Date
}

type previousSummary = {
  totalPrevIncome: number
  totalPrevExpenses: number
  prevNetIncome: number
}

type PaginatedRequest = {
  page: number
  type: string
}

export type PaginatedResponse = {
  transactions: TransactionType[]
  page: number
  totalPages: number
}

interface TransactionSummaryType {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  period: string
  previousSummary: previousSummary
}

export interface AllTransactionType {
  income: TransactionType[]
  expenses: TransactionType[]
}

export interface TopTransactionsType {
  type: string
  topTransactions: { amount: number; category: string }[]
}

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
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
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/activation`, {
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
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/validate-token`, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Token invalid')
  }
}

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    credentials: 'include',
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(' Error during sign out')
  }
}

export const login = async (formData: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
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

export const getTransactionSummary = async (
  period: string
): Promise<TransactionSummaryType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/transactions/transactions-summary/${period}`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Error fetching Transactions')
  }

  return response.json()
}

export const getRecentTransactions = async (): Promise<TransactionType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/transactions/recent`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error fetching Transactions')
  }

  return response.json()
}

export const getTransactions = async (): Promise<AllTransactionType> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/transactions`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error fetching Transactions')
  }

  return response.json()
}

export const getPaginatedTransaction = async ({
  page,
  type,
}: PaginatedRequest): Promise<PaginatedResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/transactions/${type}?page=${page}`,
    {
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Error fetching Transactions')
  }

  return response.json()
}

export const getTopTransactions = async (): Promise<TopTransactionsType[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/transactions/top-income-and-expenses`,
    {
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Error fetching Transactions')
  }

  return response.json()
}

export const getTotalAmount = async (
  type: string
): Promise<{ totalAmount: number; type: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/transactions/total/${type}`,
    {
      credentials: 'include',
    }
  )
  if (!response.ok) {
    throw new Error('Error fetching Transactions')
  }

  return response.json()
}

export const LogTransaction = async (formData: TransactionLogForm) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/transactions/create`, {
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

export const deleteTransaction = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/transactions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error deleting transaction')
  }

  return response.json()
}

export const createReminder = async (time: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/reminders/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ time }),
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error('An error occurred')
  }

  return body
}

export const UpdateUser = async (formData: FormData): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/update`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error('error updating user')
  }

  return body
}

export const getUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('error getting user')
  }
  return response.json()
}


export const deleteUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/delete`, {
    method: 'DELETE',
    credentials: 'include'
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error(body.message)
  }
  return body
}

export const getReminder = async (): Promise<Reminder> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/reminders/get`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error fetching reminders')
  }

  return response.json()
}

export const getNotification = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error fetching notifications')
  }

  return response.json()
}

export const deleteNotification = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/notifications/${id}`, {
    method:'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error deleting notifications')
  }

  return response.json()
}