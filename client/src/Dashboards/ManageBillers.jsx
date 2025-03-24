import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import image from "../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";

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
  const [biller, setBiller] = useState({});
  const [profilePicture, setProfilePicture] = useState(" "); // Default avatar
  //array iof billers from user
  const [billers, setBillers] = useState([]);

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
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("User not authenticated!");
          return;
        }

        console.log("Token:", token);

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

  const handleSelectFile = (e) => {
    const photo = e.target.files[0];
    if (photo) {
      setFile(photo);
      uploadPhoto(photo); // Pass photo directly
    }
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
      navigate("/billers");
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
  
    const formData = new FormData();
    formData.append("image", file); // Append image file to FormData
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BASE_URL}/billers/upload/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response)
  
      alert("Profile picture uploaded successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error uploading biller picture:", error);
      alert("Failed to upload picture. Try again.");
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
                  // Viewing a Biller Profile
                  <div className="flex flex-col items-center ">
                    <img
                      src={selectedBiller.avatar || image}
                      alt={selectedBiller.name}
                      className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <h3 className="mt-2 font-semibold">
                      {selectedBiller.name}
                    </h3>
                    <p className="text-gray-500">{selectedBiller.billerType}</p>

                    {/* Edit Mode */}
                    <div className="w-full space-y-2">
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Name:</label>
                        <Input
                          // className=" border shadow-sm rounded"
                          placeholder="Biller Name"
                          value={selectedBiller.name}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Email:</label>
                        <Input
                          // className=" border shadow-sm rounded"
                          placeholder="Biller Name"
                          value={selectedBiller.email}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      {/* <div className="flex w-full justify-between">
                        <div className="flex-1 w-full gap-2">
                          <label htmlFor="">Biller Type</label>
                          <Select
                            placeholder="Biller Type"
                            options={billerTypes.map((type) => ({
                              label: type,
                              value: type,
                            }))}
                            value={selectedBiller.billerType}
                            onChange={(value) =>
                              setSelectedBiller({
                                ...selectedBiller,
                                billerType: value,
                              })
                            }
                          />
                        </div>
                        <div className="flex-1  w-full">
                          <label htmlFor="">Service Type</label>
                          <Select
                            placeholder="Service Type"
                            options={billerTypes.map((type) => ({
                              label: type,
                              value: type,
                            }))}
                            value={selectedBiller.serviceType}
                            onChange={(value) =>
                              setSelectedBiller({
                                ...selectedBiller,
                                billerType: value,
                              })
                            }
                          />
                        </div>
                      </div> */}

                      <div className="flex justify-between gap-3 w-full">
                        {/* Biller Type Select */}
                        <div className="flex w-full">
                          <label>Biller Type</label>
                          <select
                            name="billerType"
                            value={selectedBiller.billerType}
                            onChange={(value) =>
                              setSelectedBiller({
                                ...selectedBiller,
                                billerType: value,
                              })
                            }
                            className="border rounded p-2 "
                          >
                            <option value="" disabled>
                              Select Biller Type
                            </option>
                            {billerTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Service Type Select */}
                        <div className="flex w-full">
                          <label>Service Type</label>
                          <select
                            name="serviceType"
                            value={selectedBiller.serviceType}
                            onChange={(value) =>
                              setSelectedBiller({
                                ...selectedBiller,
                                billerType: value,
                              })
                            }
                            className="border rounded p-2"
                          >
                            <option value="" disabled>
                              Select Service Type
                            </option>
                            {serviceTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <label htmlFor="" className="w-35">
                          {" "}
                          Account Number
                        </label>
                        <Input
                          placeholder="Account Number"
                          value={selectedBiller.accountNumber}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="" className="w-30">
                          Bank Name
                        </label>
                        <Input
                          placeholder="Bank Name"
                          value={selectedBiller.accountId}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Wallet Address(optional)</label>
                        <Input
                          placeholder="Wallet Address"
                          value={selectedBiller.metamaskWallet}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-1 items-center">
                        <label>Due Date</label>
                        <input
                          name="date"
                          type="date"
                          value={selectedBiller.duedate}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Amount:</label>
                        <Input
                          placeholder="Amount"
                          type="number"
                          value={selectedBiller.amount}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <Switch
                          checked={selectedBiller.autoPay}
                          onChange={(checked) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              autoPay: checked,
                            })
                          }
                        />
                        <span className="ml-2">Enable Auto-Pay</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between w-full ">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        // onClick={handleSaveBiller}
                      >
                        Update
                      </button>

                      <button
                        className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        onClick={() => handleDeleteBiller(selectedBiller._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  // Adding a New Biller
                  <div className="flex flex-col items-center">
                    <div className="relative">


                      <input
                        type="file"
                        accept="image/*"
                        //onChange={handleSelectFile}
                        onChange={(e) => uploadBillerPhoto(biller._id, e.target.files[0])} 
                        onClick={uploadBillerPhoto}
                        className="hidden"
                        id="profileUpload"
                        multiple={false}
                      />
                      <label htmlFor="profileUpload">
                        <img
                          src={billerPicture ? billerPicture : image}
                          alt="Profile"
                          className="w-26 h-26 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
                        />
                      </label>
                    </div>
                    <h3 className="mt-2 font-semibold">Name:</h3>
                    <p className="text-gray-500">
                      {biller?.name || "No name provided"}
                    </p>

                    {/* Edit Mode */}
                    <div className="w-full space-y-2">
                      <div className="flex gap-2 items-center">
                        <label>Name:</label>
                        <Input
                          name="name"
                          placeholder="Biller Name"
                          value={biller.name || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label>Email:</label>
                        <Input
                          name="email"
                          placeholder="Biller Email"
                          value={biller.email || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex justify-between gap-3 w-full">
                        {/* Biller Type Select */}
                        <div className="flex w-full">
                          <label>Biller Type</label>
                          <select
                            name="billerType"
                            value={biller.billerType || ""}
                            onChange={handleChange}
                            className="border rounded p-2 "
                          >
                            <option value="" disabled>
                              Select Biller Type
                            </option>
                            {billerTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Service Type Select */}
                        <div className="flex w-full">
                          <label>Service Type</label>
                          <select
                            name="serviceType"
                            value={biller.serviceType || ""}
                            onChange={handleChange}
                            className="border rounded p-2"
                          >
                            <option value="" disabled>
                              Select Service Type
                            </option>
                            {serviceTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <label className="w-35">Account Number</label>
                        <Input
                          name="accountNumber"
                          placeholder="Biller Number"
                          value={biller.accountNumber || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-1 items-center">
                        <label className="w-30">Bank Name</label>
                        <Input
                          name="bankName"
                          placeholder="Bank Name"
                          value={biller.bankName || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-1 items-center">
                        <label>Wallet Address (optional)</label>
                        <Input
                          name="metamaskWallet"
                          placeholder="Wallet Address"
                          value={biller.metamaskWallet || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-1 items-center">
                        <label>Due Date</label>
                        <input
                          name="date"
                          type="date"
                          value={biller.date || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-1 items-center">
                        <label>Amount:</label>
                        <Input
                          name="amount"
                          placeholder="Biller Amount"
                          value={biller.amount || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex items-center">
                        <Switch
                          checked={biller.autoPay || false}
                          onChange={(checked) =>
                            handleChange({
                              target: { name: "autoPay", value: checked },
                            })
                          }
                        />
                        <span className="ml-2">Enable Auto-Pay</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between w-full">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        onClick={handleCreateBiller}
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Biller"}
                      </button>

                      <button
                        className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        onClick={() => handleDeleteBiller(selectedBiller.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
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
