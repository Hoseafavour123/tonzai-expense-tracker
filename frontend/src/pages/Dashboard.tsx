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
        showToast({ message: err.message, type: 'ERROR' })
      },
    }
  )

  const { data: recentTransactions } = useQuery(
    'fetchRecentTransaction',
    apiClient.getRecentTransactions
  )

  const { data: topTransactions } = useQuery(
    'getTopTransactions',
    apiClient.getTopTransactions
  )

  const { data: transactions } = useQuery(
    [
      'getTransactions',
      {
        selectedType,
        data,
        transactionSummary,
        recentTransactions,
        topTransactions,
      },
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
        sideBarToggle ? 'ml-3' : 'md:ml-[310px]'
      } min-h-screen mt-20 mb-20`}
    >
      <div>
        <h1 className="md:text-3xl mb-3 sm:text-2xl ">Dashboard</h1>
      </div>

      <div className="grid lg:grid-cols-5 lg:grid-rows-5 gap-5 text-white sm:grid-cols-1 md:grid-cols-2 items-start ">
        <div className="sm:w-[350px] md:w-full max-lg:mr-3">
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
              color: `green`,
            }}
          />
        </div>

        <div className="sm:w-[350px] md:w-full max-lg:mr-3 ">
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

        <div className="sm:w-[350px] md:w-full max-lg:mr-3">
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

        <div className="lg:col-span-2 lg:row-span-2 p-4 bg-white h-full w-full shadow-md rounded-md sm:row-span-2 sm:col-span-2 sm:w-full max-lg:w-[335px]">
          <h1 className="md:text-2xl sm:text-xl text-black">
            Recent transactions
          </h1>
          {recentTransactions && recentTransactions?.length > 0 ? (
            <>
              <ol className="flex flex-col space-y-4 text-black mt-3 overflow-y-auto p-2">
                {recentTransactions?.map((transaction, idx) => (
                  <li className="font-semi md:text-xl sm:text-sm shadow rounded-xl p-1">
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
            </>
          ) : (
            <>
              <div className="flex justify-center items-center h-full w-full text-sm text-gray-700 mb-5">
                no recent transactions
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-3 lg:row-span-3 lg:h-full lg:w-full bg-white md:col-span-2 md:row-span-1 sm:col-span-1 sm:row-span-1 max-lg:w-[335px] max-lg:h-[280px] md:h-full md:w-full">
          <Chart
            data={data}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        </div>

        <div className="lg:col-span-2 lg:row-span-3 lg:col-start-4 lg:row-start-3 lg:row-end-5 md:col-span-2 h-full w-full bg-white shadow-md max-lg:w-[335px]">
          <h1 className="md:text-2xl sm:text-xl font-bold text-center text-black mt-3">
            Top Categories
          </h1>
          {topTransactions && topTransactions.length > 0 ? (
            <>
              <div className="flex justify-around p-1 flex-row-reverse md:flex-row max-lg:flex-col">
                {topTransactions.map((transaction) => (
                  <div
                    className={`${
                      transaction.type === 'income'
                        ? 'text-green-500'
                        : 'text-red-500'
                    } text-black md:space-y-3 sm:space-y-1 p-1 max-lg:p-2`}
                  >
                    <h1 className="md:text-2xl sm:text-xl font-bold">
                      {transaction.type}
                    </h1>
                    {transaction.topTransactions.map((tran, idx) => (
                      <p>
                        {' '}
                        {idx + 1}. {tran.category} - ${tran.amount}{' '}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center h-full text-sm text-gray-700 bg-white">
                no top categories
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default Dashboard
