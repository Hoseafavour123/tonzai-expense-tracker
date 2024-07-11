import express, { Request, Response } from 'express'
import verifyToken from '../middleware/auth'
import { body, validationResult } from 'express-validator'
import Transaction from '../models/Transaction'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/get-all-transactions', verifyToken, async (req: Request, res: Response) => {
  try {
    console.log(req.userId)
    const transactions = await Transaction.find({user: req.userId })
      .populate({ path: 'user', select: '-password' })
      .exec()
    res.status(200).json({ transactions })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'something went wrong' })
  }
})

// recent transactions
router.get('/get-recent-transaction', verifyToken, async (req: Request, res: Response) => {
  try {
     const transactions = await Transaction.find({ user: req.userId }).limit(5).sort({ createdAt: -1 })
       .populate({ path: 'user', select: '-password' })
       .exec()
     res.status(200).json({ transactions })
  } catch (error) {
    console.log(error)
    res.status(200).json({ message: 'Something went wrong '})
  }
})

// all income or expenses
router.get('/get-all-transactions/:type', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.find({
      user: req.userId,
      type: req.params.type
    }).limit(5).sort({ createdAt : -1 }).populate({ path: 'user', select: '-password' }).exec()
    res.status(200).json({ transaction })
  } catch (error) {
    console.log(error)
    res.status(200).json({ message: 'Something went wrong'})
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
    body('date')
      .notEmpty()
      .withMessage('date must not be empty')
      .isDate()
      .withMessage('invalid date format'),
    body('category').notEmpty().withMessage('category must not be empty'),
    body('description').notEmpty().withMessage('description must not be empty'),
  ],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
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



router.put('/:id', async(req: Request, res: Response) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, {...req.body})
    if (!updatedTransaction) {
      return res.status(400).json({ message: "Failed to update transaction "})
    }

    return res.status(200).json({message: 'success',  updatedTransaction })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong'})
  }
})


router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Successfully deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Somthing went wrong' })
  }
})

export default router
