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

const BarChart = ({billers}) => {
  const { theme } = useContext(ThemeContext); // Get current theme
  //  const [billers, setBillers] = useState([]);

  // useEffect(() => {
  //   const fetchBillers = async () => {
  //     try {
  //       const UserId = localStorage.getItem("userId");
  //       const token = localStorage.getItem("token");


  //       const response = await axios.get(`${BASE_URL}/biller`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`, 
  //           "Content-Type": "application/json",
  //         },
  //       });
  
  //       const fetchedBillers = response?.data || [];
  //       console.log(fetchedBillers);
  //       setBillers(fetchedBillers);
  
       
  //       // // Initialize active states
  //       // const initialStates = {};
  //       // fetchedBillers.forEach((biller) => {  // Use fetchedBillers instead of res.data
  //       //   initialStates[biller._id] = biller.activeBiller;
  //       // });
  //       // setActiveBillerStates(initialStates);
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(
  //         error?.response?.data?.message || "Failed to fetch billers"
  //       );
  //     }
  //   };
  
  //   fetchBillers();
  // }, []);

  // Extract labels (biller names) and values (totalAmountPaid)
  const labels = billers.map((biller) => biller.name);
  const dataValues = billers.map((biller) => biller.totalAmountPaid);

  // Define colors based on theme
  const textColor = theme === "dark" ? "#ffffff" : "#000000"; // White in dark mode, black in light mode
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)";

  const data = {
    labels,
    datasets: [
      {
        label: "Total Amount Paid ($)",
        data: dataValues,
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
          font: { size: 12, weight: "bold" },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { size: 12, weight: "bold" } },
        grid: { color: gridColor }, // Adjust grid color
      },
      y: {
        beginAtZero: true,
        ticks: { color: textColor, font: { size: 12, weight: "bold" } },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="m-auto rounded">
      <h2 className="font-bold text-xl p-2 text-center">Top Billers</h2>
      <div className="flex justify-center ">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
