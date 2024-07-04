import mongoose from 'mongoose'
import { UserType } from './User'

export interface TransactionType {
  title: string
  amount: number
  type: string
  date: Date
  category: string
  description: string
  user: mongoose.Types.ObjectId | UserType
 
}

const transactionchema = new mongoose.Schema<TransactionType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    amount: {
      type: Number,
      required: true,
      maxLength: 20,
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expenses'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   
  },
  { timestamps: true }
)

const Transaction = mongoose.model<TransactionType>(
  'Transaction',
  transactionchema
)

export default Transaction
