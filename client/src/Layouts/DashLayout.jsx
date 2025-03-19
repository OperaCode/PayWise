import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import image from "../assets/avatar.jpg";
import Recent from "../components/RecentTransactions";
import { ThemeContext } from "../context/ThemeContext";
// import { UserContext } from "../context/UserContext";
import { Moon, Sun, Search } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const DashLayout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Get
  // const { user, setUser } = useContext(UserContext); // Use user from context
  const { user, setUser } = useState(" "); // Use user from context
  const [username, setUserName] = useState(" ");
  const [res, setRes] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(" "); // Default avatar
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleSelectFile = (e) => {
    const photo = e.target.files[0];
    if (photo) {
      setFile(photo);
      uploadPhoto(photo); // Pass photo directly
    }
  };

  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        //console.log(UserId)
        const response = await axios.get(`${BASE_URL}/user/${UserId}`, {
          withCredentials: true,
        });
        //console.log(response)
        const data = response?.data;
        const user = data?.user
        console.log(user)
        // setUser(user);
        setUserName(user.firstName)
        setProfilePicture(user.profilePicture || image)
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
       
      }
    };

    fetchUser();
  }, [setUser]);

 
  
  
  const uploadPhoto = async (photo) => {
    // if (!photo) return toast.eroor("Please select an image");

    // const formData = new FormData();
    // formData.append("my_file", photo); // Send the selected file
    // formData.append("userId", user.id);

    const userId = localStorage.getItem("userId");
    console.log("LocalStorage userId:", userId);

    const formData = new FormData();
    formData.append("my_file", photo); // Send the selected file
    formData.append("userId", userId);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Cloudinary Response:", res.data);

      // Update the profile picture state
      if (res.data.secure_url) {
        setProfilePicture(res.data.secure_url);
        // Optionally, update user profile in DB
      }

      // ✅ Check if the response contains a URL and update the state
      if (res.data.url) {
        console.log(res.data.url);
        setProfilePicture(res.data.url); // ✅ Update profile picture
        const updateresponse = await axios.put(
          `http://localhost:3000/user/${userId}/update-profile-picture`,
          {
            profilePicture: res.data.url, // ✅ Save to database
          },
          { withCredentials: true }
        );

        if (updateresponse) {
          console.log(updateresponse);
        }

        // // Update the user state with the new profile picture
        if (updateresponse.data.user.profilePicture) {
          setProfilePicture(updateresponse.data.user.profilePicture);
          console.log(updateresponse.data.user.profilePicture);
          toast.success("Profile picture updated!");
        }
      } else {
        toast.error("Error uploading profile picture. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const uploadPhoto = async (photo) => {
  //   if (!photo) return toast.error("Please select an image");

  //   const formData = new FormData();
  //   formData.append("my_file", photo);

  //   if (!user || !user.id) {
  //     toast.error("User not found. Please log in again.");
  //     return;
  //   }
  //   formData.append("userId", user.id);

  //   try {
  //     setLoading(true);
  //     const res = await axios.post("http://localhost:3000/upload", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     console.log("Cloudinary Response:", res.data);

  //     if (res.data.secure_url) {
  //       setProfilePicture(res.data.secure_url);

  //       await axios.put(
  //         `http://localhost:3000/user/${user.id}/update-profile-picture`,
  //         { profilePicture: res.data.secure_url },
  //         { withCredentials: true }
  //       );

  //       toast.success("Profile picture updated successfully!");
  //     } else {
  //       toast.error("Error uploading profile picture. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     toast.error("Upload failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="lg:flex">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full pt-8 lg:ml-78">
        <div>
          {/* Navbar */}
          <div className="flex items-center justify-end px-10 py-4 gap-2">
            <h1 className="text-cyan- text-xl font-bold">
              Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}!
            </h1>

            {/* Clickable Profile Picture */}
            <div className="relative">
              {/* <div>
                <ClipLoader
                  // color={color}
                  loading={loading}
                  cssOverride={override}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div> */}

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
                  src={profilePicture}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
                />
              </label>
            </div>

            {loading && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 bg-blue-950 dark:bg-gray-700 rounded-2xl hover:cursor-pointer"
            >
              {theme === "light" ? (
                <Moon className="text-white" />
              ) : (
                <Sun className="text-yellow-400" />
              )}
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
