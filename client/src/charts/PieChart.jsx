import React, { useMemo } from 'react'
import { Chart, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import Label from './Labels'

// Register required Chart.js elements
Chart.register(ArcElement, Tooltip, Legend)

const PieChart = ({ payments, currency}) => {
  // Memoize data filtering, grouping and transformation
  const { serviceTypes, amounts, totalAmount } = useMemo(() => {
    const grouped = {}
    let total = 0

    const now = new Date()
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(now.getMonth() - 1)

    // Filter payments from the last 30 days
    const filtered = payments.filter((p) => {
      const paymentDate = new Date(p.createdAt || p.date)
      const isFunding = p.recipientBiller?.serviceType?.toLowerCase() === 'Funding'
      return (
        paymentDate >= oneMonthAgo &&
        paymentDate <= now &&
        !isFunding // exclude funding payments
      )
    })
  

    // Group and sum filtered payments
    filtered.forEach((p) => {
      const type = p.recipientBiller?.serviceType || 'Others'
      grouped[type] = (grouped[type] || 0) + p.amount
      total += p.amount
    })

    return {
      serviceTypes: Object.keys(grouped),
      amounts: Object.values(grouped),
      totalAmount: total,
    }
  }, [payments])

  // Optional: memoize colors
  const colors = useMemo(() => [
    'rgb(255, 205, 86)',   // yellow
    'rgb(54, 162, 235)',   // blue
    'rgb(255, 99, 132)',   // red
    'rgb(153, 102, 255)',  // purple
    'rgb(75, 192, 192)',   // teal
    'rgb(255, 159, 64)',   // orange
  ], [])

  // Chart.js doughnut config
  const chartData = {
    datasets: [{
      data: amounts,
      backgroundColor: colors.slice(0, serviceTypes.length),
      hoverOffset: 4,
      borderRadius: 7,
      spacing: 5,
    }]
  }

  const options = {
    responsive: true,
    cutout: 60,
    plugins: {
      legend: {
        labels: {
          boxWidth: 15,
          padding: 15,
        }
      }
    }
  }

  return (
    <div className='m-auto rounded w-full'>
      <h2 className='font-bold text-xl p-3 flex justify-center'>
        Bill Breakdown (Last 30 Days)
      </h2>

      <div className="items-center flex justify-center m-auto">
        <div className="chart w-70 h-70 relative">
          <Doughnut data={chartData} options={options} />

          {/* Total amount inside the doughnut */}
          <h3 className='absolute inset-0 flex flex-col items-center justify-center font-bold title'>
            Total Bills
            <span className='block text-xl text-emerald-500'>{currency(totalAmount)}</span>
          </h3>
        </div>

        <Label labels={serviceTypes} values={amounts} />
      </div>
    </div>
  )
}

export default PieChart
