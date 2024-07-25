import { ChartData, ChartOptions } from 'chart.js'
import { AllTransactionType } from '../api-client'
import { Dispatch, SetStateAction } from 'react'
import { Line } from 'react-chartjs-2'
import moment from 'moment'

interface ChartProps {
  data: AllTransactionType
  selectedType: 'income' | 'expenses'
  setSelectedType: Dispatch<SetStateAction<'income' | 'expenses'>>

}


const Chart = ({ data, selectedType, setSelectedType }: ChartProps) => {
  const chartData: ChartData<'line'> = {
    labels: data[selectedType].map((d) =>
      moment(d.date).format('MMMM D, YYYY')
    ),
    datasets: [
      {
        label: selectedType === 'income' ? 'Income' : 'Expenses',
        data: data[selectedType].map((d) => d.amount),
        borderColor: `rgba(75, 192, 192, 1)`,
        backgroundColor: `${
          selectedType === 'income'
            ? ' rgba(0, 128, 0, 0.2)'
            : ' rgba(255, 0, 0, 0.5 '
        } )`,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Weekly ${selectedType === 'income' ? 'Income' : 'Expenses'}`,
      },

    },
  }

  return (
    <div>
      <div className='flex gap-3 p-3'>
        <button className='bg-green-500 hover:opacity-50 p-2 rounded-2xl text-white font-semibold text-sm max-lg:h-9' onClick={() => setSelectedType('income')}>Show Income</button>
        <button className='bg-red-500 hover:opacity-50 p-2 rounded-2xl text-white font-semiold text-sm max-lg:h-9' onClick={() => setSelectedType('expenses')}>
          Show Expenses
        </button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default Chart
