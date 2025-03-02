import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";



// Register necessary components for Line Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const data = {
  labels: [
    "Eating",
    "Drinking",
    "Sleeping",
    "Designing",
    "Coding",
    "Cycling",
    "Running",
  ],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      pointBackgroundColor: "rgb(255, 99, 132)",
      tension: 0.4, // Smooth curve
    },
    {
      label: "My Second Dataset",
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: false,
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      pointBackgroundColor: "rgb(54, 162, 235)",
      tension: 0.4, // Smooth curve
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};

const LineGraph = () => {
 

  return (
    <div className="rounded ">
      <h3 className="text-xl font-bold text-center p-6">Activity Trends</h3>
      <div className="w-full lg:h-80 flex justify-center">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;
