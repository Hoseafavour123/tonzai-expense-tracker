import Card from '../components/Card'
import { expenseIcon, incomeIcon, wallet } from '../assets/icons'
import { useQuery } from 'react-query'
import * as apiClient from '../api-client'
import { useState } from 'react'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import moment from 'moment'
import Chart from '../components/Chart'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

type prop = {
  sideBarToggle: boolean
}

const Dashboard = ({ sideBarToggle }: prop) => {
  const { showToast } = useAppContext()
  const [transactionPeriod, setTransactionPeriod] = useState<string>('weekly')

  const [data, setData] = useState<apiClient.AllTransactionType>({
    income: [],
    expenses: [],
  })
  const [selectedType, setSelectedType] = useState<'income' | 'expenses'>(
    'income'
  )

  const { data: transactionSummary, isLoading } = useQuery(
    ['fetchTransactionSummary', transactionPeriod],
    () => apiClient.getTransactionSummary(transactionPeriod),
    {
      onSuccess: () => {
        console.log('All good')
      },
      onError: (err: Error) => {
        console.log(transactionSummary)
        showToast({ message: err.message, type: 'ERROR' })
      },
    }
  )

  const { data: recentTransactions } = useQuery(
    'fetchRecentTransaction',
    apiClient.getRecentTransactions,
    {
      onSuccess: () => {
        console.log(recentTransactions)
      },
      onError: (err: Error) => {
        showToast({ message: err.message, type: 'ERROR' })
      },
    }
  )

  const { data: topTransactions } = useQuery(
    'getTopTransactions',
    apiClient.getTopTransactions,
    {
      onSuccess: () => {
        console.log(topTransactions, 'tops')
      },
    }
  )

  const { data: transactions } = useQuery( 
    [
      'getTransactions',
      { selectedType, data, transactionSummary, recentTransactions, topTransactions },
    ],
    apiClient.getTransactions,
    {
      onSuccess: () => {
        if (transactions) setData(transactions)
      },
      onError: (err: Error) => {
        console.log(err)
      },
    }
  )

  

  if (isLoading) {
    ;<Loader />
  }

  return (
    <div
      className={`${
        sideBarToggle ? 'm-5' : 'md:ml-[310px]'
      } min-h-screen mt-20 mb-20`}
    >
      <div>
        <h1 className="text-3xl mb-3">Dashboard</h1>
      </div>

      <div className="grid lg:grid-cols-5 lg:grid-rows-5 gap-5 text-white m-3 sm:grid-cols-1 md:grid-cols-2 items-center">
        <div className="sm:w-[350px] md:w-full">
          <Card
            amount={transactionSummary?.totalIncome}
            period={transactionSummary?.period}
            title="Income"
            iconImg={{ src: incomeIcon, alt: 'income icon' }}
            avgDaily={{
              percent:
                transactionSummary &&
                Math.ceil(
                  (transactionSummary.netIncome /
                    transactionSummary.totalIncome) *
                    100
                ),
              color: `${
                transactionSummary &&
                transactionSummary?.netIncome >
                  transactionSummary.previousSummary.prevNetIncome
                  ? 'green'
                  : 'red'
              }`,
            }}
          />
        </div>

        <div className="sm:w-[350px] md:w-full">
          <Card
            amount={transactionSummary?.totalExpenses}
            period={transactionSummary?.period}
            title="Expenses"
            iconImg={{
              src: expenseIcon,
              alt: 'expense icon',
            }}
            avgDaily={{
              percent:
                transactionSummary &&
                Math.ceil(
                  (transactionSummary?.totalExpenses /
                    transactionSummary.totalIncome) *
                    100
                ),
              color: 'red',
            }}
          />
        </div>

        <div className="sm:w-[350px] md:w-full">
          <Card
            amount={transactionSummary?.netIncome}
            period={transactionSummary?.period}
            title="Net Income"
            iconImg={{ src: wallet, alt: 'wallet icon' }}
            avgDaily={{
              percent: transactionSummary && transactionSummary.netIncome / 100,
              color: 'yellow',
            }}
          />
        </div>

        <div className="lg:col-span-2 lg:row-span-2 p-4 bg-white h-full w-full shadow-md rounded-md sm:row-span-2 sm:col-span-2 sm:w-full max-lg:w-[350px]">
          <h1 className="text-2xl text-black">Recent transactions</h1>
          <ol className="flex flex-col space-y-4 text-black mt-3 overflow-y-auto p-2">
            {recentTransactions?.map((transaction, idx) => (
              <li className="font-semi text-xl shadow rounded-xl p-1">
                <small className="text-gray-400 text-xs inline">
                  {idx + 1}.{' '}
                  {moment(transaction.createdAt).format('MMMM D, YYYY')}
                </small>
                <small
                  className={`${
                    transaction.type === 'income'
                      ? 'text-green-500'
                      : 'text-red-500'
                  } ml-3 max-lg:text-sm`}
                >
                  {' '}
                  {transaction.category} - {transaction.description}- $
                  {transaction.amount}{' '}
                </small>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-3 lg:row-span-3 lg:h-full lg:w-full bg-white md:col-span-2 md:row-span-1 sm:col-span-1 sm:row-span-1 max-lg:w-[350px] max-lg:h-[250px] md:h-full md:w-full">
          <Chart
            data={data}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        </div>

        <div className="lg:col-span-2 lg:row-span-3 lg:col-start-4 lg:row-start-3 lg:row-end-5 md:col-span-2 h-full w-full bg-white shadow-md">
          <h1 className="text-3xl font-bold text-center text-black mt-3">
            Top Categories
          </h1>
          <div className="flex justify-around p-1 flex-row-reverse md:flex- sm:flex-col">
            {topTransactions &&
              topTransactions.map((transaction) => (
                <div
                  className={`${
                    transaction.type === 'income'
                      ? 'text-green-500'
                      : 'text-red-500'
                  } text-black space-y-3 p-1 max-lg:p-2`}
                >
                  <h1 className="text-2xl font-bold">{transaction.type}</h1>
                  {transaction.topTransactions.map((tran, idx) => (
                    <p>
                      {' '}
                      {idx + 1}. {tran.category} - ${tran.amount}{' '}
                    </p>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
