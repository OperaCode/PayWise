import React, { useEffect, useState, useContext } from "react";
import image from "../assets/category.png";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader"; // Import your Loader component
import P2pModal from "../modals/P2pModal";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import blkchain5 from "../assets/darkbg.jpg";
import wallpaper from "../assets/wallpapers.webp";
import { Link } from "react-router-dom";
// import billpaper from "../assets/billpaper.jpeg";
import SchedulePaymentModal from "../modals/schedulePaymentModal";
import AutoPayModal from "../modals/AutoPayModal";
import {
  SmartphoneNfc,
  HandCoins,
  CalendarSync,
  ChartNoAxesCombined,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button, Modal, Input, Select, Switch, DatePicker, Upload } from "antd";
import Line from "../charts/LineGraph";
import DashPieChart from "../charts/PieChart";
import { ethers } from "ethers";
import FwPay from "../components/FlutterWave";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DashBoard = () => {
  const { user, setUser } = useContext(UserContext);
  //const { setLoading } = useContext(LoaderContext);

  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [manageTokensModalOpen, setManageTokensModalOpen] = useState(false);
  const [p2pModalOpen, setP2pModalOpen] = useState(false);
  const [schedulePayModalOpen, setSchedulePayModalOpen] = useState(false);
  const [autoPayModalOpen, setAutoPayModalOpen] = useState(false);
  const [wiseCoinTransferOpen, setWiseCoinTransferOpen] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [billers, setBillers] = useState([]);
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [walletLinked, setWalletLinked] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState("");
  const [payWalletAddress, setPayWalletAddress] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [activeTab, setActiveTab] = useState("crypto");
  //to show hidden wallet balance
  const [showWallet, setShowWallet] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [history, setHistory] = useState([]);

  //Loading Timeout
  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

  //Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId");

        // (!UserId) {
        //   console.error("User ID not found in localStorage.");
        //   toast.error("User not authenticated.");
        //   return;
        // }
        console.log(UserId);
        const response = await axios.get(`${BASE_URL}/user/${UserId}`, {
          withCredentials: true,
        });
        console.log(response);
        setWalletBalance(response?.data?.user?.wallet?.balance || 0);
        setMetaMaskAddress(
          response?.data?.user?.metamaskWallet || "Wallet not Linked!"
        );
        setPayWalletAddress(
          response?.data?.user?.wallet.walletId || "Wallet not Linked!"
        );
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    };
    fetchUser();
  }, []);

  //fetch Biller
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("User not authenticated!");
          return;
        }

        console.log("Token:", token);

        const response = await axios.get(`${BASE_URL}/biller`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response?.data || null);

        setBillers(response.data);
      } catch (error) {
        console.error("Error fetching billers:", error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch billers"
        );
      }
    };

    fetchBillers();
  }, []);

  //fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        // console.log("User ID from localStorage:", userId); // Debugging
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/payment/history/${userId}`,
          {
            withCredentials: true,
          }
        );

        console.log("Fetched Payments Data:", response.data); // Debugging
        setHistory(response.data.data || []);
      } catch (error) {
        console.error(
          "Error fetching payment history:",
          error.response?.data || error.message
        );
      }
    };

    fetchHistory();
  }, []);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  //Fund Wallet
  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY, // Ensure this is correctly set in your .env file
    tx_ref: `paywise-${Date.now()}`,
    amount: parseFloat(amount) || 0, // Convert to number
    currency: "USD",
    payment_options: "card, banktransfer, ussd",
    customer: {
      email: "user@example.com", // Replace with actual user email
      phone_number: "08012345678", // Replace with actual user phone
      name: "John Doe", // Replace with actual user name
    },
    customizations: {
      title: "Fund PayWise Wallet",
      description: "Deposit money into your PayWise wallet",
      logo: "https://res.cloudinary.com/dmlhebmi8/image/upload/v1742915517/WhatsApp_Image_2025-03-25_at_16.11.12_izlbju.jpg",
    },
    callback: async (response) => {
      console.log("Payment successful:", response);

      if (response.status === "successful") {
        const userId = localStorage.getItem("userId"); // ✅ Retrieve userId here

        if (!userId) {
          console.error("User ID is missing!");
          toast.error("User ID is missing. Please log in again.");
          return;
        }

        setIsSending(true); // ✅ Show loading state before sending request

        // Send the transaction details to your backend
        try {
          const result = await fetch(`${BASE_URL}/payment/fund-wallet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId, // ✅ Now userId is properly defined
              amount: response.amount,
              transactionId: response.transaction_id,
            }),
          });

          if (result.ok) {
            toast.success("Wallet Funded!");
            console.log(result);
          } else {
            toast.error("Failed to update wallet. Contact support.");
          }
        } catch (error) {
          console.error("Error updating wallet:", error);
          toast.error("An error occurred. Please try again.");
        } finally {
          setIsSending(false); // ✅ Hide loading state after request
        }
      }
      closePaymentModal(); // Close the payment modal
      setWalletBalance((prevBalance) =>
        Number((prevBalance + amount).toFixed(2))
      );
    },
    onclose: () => {
      console.log("Payment modal closed");
    },
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

  //Connect to MetaMask
  const connectToMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected! Redirecting to download...");
      window.location.href = "https://metamask.io/download.html";
      return;
    }

    try {
      setIsSubmitting(true); // ✅ Start loading
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length === 0) {
        toast.error("No MetaMask account found.");
        return;
      }

      const walletAddress = accounts[0];
      console.log("MetaMask Wallet Address:", walletAddress);

      const userId = localStorage.getItem("userId");
      console.log("User ID:", userId);

      if (!userId) {
        toast.error("User not authenticated. Please log in first.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user/connect-metamask`,
        { userId, walletAddress },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Wallet Connected Successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          metamaskWallet: walletAddress,
        }));
        setMetaMaskAddress(walletAddress);
        setWalletLinked(true);
      }
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      // setP2pModalOpen(false);
    }
  };

  return (
    <>
      {/* {loading ? (
        <Loader />
      ) : (
  //Place Code here for loader
      )} */}

      <section className="p-8">
        <div className="lg:flex gap-4">
          {/* Wallet Balance Section */}
          <div className="flex-1 h-full font-bodyFont w-full">
            <h1 className="font-bold mb-4 text-xl py-2">Current Balance:</h1>
            <div className="p-4  w-full rounded-lg shadow-md items-center border-4 border-neutral-500">
              <div className="flex w-full justify-between items-center">
                <div className="p-2">
                  <p className="text-sm md:text-lg font-bold">
                    Wallet Balance:
                  </p>

                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold">
                      <span className="font-bold">
                        {showBalance
                          ? formatCurrency(walletBalance) || " 0.00 "
                          : "••••"}
                      </span>
                    </h2>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="focus:outline-none hover:cursor-pointer"
                    >
                      {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 text-center mt-4">
                  <button
                    className="h-10 text-white p-2 bg-cyan-800 rounded-xl hover:cursor-pointer text-xs font-semibold hover:bg-cyan-500 transition w-30"
                    onClick={() => setFundModalOpen(true)}
                  >
                    Manage Wallet
                  </button>
                  <button
                    className="h-10 text-white p-2 bg-cyan-800 rounded-xl hover:cursor-pointer text-xs font-semibold hover:bg-cyan-500 transition w-30"
                    onClick={() => setManageTokensModalOpen(true)}
                  >
                    Manage Assets
                  </button>
                </div>
              </div>

              <div className="flex mt-4 items-center space-x-2">
                <p className="text-xs font-bold">
                  MetaMask Wallet:{" "}
                  <span className="font-normal">
                    {showWallet
                      ? metaMaskAddress || "No wallet Linked"
                      : "•••••••••••••••••"}
                  </span>
                </p>
                <button
                  onClick={() => setShowWallet(!showWallet)}
                  className="focus:outline-none hover:cursor-pointer"
                >
                  {showWallet ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h1 className="font-semibold py-4 md:text-lg">Quick Links</h1>
              <div className="flex items-center gap-6 justify-around px-6 ">
                <div
                  className="items-center rounded-md space-y-2 flex flex-col hover:cursor-pointer hover:scale-105 hover:text-cyan-900"
                  onClick={() => setP2pModalOpen(true)}
                >
                  <HandCoins className="font-extrabold" />
                  <p className="font-bold text-sm hover:text-cyan-900">
                    TRANSFER
                  </p>
                </div>
                <div
                  className="items-center rounded-md space-y-2 flex flex-col hover:cursor-pointer hover:scale-105 hover:text-cyan-900"
                  onClick={() => setSchedulePayModalOpen(true)}
                >
                  <CalendarSync className="hover:text-cyan-900 font-extrabold" />
                  <p className="font-bold text-sm hover:text-cyan-900">
                    SCHEDULE-PAY
                  </p>
                </div>
                <a href="transactions">
                  <div
                    className="items-center flex hover:cursor-pointer flex-col rounded-md space-y-2 hover:scale-105 hover:text-cyan-900"
                    onClick={() => setAutoPayModalOpen(true)}
                  >
                    <SmartphoneNfc className="hover:text-cyan-900 font-extrabold" />
                    <p className="font-bold text-sm hover:text-cyan-900">
                      AUTOPAY
                    </p>
                  </div>
                </a>
                <Link to="/analytics">
                  <div className="items-center flex flex-col hover:cursor-pointer rounded-md space-y-2 hover:scale-105 hover:text-cyan-900">
                    <ChartNoAxesCombined className="hover:text-cyan-900" />
                    <p className="font-bold text-sm hover:text-cyan-900">
                      ANALYTICS
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Line Graph */}
          <div className="flex-1 w-full lg:w-50">
            <Line payments={history} />
          </div>
        </div>
        {/* Pie Chart */}
        <div className="md:flex justify-center">
          <div className="flex-1 w-90 h-90">
            <DashPieChart payments={history} currency={formatCurrency} />
          </div>
          <div className="flex-1 justify-center m-auto">
            <p className="font-semibold text-right">
              All your transactions intelligently sorted into categories!
            </p>
            <img src={image} alt="" className="w-90 h-90 m-auto" />
          </div>
        </div>

        {/* Fund Wallet Modal */}
        {fundModalOpen && (
          <div className="fixed inset-0 text-black flex items-center justify-center bg-opacity-50 z-50">
            <div
              className="absolute inset-0 animate-moving-bg bg-cover bg-center"
              style={{ backgroundImage: `url(${wallpaper})` }}
            ></div>
            <div className="stars"></div>

            <div className="bg-white  shadow-lg lg:w-md relative m-auto p-6 rounded-lg w-lg text-black">
              <X
                strokeWidth={7}
                color="#FF0000"
                onClick={() => setFundModalOpen(false)}
                className=" hover:cursor-pointer  hover:scale-110  hover:text-red-400 "
              />
              <h2 className="text-xl font-bold text-center">Fund Wallet</h2>
              <p className="text-center text-sm font-medium">
                Fund your paywise wallet or Connect to Metamask.
              </p>

              {/* Wallet Display Section */}
              <div className="p-2">
                {walletLinked ? (
                  <div className="m-auto text-center">
                    <p className="font-semibold">Your Wallets:</p>
                    <p>PayWise Wallet: {payWalletAddress || "N/A"}</p>
                    <p>Metamask Wallet: {metaMaskAddress || "N/A"}</p>
                  </div>
                ) : (
                  <p className="font-semibold text-center">
                    You have no external wallets linked.
                  </p>
                )}
              </div>
              <div className=" p-1">
                <div className="flex-1 items-center justify-center">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="p-2 border rounded-md w-full mb-2"
                  />
                  <FlutterWaveButton
                    className={`flex-1 p-2 bg-cyan-700 cursor-pointer hover:bg-cyan-500 text-white rounded-md ${
                      !amount || amount <= 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    {...flutterwaveConfig}
                    disabled={!amount || amount <= 0}
                  >
                    {isSending ? "Processing..." : "Fund Wallet"}
                  </FlutterWaveButton>
                </div>

                <p className="p-4 m-auto text-center font-bold text-xl">OR</p>

                <div className="flex items-center justify-center w-full">
                  <button
                    onClick={connectToMetaMask}
                    className="flex-1 hover:cursor-pointer p-2 bg-green-800 m-auto hover:bg-green-600 text-white rounded-md "
                  >
                    {isSubmitting ? "Connecting..." : "Connect to MetaMask"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Manage Tokens Modal */}
        {manageTokensModalOpen && (
          <div className="fixed inset-0 text-black flex items-center justify-center bg-opacity-50 z-50">
            {/* Moving Gradient Background */}
            {/* <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div> */}

            {/* Moving Image Background */}
            {/* <div
             className="absolute inset-0 galaxy-background bg-contain "
              style={{ backgroundImage: `url(${blkchain2})` }}
           ></div>
           */}

            {/* Animated Background  */}
            {/* <div className="absolute inset-0 animate-waves bg-cover bg-center" style={{ backgroundImage: `url(${blkchain2})` }}></div> */}

            <div
              className="absolute inset-0 animate-moving-bg bg-cover bg-center"
              style={{ backgroundImage: `url(${blkchain5})` }}
            ></div>
            <div className="stars"></div>

            <div className=" bg-white  shadow-lg lg:w-md relative m-auto p-6 rounded-lg w-lg text-black">
              <X
                strokeWidth={7}
                color="#FF0000"
                onClick={() => setManageTokensModalOpen(false)}
                className=" hover:cursor-pointer  hover:scale-110  hover:text-red-400 "
              />
              <h2 className="text-xl font-bold text-center">My Assets</h2>
              <p className="text-center text-sm font-medium">
                Manage transactions with your digital wallets
              </p>
              {/* Tabs */}
              <div className="flex border-b mb-4 ">
                <button
                  className={`flex-1 p-2 text-center cursor-pointer ${
                    activeTab === "crypto"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("crypto")}
                >
                  Crypto
                </button>
                <button
                  className={`flex-1 p-2 text-center cursor-pointer ${
                    activeTab === "rewards"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("rewards")}
                >
                  Rewards
                </button>
              </div>
              {/* Content */}
              {activeTab === "crypto" ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded cursor-pointer">
                    <span>🔗 Bitcoin</span>
                    <span>0.05 BTC</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded cursor-pointer">
                    <span>🌐 Ethereum</span>
                    <span>1.2 ETH</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded cursor-pointer">
                    <span>🏆 PayWise Tokens</span>
                    <span>500 PWT</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex justify-between">
                <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
                  Send
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                  Receive
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer">
                  Convert
                </button>
              </div>
            </div>
          </div>
        )}
        {/* P2P Modal */}
        {p2pModalOpen && (
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
        )}
        {/* Scehdule Payment Modal */}
        {schedulePayModalOpen && (
          <SchedulePaymentModal
            onClose={() => setSchedulePayModalOpen(false)}
            billers={billers}
          />
        )}
        {/* AutoPay Modal */}
        {autoPayModalOpen && (
          <AutoPayModal
            onClose={() => setAutoPayModalOpen(false)}
            billers={billers}
          />
        )}
        {/* Transfer Modal */}
        {wiseCoinTransferOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold text-center">
                Transfer WiseCoin
              </h2>

              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Sender Email:
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Enter recipient's email"
                  value={senderEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Recipient Email:
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Enter recipient's email"
                  value={receiverEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Amount:</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">Pin:</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter amount"
                  value={pin}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setTransferModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default DashBoard;
