import React, { useEffect, useState, useContext } from "react";
import blkchain5 from "../assets/darkbg.jpg";
import {
  SmartphoneNfc,
  HandCoins,
  CalendarSync,
  ChartNoAxesCombined,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

const P2pModal = () => {
  const [selectedBiller, setSelectedBiller] = useState("");
  const [billers, setBillers] = useState([]);
  const [amount, setAmount] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
   const [loading, setLoading] = useState(true);

  const handleOpenPinModal = () => {
    if (!recipientEmail || amount <= 0) {
      alert("Please enter a valid email and amount.");
      return;
    }
    setShowPinModal(true);
  };


  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  //P2P Transfer
  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true); // ✅ Start loading
      const senderId = localStorage.getItem("userId"); // Fetch sender ID
      const token = localStorage.getItem("token");

      console.log("🔹 Sender ID from localStorage:", senderId); // Debugging

      if (!senderId) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      if (!token) {
        toast.error("Authorization token missing. Please log in again.");
        return;
      }

      console.log("🔹 Sending Transfer Request:", {
        senderId,
        recipientEmail,
        amount,
      });

      const response = await axios.post(
        `${BASE_URL}/payment/wallet-transfer`,
        { senderId, recipientEmail, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Transfer Success:", response);

      toast.success(response.data.message);

      // Update wallet balance
      setWalletBalance((prevBalance) => prevBalance - amount);

      setRecipientEmail("");
      setAmount("");
    } catch (error) {
      console.error("Transfer Failed:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Transfer failed");
    } finally {
      setIsSubmitting(false);
      setP2pModalOpen(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 text-black flex items-center justify-center bg-opacity-50 z-50">
        <div
          className="absolute inset-0 animate-moving-bg bg-cover bg-center"
          style={{ backgroundImage: `url(${blkchain5})` }}
        ></div>

        <div className="bg-white  shadow-lg lg:w-md relative m-auto p-6 rounded-lg w-lg text-black">
          <X
            strokeWidth={7}
            color="#FF0000"
            onClick={() => setP2pModalOpen(false)}
            className=" hover:cursor-pointer  hover:scale-110  hover:text-red-400 "
          />
          <h2 className="text-xl font-bold text-center">
            Transfer from Wallet
          </h2>
          <p className="text-center text-sm font-medium">
            Make Instant transfer to other Paywise users
          </p>

          <div className=" p-1">
            <form
              action=""
              className="flex-1 items-center justify-center"
            ></form>
            <label htmlFor="email" className="text-sm">
              Receipient Email
            </label>
            <input
              type="email"
              placeholder="Enter receipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="p-2 border rounded-md w-full mb-2"
            />
            <label htmlFor="amount" className="text-sm">
              Enter Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              className="p-2 border rounded-md w-full mb-2"
            />
            <div className="flex items-center justify-center w-full">
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="flex-1 hover:cursor-pointer p-2 bg-green-800 m-auto hover:bg-green-600 text-white rounded-md"
              >
                {isSubmitting ? "Transferring Funds..." : "Transfer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default P2pModal;
