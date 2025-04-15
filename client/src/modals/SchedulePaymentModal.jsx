import React, { useEffect, useState } from "react";
import blkchain5 from "../assets/darkbg.jpg";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { parseISO } from 'date-fns';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SchedulePaymentModal = ({ billers, onClose }) => {
  const [selectedBiller, setSelectedBiller] = useState(null); // Store full biller object
  const [amount, setAmount] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startDate, setStartDate] = useState("");

  const openPinModal = () => setIsPinModalOpen(true);
  const closePinModal = () => setIsPinModalOpen(false);

  // Handle cancel action (close modal)
  const handleCancel = () => {
    onClose();
  };

  // Handle Scheduled Payment
//   const handleSchedulePayment = async () => {
//     setIsProcessing(true);
  
//     try {
//       // 🔹 Validate selected biller
//       if (!selectedBiller) {
//         console.error("Error: Biller not selected");
//         toast.error("Biller is not selected. Please choose a biller.");
//         return;
//       }
  
//       // 🔹 Validate token
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("You must be logged in to schedule a payment.");
//         return;
//       }
  
//       // 🔹 Validate amount
//       if (!amount || isNaN(amount) || Number(amount) <= 0) {
//         toast.error("Please enter a valid amount.");
//         return;
//       }
  
//       // 🔹 Validate transaction pin
//       if (!transactionPin || transactionPin.trim().length === 0) {
//         toast.error("Transaction PIN is required.");
//         return;
//       }
  
//       // 🔹 Validate schedule date
//       if (!scheduleDate) {
//         toast.error("Please select a valid date and time.");
//         return;
//       }
  
//       const formattedScheduleDate = new Date(scheduleDate).toISOString();
//       console.log("Formatted Schedule Date:", formattedScheduleDate);
  
//       const payload = {
//         billerEmail: selectedBiller.email,
//         amount,
//         scheduleDate: formattedScheduleDate,
//         transactionPin,
//       };
  
//       console.log("Scheduling Payment with Payload:", payload);
  
//       const response = await axios.post(
//         `${BASE_URL}/payment/schedule-transfer`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       console.log("Scheduled Payment Response:", response.data);
//       toast.success("Payment scheduled successfully.");
//     } catch (error) {
//       console.error("Error scheduling payment:", error);
//       const errorMessage =
//         error.response?.data?.message || "Failed to schedule payment.";
//       toast.error(errorMessage);
//     } finally {
//       setIsProcessing(false);
//     }
//   };


const handleSchedulePayment = async () => {
    setIsProcessing(true);
  
    try {
      // 🔹 Validate selected biller
      if (!selectedBiller) {
        toast.error("Biller is not selected. Please choose a biller.");
        return;
      }
  
      // 🔹 Validate token
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to schedule a payment.");
        return;
      }
  
      // 🔹 Validate amount
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        toast.error("Please enter a valid amount.");
        return;
      }
  
      // 🔹 Validate transaction pin
      if (!transactionPin || transactionPin.trim().length === 0) {
        toast.error("Transaction PIN is required.");
        return;
      }
  
      // 🔹 Validate schedule date
      if (!scheduleDate) {
        toast.error("Please select a valid date and time.");
        return;
      }
  

      const localDate = new Date(scheduleDate); // Local time from the input
      const utcDate = localDate.toISOString(); // Convert to UTC string
      
      const payload = {
        billerEmail: selectedBiller.email,
        amount: Number(amount),  // Convert to number
        scheduleDate: utcDate,  // Use the UTC formatted date
        transactionPin,
      };

     
      console.log("Scheduling Payment with Payload:", payload);
  
      const response = await axios.post(
        `${BASE_URL}/payment/schedule-transfer`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Scheduled Payment Response:", response.data);
      toast.success("Payment scheduled successfully.");
    } catch (error) {
      console.error("Error scheduling payment:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to schedule payment.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  
  
  

  // Confirm Pin and Schedule Payment
  const handleConfirm = () => {
    if (isSettingPin && transactionPin !== confirmPin) {
      alert("Pins do not match!");
      return;
    }

    handleSchedulePayment(transactionPin); // Use transactionPin
    onClose();
  };

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Background Image */}
      <div
        className="absolute inset-0 animate-moving-bg bg-cover bg-center"
        style={{ backgroundImage: `url(${blkchain5})` }}
      ></div>

      {/* Modal Content */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
            value={selectedBiller ? selectedBiller._id : ""}
            onChange={(e) => {
              const biller = billers.find((b) => b._id === e.target.value);
              setSelectedBiller(biller); // Store the entire biller object
            }}
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
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 0) setAmount(value);
            }}
          />

          {/* Select Date */}
          <label htmlFor="date" className="font-medium">
            Due Date
          </label>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            required
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
                  onClick={handleConfirm}
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
