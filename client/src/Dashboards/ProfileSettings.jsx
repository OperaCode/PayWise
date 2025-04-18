import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import { Moon, Sun, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProfileSettings = () => {
  const [username, setUserName] = useState(" ");
  const [userData, setUserData] = useState({});
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [firstname, setFirstName] = useState(" ");
  const [lastname, setLastName] = useState(" ");
  const [profilePicture, setProfilePicture] = useState(" ");
  const { user, setUser } = useState(" ");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);

  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  //   const [profilePicture, setProfilePicture] = useState("default_image.jpg");
  const [activeTab, setActiveTab] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`${BASE_URL}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile({
          fullName: res.data.fullName || "",
          phone: res.data.phone || "",
        });
        const user = response?.data?.user;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhone(user.phone || "");
        setProfilePicture(user.profilePicture || "default_image.jpg");
      } catch (err) {
        setError("Failed to fetch profile.");
      }
    };
    fetchProfile();
  }, []);

  //   const uploadPhoto = async (photo) => {
  //     if (!photo) {
  //       return toast.error("Please select an image");
  //     }

  //     const userId = localStorage.getItem("userId");
  //     console.log("LocalStorage userId:", userId);

  //     if (!userId) {
  //       return toast.error("User ID not found. Please log in again.");
  //     }

  //     const formData = new FormData();
  //     formData.append("profilePicture", photo); // Match backend field name
  //     formData.append("userId", userId);

  //     try {
  //       setLoading(true);

  //       // Send request to backend
  //       const res = await axios.put(
  //         "http://localhost:3000/user/upload-profile-picture", // Ensure correct endpoint
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //           withCredentials: true, // Ensure cookies are sent if using authentication
  //         }
  //       );

  //       console.log("Upload Response:", res.data);

  //       // Check if the response contains the Cloudinary URL
  //       if (res.data.user && res.data.user.profilePicture) {
  //         const imageUrl = res.data.user.profilePicture;

  //         console.log("New Profile Picture URL:", imageUrl); // Add this log

  //         setProfilePicture(imageUrl); //Update the profile picture state

  //         // Display success message
  //         toast.success("Profile picture updated!");
  //       } else {
  //         toast.error("Error uploading profile picture. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Upload error:", error);
  //       toast.error("Upload failed. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSetPin = async () => {
    setIsSettingPin(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to set a PIN.");
      setIsSettingPin(false);
      return;
    }

    if (!transactionPin || !confirmPin) {
      toast.error("Please enter and confirm your PIN.");
      setIsSettingPin(false);
      return;
    }

    if (transactionPin !== confirmPin) {
      toast.error("PINs do not match.");
      setIsSettingPin(false);
      return;
    }

    // Validate PIN format before making the request
    if (typeof transactionPin !== "string" || transactionPin.length !== 4) {
      toast.error("Transaction PIN must be a 4-digit string.");
      setIsProcessing(false);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/user/set-pin`,
        { pin: transactionPin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("PIN set successfully.");
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "An error occurred while setting PIN."
      );
    } finally {
      setIsSettingPin(false);
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinMessage("");

    if (!currentPin || !newPin || !confirmPin) {
      return toast.error("Please fill in all fields.");
    }

    if (newPin !== confirmPin) {
      return setPinMessage("New PIN and Confirm PIN do not match.");
    }

    if (!/^\d{4}$/.test(newPin)) {
      return setPinMessage("PIN must be exactly 4 digits.");
    }

    try {
        await axios.post(
          `${BASE_URL}/user/set-pin`,
          { pin: newPin },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        toast.success("PIN set successfully.");
    } catch (error) {
      setPinMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
 

  const renderTabContent = async () => {
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
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-semibold">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded border"
                placeholder="Enter phone number"
              />
            </div>
            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        );

      case "Security":
        return (
          <div className="mt-6 px-6 max-w-md space-y-5 h-screen">
            <h2 className="text-lg font-bold">Change Password</h2>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  //   type={showNewPassword ? "text" : "password"}
                  //   placeholder="Enter new password"
                  //   className="w-full px-4 py-2 rounded border"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={newPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2"
                >
                  {showPassword ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => toast.success("Password updated successfully!")}
            >
              Update Password
            </button>

            {/* Transaction PIN Section */}
            <h2 className="text-lg font-bold mt-10">Change Transaction PIN</h2>

            {/* Current PIN */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Current PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={6}
                  placeholder="Enter current PIN"
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-2 top-2"
                >
                  {showPin ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* New PIN */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                New PIN
              </label>
              <div className="relative">
                <input
                  type={showNewPin ? "text" : "password"}
                  //   maxLength={6}
                  value={transactionPin}
                  placeholder="Enter new PIN"
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute right-2 top-2"
                >
                  {showNewPin ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New PIN */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Confirm New PIN
              </label>
              <div className="relative">
                <input
                  type={showConfirmPin ? "text" : "password"}
                  //maxLength={6}
                  value={confirmPin}
                  placeholder="Confirm new PIN"
                  className="w-full px-4 py-2 rounded border"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-2 top-2"
                >
                  {showConfirmPin ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <button
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleSetPin}
            >
              Update PIN
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
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
        <div className="flex px-10 mt-6 gap-4 border-b pb-2 ">
          {["Profile", "Security"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
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
  );
};

export default ProfileSettings;
