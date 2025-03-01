import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import image from "../assets/avatar.jpg";
import Recent from "../components/RecentTransactions";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { Moon, Sun, Search } from "lucide-react";
import axios from "axios";

const DashLayout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Get theme & toggle function
  const [user,setUser ] = useState(UserContext); // ✅ Use user from context
  //console.log(user)
  const [username, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(image);
  const [loading, setLoading] = useState(false); 

 // ✅ Fixed: Use `user` from context instead of calling `useContext` inside the function
 const handleChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;



// Update user in state and context
const User = JSON.parse(localStorage.getItem("user"));

  // ✅ Ensure user exists
  if (!user) {
    console.error("User is null, fetching user data...");
    return;
  }


  // Check if user is authenticated
  if (!User) {
    console.error("User is not authenticated, fetching user data...");
    return;
  }
  

  const formData = new FormData();
  formData.append("image", file);
  formData.append("user", User);

  setLoading(true); // Show loading indicator

  try {
    const response = await axios.post("http://localhost:3000/user/upload-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    console.log("Upload success:", response.data);

    // ✅ Update profile picture in state and context
    setProfilePicture(response.data.profilePicture);
    setUser({ ...user, profilePicture: response.data.profilePicture });
  } catch (error) {
    console.error("Upload error:");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        const response = await axios.get(`http://localhost:3000/user/${UserId}`, {
          withCredentials: true,
        });

        const fetchedUser = response?.data?.user;
        console.log(fetchedUser);
        setUser(fetchedUser);
        setUserName(fetchedUser.firstName);
        // setProfilePicture(fetchedUser.profilePicture || image);

      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    const uploadPhoto = async(e)=>{

      const file = e.target.files[0];
      if (!file) return;



      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", UserId);
      try {
        const user = localStorage.getItem("user");
        const response = await axios.post(`http://localhost:3000/user/upload-photo`, { userId: UserId }, {
          withCredentials: true,
        });
        if (!user) {
          console.error("User ID is missing.");
          return;
        }
    

        console.log("Upload photo success:", response.data);

      } catch (error) {
        console.error("Upload photo error:", error.response?.data || error.message);
      }
    }

    fetchUser();
     uploadPhoto();
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

            {/* Clickable Profile Picture */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleChange} 
                className="hidden"
                id="profileUpload"
              />
              <label htmlFor="profileUpload">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
                />
              </label>
            </div>
            
            {loading && <span className="text-sm text-gray-500">Uploading...</span>}

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
