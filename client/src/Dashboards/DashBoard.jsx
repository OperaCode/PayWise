import React, { useEffect, useState, useContext } from "react";
import image from "../assets/category.png";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader"; // Import your Loader component
import walletImages from "../assets/autopay.png";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
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
import Line from "../charts/LineGraph";
import DashPieChart from "../charts/PieChart";
import { ethers } from "ethers";
import FwPay from "../components/FlutterWave";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const flutterwaveConfig = {
  public_key: import.meta.env.VITE_FLW_PUBLIC_KEY, // Ensure this is correctly set in your .env file
  tx_ref: "tx_" + Date.now(),
  amount: 100, // Amount to charge
  currency: "USD",
  payment_options: "card, mobilemoney, ussd",
  customer: {
    email: "user@example.com",
    phone_number: "1234567890",
    name: "John Doe",
  },
  customizations: {
    title: "PayWise Wallet Funding",
    description: "Funding your PayWise Wallet",
    logo: "https://your-logo-url.com/logo.png",
  },
  callback: (response) => {
    console.log("Payment successful:", response);
    closePaymentModal(); // Close the payment modal
  },
  onclose: () => {
    console.log("Payment modal closed");
  },
};

const DashBoard = () => {
  const { user } = useContext(UserContext);
  //const { setLoading } = useContext(LoaderContext);
  const [walletBalance, setWalletBalance] = useState("");
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [manageTokensModalOpen, setManageTokensModalOpen] = useState(false);
  const [p2pModalOpen, setP2pModalOpen] = useState(false);
  const [schedulePayModalOpen, setSchedulePayModalOpen] = useState(false);
  const [autoPayModalOpen, setAutoPayModalOpen] = useState(false);
  const [wiseCoinTransferOpen, setWiseCoinTransferOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        console.log(UserId);
        const response = await axios.get(`${BASE_URL}/user/${UserId}`, {
          withCredentials: true,
        });
        console.log(response);
        setWalletBalance(response?.data?.user?.wallet?.balance || 0);
        setWalletAddress(response?.data?.user?.metamaskWallet || "Wallet not Linked!");
      
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    };
    fetchUser();
  }, []);

  const handleTransfer = async () => {
    if (!recipientEmail || !amount) {
      toast.error("Please enter recipient email and amount.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/wisecoin/transfer",
        { recipientEmail, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Transfer Successful!");
      onClose(); // Close modal after transfer
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer Failed!");
    } finally {
      setLoading(false);
    }
  };

  const connectToMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected! Redirecting to download...");
      window.location.href = "https://metamask.io/download.html";
     
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length === 0) {
        toast.error("No MetaMask account found.");
        return;
      }

      const walletAddress = accounts[0];
      console.log(walletAddress)
      //setWalletAddress(walletAddress);
      

      // Ensure userId is retrieved correctly
      const userId = localStorage.getItem("userId"); // Adjust based on your auth method
      console.log(userId)
      if (!userId) {
        toast.error("User not authenticated. Please log in first.");
        return;
      }

      // Send wallet address to the backend
      const response = await axios.post(
        `${BASE_URL}/user/connect-metamask`,
        { userId, walletAddress }, // Properly structured payload
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Wallet Connected Succesfully!");
      } 
    } catch (error) {
      console.error("Error connecting MetaMask:", error);

      // Format and display the error message properly
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      toast.error(`${errorMessage}`);
    

    }
  };

  return (
    <>
      {/* {loading ? (
        <Loader />
      ) : (
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
                  $
                  <span className="font-bold">
                  {showBalance
                    ? walletBalance || " 0.00 "
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
                    Manage Coin
                  </button>
                </div>
              </div>

              <div className="flex mt-4 items-center space-x-2">
                <p className="text-xs font-bold">
                  MetaMask Wallet:{" "}
                  <span className="font-normal">
                  {showWallet
                    ? walletAddress || "No wallet Linked"
                    : "•••••••••••••••••"}
                  </span>
                </p>
                <button
                  onClick={() => setShowWallet(!showWallet)}
                  className="focus:outline-none hover:cursor-pointer"
                >
                  {showWallet ?<Eye size={16} /> : <EyeOff size={16} />}
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
                  <p className="font-bold text-sm hover:text-cyan-900">P2P</p>
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
                <div className="items-center flex flex-col hover:cursor-pointer rounded-md space-y-2 hover:scale-105 hover:text-cyan-900">
                  {/* <img src={analytics} alt="" /> */}
                  <ChartNoAxesCombined classname="hover:text-cyan-900" />
                  <p className="font-bold text-sm hover:text-cyan-900">
                    ANALYTICS
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Line Graph */}
          <div className="flex-1 w-full lg:w-50">
            <Line />
          </div>
        </div>
        {/* Pie Chart */}
        <div className="md:flex justify-center">
          <DashPieChart />
          <div className="flex justify-center w-2/3 m-auto">
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
              style={{ backgroundImage: `url(${blkchain5})` }}
            ></div>
            <div className="stars"></div>

            <div className="bg-zinc-200 p-2 rounded-lg shadow-lg w-2/3 lg:w-md relative m-auto">
              <div className="flex-col justify-center p-2 flex m-auto text-center">
                <X
                  strokeWidth={4}
                  color="#FF0000"
                  onClick={() => setFundModalOpen(false)}
                  className=" hover:cursor-pointer  hover:scale-110  hover:text-red-400 "
                />
                <h2 className="text-xl font-bold ">My Wallets</h2>
                <p>
                  Here you can manage your paywise wallet or Connect to
                  Metamask.
                </p>
              </div>
              <div className="flex justify-between p-4">
                <FlutterWaveButton
                  className=" hover:cursor-pointer   p-2 bg-cyan-700 hover:bg-cyan-500 text-white rounded-md"
                  {...flutterwaveConfig}
                >
                  Manage Wallet
                </FlutterWaveButton>

                <button
                  onClick={connectToMetaMask}
                  className=" hover:cursor-pointer   bg-green-800 on hover:bg-green-600 text-white rounded-md w-1/3"
                >
                  Connect Wallet
                </button>
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

            <div className="bg-zinc-200 p-4 rounded-lg shadow-lg w-2/3 lg:w-lg relative m-auto">
              <div className="flex-col justify-center flex m-auto text-center">
                <h2 className="text-xl font-bold ">Manage Tokens</h2>
                <p>Here you can manage your tokens, Connect to your wallets</p>
              </div>
              <div className="flex justify-around w-full">
                <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-cyan-700 text-white rounded-md">
                  Connect Wallet
                </button>
                <button
                  className=" hover:cursor-pointer mt-4 px-4 py-2 bg-green-700 text-white rounded-md"
                  onClick={() => setWiseCoinTransferOpen(true)}
                >
                  Transfer WiseCoin
                </button>
              </div>
              <button
                className=" hover:cursor-pointer mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => setManageTokensModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* P2P Modal */}
        {p2pModalOpen && (
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

            <div className="bg-zinc-200 p-6 rounded-lg shadow-lg w-2/3 lg:w-2xl relative">
              <h2 className="text-xl font-bold mb-4">Manage Tokens</h2>
              <p>Here you can manage your tokens.</p>
              <div className="flex justify-between w-full">
                <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-cyan-700 text-white rounded-md">
                  Connect Wallet
                </button>
                <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-green-700 text-white rounded-md">
                  Check your WiseCoin
                </button>
              </div>
              <button
                className=" hover:cursor-pointer mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => setP2pModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Scehdule Payment Modal */}
        {schedulePayModalOpen && (
          <div className="fixed inset-0 text-black flex items-center justify-center bg-opacity-50 z-50">
            <div
              className="absolute inset-0 animate-moving-bg bg-cover bg-center"
              style={{ backgroundImage: `url(${blkchain5})` }}
            ></div>
            <div className="stars"></div>

            <div className="bg-zinc-200 p-6 rounded-lg shadow-lg w-2/3 lg:w-2xl relative">
              <h2 className="text-xl font-bold mb-4">Manage Tokens</h2>
              <p>Here you can manage your tokens.</p>
              <div className="flex justify-between w-full">
                <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-cyan-700 text-white rounded-md">
                  Connect Wallet
                </button>
                <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-green-700 text-white rounded-md">
                  Check your WiseCoin
                </button>
              </div>
              <button
                className=" hover:cursor-pointer mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => setSchedulePayModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* AutoPay Modal */}
        {autoPayModalOpen && (
          <div className="fixed inset-0 text-black flex items-center justify-center bg-opacity-50 z-50">
            <div
              className="absolute inset-0 animate-moving-bg bg-cover bg-center"
              style={{ backgroundImage: `url(${blkchain5})` }}
            ></div>
            <div className="stars"></div>

            <div className="bg-zinc-200 p-6 rounded-lg shadow-lg w-2/3 lg:w-2xl relative">
              <h2 className="text-xl font-bold mb-4">Manage Tokens</h2>
              <p>Here you can manage your tokens.</p>
              <div className="flex justify-between w-full">
                <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-cyan-700 text-white rounded-md">
                  Connect Wallet
                </button>
                <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-green-700 text-white rounded-md">
                  Check your WiseCoin
                </button>
              </div>
              <button
                className=" hover:cursor-pointer mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => setAutoPayModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
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
