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
  subscription,
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
  'Subscription',
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
  'Subscription': subscription,
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



type Currency = {
  code: string
  symbol: string
  name: string
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'United States Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound Sterling' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan Renminbi' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
  { code: 'DZD', symbol: 'دج', name: 'Algerian Dinar' },
  { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar' },
  { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
  { code: 'MUR', symbol: '₨', name: 'Mauritian Rupee' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  { code: 'LYD', symbol: 'ل.د', name: 'Libyan Dinar' },
  { code: 'SDG', symbol: 'ج.س', name: 'Sudanese Pound' },
  { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar' },
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
]
