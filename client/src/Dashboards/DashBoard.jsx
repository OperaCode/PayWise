import React, { useEffect, useState, useContext } from "react";
import image from "../assets/category.png";
import { UserContext } from "../context/UserContext";
import walletImages from "../assets/autopay.png";
import blkchain from "../assets/blockchain.webp";
import blkchain2 from "../assets/blockchain2.webp";
import blkchain3 from "../assets/blkchain3.jpeg";
import blkchain4 from "../assets/blockChain1.jpg";
import blkchain5 from "../assets/darkbg.jpg";
import {
  SmartphoneNfc,
  HandCoins,
  CalendarSync,
  ChartNoAxesCombined,
} from "lucide-react";
import Line from "../charts/LineGraph";
import DashPieChart from "../charts/PieChart";
import FwPay from "../components/FlutterWave";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DashBoard = () => {
  const { user } = useContext(UserContext);
  const [walletBalance, setWalletBalance] = useState("");
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [manageTokensModalOpen, setManageTokensModalOpen] = useState(false);
  const [p2pModalOpen, setP2pModalOpen] = useState(false);
  const [schedulePayModalOpen, setSchedulePayModalOpen] = useState(false);
  const [autoPayModalOpen, setAutoPayModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        const response = await axios.get(`${BASE_URL}/user/${UserId}`, {
          withCredentials: true,
        });
        setWalletBalance(response?.data?.user?.wallet?.balance || 0);
      } catch (error) {
        toast.error("Error Fetching User");
      }
    };
    fetchUser();
  }, []);

  return (
    <section className="p-8">
      <div className="lg:flex gap-4">
        {/* Wallet Balance Section */}
        <div className="flex-1 h-full font-bodyFont w-full">
          <h1 className="font-bold mb-4 text-xl py-2">Current Balance:</h1>
          <div className="p-4 flex w-full justify-between rounded-lg shadow-md items-center border-4 border-neutral-500">
            <div className="p-2">
              <p className="text-sm md:text-lg font-bold">Wallet Balance:</p>
              <h2 className="text-xl font-bold">${walletBalance}</h2>
            </div>
            <div className="flex gap-2 text-center">
              <button
                className="h-10 text-white p-2 bg-cyan-800 rounded-xl hover:cursor-pointer text-xs font-semibold hover:bg-cyan-500 transition w-30"
                onClick={() => setFundModalOpen(true)}
              >
                Add Money
              </button>
              <button
                className="h-10 text-white p-2 bg-cyan-800 rounded-xl hover:cursor-pointer text-xs font-semibold hover:bg-cyan-500 transition w-30"
                onClick={() => setManageTokensModalOpen(true)}
              >
                Manage Tokens
              </button>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h1 className="font-semibold py-4 md:text-lg">Quick Links</h1>
            <div className="flex items-center gap-6 justify-around px-6 ">
              <div
                className="items-center rounded-md space-y-2 flex flex-col hover:scale-105 hover:text-cyan-900  "
                onClick={() => setP2pModalOpen(true)}
              >
                <HandCoins className="font-extrabold" />
                <p className="font-bold text-sm hover:cursor-pointer ">P2P</p>
              </div>
              <div
                className="items-center rounded-md space-y-2 flex flex-col hover:cursor-pointer hover:scale-105"
                onClick={() => setSchedulePayModalOpen(true)}
              >
                <CalendarSync className="hover:text-cyan-900 font-extrabold" />
                <p className="font-bold hover:cursor-pointer text-sm">
                  SCHEDULE-PAY
                </p>
              </div>
              <div
                className="items-center flex hover:cursor-pointer flex-col rounded-md space-y-2 hover:scale-105"
                onClick={() => setAutoPayModalOpen(true)}
              >
                <SmartphoneNfc className="hover:text-cyan-900 font-extrabold" />
                <p className="font-bold text-sm">AUTOPAY</p>
              </div>
              <div className="items-center flex flex-col hover:cursor-pointer rounded-md space-y-2 hover:scale-105">
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
        <div className="fixed inset-0 text-black flex items-center justify-center z-50  bg-opacity-50">
          {/* Animated Background  */}
          <div
            className="absolute inset-0 animate-waves bg-cover bg-center"
            style={{ backgroundImage: `url(${blkchain5})` }}
          ></div>

          <div className="bg-zinc-200 relative p-4 rounded-lg shadow-lg w-2/3 md:w-1/3">
            <h2 className="text-xl font-bold mb-4 m-auto">Fund Wallet</h2>
            <p>Enter the amount you want to add to your wallet.</p>
            <div className="flex justify-between items-center">
              <button
                className="p-2  hover:cursor-pointer bg-red-500 text-white rounded hover:bg-red-300"
                onClick={() => setFundModalOpen(false)}
              >
                Cancel
              </button>

              <FwPay />
              {/* <button
                className=" hover:cursor-pointer mt-4 px-4 py-2 bg-green-800 text-white rounded"
                onClick={() => setFundModalOpen(false)}
              >
                Pay Now
              </button> */}
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
              <button className=" hover:cursor-pointer mt-4 px-4 py-2 bg-green-700 text-white rounded-md">
                Check your WiseCoin
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

    </section>
  );
};

export default DashBoard;
