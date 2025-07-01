import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import { Moon, Sun, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import image from "../assets/profileP.jpg";
import Avatar from '../Layouts/Avatar'

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProfileSettings = () => {
  const [username, setUserName] = useState(" ");
  //   const [userData, setUserData] = useState({});
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [firstname, setFirstName] = useState(" ");
  const [lastname, setLastName] = useState(" ");
 
  const [profilePicture, setProfilePicture] = useState(" ");
  //   const { user, setUser } = useState(" ");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);

  //   const [message, setMessage] = useState("");
  //   const [error, setError] = useState("");


 
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isSettingPin, setIsSettingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const [email, setEmail] = useState("");
 
  const [activeTab, setActiveTab] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
  

  const [showPin, setShowPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  //Loading Timeout
  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

  //fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        const response = await axios.get(`${BASE_URL}/user/${UserId}`, {
          withCredentials: true,
        });
        const data = response?.data;
        const user = data?.user;
        setUserName(user.firstName);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);

        setProfilePicture(user.profilePicture);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    };

    fetchUser();
  }, []);

  
 // Handle file selection
 const handleSelectFile = (e) => {
  const photo = e.target.files[0];
  if (photo) {
    setFile(photo);
    uploadPhoto(photo);
  }
};


  const uploadPhoto = async (photo) => {
    if (!photo) {
      return toast.error("Please select an image");
    }

    const token = localStorage.getItem("token");
    console.log("🪪 Token being sent:", token);

    if (!token) {
      return toast.error("No token found. Please log in again.");
    }

    const formData = new FormData();
    formData.append("profilePicture", photo);

    try {
      setLoading(true);

      const res = await axios.put(
        `${BASE_URL}/user/upload-profile-picture`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Upload Response:", res.data);

      if (res.data.user && res.data.user.profilePicture) {
        const imageUrl = res.data.user.profilePicture;
        setProfilePicture(imageUrl);
        toast.success("Profile picture updated!");
      } else {
        toast.error("Upload Error, Try using another image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateInfo = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    if (!token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
  
    if (!firstname || !lastname ) {
      toast.error("All fields are required.");
      return;
    }
  
    try {
      const response = await axios.put(
        `${BASE_URL}/user/update/${userId}`,
        {
          firstName: firstname.trim(),
          lastName: lastname.trim(),
         
        },
        {
          
          withCredentials: true,
        }
      );
  
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    }
  };
  

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsSettingPassword(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      toast.error("You must be logged in to update your password.");
      setIsSettingPassword(false);
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      setIsSettingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      setIsSettingPassword(false);
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/user/update/${userId}`,
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials:true
        }
      );

      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
    } finally {
      setIsSettingPassword(false);
    }
  };

  const handleSetPin = async (e) => {
    e.preventDefault();
    setIsSettingPin(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      toast.error("You must be logged in to update PIN.");
      setIsSettingPin(false);
      return;
    }

    if (!currentPin || !newPin || !confirmPin) {
      toast.error("Please fill in all fields.");
      setIsSettingPin(false);
      return;
    }

    if (newPin !== confirmPin) {
      toast.error("New PIN and Confirm PIN do not match.");
      setIsSettingPin(false);
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      toast.error("PIN must be exactly 4 digits.");
      setIsSettingPin(false);
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/user/update/${userId}`,
        {
          currentPin,
          newPin,
        },
        {
          withCredentials:true
        }
      );

      toast.success("Transaction PIN updated.");
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (error) {
      console.log("Something went wrong. Please try again.");
      toast.error(error.response?.data?.message || "Error updating PIN.");
    } finally {
      setIsSettingPin(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="mt-6 px-6 h-screen">
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold">
                First Name
              </label>
              <input
                value={firstname.charAt(0).toUpperCase() + firstname.slice(1)}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded border"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold">
                Last Name
              </label>
              <input
                value={lastname.charAt(0).toUpperCase() + lastname.slice(1)}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded border"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded border"
                placeholder="Enter your email"
                readOnly
              />
            </div>

            <button onClick={handleUpdateInfo} className="mt-6 bg-cyan-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer">
              Update Profile
            </button>
          </div>
        );

      case "Security":
        return (
          <div className="mt-6 px-6 max-w-md space-y-5 h-screen">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>

            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-2 cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-2 cursor-pointer"
                >
                  {showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Update Button */}
            <button
              className="mt-2 bg-cyan-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer"
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>

            <form onSubmit={handleSetPin}>
              <h2 className="text-lg font-bold mt-10">
                Change Transaction PIN
              </h2>

              {/* Current PIN */}
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-1">
                  Current PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    maxLength={6}
                    placeholder="Enter current PIN"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    className="w-full px-4 py-2 rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2 top-2 cursor-pointer"
                  >
                    {showPin ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* New PIN */}
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-1">
                  New PIN
                </label>
                <div className="relative">
                  <input
                    type={showNewPin ? "text" : "password"}
                    maxLength={6}
                    placeholder="Enter new PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-4 py-2 rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-2 top-2 cursor-pointer"
                  >
                    {showNewPin ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New PIN */}
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-1">
                  Confirm New PIN
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPin ? "text" : "password"}
                    maxLength={6}
                    placeholder="Confirm new PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full px-4 py-2 rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-2 top-2 cursor-pointer"
                  >
                    {showConfirmPin ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer"
                disabled={isSettingPin}
              >
                {isSettingPin ? "Updating..." : "Update PIN"}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
    { loading ? (
        <Loader/>
    ):(
        <div className="lg:flex h-full ">
        <SideBar />
  
        {/* Layout Content */}
        <div className="flex-col w-full pt-8 lg:ml-78 ">
          <div className="flex items-center justify-end px-10 py-4 gap-2">
            <h1 className="text-cyan- text-xl font-bold">
              Welcome, {firstname.charAt(0).toUpperCase() + firstname.slice(1)}!
            </h1>
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
                {/* <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
                /> */}
                <Avatar
                  name={username}
                  imageUrl={profilePicture}
                  loading={loading}
                />
              </label>
            </div>
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
  
          {/* Tabs */}
          <div className="flex px-10 mt-4 gap-4 border-b pb-2  ">
            {["Profile", "Security"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-cyan-600 text-cyan-600 font-extrabold text-xl"
                    : "text-gray-500 hover:text-green-600 font-extrabold text-xl"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
  
          {/* Tab Content */}
          <div className="px-10 ">{renderTabContent()}</div>
        </div>
      </div>
    )};
   </>
  );
};

export default ProfileSettings;
