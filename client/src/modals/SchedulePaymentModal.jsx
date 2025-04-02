import React, { useEffect, useState } from "react";
import blkchain5 from "../assets/darkbg.jpg";
import { X } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SchedulePaymentModal = ({ billers, onClose }) => {
  const [selectedBiller, setSelectedBiller] = useState("");
  const [amount, setAmount] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [startDate, setStartDate] =useState("");

  const openPinModal = () => setIsPinModalOpen(true);
  const closePinModal = () => setIsPinModalOpen(false);

  // Handle cancel action (close modal)
  const handleCancel = () => {
    onClose(); // Trigger the parent component's close function
  };

  // Handle Scheduled Payment
  const handleSchedulePayment = async () => {
    setIsSubmitting(true);
  
    // Get userId and token from localStorage or wherever they're stored
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      alert("You must be logged in to schedule a payment.");
      setIsSubmitting(false);
      return;
    }
  
    const paymentData = {
      userId,  // Include userId in the request body
      billerId: selectedBiller,
      amount,
      startDate,
      transactionPin,
    };
  
    try {
      const response = await fetch(`${BASE_URL}/payment/schedule-transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Ensure token is passed
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      console.log(result);
      alert(result.success ? "Payment scheduled successfully!" : result.message || "Failed to schedule payment");
    } catch (error) {
      console.error("Error scheduling payment:", error);
      alert("An error occurred while scheduling the payment.");
    } finally {
      setIsSubmitting(false);
    }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Background Image */}
      <div
        className="absolute inset-0 animate-moving-bg bg-cover bg-center"
        style={{ backgroundImage: `url(${blkchain5})` }}
      ></div>

      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close Button */}
        <X
          strokeWidth={7}
          color="#FF0000"
          onClick={handleCancel}
          className="absolute top-3 right-3 hover:cursor-pointer hover:scale-110 hover:text-red-400"
        />

        <h2 className="text-xl font-bold text-center">Schedule Payment</h2>
        <p className="text-center text-sm font-medium mb-4">
          Schedule payments to Registered Billers
        </p>

        {/* Form */}
        <div className="flex flex-col">
          {/* Select Biller */}
          <label htmlFor="billers" className="font-medium">Choose Biller</label>
          <select
            id="billers"
            className="p-2 border w-full rounded-md mb-3"
            value={selectedBiller}
            onChange={(e) => setSelectedBiller(e.target.value)}
          >
            <option value="">Select Biller</option>
            {billers.map((biller) => (
              <option key={biller._id} value={biller._id}>
                {biller.name}
              </option>
            ))}
          </select>

          {/* Enter Amount */}
          <label htmlFor="amount" className="font-medium">Amount</label>
          <input
            id="amount"
            type="number"
            placeholder="Enter Amount"
            className="w-full p-2 border rounded-md mb-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Select Date */}
          <label htmlFor="date" className="font-medium">Due Date</label>
          <input
            id="date"
            type="date"
            className="w-full p-2 border rounded-md mb-3"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* Submit Button */}
          <button
            onClick={openPinModal}
            disabled={isSubmitting}
            className="w-full p-2 bg-green-800 hover:bg-green-600 text-white rounded-md mt-2"
          >
            {isSubmitting ? "Sending Request..." : "Schedule Transfer"}
          </button>
        </div>
      </div>

      {/* Transaction PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">
              {isSettingPin ? "Set Transaction PIN" : "Enter Transaction PIN"}
            </h3>

            {/* PIN Input */}
            <input
              type="password"
              placeholder="Enter PIN"
              className="w-full p-2 border rounded-md mb-3"
              value={transactionPin}
              onChange={(e) => setTransactionPin(e.target.value)}
            />

            {/* Confirm PIN (only when setting a new PIN) */}
            {isSettingPin && (
              <input
                type="password"
                placeholder="Confirm PIN"
                className="w-full p-2 border rounded-md mb-3"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
              />
            )}

            {/* Toggle Mode Button */}
            <button
              onClick={() => setIsSettingPin(!isSettingPin)}
              className="text-blue-600 text-sm mb-3 hover:underline"
            >
              {isSettingPin ? "Already have a PIN? Enter it" : "Set a new PIN"}
            </button>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={closePinModal}
                className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closePinModal();
                  handleSchedulePayment(); // Proceed to process the payment after entering the PIN
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                {isSettingPin ? "Set PIN" : "Confirm Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePaymentModal;
