import React, { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";

import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;




const Transactions = [
    {
      sender: "Alice Johnson",
      receiver: "Bob Smith",
      amount: 120.5,
      date: "2025-02-20T14:30:00Z",
    },
    {
      sender: "Charlie Brown",
      receiver: "David Wilson",
      amount: 250.75,
      date: "2025-02-21T10:15:00Z",
    },
    {
      sender: "Emma Williams",
      receiver: "Fiona Davis",
      amount: 89.99,
      date: "2025-02-22T08:45:00Z",
    },
    {
      sender: "George Miller",
      receiver: "Hannah Lee",
      amount: 310.2,
      date: "2025-02-23T16:00:00Z",
    },
  ];
  


const Recent = () => {
  const [transactions, setTransactions] = useState([Transactions]);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         // const UserId = localStorage.getItem("userId"); 
//         const response = await axios.get(`${BASE_URL}/expense`, { withCredentials: true });
//         setTransactions(response.data || []); 
//       } catch (error) {
//         console.log("Error fetching transactions:", error);
//       }
//     };
//     fetchTransactions();
//   }, []);

  return (
    <div className="w-full p-6 bg-zinc-200 rounded-lg mt-4 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center md:text-lg">
        <div>
          <h2 className="text-s md:text-lg font-bold text-cyan-950">
            Recent Transactions
          </h2>
          {/* <p className="text-xs p-2 md:text-gray-500">Check your transaction history</p> */}
        </div>
        <Link to="/history">
          <button className="text-sm p-3  bg-cyan-700 text-white rounded hover:bg-blue-900 mb-2">See all</button>
        </Link>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md">
        <table className="w-full text-xs md:text-lg">
          <thead>
            <tr className="bg-">
              <th className="text-center text-base text-gray-700">Sender</th>
              <th className="text-center text-base text-gray-700">Receiver</th>
              <th className="text-center text-base text-gray-700">Amount</th>
              <th className="text-center text-base text-gray-700">Date</th>
              <th className="text-center text-base text-gray-700 md:hidden">Action</th>
            </tr>
          </thead>

          <tbody>
          {Array.isArray(Transactions) && Transactions.length > 0 ? (
  Transactions.slice(0, 3).map((transaction, index) => {
    const transactionDate = transaction.date ? new Date(transaction.date) : null;
    const formattedDate = transactionDate ? transactionDate.toLocaleDateString() : "Invalid Date";
            
                return (
                  <tr
                    key={index}
                    className={`${index % 4 === 0 } hover:bg-gray-100`}
                  >
                    <td className="text-center p-2 text-cyan-900">
                      {transaction.sender}
                    </td>
                    <td className="text-center  p-2 text-cyan-900">
                      {transaction.receiver}
                    </td>
                    <td className="text-center text-base p-2 text-cyan-900">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td className="text-center text-base p-2 text-cyan-900">
                      {formattedDate}
                    </td>
                    <td className="p-2 md:px-6 text-base md:hidden text-indigo-900">
                      <Ellipsis className="m-auto" />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center  p-4">No recent transactions found!</td>
              </tr>
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recent;