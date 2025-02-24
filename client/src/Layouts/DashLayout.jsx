import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import image from "../assets/avatar.jpg"
import { Link } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun } from "lucide-react";
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
        const response = await axios.get(`http://localhost:3000/transactions/${UserId}`, { withCredentials: true });
        setTransactions(response.data); // Assuming response.data is an array of transactions
      } catch (error) {
        console.log("Error fetching transactions:", error);
      }
    };

    fetchUser();
    fetchTransactions();
  }, []);
 
  
  return (
    <div className="lg:flex items-cent p-1 ">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full p-3 ">
        {/* Navbar */}
        <div className="flex items-center justify-end gap-4 p-2">
          <h1 className="text-cyan- text-2xl md:text-2xl font-bold ">
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
        <div className="px-6">
        <input type="text" className="p-2  text-cyan-950 rounded-lg w-full bg-gray-200 border-1 border-neutral-500 shadow-md" placeholder="Enter Search " />
        </div>

        {/* Balance and Chart Section */}
        <div className="w-full p-3 ">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashLayout;