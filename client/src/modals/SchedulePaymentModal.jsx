import React, { useEffect, useState } from "react";
import blkchain5 from "../assets/darkbg.jpg";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [startDate, setStartDate] = useState("");

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
      toast.error("You must be logged in to schedule a payment.");
      setIsSubmitting(false);
      return;
    }
  
    // Validate required fields
    if (!selectedBiller || !amount || !scheduleDate || !transactionPin) {
      toast.error("All fields are required to schedule a payment.");
      setIsSubmitting(false);
      return;
    }
  
    const paymentData = {
      userId,
      billerId: selectedBiller,
      amount,
      scheduleDate,
      transactionPin,
    };
  
    console.log("Scheduling Payment with data:", paymentData); // Debugging
  
    try {
      const response = await fetch(`${BASE_URL}/payment/schedule-transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure token is passed
        },
        body: JSON.stringify(paymentData),
      });
  
      const result = await response.json();
      console.log("Response from server:", result); // Debugging
  
      if (result.success) {
        toast.success("Payment scheduled successfully!");
        onClose(); // Close modal after successful scheduling
      } else {
        toast.error(result.message || "Failed to schedule payment");
      }
    } catch (error) {
      console.error("Error scheduling payment:", error);
      toast.error("An error occurred while scheduling the payment.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

//   const handleSetPin = async () => {
//     setIsSettingPin(true);
  
//     // Get userId and token from localStorage
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("token");
  
//     if (!userId) {
//       toast.error("You must be logged in to set a PIN.");
//       setIsSettingPin(false);
//       return;
//     }
  
//     if (!transactionPin || !confirmPin) {
//       toast.error("Please enter and confirm your PIN.");
//       setIsSettingPin(false);
//       return;
//     }
  
//     if (transactionPin !== confirmPin) {
//       toast.error("PINs do not match.");
//       setIsSettingPin(false);
//       return;
//     }
  
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/user/set-pin`,
//         { userId, pin },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       toast.success(response.data.message || "Transaction PIN set successfully!");
//       setIsPinModalOpen(false);
//     } catch (error) {
//       console.error("Error setting PIN:", error);
//       toast.error(error.response?.data?.message || "Failed to set PIN.");
//     } finally {
//       setIsSettingPin(false);
//     }
//   };
  

const handleSetPin = async () => {
    setIsSettingPin(true);
  
    // Get userId and token from localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    if (!userId) {
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
    if (transactionPin.trim().length !== 4 || isNaN(transactionPin.trim())) {
      alert("PIN must be exactly 4 digits.");
      setIsSettingPin(false);
      return;
    }
  
    // Log data for debugging
    console.log('User ID:', userId);
    console.log('PIN:', transactionPin);
  
    try {
      // Sending POST request to the backend
      await axios.post(`${BASE_URL}/user/set-pin`, { userId, pin: transactionPin });
      // Handle successful response (e.g., show a success message)
      alert('PIN set successfully.');
    } catch (error) {
      // Handle error response
      console.error('Error:', error.response.data);
      alert(error.response.data.message || 'An error occurred while setting PIN.');
    } finally {
      setIsSettingPin(false); // Ensure loading state is reset
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
          <label htmlFor="billers" className="font-medium">
            Choose Biller
          </label>
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
          <label htmlFor="amount" className="font-medium">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Enter Amount"
            className="w-full p-2 border rounded-md mb-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Select Date */}
          <label htmlFor="date" className="font-medium">
            Due Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full p-2 border rounded-md mb-3"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
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
              {isSettingPin ? (
                // If user is setting a new PIN
                <button
                  onClick={handleSetPin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Set PIN
                </button>
              ) : (
                // If user is confirming a transaction with PIN
                <button
                  onClick={() => {
                    closePinModal();
                    handleSchedulePayment();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                >
                  Confirm Transfer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePaymentModal;
