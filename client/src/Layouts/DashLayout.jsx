import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import image from "../assets/avatar.jpg";
import Recent from "../components/RecentTransactions";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { Moon, Sun, Search } from "lucide-react";
import axios from "axios";

const DashLayout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Get 
   const { user, setUser } = useContext(UserContext); // ✅ Use user from context
  const [username, setUserName] = useState("");
  const [res, setRes] = useState({});
  // const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(" "); // Default avatar

  // ✅ Handle file selection
  const handleSelectFile = (e) => {
    const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFile(selectedFile); 
    uploadPhoto(selectedFile); // Pass selectedFile directly
  }
  };

  // ✅ Upload Profile Picture
  // const uploadPhoto = async (selectedFile) => {
  //   try {
  //     setLoading(true);
  //     const data = new FormData();
  //     data.append("my_file", file);
  //     const res = await axios.post("http://localhost:3000/upload", data);
  //     setRes(res.data);
  //   } catch (error) {
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const uploadPhoto = async (selectedFile) => {
    if (!selectedFile) return alert("Please select an image");

  const formData = new FormData();
  formData.append("my_file", selectedFile); // Send the selected file
  try {
    // setLoading(true);
    const res = await axios.post("http://localhost:3000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Cloudinary Response:", res.data);
    
    // Update the profile picture state
    // if (res.data.secure_url) {
    //   setProfilePicture(res.data.secure_url); 
    //   // Optionally, update user profile in DB
    // }

    // ✅ Check if the response contains a URL and update the state
    if (res.data.url) {
      setProfilePicture(res.data.url); // ✅ Update profile picture
      await axios.put(`http://localhost:3000/user/${user._id}/update-profile-picture`, {
        profilePicture: res.data.url, // ✅ Save to database
      }, { withCredentials: true });
    } else {
      toast.sucess("Error uploading profile picture. Please try again.");
    }
  } catch (error) {
    console.error("Upload error:", error);
  } finally {
    // setLoading(false);
  }
  };

  // ✅ Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(`http://localhost:3000/user/${userId}`, {
          withCredentials: true,
        });

        const fetchedUser = response?.data?.user;
        setUser(fetchedUser);
        setUserName(fetchedUser?.firstName || "User");
         setProfilePicture(fetchedUser?.profilePicture || image);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [setUser]);

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
                onChange={handleSelectFile}
                className="hidden"
                id="profileUpload"
                multiple={false}
              />
              <label htmlFor="profileUpload">
                <img
                  src={profilePicture || image}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
                />
              </label>
            </div>

            {/* {loading && <span className="text-sm text-gray-500">Uploading...</span>} */}

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
