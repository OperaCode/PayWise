import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Recent = () => {
  const [history, setHistory] = useState([]);

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

  return (
    <div>
      <div className="w-full md:text-lg">
        <h2 className="md:text-md font-bold text-xl text-center p-2">
          Recent Transactions
        </h2>
      </div>

      <div className="p-4 m-auto text-center">
        <table className="w-full text-lg border-collapse border border-gray-300">
          <thead>
            <tr className="">
              <th className="p-2 border border-gray-300 shadow-xs">Date</th>
              <th className="p-2 border border-gray-300">Recipient</th>
              <th className="p-2 border border-gray-300">Payment Category</th>
              <th className="p-2 border border-gray-300">Amount</th>
              <th className="p-2 border border-gray-300">Status</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              history.map((payment) => (
                <tr key={payment._id} className="border border-gray-300">
                  <td className="p-2 border border-gray-300">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {/* {payment.recipientBiller?.name || payment.recipientUser?.firstName || "Unknown"} */}
                    {payment.recipientBiller?.name ||
                      (payment.recipientUser
                        ? `${payment.recipientUser.firstName} ${payment.recipientUser.lastName}`
                        : "Unknown")}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {/* {payment.recipientUser
                      ? "Transfer"
                      : payment.recipientBiller
                      ? "PayLater"
                      : "N/A"} */}
                    {payment.recipientBiller?.serviceType
                      ? payment.recipientBiller.serviceType
                      : payment.recipientUser
                      ? "Transfer"
                      : "Others"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {payment.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recent;
