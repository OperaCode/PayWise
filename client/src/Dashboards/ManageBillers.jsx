import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import image from "../assets/avatar.jpg";


import cardBg2 from "../assets/cardBg2.webp";
import { toast } from "react-toastify";
import axios from "axios";

import { Plus, Scroll, ArrowLeft } from "lucide-react";
import { Button, Modal, Input, Select, Switch, DatePicker, Upload } from "antd";

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
  useEffect(()=>{
    const fetchBillers = async () => {
      try {
        const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      //console.log("UserId:", userId);
      //console.log("Token:", token);

      // ✅ Send correct data object
      const response = await axios.post(
        `${BASE_URL}/biller/`,
        token,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
            "Content-Type": "application/json",
          },
        }
      );
  
        console.log("User Profile:", response.data);

        const billerIds = response.data.user.billers;

       

      if (!billerIds.length) {
        setBillers([]); // No billers found
        return;
      }

      // Fetch details of each biller using their IDs
      const billerResponses = await Promise.all(
        billerIds.map((id) =>
          axios.get(`${BASE_URL}/biller/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const billerDetails = billerResponses.map((res) => res.data);

      console.log(billerDetails)
      setBillers(billerDetails); // ✅ Update state with full biller details





  
        // ✅ Set the billers state with full biller details
        //setBillers(response.data.billers);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchBillers()
  },
  []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBiller((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const closeModal = async() => {
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

  const handleCreateBiller1 = async () => {
    const {
      name,
      billerType,
      accountNumber,
      bankName,
      serviceType,
      email,
      amount,
    } = formData;

    console.log(formData);

    if (
      !biller.name ||
      !biller.billerType ||
      !biller.accountNumber ||
      !biller.bankName ||
      !biller.serviceType ||
      !biller.email ||
      !biller.amount
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.post(
        `${BASE_URL}/billers/createbiller`,
        biller,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      toast.success("Biller created successfully!");
      refreshBillers(); // Refresh the billers list after creation
      closeModal(); // Close the modal if applicable
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create biller.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBiller = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setError(""); // Reset error before validation

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
        return; // ✅ No need to throw an error, just return early
      }

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      //console.log("UserId:", userId);
      //console.log("Token:", token);

      // ✅ Send correct data object
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
      setIsSubmitting(false);
    }
  };

  const handleCardClick = (biller) => {
    setSelectedBiller(biller);
    setIsModalOpen(true);
  };

  const handleDeleteBiller = (id) => {
    if (confirm("Are you sure you want to delete this biller?")) {
      setBillers((prev) => prev.filter((biller) => biller.id !== id));
      setIsModalOpen(false);
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
                ):(
                  <p className="text-xl font-semibold m-auto text-center p-4"> No biller created, Go back <span className="text-2xl">👈</span> to create a new biller.</p>
                )}
              </ul>

              <button
                onClick={() => setShowFullList(false)}
                className="mt-4 px-4 py-2  rounded-lg flex gap-2 justify-center hover:scale-105  border-2 items-center  shadow-md cursor-pointer bg-cyan-700  font-semibold hover:bg-red-400 transition duration-200 ease-in hover:cursor-pointer"
              >
                <ArrowLeft /> Back to Profiles
              </button>
            </div>
          ) : (
            // Default Profile View with Your Requested Features
            <div className="lg:flex flex-col items-center text-center p-2 ">
              <h1 className="ont-bold  py-2 font-bold text-xl p-2 text-center">
                Billers Profile
              </h1>
              <p className="text-center mb-4">
                Start by creating the profile of your biller. You can add as
                much as 5 biller profiles on Paywise{" "}
                <span className="text-green-600">Ugrade Plan</span>.
              </p>

              {/* Cards */}
              <div className="flex gap-4 justify-between  w-full items-center p-4">
                
                {/* Toggle when billerslist is empty */}
                {billers && billers.length > 0 ? (
                  billers.map((biller) => (
                    <div
                      key={biller.id}
                      onClick={() => handleCardClick(biller)}
                      // style={{
                      //   backgroundImage: `url(${cardBg2})`,
                      // }}
                      className="cursor-pointer border bg-center hover:scale-105 shadow-lg rounded-lg p-4 w-50 flex flex-col items-center"
                    >
                      <img
                        src={biller.profilePicture || image}
                        alt={biller.name}
                        className="rounded-full w-20 h-20 border-2 cursor-pointer hover:opacity-80 transition"
                      />
                      <h3 className="mt-2 font-bold">{biller.name}</h3>
                      <p className="text-sm font-semibold">{biller.billerType}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-2xl font-semibold m-auto"> No biller created, Click here <span className="text-2xl">👉</span> to create a new biller.</p>
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
                        <input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
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
                        <input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
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
                      <div className="flex justify-between">
                        <div className="flex w-full gap-2">
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
                        <div className="flex  w-full">
                          <label htmlFor="">Service Type</label>
                          <Select
                            placeholder="Service Type"
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
                      </div>

                      <div className="flex gap-2 items-center">
                        <label htmlFor="" className="w-35">
                          {" "}
                          Account Number
                        </label>
                        <input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
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
                        <input
                          style={{
                            borderWidth: "5px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
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
                        <input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          placeholder="Wallet Address"
                          value={selectedBiller.accountId}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <label htmlFor="">Due Date</label>
                        <DatePicker
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          placeholder="Due Date"
                          value={
                            selectedBiller.dueDate
                              ? moment(selectedBiller.dueDate)
                              : null
                          }
                          onChange={(date, dateString) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              dueDate: dateString,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Amount:</label>
                        <input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
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
                        onClick={() => handleDeleteBiller(selectedBiller.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  // Adding a New Biller
                  <div className="flex flex-col items-center">
                    <img
                      src={image}
                      alt={image}
                      className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <h3 className="mt-2 font-semibold">Name:</h3>
                    <p className="text-gray-500">
                      {biller?.name || "No name provided"}
                    </p>

                    {/* Edit Mode */}
                    <div className="w-full space-y-2">
                      <div className="flex gap-2 items-center">
                        <label>Name:</label>
                        <input
                          name="name"
                          placeholder="Biller Name"
                          value={biller.name || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label>Email:</label>
                        <input
                          name="email"
                          placeholder="Biller Email"
                          value={biller.email || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex justify-between">
                        {/* Biller Type Select */}
                        <div className="flex w-full">
                          <label>Biller Type</label>
                          <select
                            name="billerType"
                            value={biller.billerType || ""}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
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
                            className="border rounded p-2 w-full"
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
                        <input
                          name="accountNumber"
                          placeholder="Biller Number"
                          value={biller.accountNumber || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label className="w-30">Bank Name</label>
                        <input
                          name="bankName"
                          placeholder="Bank Name"
                          value={biller.bankName || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label>Wallet Address (optional)</label>
                        <input
                          name="metamaskWallet"
                          placeholder="Wallet Address"
                          value={biller.metamaskWallet || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex items-center">
                        <label>Due Date</label>
                        <input
                          name="date"
                          type="date"
                          value={biller.date || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label>Amount:</label>
                        <input
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
