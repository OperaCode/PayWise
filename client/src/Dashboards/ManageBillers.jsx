import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import image from "../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";
import CreateBillerModal from  "../modals/createBillerModal"
import  EditBillerModal  from "../modals/EditBillerModal"
import cardBg2 from "../assets/cardBg2.webp";
import { toast } from "react-toastify";
import axios from "axios";

import { Plus, Scroll, ArrowLeft } from "lucide-react";
import { Button, Modal, Input, Select, Switch, DatePicker, Upload } from "antd";
import { Navigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ManageBillers = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biller, setBiller] = useState({
    firstName: "",
    nickname: "",
    email: "",
    serviceType: "",
    metamaskWallet: "",
    amount: "",
  });
  const [profilePicture, setProfilePicture] = useState(" "); // Default avatar
  //array iof billers from user
  const [billers, setBillers] = useState([]);
  const [email, setEmail] = useState("");

  const [showFullList, setShowFullList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [error, setError] = useState("");
  const [billerPicture, setBillerPicture] = useState(null);
  const [newBiller, setNewBiller] = useState({
    name: "",
    email: "",
    billerType: "",
    serviceType: "",
    accountNumber: "",
    bankName: "",
    profilePicture: null,
    amount: "",
  });
  const billerTypes = ["Vendor", " Beneficiary"];
  const serviceTypes = [
    "Electricity",
    "Water",
    "Internet",
    "Cable TV",
    "Other",
  ];

  const navigate = useNavigate();

  const resetForm = () => {
    setNewBiller({
      // ✅ Clears all inputs
      name: "",
      email: "",
      billerType: "",
      serviceType: "",
      accountNumber: "",
      bankName: "",
      //profilePicture: null,
      amount: "",
    });
  };

  const searchBiller = async () => {
    try {
      setError(""); // Clear previous errors
      setBiller(null); // Clear previous results

      const response = await axios.get(`${BASE_URL}/biller/search/${email}`);

      console.log(response.data);
      const biller = response.data.user;
      console.log(biller);

      setBiller((prevBiller) => ({ ...prevBiller, ...data })); // Merge with existing state
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
      console.log(err.message);
    }
  };

  const handleCancel = () => {
    resetForm(); // ✅ Clears inputs
    setIsModalOpen(false); // ✅ Closes modal
  };

  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

  // const handleChange = (e, fieldName) => {
  //   if (e && e.target) {
  //     // Handles standard HTML inputs
  //     const { name, value } = e.target;
  //     setBiller((prev) => ({ ...prev, [name]: value }));
  //   } else if (typeof e === "string" || typeof e === "number") {
  //     // Handles Ant Design <Select>
  //     setBiller((prev) => ({ ...prev, [fieldName]: e }));
  //   } else {
  //     console.error("Invalid event object:", e);
  //   }

  //   setError(""); // Clear errors
  // };

  // Function to handle closing the modal

  // const handleChange = (e, field) => {
  //   if (e.target) {
  //     // Normal input fields
  //     setBiller((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  //   } else {
  //     // For Select components
  //     setBiller((prev) => ({ ...prev, [field]: e.value }));
  //   }
  // };

  // for fetching billrs to frontend
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId) {
          toast.error("User not authenticated!");
          return;
        }

        console.log("Token:", userId);

        const response = await axios.get(`${BASE_URL}/biller`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response?.data || null);

        setBillers(response.data);
        //setWalletID()
      } catch (error) {
        console.error("Error fetching billers:", error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch billers"
        );
      }
    };

    fetchBillers();
  }, []);

  //to handle input changes for the forms
  const handleChange = (event) => {
    const { name, value } = event.target;
    setBiller((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  // Handle file selection
  const handleSelectFile = (e) => {
    const photo = e.target.files[0];
    if (photo) {
      setFile(photo);
      uploadBillerPhoto(photo); // Pass photo directly
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setBillerData({ ...billerData, billerPicture: file });
  };

  const closeModal = async () => {
    setIsModalOpen(false);
    setSelectedBiller(null);
    setNewBiller({
      name: "",
      billerType: "",
      accountId: "",
      dueDate: "",
      amount: "",
      profilePicture: null,
      autoPay: false,
    });
  };

  const handleCreateBiller = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setError("");

    try {
      const {
        name,
        billerType,
        accountNumber,
        bankName,
        serviceType,
        profilePicture,
        email,
        amount,
      } = biller;

      //console.log("Biller Data:", biller);

      // ✅ Validate all fields before making API call
      if (
        !name ||
        !email ||
        !billerType ||
        !serviceType ||
        !accountNumber ||
        !bankName ||
        !amount
      ) {
        toast.error("Oops, all fields are required");
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      //console.log("UserId:", userId);
      //console.log("Token:", token);

      const response = await axios.post(
        `${BASE_URL}/biller/createbiller`,
        biller,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data) {
        const userData = response.data.user;
        console.log(userData);

        setIsModalOpen(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Internal server error";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      //navigate("/billers");
    }
  };

  const handleCardClick = async (biller) => {
    setSelectedBiller(biller);
    setIsModalOpen(true);
  };

  const handleDeleteBiller = async (id) => {
    if (!id) {
      console.error("Error: Biller ID is undefined.");
      toast.error("Error: Unable to delete biller. Please try again.");
      return;
    }

    console.log("Attempting to delete biller with ID:", id);

    const confirmDelete = confirm(
      "Are you sure you want to delete this biller?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        toast.error("Authentication error. Please log in again.");
        return;
      }

      //console.log("Auth Token:", token);
      //console.log("Sending DELETE request to:", `${BASE_URL}/biller/${id}`);

      const response = await axios.delete(`${BASE_URL}/biller/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      //console.log("Server Response:", response);

      setBillers((prev) => prev.filter((biller) => biller._id !== id));
      setIsModalOpen(false);

      toast.success("Biller deleted successfully!");
    } catch (error) {
      console.error("Error deleting biller:", error);
      toast.error("Error deleting biller. Please try again.");
    }
  };

  const uploadBillerPhoto = async (id, file) => {
    if (!id || !file) {
      alert("Please select a valid image.");
      return;
    }

    console.log(id, file);

    const formData = new FormData();
    formData.append("profilePicture", file); // ✅ Match backend field name

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/billers//upload-biller-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ✅ Ensures authentication cookies are sent
        }
      );

      if (response.data.profilePicture) {
        alert("Profile picture uploaded successfully!");
        setBillerProfilePicture(response.data.profilePicture); // ✅ Update UI
      } else {
        alert("Upload successful, but no image URL returned.");
      }

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error uploading biller picture:", error);
      alert("Failed to upload picture. Try again.");
    }
  };

  const uploadPhoto = async (photo) => {
    if (!photo) {
      return toast.error("Please select an image");
    }

    const userId = localStorage.getItem("userId");
    console.log("LocalStorage userId:", userId);

    if (!userId) {
      return toast.error("User ID not found. Please log in again.");
    }

    const formData = new FormData();
    formData.append("profilePicture", photo); // ✅ Match backend field name
    formData.append("userId", userId);

    try {
      setLoading(true);

      // ✅ Send request to backend
      const res = await axios.put(
        "http://localhost:3000/user/upload-profile-picture", // ✅ Ensure correct endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ✅ Ensure cookies are sent if using authentication
        }
      );

      console.log("Upload Response:", res.data);

      // ✅ Check if the response contains the Cloudinary URL
      if (res.data.user && res.data.user.profilePicture) {
        const imageUrl = res.data.user.profilePicture;

        console.log("New Profile Picture URL:", imageUrl); // ✅ Add this log

        setProfilePicture(imageUrl); // ✅ Update the profile picture state

        // ✅ Display success message
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Error uploading profile picture. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* {loading?(<Loader/>):(
    )} */}
      <div className="p-6">
        {/* Biller Profile and List */}
        <div className="">
          {showFullList ? (
            // Full List View
            <div>
              <h2 className="text-xl font-bold mb-4">All Billers</h2>

              <ul className="space-y-2">
                {billers && billers.length > 0 ? (
                  billers.map((biller) => (
                    <li
                      key={biller.id}
                      className="p-2 border-2 rounded-lg shadow-sm  flex justify-between items-center"
                    >
                      {/* Left: Biller Info */}
                      <div>
                        <h3 className="text-lg font-semibold">{biller.name}</h3>
                        <p className="text-sm ">{biller.billerType}</p>
                      </div>

                      {/* Right: AutoPay Switch */}
                      <div className="flex items-center gap-3">
                        <Switch
                          //checked={autoPayStates[biller.id]}
                          onChange={() => toggleAutoPay(biller.id)}
                        />
                        <span className="text-sm text-gray-700">
                          {/* {autoPayStates[biller.id]
                            ? "Auto-Pay On"
                            : "Enable Auto-Pay"} */}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-xl font-semibold m-auto text-center p-4">
                    {" "}
                    No biller created, Go back{" "}
                    <span className="text-2xl">👈</span> to create a new biller.
                  </p>
                )}
              </ul>

              <button
                onClick={() => setShowFullList(false)}
                className="mt-4 px-4 py-2 text-sm rounded-lg flex gap-2 justify-center hover:scale-105  border-2 items-center  shadow-md cursor-pointer bg-cyan-700  font-semibold hover:bg-red-400 transition duration-200 ease-in hover:cursor-pointer"
              >
                <ArrowLeft /> Back to Profiles
              </button>
            </div>
          ) : (
            // Default Profile View with Your Requested Features
            <div className="lg:flex flex-col items-center text-center p-2 ">
              <h1 className="py-2 font-bold text-xl p-2 text-center">
                Billers Profile
              </h1>
              <p className="text-center mb-4">
                Start by creating the profile of your biller. You can add as
                much as 5 biller profiles on Paywise{" "}
                <span className="text-green-600">Ugrade Plan</span>.
              </p>

              {/* Cards */}
              <div className="flex gap-4 justify-between w-full items-center p-4">
                {/* Toggle when billerslist is empty */}
                {billers && billers.length > 0 ? (
                  billers.map((biller) => (
                    <div
                      key={biller.id}
                      onClick={() => handleCardClick(biller)}
                      // style={{
                      //   backgroundImage: `url(${cardBg2})`,
                      // }}
                      className="cursor-pointer border bg-center hover:scale-105 shadow-lg rounded-lg p-4 w-40 flex flex-col items-center"
                    >
                      <img
                        src={biller.profilePicture || image}
                        alt={biller.name}
                        className="rounded-full w-20 h-20 border-2 cursor-pointer hover:opacity-80 transition"
                      />
                      <h3 className="mt-2 font-bold">{biller.name}</h3>
                      <p className="text-sm font-semibold">
                        {biller.billerType}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-2xl font-semibold m-auto">
                    {" "}
                    No biller created, Click here{" "}
                    <span className="text-2xl">👉</span> to create a new biller.
                  </p>
                )}

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="border-2 border-blue-500 w-40 h-32 flex flex-col items-center justify-center rounded-lg cursor-pointer shadow-md hover:scale-105"
                >
                  <span className="text-blue-500 text-xl">+</span>
                  <span className="text-blue-500">Add biller</span>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                You can add a biller anytime from the settings.
              </p>
              <button
                onClick={() => setShowFullList(true)}
                className="flex gap-2 px-6 m-auto mt-4 justify-center hover:scale-105  border-2 items-center rounded-md shadow-md cursor-pointer w-sm bg-cyan-700 text-white py-3  font-semibold hover:bg-green-900 transition hover:cursor-pointer"
              >
                See Full List <Scroll size={20} />
              </button>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-lg text-black">
                <h2 className="text-lg font-semibold text-center">
                  {selectedBiller ? "Biller Profile" : "Add New Biller"}
                </h2>

                {selectedBiller ? (
                  // Viewing or Editing a Biller
          
                  <EditBillerModal/>
                ) : (
                  // Adding a New Biller
                  <CreateBillerModal/>
                )}

                {/* Close Button */}
                <div className="flex justify-center">
                  <button
                    className="mt-4 hover:bg-red-600 bg-cyan-600 hover:text-white p-2  w-1/2 text-center border-2 cursor-pointer rounded-md hover:scale-105 transition duration-300 ease-in-out"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart Section */}
        <div className="lg:w-4xl m-auto p-4">
          <BarChart />
        </div>
      </div>
    </>
  );
};

export default ManageBillers;
