import { Activation } from './pages/Activation'
import { LoginFormData } from './pages/Login'
import { RegisterFormData } from './pages/Register'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

type previousSummary = {
  totalPrevIncome: number
  totalPrevExpenses: number
  prevNetIncome: number
}

interface TransactionSummaryType {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  period: string
  previousSummary: previousSummary
}

export interface TransactionType {
  title: string
  amount: number
  type: string
  date: Date
  category: string
  description: string
  user: string
  createdAt: Date
 
}

export interface AllTransactionType {
  income: TransactionType[],
  expenses: TransactionType[]
}

export interface TopTransactionsType {
  type: string
  topTransactions: { amount: number, category: string }[]
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

export const getRecentTransactions = async () : Promise<TransactionType[]> => {
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

export const getTopTransactions = async () : Promise<TopTransactionsType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/transactions/top-income-and-expenses`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error fetching Transactions')
  }

  return response.json()
}