import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const RewardsAndAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [insights, setInsights] = useState({
    totalSpent: 0,
    totalTransactions: 0,
    mostUsedService: "",
    largestPayment: 0,
    paymentFrequency: 0,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/payment/payment-summary`, {
          withCredentials: true,
        });
        const data = response.data;
        console.log(data)
        setInsights(data.insights || []);
        setRewardBalance(data.rewardBalance || 0);
        setRewardHistory(data.rewardHistory || []);
      } catch (error) {
        console.error("Error fetching payment summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleRedeem = () => {
    if (!redeemAmount || redeemAmount > rewardBalance) return;
    alert(`Redeemed ${redeemAmount} PayCoins`);
    // Integrate redeem logic here
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Your Reward Balance</h2>
        <p className="text-4xl mt-2 font-semibold">{rewardBalance} PayCoins</p>
        <div className="w-full justify-end flex">
          <button
            onClick={() => setShowModal(true)}
            className="h-10 border text-white p-2 bg-cyan-800 rounded-xl hover:cursor-pointer text-xs font-semibold hover:bg-cyan-500 transition"
          >
            Show Rewards History
          </button>
        </div>
      </div>

      <div className=" rounded-xl shadow p-4 mb-6">
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
        <p className="text-sm mt-1">Redeem your PayCoins to fund wallet or get discounts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Spent</h3>
          <p className="text-2xl font-bold text-green-500">${insights.totalSpent}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Most Paid Biller</h3>
          <p className="text-2xl font-bold text-blue-500">{insights.mostUsedService}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Transactions</h3>
          <p className="text-2xl font-bold text-purple-500">{insights.totalTransactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Largest Payment</h3>
          <p className="text-2xl font-bold text-orange-500">${insights.largestPayment}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">Payment Frequency</h3>
          <p className="text-2xl font-bold text-teal-500">{insights.paymentFrequency} p/month</p>
        </div>
      </div>

      {/* Reward History Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4 text-center">Reward History</h3>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <div className="overflow-auto max-h-80">
              {rewardHistory.length > 0 ? (
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Source</th>
                      <th className="px-4 py-2">PayCoins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardHistory.map((reward, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{new Date(reward.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{reward.source}</td>
                        <td className="px-4 py-2">{reward.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">No reward history found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsAndAnalytics;