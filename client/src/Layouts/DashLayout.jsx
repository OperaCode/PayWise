import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Recent from "../components/RecentTransactions";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Avatar from "./Avatar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DashLayout = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [username, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState();

  console.log(user);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.profilePicture) {
      setProfilePicture(user.profilePicture);
    }
  }, [user]);

  const handleSelectFile = (e) => {
    const photo = e.target.files[0];
    if (photo) uploadPhoto(photo);
  };

  // to upload/update profile picture
  const uploadPhoto = async (photo) => {
    if (!photo) return toast.error("Please select an image");
    const formData = new FormData();
    formData.append("profilePicture", photo);
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/user/upload-profile-picture`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (res.data.user?.profilePicture) {
        // setProfilePicture(res.data.user.profilePicture);
        // toast.success("Profile picture updated!");

        // ✅ Update local + global user state
        setProfilePicture(newPicture);
        setUser((prev) => ({ ...prev, profilePicture: newPicture }));

        toast.success("Profile picture updated!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8  lg:ml-64">
        {/* Navbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 ">
          {user ? (
            <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              Welcome,{" "}
              {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}
              !
            </h1>
          ) : (
            <h1 className="text-lg md:text-3xl font-bold text-gray-400">
              Loading user...
            </h1>
          )}

          {/* Profile + Theme */}
          <div className="flex items-center gap-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleSelectFile}
              className="hidden"
              id="profileUpload"
            />
            <label htmlFor="profileUpload" className="cursor-pointer">
              <Avatar
                name={user?.firstName || "User"}
                imageUrl={profilePicture}
                loading={loading}
              />
            </label>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-cyan-900"
            >
              {theme === "light" ? (
                <Moon className="text-white" />
              ) : (
                <Sun className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>

        {/* Main Sections */}
        <div className="flex flex-col gap-6">
          <div>{children}</div>
          <div className="p-2 sm:p-4 rounded-lg shadow">
            <Recent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashLayout;
