import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import image from "../assets/avatar.jpg";
import cardImage from "../assets/profileP.jpg"; 
import { useNavigate } from "react-router-dom";
import CreateBillerModal from "../modals/createBillerModal";
import EditBillerModal from "../modals/EditBillerModal";
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
    fullName: "",
    nickname: "",
    email: "",
    serviceType: "",
    profilePicture: "",
    wallet: { walletId: "" },
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
    fullName: "",
    nickname: "",
    email: "",
    serviceType: "",
    profilePicture: "",
    wallet: { walletId: "" },
  });
  // const billerTypes = ["Vendor", " Beneficiary"];
  const serviceTypes = [
    "Electricity",
    "Water",
    "Internet",
    "Cable TV",
    "Other",
  ];


  

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

  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

  // for fetching billrs to frontend
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        console.log(UserId);
        const response = await axios.get(`${BASE_URL}/biller`, {
          withCredentials: true,
        });
        console.log(response);
        setBillers(response?.data|| []);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
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

  const handleSaveBiller = async()=>{
    try {
      const response = await fetch(`${BASE_URL}/billers/${billerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Biller updated successfully!");
        // Refresh the biller list or close the modal here
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating biller:", error);
    }
  }

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
              <div className="flex gap-2 justify-between w-full items-center p-2">
                {/* Toggle when billerslist is empty */}
                {billers && billers.length > 0 ? (
                  billers.map((biller) => (
                    <div
                      key={biller.id}
                      onClick={() => handleCardClick(biller)}
                      // style={{
                      //   backgroundImage: `url(${cardBg2})`,
                      // }}
                      className="cursor-pointer border bg-center hover:scale-105 shadow-lg rounded-lg p-3 w-40 flex flex-col items-center"
                    >
                      <img
                        src={
                          biller?.profilePicture ? biller.profilePicture : cardImage
                        }
                        alt={biller.name}
                        className="rounded-full w-24 h-24 border-2 cursor-pointer hover:opacity-80 transition"
                      />
                      <h3 className="mt-2 font-bold">{biller.name}</h3>
                      <p className="text-sm font-semibold">
                        {biller.serviceType}
                      </p>
                      <p className="text-sm font-semibold">
                      ${biller.totalAmountPaid || 0}
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
                  //Viewing or Editing a Biller
                 
                  <div className="flex flex-col items-center ">
                    <img
                      src={selectedBiller.profilePicture || image}
                      alt={selectedBiller.name}
                      className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <h3 className="mt-2 font-semibold">
                      {selectedBiller.name}
                    </h3>
                    <p className="text-gray-500">{selectedBiller.billerType}</p>

                    {/* Edit Mode */}
                    <div className="w-full space-y-2">
                      <div className="flex  items-center">
                        <label htmlFor="" className="w-1/3">
                          Full Name:
                        </label>
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
                          readOnly
                        />
                      </div>
                      <div className="flex  items-center">
                        <label htmlFor="" className="w-1/3">
                          Nickname:
                        </label>
                        <Input
                          // className=" border shadow-sm rounded"
                          placeholder="Biller nickname"
                          value={selectedBiller.nickname}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              nickname: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <label htmlFor="" className="w-1/3">
                          Email:
                        </label>
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
                          readOnly
                        />
                      </div>

                      {/* Service Type Select */}
                      <div className="flex w-full items-center">
                        <label className="w-1/3">Service Type</label>
                        <select
                          name="serviceType"
                          value={selectedBiller.serviceType}
                          onChange={(value) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              billerType: value,
                            })
                          }
                          className="border-2 border-neutral-300 rounded p-2 w-full shadow-md"
                        >
                          <option value="" disabled className="">
                            Select Service Type:
                          </option>
                          {serviceTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex  items-center">
                        <label htmlFor="" className="w-1/3">
                          Wallet ID: <br />
                          <span className="text-xs">(for paywise user)</span>
                        </label>
                        <Input
                          placeholder="Wallet Address"
                          value={selectedBiller?.walletAddress || ""}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                          readOnly
                        />
                      </div>

                     
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between w-full ">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        onClick={handleSaveBiller}
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

                  // <EditBillerModal />
                ) : (
                  // Adding a New Biller
                  <CreateBillerModal />
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
          <BarChart  billers={billers} />
        </div>
      </div>
    </>
  );
};

export default ManageBillers;
