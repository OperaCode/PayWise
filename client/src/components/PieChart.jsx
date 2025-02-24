
import React from 'react'
import {Chart, ArcElement} from "chart.js"
import {Doughnut} from "react-chartjs-2";
import Label from '../components/Labels';

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
      borderRadius:5,
      spacing:5
    }]
  },
  options:{
    responsiveness:true,
    cutout:50,  
    }
}
const Graph = () => {
  return (
    // <div className='flex w-full justify-center rounded p-6'>
    //   <div className="">
    //     <div className="w-50 m-auto items-center flex">
    //      <Doughnut {...config}></Doughnut>
    //      <h3 className=' absolute right-82 text-center  font-bold'>Total <span className='block text-emerald-400'>${0}</span></h3>
    //     </div>
    //     <div className="flex flex-col">
    //    <Label/>
         
    //     </div>
    //   </div>
    // </div>



    <div className='w-full flex justify-center m-auto rounded p-6'>
      <div className="item">
        <div className="chart relative w-50 m-auto">
         <Doughnut {...config}></Doughnut>
         <h3 className='mb-4 font-bold title'>Total <span className='block text-3xl text-emerald-400'>${0}</span></h3>
        </div>
        <div className="flex flex-col ">
          {/* labels */}
          <Label></Label>
        </div>
      </div>
    </div>
  )
}

export default Graph