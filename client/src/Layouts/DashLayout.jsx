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
import { UserContext } from "../context/UserContext";
import { Moon, Sun, Search } from "lucide-react";
import axios from "axios";




const DashLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  const [username, setUserName] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext); // Get theme & toggle function
  // const [profilePhoto, setProfilePhoto] = useState(image)
  // const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId"); // Assuming you store userId in local storage
        const response = await axios.get(`http://localhost:3000/user/${UserId}`, { withCredentials: true });
        const data = response.data;

        const capitalizeFirstLetter = (name) => {
          return name.charAt(0).toUpperCase() + name.slice(1);
        };

    setUserName(capitalizeFirstLetter(data.firstName));
        // setProfilePhoto(data.profilePhoto || image);
      } catch (error) {
        // toast.error(error.message)
        console.log("Error fetching user:", error);
      }
  };
  


    fetchUser();
  
  }, []);


  return (
    <div className="lg:flex ">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full pt-8 lg:ml-70 ">
        <div>
          {/* Navbar */}
        <div className="flex items-center justify-end px-10 py-4 gap-2">
          <h1 className="text-cyan- text-xl font-bold ">
            Welcome, {username }!
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
          <Search className="-ml-8 size-5 text-black"/>
        </div>
        </div>

        {/* Balance and Chart Section */}
        <div className="w-full ">
         
            <div className=" ">{children}</div>
         
          <div className="p-1"><Recent /></div>
        </div>



      </div>
    </div>
  );
};

export default DashLayout;