import React, { useEffect, useState } from "react";
import { Input, message } from "antd";
import axios from "axios";
import image from "../assets/profileP.jpg";

const serviceTypes = ["Electricity", "Water", "Internet", "Cable TV", "Other"];

const EditBillerModal = ({ selectedBiller, setSelectedBiller, onClose, updateBiller, deleteBiller }) => {
  const [biller, setBiller] = useState(selectedBiller || {});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setBiller(selectedBiller || {});
  }, [selectedBiller]);

  const handleChange = (key, value) => {
    setBiller((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    if (!userId) {
      message.error("You must be logged in to update a biller.");
      return;
    }
    
    if (!biller.name || !biller.email || !biller.billerType || !biller.walletId || !biller.amount) {
      message.error("All fields are required!");
      return;
    }

    try {
      const response = await axios.put(`/api/billers/${biller._id}`, { ...biller, userId });
      updateBiller(response.data);
      message.success("Biller updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update biller");
    }
  };

  const handleDelete = async () => {
    if (!biller._id) return;

    try {
      await axios.delete(`/api/billers/${biller._id}`, { data: { userId } });
      deleteBiller(biller._id);
      message.success("Biller deleted successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to delete biller");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
      <img
        src={biller.profilePicture ? biller.profilePicture : image}
        alt={biller.name || "Biller"}
        className="w-20 h-20 rounded-full border border-gray-300"
      />
      <h3 className="mt-2 font-semibold">{biller.name || "Biller Profile"}</h3>

      <div className="w-full space-y-2 mt-4">
        <div className="flex items-center">
          <label className="w-1/3">Full Name:</label>
          <Input value={biller.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Nickname:</label>
          <Input value={biller.nickname || ""} onChange={(e) => handleChange("nickname", e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Email:</label>
          <Input value={biller.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Service Type:</label>
          <select
            className="border-2 border-neutral-300 rounded p-2 w-full shadow-md"
            value={biller.billerType || ""}
            onChange={(e) => handleChange("billerType", e.target.value)}
          >
            <option value="" disabled>Select Service Type:</option>
            {serviceTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Wallet ID:</label>
          <Input value={biller.walletId || ""} onChange={(e) => handleChange("walletId", e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="w-1/3">Amount:</label>
          <Input type="number" value={biller.amount || ""} onChange={(e) => handleChange("amount", e.target.value)} />
        </div>
      </div>

      <div className="mt-4 flex justify-between w-full">
        <button className="bg-blue-600 text-white px-4 py-2 w-1/3 rounded hover:scale-105" onClick={handleUpdate}>
          Update
        </button>

        <button className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default EditBillerModal;
