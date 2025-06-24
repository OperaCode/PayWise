import React, { useEffect, useState, useContext } from "react";
import image from "../assets/category.png";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader"; // Import your Loader component
import P2pModal from "../modals/P2pModal";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import blkchain5 from "../assets/darkbg.jpg";
import wallpaper from "../assets/paywise.jpeg";
import { Link } from "react-router-dom";

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
  // const { user, setUser } = useContext(UserContext);
  //const { setLoading } = useContext(LoaderContext);
  const [user, setUser] = useState("");
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [manageTokensModalOpen, setManageTokensModalOpen] = useState(false);
  const [p2pModalOpen, setP2pModalOpen] = useState(false);
  const [schedulePayModalOpen, setSchedulePayModalOpen] = useState(false);
  const [autoPayModalOpen, setAutoPayModalOpen] = useState(false);

  const [withdrawal, setWithdrawal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [billers, setBillers] = useState([]);
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [ledgerBalance, setLedgerBalance] = useState("");
  const [walletLinked, setWalletLinked] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState("");
  const [payWalletAddress, setPayWalletAddress] = useState("");
  // const [scheduleDate, setScheduleDate] = useState("");
  // const [activeTab, setActiveTab] = useState("crypto");
  //to show hidden wallet balance
  const [showWallet, setShowWallet] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  // const [activeBillers, setActiveBillers] = useState({});
  // const [pin, setPin] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [narration, setNarration] = useState("");
  const [activeTab, setActiveTab] = useState("fund");
  // const [loading, setLoading] = useState(false);

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
        setUser(response?.data?.user);
        setWalletBalance(response?.data?.user?.wallet?.balance || 0);
        setLedgerBalance(response?.data?.user?.wallet?.lockedAmount || 0);
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

  // for fetching billers to frontend
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        const response = await axios.get(`${BASE_URL}/biller`, {
          withCredentials: true,
        });

        const fetchedBillers = response?.data || [];
        console.log(fetchedBillers);
        setBillers(fetchedBillers);
      } catch (error) {
        console.error(error);
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
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: `FND-${Date.now()}`,
    amount: parseFloat(amount) || 0,
    currency: "USD",
    payment_options: "card, banktransfer, ussd",
    customer: {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
    customizations: {
      title: "Fund PayWise Wallet",
      description: "Deposit money into your PayWise wallet",
      logo: "https://res.cloudinary.com/dmlhebmi8/image/upload/v1742915517/WhatsApp_Image_2025-03-25_at_16.11.12_izlbju.jpg",
    },
    callback: async (response) => {
      console.log("Payment callback:", response);
  
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User ID missing. Please log in again.");
        return;
      }
  
      if (response.status === "successful") {
        setIsSending(true);
        try {
          const result = await fetch(`${BASE_URL}/payment/fund-wallet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              transactionId: response.transaction_id, // actual ID from Flutterwave
            }),
          });
  
          const data = await result.json();
          if (result.ok && data.success) {
            toast.success("Wallet Funded!");
            setWalletBalance(data.walletBalance); // update from backend
          } else {
            toast.error(data.message || "Wallet funding failed.");
          }
        } catch (err) {
          console.error("Funding error:", err);
          toast.error("Something went wrong. Try again.");
        } finally {
          setIsSending(false);
          setFundModalOpen(false);
        }
      }
  
      closePaymentModal();
    },
    onclose: () => {
      console.log("Flutterwave modal closed");
    },
  };
  

  // Wallet withdraw from wallet
  const handleWithdraw = async (e) => {
    e.preventDefault();

    setWithdrawal(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.error("Authentication error. Please log in again.");
        setWithdrawal(false);
        return;
      }

      const amountNum = parseFloat(withdrawAmount);

      if (!amountNum || amountNum <= 0) {
        toast.error("Enter a valid withdrawal amount.");
        return;
      }

      if (!accountNumber || !bankCode) {
        toast.error("Account number and bank code are required.");
        return;
      }

      // if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount < 1) {
      //   toast.error("Enter a valid amount to withdraw.");
      //   return;
      // }

      const response = await axios.post(
        `${BASE_URL}/payment/withdraw-fund`,
        {
          userId,
          amount: amountNum,
          account_bank: bankCode,
          account_number: accountNumber,
          narration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Withdrawal processed ${response.data.message}`);
      console.log("Withdrawal response:", response.data);
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
      console.error("Withdrawal error:", err);
    } finally {
      setWithdrawModalOpen(false);
    }
  };

  //P2P Transfer
  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const senderId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      console.log("🔹 Sender ID from localStorage:", senderId);

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

  const connectToMetaMask = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      toast.error("MetaMask not detected! Redirecting to download...");
      window.location.href = "https://metamask.io/download.html";
      return;
    }

    try {
      // Request accounts and open the MetaMask extension for the user to connect
      setIsSubmitting(true);

      // This triggers the MetaMask extension to open and request the user's approval to connect
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Ensure that the user has at least one account
      if (accounts.length === 0) {
        toast.error("No MetaMask account found.");
        return;
      }

      const walletAddress = accounts[0];
      console.log("MetaMask Wallet Address:", walletAddress);

      // Store the wallet address (optional)
      localStorage.setItem("walletAddress", walletAddress);

      // Optionally: Update user in backend if needed
      const userId = localStorage.getItem("userId");
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
        const { updatedWallets } = response.data;
        console.log(response.data);
        // Update user in state if needed
        setMetaMaskAddress(walletAddress);
        setWalletLinked(true);
        setPayWiseAddress(updatedWallets.wallets); // assuming response contains the PayWise address

        // Store PayWise address (optional)
        localStorage.setItem("payWiseAddress", updatedWallets.payWiseAddress);
      }
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
      toast.error("Error connecting MetaMask.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="p-8">
          <div className="lg:flex gap-4">
            {/* Wallet Balance Section */}
            <div className="flex-1 h-full font-bodyFont w-full">
              <h1 className="font-bold mb-2 text-xl py-2">Wallet Balance:</h1>
              <div className="p-4  w-full rounded-lg shadow-md items-center border-4 border-neutral-500">
                <div className="flex w-full justify-between items-center">
                  {/* wallet balances */}
                  <div className="p-2">
                    <p className="text-sm md:text-lg font-bold">
                      Available Balance:
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
                    {/* <button
                    className="h-10 text-white p-2 bg-cyan-800 rounded-xl hover:cursor-pointer text-xs font-semibold hover:bg-cyan-500 transition w-30"
                    onClick={() => setManageTokensModalOpen(true)}
                  >
                    Manage Assets
                  </button> */}
                  </div>
                </div>

                <div className="flex mt-2 items-center p-2 space-x-2">
                  <p className="text-sm font-semibold">
                    Frozen Balance:{" "}
                    <span className="font-semibold">
                      {showWallet ? formatCurrency(ledgerBalance) : "•••"}
                    </span>
                  </p>
                  <button
                    onClick={() => setShowWallet(!showWallet)}
                    className="focus:outline-none hover:cursor-pointer"
                  >
                    {showWallet ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                {/* proposed Metamask */}
                {/* <div className="flex mt-4 items-center space-x-2">
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
                </div> */}
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

                  <div
                    className="items-center flex hover:cursor-pointer flex-col rounded-md space-y-2 hover:scale-105 hover:text-cyan-900"
                    onClick={() => setAutoPayModalOpen(true)}
                  >
                    <SmartphoneNfc className="hover:text-cyan-900 font-extrabold" />
                    <p className="font-bold text-sm hover:text-cyan-900">
                      AUTOPAY
                    </p>
                  </div>

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
            <div className="fixed inset-0 text-black flex items-center  justify-center bg-opacity-50 z-50">
              <div
                className="absolute inset-0 animate-moving-bg bg-cover bg-center"
                style={{ backgroundImage: `url(${blkchain5})` }}
              ></div>
              <div className="stars"></div>

              <div className="bg-zinc-100 shadow-lg w-1/3 h-2/3 relative m-auto p-3 rounded-lg text-black z-50">
                <X
                  strokeWidth={7}
                  color="#FF0000"
                  onClick={() => setFundModalOpen(false)}
                  className="hover:cursor-pointer hover:scale-110 hover:text-red-400 absolute top-4 right-4"
                />

                <div className="">
                  <h2 className="text-xl font-bold text-center mt-3 mb-2">
                    Manage Your Wallet
                  </h2>
                  <p className="text-center text-sm font-medium mb-4">
                    Fund or Withdraw from your PayWise wallet.
                  </p>
                </div>

                {/* Toggle Header */}
                <div className="flex justify-center gap-4 mb-6 ">
                  <button
                    onClick={() => setActiveTab("fund")}
                    className={`transition-all duration-300 ease-in-out px-4 py-2 cursor-pointer rounded-md font-semibold ${
                      activeTab === "fund"
                        ? "border-b-3 border-cyan-500 "
                        : "bg-zinc-100"
                    }`}
                  >
                    Fund Wallet
                  </button>
                  <button
                    onClick={() => setActiveTab("withdraw")}
                    className={`transition-all duration-300 ease-in-out px-4 py-2 cursor-pointer rounded-md font-semibold ${
                      activeTab === "withdraw"
                        ? "border-b-3 border-cyan-500"
                        : "bg-zinc-100"
                    }`}
                  >
                    Withdraw Funds
                  </button>
                </div>

                {/* Toggle Content */}
                {activeTab === "fund" ? (
                  <div className="space-y-4 w-2/3 m-auto">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className="p-2 border rounded-md w-full"
                    />
                    <FlutterWaveButton
                      className={`p-2 w-1/3 bg-cyan-700 text-white rounded-md hover:bg-cyan-500 cursor-pointer${
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
                ) : (
                  <form
                    onSubmit={handleWithdraw}
                    className="space-y-4 w-2/3 m-auto"
                  >
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="p-2 border rounded-md w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Bank Code (e.g., 058 for GTBank)"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      className="p-2 border rounded-md w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="p-2 border rounded-md w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Narration"
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      className="p-2 border rounded-md w-full"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="p-2 w-2/3 bg-cyan-700 text-white rounded-md hover:bg-cyan-500"
                    >
                      {withdrawal ? "Processing..." : "Withdraw Funds"}
                    </button>
                  </form>
                )}
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
          {/* transfer Modal */}
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
          {/* Withdraw Modal */}
          {withdrawModalOpen && (
            <form
              onSubmit={handleWithdraw}
              className="p-4 space-y-4 max-w-md mx-auto"
            >
              <input
                type="number"
                placeholder="Amount (₦)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Bank Code (e.g., 058 for GTBank)"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Narration"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="input"
              />
              <button
                type="submit"
                disabled={withdrawal}
                className="btn btn-primary w-full"
              >
                {/* {loading ? "Processing..." : "Withdraw"} */}
                {withdrawal ? "Processing..." : "Withdraw Funds"}
              </button>
            </form>
          )}
        </section>
      )}
    </>
  );
};

export default DashBoard;
