import React, { useMemo } from 'react'
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ payments }) => {
  const { serviceTypes, datasets } = useMemo(() => {
    const groupedData = {};
    const serviceSet = new Set();

    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Filter payments from the last 30 days
    const filtered = payments.filter((p) => {
      const paymentDate = new Date(p.createdAt || p.date);
      return paymentDate >= oneMonthAgo && paymentDate <= now;
    });

    // Group payments by paymentType and serviceType
    filtered.forEach((p) => {
      const paymentType = p.paymentType || 'Unknown';
      const serviceType = p.recipientBiller?.serviceType || 'Others';
      serviceSet.add(serviceType);

      if (!groupedData[paymentType]) {
        groupedData[paymentType] = {};
      }

      groupedData[paymentType][serviceType] = (groupedData[paymentType][serviceType] || 0) + p.amount;
    });

    const allServiceTypes = Array.from(serviceSet);

    const colorSet = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
    ];

    const datasets = Object.keys(groupedData).map((paymentType, i) => {
      return {
        label: `${paymentType} Payments`,
        data: allServiceTypes.map(service => groupedData[paymentType][service] || 0),
        borderColor: colorSet[i % colorSet.length],
        backgroundColor: colorSet[i % colorSet.length],
        fill: false,
        tension: 0.4,
      };
    });

    return {
      serviceTypes: allServiceTypes,
      datasets,
    };
  }, [payments]);

  const data = {
    labels: serviceTypes,
    datasets: datasets,
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
        title: {
          display: true,
          text: "Service Type",
        },
        ticks: {
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Amount ($)",
        },
        ticks: {
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
  };

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
