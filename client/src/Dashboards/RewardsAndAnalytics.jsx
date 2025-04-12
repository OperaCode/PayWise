import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const RewardsAndAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [redeemAmount, setRedeemAmount] = useState("");

  const [insights, setInsights] = useState({
    totalSpent: 0,
    totalTransactions: 0,
    mostUsedService: "",
    largestPayment: 0,
    paymentFrequency: 0,
  });

  //Loading Timeout
  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

  //fetch History
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        // console.log("User ID from localStorage:", userId); // Debugging
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/payment/payment-summary`,
          {
            withCredentials: true,
          }
        );
        const data = response.data;

        console.log("Fetched Analytics Data:", response.data);
        setInsights(data.insights || []);
      } catch (error) {
        console.error(
          "Error fetching payment history:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false); // Hide loader once data is fetched
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleRedeem = () => {
    if (!redeemAmount || redeemAmount > rewardBalance) return;
    alert(`Redeemed ${redeemAmount} WiseCoins`);
    // Logic to redeem here
  };

  
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        // <div className="space-y-6">
        //   <h2 className="py-2 font-bold text-xl p-2 ">Rewards & Analytics</h2>
        //   {/* Balance */}
        //   <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md text-center mb-6">
        //     <h2 className="text-xl md:text-2xl font-bold">
        //       Your Reward Balance
        //     </h2>
        //     <p className="text-4xl mt-2 font-semibold">
        //       {rewardBalance} WiseCoins
        //     </p>
        //   </div>

        //   {/* Redeem Section */}
        //   <div className="bg-white rounded-xl shadow p-4 mb-6">
        //     <h3 className="text-lg font-semibold mb-2">Redeem WiseCoins</h3>
        //     <div className="flex gap-3 items-center">
        //       <input
        //         type="number"
        //         min="1"
        //         className="border p-2 rounded w-full"
        //         placeholder="Enter amount to redeem"
        //         value={redeemAmount}
        //         onChange={(e) => setRedeemAmount(e.target.value)}
        //       />
        //       <button
        //         onClick={handleRedeem}
        //         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        //       >
        //         Redeem
        //       </button>
        //     </div>
        //     <p className="text-sm text-gray-500 mt-1">
        //       Use WiseCoins to fund wallet or get discounts.
        //     </p>
        //   </div>
        //   {/* Activity Trends Cards */}

      
        // </div>
        <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Reward Balance */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Your Reward Balance</h2>
        <p className="text-4xl mt-2 font-semibold">{rewardBalance} PayCoins</p>
      </div>

      {/* Redeem Section */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Redeem PayCoins</h3>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            min="1"
            className="border p-2 rounded w-full"
            placeholder="Enter amount to redeem"
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(e.target.value)}
          />
          <button
            onClick={handleRedeem}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Redeem
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">Redeem your PayCoins to fund wallet or get discounts.</p>
      </div>

      {/* Reward History Table */}
      {/* <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Reward History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
                <th className="p-2">Points</th>
                <th className="p-2">Source</th>
                <th className="p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {rewards.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    No rewards yet.
                  </td>
                </tr>
              ) : (
                rewards.map((reward) => (
                  <tr key={reward.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{reward.date}</td>
                    <td className="p-2">{reward.type}</td>
                    <td className="p-2 font-semibold text-green-600">+{reward.points}</td>
                    <td className="p-2">{sourceBadge(reward.source)}</td>
                    <td className="p-2">{reward.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6 ">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-col m-auto ">
              <h3 className="text-xl font-semibold h-15 text-gray-700">
                Total Spent
              </h3>
              <p className="text-2xl font-bold text-green-500">
                ${insights.totalSpent}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center m-auto">
              <h3 className="text-xl font-semibold h-15 text-gray-700">
                Most Paid Biller
              </h3>
              <p className="text-2xl font-bold text-blue-500">
                {insights.mostUsedService}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center m-auto">
              <h3 className="text-xl font-semibold h-15 text-gray-700">
                Total Transactions
              </h3>
              <p className="text-2xl font-bold text-purple-500">
                {insights.totalTransactions}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center m-auto">
              <h3 className="text-xl font-semibold h-15 text-gray-700">
                Largest Payment
              </h3>
              <p className="text-2xl font-bold text-orange-500">
                ${insights.largestPayment}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center m-auto">
              <h3 className="text-xl font-semibold h-15 text-gray-700">
                Payment Frequency
              </h3>
              <p className="text-2xl font-bold text-teal-500">
                {insights.paymentFrequency} p/month
              </p>
            </div>
          </div>
    </div>
      )}
    </>
  );
};

export default RewardsAndAnalytics;
