
import React from 'react'
import {Chart, ArcElement} from "chart.js"
import {Doughnut} from "react-chartjs-2";
import Label from './Labels';

Chart.register(ArcElement);

const config = {
  data: {
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4,
      borderRadius:7,
      spacing:5
    }]
  },
  options:{
    responsiveness:true,
    cutout:60,  
    }
}
const Graph = () => {
  return (
   

    <div className=' m-auto rounded'>
        <h2 className='font-bold text-1xl text-center '>Expense Breakdown</h2>
      <div className="items-center flex w-2/3 justify-center m-auto ">
        <div className="chart w-60 h-60 relative m-auto">
         <Doughnut {...config}></Doughnut>
         <h3 className='mb-4 font-bold title'>Total <span className='block text-3xl text-emerald-400'>${0}</span></h3>
        </div>
        
          {/* labels */}
          <Label></Label>
       
      </div>
    </div>
  )
}

export default Graph