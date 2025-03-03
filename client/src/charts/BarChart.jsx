import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ThemeContext } from "../context/ThemeContext"; // Import theme context

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const { theme } = useContext(ThemeContext); // Get current theme

  // Define colors based on theme
  const textColor = theme === "dark" ? "#ffffff" : "#000000"; // White in dark mode, black in light mode
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)";

  const data = {
    labels: ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5", "Vendor 5", "Beneficiary 1"], // Labels for bars
    datasets: [
      {
        label: "Biller Rating by payments",
        data: [65, 59, 80, 81, 56, 55, 40], // Data points
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(255, 205, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(201, 203, 207, 0.5)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: textColor, // Adapt to theme
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
          color: textColor, // Adapt to theme
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          color: gridColor, // Adjust grid color
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor, // Adapt to theme
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          color: gridColor, // Adjust grid color
        },
      },
    },
  };

  return (
    <div className="m-auto rounded">
      <h2 className="font-bold text-xl p-2 text-center">Biller Ratings</h2>
      <div className="flex justify-center ">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
