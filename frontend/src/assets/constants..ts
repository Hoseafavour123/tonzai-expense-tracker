import {
  businessImg,
  commissionImg,
  debtImg,
  educationImg,
  entertainmentImg,
  foodIcon,
  freelanceImg,
  giftImg,
  houseImg,
  investmentImg,
  pensionImg,
  personalcareImg,
  rentalImg,
  royaltiesImg,
  savingsImg,
  socialSecurityImg,
  transaportationImg,
  utilityImg,
} from './icons'


type TransactionImgObjType = {
   [key: string]: string
}

export const incomeCategories = [
  'Freelance',
  'Investment',
  'Rental',
  'Business',
  'Commissions',
  'Royalties',
  'Pension',
  'Social Securities',
  'Gifts & Grants',
]

export const IncomeImgObj : TransactionImgObjType = {
  'Freelance': freelanceImg,
  'Investment': investmentImg,
  'Rental': rentalImg,
  'Business': businessImg,
  'Commissions': commissionImg,
  'Royalties': royaltiesImg,
  'Pension': pensionImg,
  'Social Securities': socialSecurityImg,
  'Gifts & Grants': giftImg
}



export const expensesCategories = [
  'Food',
  'Housing',
  'Transportation',
  'Personal Care',
  'Education',
  'Savings & Investments',
  'Entertainment',
  'Debt Payment',
  'Utilities',
]

export const expenseObjImg : TransactionImgObjType= {
  'Food': foodIcon,
  'Housing': houseImg,
  'Transportation': transaportationImg,
  'Personal Care': personalcareImg,
  'Education': educationImg,
  'Savings & Investments': savingsImg,
  'Entertainment': entertainmentImg,
  'Debt Payment': debtImg,
  'Utilities': utilityImg
}