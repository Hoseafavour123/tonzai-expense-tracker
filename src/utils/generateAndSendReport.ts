import Transaction from '../models/Transaction'
import moment from 'moment'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import cron from 'node-cron'
import { sendMail } from './sendMail'
import User from '../models/User'
import { TransactionType } from '../models/Transaction'
import mongoose from 'mongoose'

export const generateAndSendReport = async (
  userId: mongoose.Types.ObjectId
) => {
  try {
    const startDate = moment().subtract(7, 'days').startOf('day')
    const endDate = moment().endOf('day')

    const user = await User.findById(userId)
    const transactions = await Transaction.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    })

    let totalIncome = 0
    let totalExpenses = 0
    let incomesArray: TransactionType[] = []
    let expenseArray: TransactionType[] = []

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome = totalIncome + transaction.amount
        incomesArray.push(transaction)
      } else if (transaction.type === 'expenses') {
        totalExpenses = totalExpenses + transaction.amount
        expenseArray.push(transaction)
      }
    })

    const doc = new PDFDocument()
    const pdfpath = `weekly_report_${startDate.format(
      'YYYY-MM-DD'
    )}_to_${endDate.format('YYYY-MM-DD')}.pdf`

    const writeStream = fs.createWriteStream(pdfpath)
    doc.pipe(writeStream)

    doc
      .fontSize(25)
      .fillColor('black')
      .text(`Weekly Income/Expenses Reports for ${user?.name}`, {
        underline: true,
        align: 'center',
      })
    doc.moveDown()

    doc
      .fontSize(15)
      .text(
        `Date Range: ${moment(startDate).format('DD MMMM YYYY')} - ${moment(endDate).format('DD MMMM YYYY')}`,
        { align: 'center' }
      )
    doc.moveDown(3)

    doc
      .fontSize(18)
      .fillColor('black')
      .text('Summary', { underline: true, align: 'center' })
    doc.moveDown()
    doc.fontSize(12).fillColor('green').text(`Income: $${totalIncome}`)
    doc.moveDown()
    doc.fontSize(12).fillColor('red').text(`Expenses: $${totalExpenses}`)
    doc.moveDown()
    let netIncome = totalIncome > totalExpenses
    doc
      .fontSize(12)
      .fillColor(`${netIncome ? 'green' : 'red'}`)
      .text(`Net Income for the Week: $${totalIncome - totalExpenses}`)
    doc.moveDown(3)

    doc
      .fontSize(18)
      .fillColor('black')
      .text('Income Details', { align: 'center', underline: true })
    doc.moveDown()
    incomesArray.forEach((income, idx) => {
      doc
        .fontSize(12)
        .fillColor('green')
        .text(`${idx + 1}. ${moment(income.date).format('DD MMMM YYYY')} - ${income.description} - $${income.amount}`)
      doc.moveDown()
    })

    doc
      .fontSize(18)
      .fillColor('black')
      .text('Expense Details', { align: 'center', underline: true })
    doc.moveDown()
    expenseArray.forEach((expense, idx) => {
      doc
        .fontSize(12)
        .fillColor('red')
        .text(`${idx + 1}. ${moment(expense.date).format('DD MMMM YYYY')} - ${expense.description} - $${expense.amount}`)
      doc.moveDown()
    })

    doc.end()

    cron.schedule('0 23 * * 6', () => {
      sendMail({
        email: user?.email,
        subject: 'Weekly Income/Expense Report',
        html: `<p>Hello ${user?.name}! Find attached to this mail your income/expenses report for the week.</p>`,
        attachments: [{
          filename: pdfpath,
          path: pdfpath
        }]
      })
    })

    //fs.unlinkSync(pdfpath)
  } catch (error) {
    console.log(error)
  }
}
