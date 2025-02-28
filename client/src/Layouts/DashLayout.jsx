import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import image from "../assets/avatar.jpg";
import Recent from "../components/RecentTransactions";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { Moon, Sun, Search } from "lucide-react";

const DashLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  function formatName(fullName) {
    if (!fullName) return "Guest"; // Handle empty or undefined names
  
    const firstName = fullName.split(' ')[0]; // Get the first name
    return firstName.charAt(0).toUpperCase() + firstName.slice(1); // Capitalize first letter
  }
  
  return (
    <div className="lg:flex">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full pt-8 lg:ml-70">
        <div>
          {/* Navbar */}
          <div className="flex items-center justify-end px-10 py-4 gap-2">
            <h1 className="text-cyan- text-xl font-bold">
              Welcome, {formatName(user.fullName)}!
            </h1>
            <img
              src={user?.profilePicture || image}
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
