
import React from 'react'
import { Chart, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import Label from './Labels'

Chart.register(ArcElement, Tooltip, Legend)

const PieChart = ({ payments }) => {
  // 1. Group by serviceType and sum amounts
  const grouped = {}
  let totalAmount = 0

  payments.forEach((p) => {
    const type = p.recipientBiller?.serviceType || 'Others'
    if (!grouped[type]) grouped[type] = 0
    grouped[type] += p.amount
    totalAmount += p.amount
  })

  const serviceTypes = Object.keys(grouped)
  const amounts = Object.values(grouped)

  const colors = [
    'rgb(255, 205, 86)',   // yellow
    'rgb(54, 162, 235)',   // blue
    'rgb(255, 99, 132)',   // red
    'rgb(153, 102, 255)',  // purple
    'rgb(75, 192, 192)',   // teal
    'rgb(255, 159, 64)',   // orange
  ]

  const chartData = {
    //labels: serviceTypes,
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
      <h2 className='font-bold text-xl p-3 flex justify-center'>Bill Category Breakdown</h2>
      <div className="items-center flex justify-center m-auto">
        <div className="chart w-70 h-70 relative ">
          <Doughnut data={chartData} options={options} />
          <h3 className='absolute inset-0 flex flex-col items-center justify-center font-bold title'>
            Total
            <span className='block text-3xl text-emerald-400'>${totalAmount}</span>
          </h3>
        </div>
        <Label labels={serviceTypes} values={amounts} />
      </div>
    </div>
  )
}

export default PieChart
