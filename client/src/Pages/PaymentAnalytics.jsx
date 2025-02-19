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

  // Dummy data for testing
  const dummyData = {
    paymentStatusCounts: [
      { _id: 'Completed', count: 120 },
      { _id: 'Pending', count: 50 },
      { _id: 'Failed', count: 30 },
    ],
    monthlyTrends: [
      { _id: { year: 2025, month: 1 }, totalAmount: 5000 },
      { _id: { year: 2025, month: 2 }, totalAmount: 7000 },
      { _id: { year: 2025, month: 3 }, totalAmount: 8000 },
    ],
    topVendors: [
      { vendorName: 'Vendor A', totalAmount: 15000 },
      { vendorName: 'Vendor B', totalAmount: 12000 },
      { vendorName: 'Vendor C', totalAmount: 8000 },
    ],
  };

  useEffect(() => {
    // Simulate an API call with dummy data
    setAnalytics(dummyData);
    
    // Clean up previous chart instances on component unmount
    return () => {
      Object.values(chartRefs.current).forEach(chart => chart.destroy());
    };
  }, []);

  if (!analytics) {
    return <p>Loading...</p>;
  }

  // Pie chart for payment status
  const statusData = {
    labels: analytics.paymentStatusCounts.map((item) => item._id),
    datasets: [
      {
        data: analytics.paymentStatusCounts.map((item) => item.count),
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  // Line chart for monthly trends
  const monthlyData = {
    labels: analytics.monthlyTrends.map((item) => `${item._id.month}/${item._id.year}`),
    datasets: [
      {
        label: 'Total Payments ($)',
        data: analytics.monthlyTrends.map((item) => item.totalAmount),
        fill: false,
        borderColor: '#007bff',
      },
    ],
  };

  // Bar chart for top vendors
  const vendorData = {
    labels: analytics.topVendors.map((vendor) => vendor.vendorName),
    datasets: [
      {
        label: 'Total Amount ($)',
        data: analytics.topVendors.map((vendor) => vendor.totalAmount),
        backgroundColor: '#FF9800',
      },
    ],
  };

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
