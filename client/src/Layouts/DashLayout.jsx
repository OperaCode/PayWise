import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import image from "../assets/avatar.jpg"
import Graph from "../charts/PieChart";
import Recent from "../components/RecentTransactions";
import HeatMap from "../charts/HeatMap";
import LineGraph from "../charts/LineGraph";
import { Link } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, Search } from "lucide-react";
import axios from "axios";




const DashLayout = ({ children }) => {
  // const { user } = useContext(UserContext);
  const [username, setUserName] = useState("Guest");
  const { theme, toggleTheme } = useContext(ThemeContext); // Get theme & toggle function
  // const [profilePhoto, setProfilePhoto] = useState(image)
  // const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId"); // Assuming you store userId in local storage
        const response = await axios.get(`http://localhost:3000/user/${UserId}`, { withCredentials: true });
        const data = response.data;

        setUserName(data.firstName);
        setProfilePhoto(data.profilePhoto || image);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        // const response = await axios.get(`http://localhost:3000/transactions/${UserId}`, { withCredentials: true });
        setTransactions(response.data); // Assuming response.data is an array of transactions
      } catch (error) {
        console.log("Error fetching transactions:", error);
      }
    };

    fetchUser();
    fetchTransactions();
  }, []);


  return (
    <div className="lg:flex ">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full border lg:ml-70 ">
        <div>
          {/* Navbar */}
        <div className="flex items-center justify-end p-4 gap-2">
          <h1 className="text-cyan- text-xl font-bold ">
            Welcome, {username}!
          </h1>
          <img
            src={image}
            alt="Profile"
            className="w-14 h-14 rounded-full border-2"
          />
          <button
            onClick={toggleTheme}
            className="p-2 bg-blue-950 dark:bg-gray-700 rounded-2xl hover:cursor-pointer"
          >
            {theme === "light" ? <Moon className="text-white" /> : <Sun className="text-yellow-400" />}
          </button>


        </div>
        {/* Search bar */}
        <div className="px-10 flex items-center">
          <input type="text" className="p-1  text-cyan-950 rounded-lg w-full bg-gray-100 border-1 border-neutral-500 shadow-md" placeholder="Enter Search " />
          <Search className="-ml-8 size-5"/>
        </div>
        </div>

        {/* Balance and Chart Section */}
        <div className="w-full">
          <div className=" ">
            <div className=" ">{children}</div>
          </div>
          <div className=""><Recent /></div>
        </div>



      </div>
    </div>
  );
};

export default DashLayout;