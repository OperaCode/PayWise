import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Input, Select } from "antd";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Recent = () => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate();
   const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
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

  // Filter + Sort
  const filteredHistory = history
    .filter((payment) => {
      const recipient =
        payment.recipientBiller?.name ||
        (payment.recipientUser
          ? `${payment.recipientUser.firstName} ${payment.recipientUser.lastName}`
          : "");
      const category = payment.recipientBiller?.serviceType || "";
      const searchText = searchQuery.toLowerCase();
      return (
        recipient.toLowerCase().includes(searchText) ||
        category.toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      if (sortOption === "date-newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "date-oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === "amount-highest") {
        return b.amount - a.amount;
      } else if (sortOption === "amount-lowest") {
        return a.amount - b.amount;
      }
      return 0;
    });

  // Handle row click
  const handleTransactionClick = (id) => {
    navigate(`/receipt/${id}`);
  };

  return (
    <div>
      <div className="w-full text-center">
        <h2 className="text-xl md:text-2xl font-bold p-2">
          Recent Transactions
        </h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4">
        <Input
          type="text"
          placeholder="Search by recipient or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md "
        />

        <Select
          value={sortOption}
          onChange={(value) => setSortOption(value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <Select.Option value="">Sort By</Select.Option>
          <Select.Option value="date-newest">Date: Newest</Select.Option>
          <Select.Option value="date-oldest">Date: Oldest</Select.Option>
          <Select.Option value="amount-highest">Amount: High to Low</Select.Option>
          <Select.Option value="amount-lowest">Amount: Low to High</Select.Option>
        </Select>
      </div>

      <div className="p-2 m-auto text-center">
        <table className="w-full text-sm md:text-lg border-collapse  border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="p-2 border-gray-300">Date</th>
              <th className="p-2 border-gray-300">Recipient</th>
              <th className="p-2 border-gray-300">Category</th>
              <th className="p-2 border-gray-300">Type</th>
              <th className="p-2 border-gray-300">Amount</th>
              <th className="p-2 border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((payment) => (
                <tr
                  key={payment._id}
                  onClick={() => handleTransactionClick(payment._id)}
                  className=" cursor-pointer hover:bg-gray-100  hover:text-black  border-b  transition-colors"
                >
                  <td className="p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    {payment.recipientBiller?.name ||
                      (payment.recipientUser
                        ? `${payment.recipientUser.firstName} ${payment.recipientUser.lastName}`
                        : "Unknown")}
                  </td>
                  <td className="p-2">
                    {payment.recipientBiller?.serviceType || "Others"}
                  </td>
                  <td className="p-2">{payment.paymentType}</td>
                  <td className="p-2">${payment.amount.toFixed(2)}</td>
                  <td className="p-2">{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 mb-6">
        <a
          href="/transactions"
          className="bg-blue-600 hover:bg-green-900 text-white px-6 py-2 rounded-lg transition hover:scale-105 border-2"
        >
          See All Transactions
        </a>
      </div>
    </div>
  );
};

export default Recent;
