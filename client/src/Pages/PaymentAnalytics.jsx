import React, { useEffect, useState, useRef } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,    // For the x-axis scale in bar and line charts
  LinearScale,      // For the y-axis scale in bar and line charts
  BarElement,       // For bar charts
  ArcElement,       // For pie charts
  Title,            // For the chart title
  Tooltip,          // For tooltips
  Legend,           // For the chart legend
  LineElement,      // For line charts
  PointElement      // For points on line charts
);

const userPaymentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const chartRefs = useRef({}); // Ref to store chart instances

  

  

  return (
    <div>
      <h2>User Payment Analytics</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div style={{ width: '30%' }}>
          <h3>Payments by Status</h3>
          <Pie
            data={statusData}
            ref={(ref) => { chartRefs.current['pie'] = ref?.chartInstance; }}
          />
        </div>
        <div style={{ width: '50%' }}>
          <h3>Monthly Transaction Trends</h3>
          <Line
            data={monthlyData}
            ref={(ref) => { chartRefs.current['line'] = ref?.chartInstance; }}
          />
        </div>
        <div style={{ width: '50%' }}>
          <h3>Top Vendors</h3>
          <Bar
            data={vendorData}
            ref={(ref) => { chartRefs.current['bar'] = ref?.chartInstance; }}
          />
        </div>
      </div>
    </div>
  );
};

export default userPaymentAnalytics;
