import React, { useState } from "react";
import { Button, Modal, Input, Select } from "antd";
import image from "../assets/profileP.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateBillerModal = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [biller, setBiller] = useState({
    fullName: "",
    nickname: "",
    email: "",
    serviceType: "",
    profilePicture: "",
    wallet: "",
   
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBiller((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleCreateBiller = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");
  
    try {
      const { firstName, nickname, email, serviceType, walletId, profilePicture } = biller;
  
      // Ensure required fields are filled
      if (!firstName || !email || !serviceType || !nickname) {
        toast.error("Oops, all fields are required");
        setIsCreating(false);
        return;
      }
  
      const token = localStorage.getItem("token");
  
      let formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("nickname", nickname);
      formData.append("email", email);
      formData.append("serviceType", serviceType);
      if (walletId) formData.append("walletId", walletId);
      if (profilePicture instanceof File) {
        formData.append("profilePicture", profilePicture);
      }
  
      const response = await axios.post(
        `${BASE_URL}/biller/createbiller`,
        formData, // Send as FormData for file uploads
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response?.data) {
        toast.success(response.data.message);
        setIsModalOpen(false);
        handleCancel();
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Internal server error");
      toast.error(error?.response?.data?.message || "Internal server error");
    } finally {
      setIsCreating(false);
    }
  };
  

  const handleCancel = () => {
    setBiller({
      firstName: "",
      nickname: "",
      email: "",
      serviceType: "",
      profilePicture: image,
      metamaskWallet: "",
      amount: "",
    });
    setIsModalOpen(false);
  };

  const serviceTypes = ["Electricity", "Water", "Internet", "Cable TV", "Other"];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBiller((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const searchBiller = async () => {
    try {
      setError(""); // Clear previous errors
      setIsSubmitting(true)
      const response = await axios.get(`${BASE_URL}/biller/search/${email}`);
      console.log(response.data)
      if (response?.data?.biller) {
        setBiller(response.data.biller);
      } else {
        toast.error("Biller not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
      toast.error(err.response?.data?.message || "User not found");
    }finally{
        setIsSubmitting(false)
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full py-2 items-center">
        <Input
          name="email"
          placeholder="Search by Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={searchBiller}
          className="w-1/4 text-center rounded hover:scale-105 cursor-pointer bg-cyan-700 text-white px-4 py-2"
        >
          {isSubmitting? "Searching..." : "Browse"}
        </button>
      </div>

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="profileUpload"
          multiple={false}
        />
        <label htmlFor="profileUpload">
          <img
            src={
              biller.profilePicture? biller.profilePicture
                : image
            }
            alt="Profile"
            className="w-26 h-26 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
          />
        </label>
      </div>

      <h3 className="mt-2 font-semibold">Name:</h3>
      <p className="text-gray-500">{biller?.fullName || "No name provided"}</p>

      <div className="w-full space-y-2">
        <div className="flex items-center">
          <label className="w-1/3">Full Name:</label>
          <Input
            name="firstName"
            placeholder="Biller Name"
            value={biller.fullName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Nick Name:</label>
          <Input
            name="nickname"
            placeholder="Choose a Nickname"
            value={biller.nickname || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Email:</label>
          <Input
            name="email"
            placeholder="Biller Email"
            value={biller.email || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full">
          <label className="w-1/3">Service Type</label>
          <Select
            name="serviceType"
            value={biller.serviceType || ""}
            onChange={(value) =>
              setBiller((prev) => ({ ...prev, serviceType: value }))
            }
            className="border-2 border-neutral-300 rounded p-2 w-full shadow-md"
          >
            {serviceTypes.map((type, index) => (
              <Select.Option key={index} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Wallet ID:</label>
          <Input
            name="walletId"
            placeholder="Wallet Address"
            value={biller.wallet.walletId || ""}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="mt-4 flex justify-between w-full">
        <button
          className="bg-blue-600 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
          onClick={handleCreateBiller}
          disabled={isSubmitting}
        >
          {isCreating ? "Creating..." : "Create Biller"}
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateBillerModal;
