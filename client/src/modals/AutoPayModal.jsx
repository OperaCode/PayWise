import React, { useState } from "react";
import blkchain5 from "../assets/darkbg.jpg";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AutoPayModal = ({ billers, onClose }) => {
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [frequency, setFrequency] = useState("once");
  const [occurrences, setOccurrences] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);

  const openPinModal = () => setIsPinModalOpen(true);
const closePinModal = () => setIsPinModalOpen(false);

  const handleSetPin = async () => {
    const token = localStorage.getItem("token");

    if (!transactionPin || !confirmPin) {
      toast.error("Enter and confirm your PIN.");
      return;
    }

    if (transactionPin !== confirmPin) {
      toast.error("PINs do not match.");
      return;
    }

    if (!/^\d{4}$/.test(transactionPin)) {
      toast.error("PIN must be a 4-digit number.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(`${BASE_URL}/user/set-pin`, { pin: transactionPin }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("PIN set successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error setting PIN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchedulePayment = async () => {
    if (!selectedBiller || !amount || !startDate || !transactionPin) {
      toast.error("Please complete all fields and enter PIN.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        billerEmail: selectedBiller.email,
        amount,
        startDate,
        frequency,
        occurrences: frequency === "once" ? 1 : occurrences,
        transactionPin,
      };

      await axios.post(`${BASE_URL}/payment/schedule-recurring`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Recurring payment scheduled.");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    if (!transactionPin) {
      toast.error("Enter your PIN to continue.");
      return;
    }

    handleSchedulePayment();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="absolute inset-0 animate-moving-bg bg-cover bg-center"
        style={{ backgroundImage: `url(${blkchain5})` }}
      ></div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-10">
        <X
          strokeWidth={7}
          color="#FF0000"
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer hover:scale-110"
        />
        <h2 className="text-xl font-bold text-center">Schedule Recurring Payment</h2>
        <p className="text-center text-sm font-medium mb-4">
          Automate payments to registered billers
        </p>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Select Biller</label>
          <select
            className="p-2 border rounded"
            value={selectedBiller?._id || ""}
            onChange={(e) => {
              const b = billers.find((b) => b._id === e.target.value);
              setSelectedBiller(b);
            }}
          >
            <option value="">-- Choose --</option>
            {billers.map((biller) => (
              <option key={biller._id} value={biller._id}>
                {biller.name}
              </option>
            ))}
          </select>

          <label className="font-medium">Amount</label>
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className="font-medium">Start Date</label>
          <input
            type="date"
            className="p-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="font-medium">Frequency</label>
          <select
            className="p-2 border rounded"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {frequency !== "once" && (
            <>
              <label className="font-medium">Occurrences</label>
              <input
                type="number"
                className="p-2 border rounded"
                value={occurrences}
                onChange={(e) => setOccurrences(e.target.value)}
                min={1}
                placeholder="e.g., 3 months"
              />
            </>
          )}

          <button
            onClick={openPinModal}
            disabled={isSubmitting}
            className="w-full bg-green-700 hover:bg-green-600 text-white rounded p-2 mt-3"
          >
            {isSubmitting ? "Processing..." : "Proceed"}
          </button>
        </div>
      </div>

      {/* Transaction PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-3">
              {isSettingPin ? "Set Transaction PIN" : "Enter Transaction PIN"}
            </h3>

            <input
              type="password"
              placeholder="Enter PIN"
              className="w-full p-2 border rounded-md mb-3"
              value={transactionPin}
              onChange={(e) => setTransactionPin(e.target.value)}
            />

            {isSettingPin && (
              <input
                type="password"
                placeholder="Confirm PIN"
                className="w-full p-2 border rounded-md mb-3"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
              />
            )}

            <button
              onClick={() => setIsSettingPin(!isSettingPin)}
              className="text-sm text-blue-500 underline mb-4"
            >
              {isSettingPin ? "Already have a PIN? Enter it" : "Don't have a PIN? Set one"}
            </button>

            <div className="flex justify-end gap-3">
              <button
                onClick={closePinModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              {isSettingPin ? (
                <button
                  onClick={handleSetPin}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {isSubmitting ? "Setting..." : "Set PIN"}
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {isSubmitting ? "Confirming..." : "Confirm"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoPayModal;
