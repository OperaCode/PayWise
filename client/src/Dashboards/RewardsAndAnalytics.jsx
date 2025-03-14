import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";

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

          {/* Activity Trends Chart */}
          <div className="mt-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Activity Trends</h3>
              <img
                src="/mnt/data/image.png"
                alt="Activity Trends Chart"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>


    </>
  );
};

export default RewardsAndAnalytics;
