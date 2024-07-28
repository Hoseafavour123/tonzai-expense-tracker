import express, { Request, Response } from 'express'
import verifyToken from '../middleware/auth'
import { body, check, validationResult } from 'express-validator'
import Transaction, { TransactionType } from '../models/Transaction'
import User from '../models/User'
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import moment from 'moment'
import { getActiveReminders } from '../utils/activeReminderObjects'

const router = express.Router()

export interface TopTransactionsType {
  type: string
  topTransactions: { amount: number; category: string }[]
}

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const startDate = moment().subtract(7, 'days').startOf('day')
    const endDate = moment().endOf('day')

    const transactions = await Transaction.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      user: req.userId,
    })

    let income: TransactionType[] = []
    let expenses: TransactionType[] = []

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        income.push(transaction)
      } else if (transaction.type === 'expenses') {
        expenses.push(transaction)
      }
    })

    return res.status(200).json({ income, expenses })
  } catch (error) {
    console.log(error)
    res.status(200).json({ message: 'Something went wrong' })
  }
})

//transaction summary
router.get(
  '/transactions-summary/:period',
  verifyToken,
  check('period', 'Provide period of transaction').isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }

    try {
      const { period } = req.params
      if (period === 'weekly') {
        const startDate = moment().subtract(7, 'days').startOf('day')
        const endDate = moment().endOf('day')

        const transactions = await Transaction.find({
          date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
          user: req.userId,
        })

        const previousWeekSummary = await Transaction.find({
          date: {
            $gte: startDate.clone().subtract(7, 'days').toDate(),
            $lte: startDate.clone().toDate(),
          },
          user: req.userId,
        })

        let totalIncome = 0
        let totalExpenses = 0
        let totalPrevExpenses = 0
        let totalPrevIncome = 0

        transactions.forEach((transaction) => {
          if (transaction.type === 'income') {
            totalIncome = totalIncome + transaction.amount
          } else if (transaction.type === 'expenses') {
            totalExpenses = totalExpenses + transaction.amount
          }
        })

        previousWeekSummary.forEach((transaction) => {
          if (transaction.type === 'income') {
            totalPrevIncome = totalPrevIncome + transaction.amount
          } else if (transaction.type === 'expenses') {
            totalPrevExpenses = totalPrevExpenses + transaction.amount
          }
        })

        return res.status(200).json({
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          period: 'last 7 days',
          previousSummary: {
            totalPrevIncome,
            totalPrevExpenses,
            prevNetIncome: totalPrevIncome - totalPrevExpenses,
          },
        })
      } else if (period === 'monthly') {
        const startDate = moment().subtract(30, 'days').startOf('day')
        const endDate = moment().endOf('day')

        const transactions = await Transaction.find({
          date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
          user: req.userId,
        })

        const previousMonthSummary = await Transaction.find({
          date: {
            $gte: startDate.clone().subtract(30, 'days').toDate(),
            $lte: startDate.clone().toDate(),
          },
          user: req.userId,
        })

        let totalIncome = 0
        let totalExpenses = 0
        let totalPrevExpenses = 0
        let totalPrevIncome = 0

        transactions.forEach((transaction) => {
          if (transaction.type === 'income') {
            totalIncome = totalIncome + transaction.amount
          } else if (transaction.type === 'expenses') {
            totalExpenses = totalExpenses + transaction.amount
          }
        })

        previousMonthSummary.forEach((transaction) => {
          if (transaction.type === 'income') {
            totalPrevIncome = totalPrevIncome + transaction.amount
          } else if (transaction.type === 'expenses') {
            totalPrevExpenses = totalPrevExpenses + transaction.amount
          }
        })

        return res.status(200).json({
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          period: 'last 30 days',
          previousSummary: {
            totalPrevIncome,
            totalPrevExpenses,
            prevNetIncome: totalPrevIncome - totalPrevExpenses,
          },
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'something went wrong' })
    }
  }
)

// recent transactions
router.get('/recent', verifyToken, async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({ user: req.userId })
      .limit(5)
      .sort({ createdAt: -1 })
    res.status(200).json(transactions)
  } catch (error) {
    console.log(error)
    res.status(200).json({ message: 'Something went wrong ' })
  }
})

// top transactions
router.get(
  '/top-income-and-expenses',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const topTransactions: TopTransactionsType[] =
        await Transaction.aggregate([
          {
            $match: {
              type: { $in: ['income', 'expenses'] },
              user: new ObjectId(req.userId),
            },
          },
          {
            $sort: { amount: -1 },
          },
          {
            $group: {
              _id: '$type',
              transactions: {
                $push: {
                  amount: '$amount',
                  category: '$category',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              type: '$_id',
              transactions: 1,
            },
          },
          {
            $addFields: {
              topTransactions: {
                $reduce: {
                  input: '$transactions',
                  initialValue: { uniqueCategories: [], transactions: [] },
                  in: {
                    $cond: [
                      { $in: ['$$this.category', '$$value.uniqueCategories'] },
                      '$$value',
                      {
                        uniqueCategories: {
                          $concatArrays: [
                            '$$value.uniqueCategories',
                            ['$$this.category'],
                          ],
                        },
                        transactions: {
                          $concatArrays: ['$$value.transactions', ['$$this']],
                        },
                      },
                    ],
                  },
                },
              },
            },
          },

          {
            $project: {
              type: 1,
              topTransactions: { $slice: ['$topTransactions.transactions', 3] },
            },
          },
        ])

      return res.status(200).json(topTransactions)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
)

// total amount
router.get('/total/:type', verifyToken, async (req: Request, res: Response) => {
  try {
    let totalAmount = 0

    const result = await Transaction.find({
      user: req.userId,
      type: req.params.type,
    })
    result.forEach((res) => {
      totalAmount += res.amount
    })

    return res.status(200).json({ type: res.type, totalAmount })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// all income or expenses
router.get('/:type', verifyToken, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const startIndex = (page - 1) * limit
    const transactions = await Transaction.find({
      user: req.userId,
      type: req.params.type,
    })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })

    const totalDocuments = await Transaction.countDocuments()

    return res.status(200).json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// get a single transaction
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    res.status(200).json({ transaction })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

//create transaction
router.post(
  '/create',
  [
    body('title').notEmpty().withMessage('title is required'),
    body('amount')
      .notEmpty()
      .withMessage('amount must not be empty')
      .isNumeric()
      .withMessage('amount must be number'),
    body('type')
      .notEmpty()
      .withMessage('type must not be empty')
      .isIn(['income', 'expenses'])
      .withMessage('type must either be income or expenses'),
    body('category').notEmpty().withMessage('category must not be empty'),
    body('description').notEmpty().withMessage('description must not be empty'),
  ],

  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.status(400).json({ message: errors.array() })
    }

    try {
      const { title, amount, type, date, category, description } = req.body

      const newTransaction = new Transaction({
        title,
        amount,
        type,
        date,
        category,
        description,
        user: req.userId,
      })
      await newTransaction.save()
      res.status(200).json({ message: 'transaction saved.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
)

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...req.body }
    )
    if (!updatedTransaction) {
      return res.status(400).json({ message: 'Failed to update transaction ' })
    }

    return res.status(200).json({ message: 'success', updatedTransaction })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: 'Successfully deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Somthing went wrong' })
  }
})

export default router