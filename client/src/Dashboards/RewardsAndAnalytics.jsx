import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_BASE_URL;
const RewardsAndAnalytics = () => {
  const [loading, setLoading] = useState(true);
  // const [billers, setBillers] = useState([
  //   {
  //     _id: "1",
  //     name: "Power Company",
  //     billerType: "Vendor",
  //     user: "65d2f8a9c3b6a8e1a4567890",
  //     accountNumber: "ACC123456",
  //     bankName: "",
  //     serviceType: "Utilities and Rent",
  //     phone: "555-0101",
  //     // amount: "support@powerco.com",
  //     amount: "$650",
  //     createdAt: "2025-02-28T12:00:00Z",
  //   },
  //   {
  //     _id: "2",
  //     name: "Internet Provider",
  //     billerType: "Vendor",
  //     user: "65d2f8a9c3b6a8e1a4567891",
  //     accountNumber: "ACC654321",
  //     bankName: "",
  //     serviceType: "Utilities and Rent",
  //     phone: "555-0202",
  //     email: "support@internet.com",
  //     amount: "$450",
  //     createdAt: "2025-02-28T12:30:00Z",
  //   },
  //   {
  //     _id: "3",
  //     name: "John Doe",
  //     billerType: "Beneficiary",
  //     user: "65d2f8a9c3b6a8e1a4567892",
  //     accountNumber: "ACC987654",
  //     bankName: "ABC Bank",
  //     serviceType: "Beneficiary and Sponsor",
  //     phone: "555-0303",
  //     email: "john.doe@example.com",
  //     amount: "$600",
  //     createdAt: "2025-02-28T13:00:00Z",
  //   },
  //   {
  //     _id: "4",
  //     name: "SuperMart",
  //     billerType: "Vendor",
  //     user: "65d2f8a9c3b6a8e1a4567893",
  //     accountNumber: "ACC321789",
  //     bankName: "",
  //     serviceType: "Food and Groceries",
  //     phone: "555-0404",
  //     email: "contact@supermart.com",
  //     amount: "$500",
  //     createdAt: "2025-02-28T14:00:00Z",
  //   },
  // ]);

  // const [modalOpen, setModalOpen] = useState(false);
  // const [currentBiller, setCurrentBiller] = useState(null);

  // const serviceTypeOptions = [
  //   "Food and Groceries",
  //   "Utilities and Rent",
  //   "Beneficiary and Sponsor",
  //   "Others",
  // ];

  // useEffect(() => {
  //   // Simulate an API call or app initialization delay
  //   setTimeout(() => setLoading(false), 3000);
  // }, [])

  // const handleSaveBiller = () => {
  //   if (currentBiller) {
  //     setBillers((prevBillers) =>
  //       prevBillers.map((b) => (b._id === currentBiller._id ? newBiller : b))
  //     );
  //   } else {
  //     setBillers([...billers, { ...newBiller, _id: Date.now().toString() }]);
  //   }
  //   setModalOpen(false);
  //   setNewBiller({
  //     name: "",
  //     billerType: "Vendor",
  //     accountNumber: "",
  //     bankName: "",
  //     serviceType: "Food and Groceries",
  //     phone: "",
  //     email: "",
  //     amount: "$50",
  //     createdAt: new Date().toISOString(),
  //   });
  //   setCurrentBiller(null);
  // };

  // const handleDeleteBiller = (id) => {
  //   setBillers(billers.filter((biller) => biller._id !== id));
  // };

  


  const [insights, setInsights] = useState({
    totalSpent: 0,
    totalTransactions: 0,
    mostUsedService: '',
    largestPayment: 0,
    paymentFrequency: 0
  });

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

      console.log("Fetched Analytics Data:", response.data); 
      setInsights(response.data.data || []);
    } catch (error) {
      console.error(
        "Error fetching payment history:",
        error.response?.data || error.message
      );
    }
  };

  fetchAnalyticsData();
}, []);




  return (
    <>
      {/* {loading ? (
        <Loader />
      ) : (
      )} */}

      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Rewards & Analytics</h2>

        {/* Rewards Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Rewards & Points</h3>
          <p className="text-green-600 text-xl font-bold">$0</p>
          <p className="text-gray-500">
            All your transactions intelligently sorted into categories!
          </p>
        </div>

        {/* Activity Trends Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">Total Spent</h3>
            <p className="text-2xl font-bold text-green-500">${totalSpent}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Most Used Service
            </h3>
            <p className="text-2xl font-bold text-blue-500">
              {mostUsedService}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Transactions
            </h3>
            <p className="text-2xl font-bold text-purple-500">
              {totalTransactions}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Largest Payment
            </h3>
            <p className="text-2xl font-bold text-orange-500">
              ${largestPayment}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Payment Frequency
            </h3>
            <p className="text-2xl font-bold text-teal-500">
              {paymentFrequency} payments/month
            </p>
          </div>
        </div> */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold text-gray-700">Total Spent</h3>
        <p className="text-2xl font-bold text-green-500">${insights.totalSpent}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold text-gray-700">Most Used Service</h3>
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
        <p className="text-2xl font-bold text-teal-500">{insights.paymentFrequency} payments/month</p>
      </div>
    </div>
      </div>
    </>
  );
};

export default RewardsAndAnalytics;
