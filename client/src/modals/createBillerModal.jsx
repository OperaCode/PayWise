import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Select } from "antd";
import image from "../assets/avatar.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateBillerModal = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [biller, setBiller] = useState({
    firstName: "",
    nickname: "",
    email: "",
    serviceType: "",
    profilePicture: null,
    metamaskWallet: "",
    amount: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setBiller((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleCreateBiller = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const {
        firstName,
        nickName,
        email,
        serviceType,
        profilePicture,
        metamaskWallet,
        
      } = biller;

      if (!firstName || !email || !serviceType || ! nickName) {
        toast.error("Oops, all fields are required");
        setIsSubmitting(false);
        return;
      }

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/biller/createbiller`,
        biller,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data) {
        toast.success(response.data.message);
        setIsModalOpen(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Internal server error");
      toast.error(error?.response?.data?.message || "Internal server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setBiller({
      firstName: "",
      nickname: "",
      email: "",
      serviceType: "",
      profilePicture: null,
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
      setBiller({}); // Reset to an empty object instead of null
  
      const response = await axios.get(`${BASE_URL}/biller/search/${email}`);
  
      if (response?.data) {
        console.log(response.data);
        setBiller(response.data.biller); // Ensure API returns 'biller' object
      }
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
      console.log(err.message);
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
          Browse
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
            src={biller?.profilePicture instanceof File ? URL.createObjectURL(biller.profilePicture) : image}
            alt="Profile"
            className="w-26 h-26 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
          />
        </label>
      </div>

      <h3 className="mt-2 font-semibold">Name:</h3>
      <p className="text-gray-500">{biller?.firstName || "No name provided"}</p>

      <div className="w-full space-y-2">
        <div className="flex items-center">
          <label className="w-1/3">Full Name:</label>
          <Input
            name="firstName"
            placeholder="Biller Name"
            value={biller.firstName || ""}
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
            name="metamaskWallet"
            placeholder="Wallet Address"
            value={biller.metamaskWallet || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Amount:</label>
          <Input
            name="amount"
            placeholder="Biller Amount"
            value={biller.amount || ""}
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
          {isSubmitting ? "Creating..." : "Create Biller"}
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
