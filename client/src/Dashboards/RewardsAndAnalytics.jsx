import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const RewardsAndAnalytics = () => {
  const [loading, setLoading] = useState(true);
  
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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
        <h2 className="py-2 font-bold text-xl p-2 ">Rewards & Analytics</h2>

        {/* Rewards Section */}
        <div className="flex w-full justify-between px-6">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2"> Transaction Points</h3>
            <p className="text-green-600 text-xl font-bold">$0</p>
            <p className="text-gray-500">
              All your transactions intelligently sorted into categories!
            </p>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Total Rewards</h3>
            <p className="text-green-600 text-xl font-bold">$0</p>
            <p className="text-gray-500">
              Your withdrawal threshold is <span className="text-2xl font-bold text-green-600">100 Paywise Coins</span>
            </p>
          </div>
        </div>
        {/* Activity Trends Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6 ">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-col m-auto ">
            <h3 className="text-xl font-semibold h-15 text-gray-700">Total Spent</h3>
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
