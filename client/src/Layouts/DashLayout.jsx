import React, { useContext,useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import image from "../assets/avatar.jpg";
import Recent from "../components/RecentTransactions";
import { ThemeContext } from "../context/ThemeContext";

import { Moon, Sun, Search } from "lucide-react";
import axios from "axios";

const DashLayout = ({ children }) => {
 
 const { theme, toggleTheme } = useContext(ThemeContext); // Get theme & toggle function
  const [username, setUserName] = useState(" ")
  const [profilePicture, setprofilePicture] = useState(image)

  // const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    const fetchUser = async () => {
      // try {
      //   const UserId = localStorage.getItem("userId"); // Assuming you store userId in local storage
      //   const response = await axios.get(`http://localhost:3000/user/${UserId}`, { withCredentials: true });
      //   const data = response.data;
      //   console.log(data.user)
      //   const user = data.user
      //   setUserName(user.firstName);
      //   console.log(username)
      //   setprofilePicture(data.profilePicture || image);
      // } catch (error) {
      //   console.log("Error fetching user:", error);
      // }

      try {
        const UserId = localStorage.getItem("userId"); // Assuming you store userId in local storage
        const response = await axios.get(`http://localhost:3000/user/${UserId}`, { withCredentials: true });
        
        const fetchedUser = response?.data?.user;
        console.log(fetchedUser)
        setUserName(fetchedUser.firstName);
        setprofilePicture(fetchedUser.profilePicture || image);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    // const fetchTransactions = async () => {
    //   try {
    //     const UserId = localStorage.getItem("userId");
    //     const response = await axios.get(`http://localhost:3000/transactions/${UserId}`, { withCredentials: true });
    //     setTransactions(response.data); // Assuming response.data is an array of transactions
    //   } catch (error) {
    //     console.log("Error fetching transactions:", error);
    //   }
    // };

    fetchUser();
    // fetchTransactions();
  }, []);




  
  
  
  return (
    <div className="lg:flex">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full pt-8 lg:ml-70">
        <div>
          {/* Navbar */}
          <div className="flex items-center justify-end px-10 py-4 gap-2">
            <h1 className="text-cyan- text-xl font-bold">
              Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}!
            </h1>
            <img
              // src={user?.profilePicture ? user.profilePicture : image}
               src={profilePicture ? profilePicture : image}
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
            <input
              type="text"
              className="p-1 text-cyan-950 rounded-lg w-full bg-gray-100 border-1 border-neutral-500 shadow-md"
              placeholder="Enter Search"
            />
            <Search className="-ml-8 size-5 text-black" />
          </div>
        </div>

        {/* Balance and Chart Section */}
        <div className="w-full">
          <div className="">{children}</div>
          <div className="p-1">
            <Recent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashLayout;
