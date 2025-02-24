
import React from 'react'
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
// import Label from './Label.jsx';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);



const data = {
    labels: [
      'Eating',
      'Drinking',
      'Sleeping',
      'Designing',
      'Coding',
      'Cycling',
      'Running'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: 'My Second Dataset',
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
        scales: {
            r: {
              beginAtZero: true,
              suggestedMin: 50,
              suggestedMax: 600,
            },
          },
      elements: {
        line: {
          borderWidth: 4,
          borderColor:'rgba(0, 0, 0, 0.2)',
          backgroundColor:'rgba(0, 0, 0, 0.2)',
         
        }
      }
    },
  };

const options = {
    scales: {
      r: {
        grid: {
            color: "rgba(0, 0, 0, 0)", // Change grid line color (darker)
            lineWidth: 5, // Make the grid lines thicker
          },
          angleLines: {
            color: "rgba(0, 0, 0,)", // Darker lines for the radial spokes
            lineWidth: 5, // Increase thickness of the radial lines
          },
        beginAtZero: true,
        suggestedMin: 50,
        suggestedMax: 600,
      },
    },
  };

  
const Graph = () => {
  return (
    <div className='w-full justify-center rounded border bg-zinc-100 '>
     
        <div className="w-full ">
         {/* <Radar {...config}></Radar> */}
         <Radar data={data} config={config} />
        
        </div>
    
  
    </div>
  )
}

export default Graph