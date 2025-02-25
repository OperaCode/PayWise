import React, { useEffect, useState } from "react";
import { Ellipsis, Search } from "lucide-react";

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
    <div className="w-full  rounded-lg shadow-md">
      {/* Header */}
      <div className=" w-full md:text-lg">
        <h2 className=" md:text-md font-bold text-xl text-center p-2">
          Recent Transactions
        </h2>
        <div className="flex w-2/3 items-center m-auto">
          <div className="flex flex-1 items-center p-4">
            <input type="text" className="p-1  text-cyan-950 rounded-lg w-full bg-gray-100 border-1 border-neutral-500 shadow-md" placeholder="Enter Search " />
            <Search className="-ml-8 size-5 text-black" />
          </div>
          <Link to="/history">
            <button className="text-sm p-3  bg-cyan-700 text-white rounded hover:bg-blue-900 mb-2">See all</button>
          </Link>

        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-4 m-auto  text-center">
        <table className="w-full text-lg">
          <thead>
            <tr className="">
              <th className=" p-2">Sender</th>
              <th className=" p-2 ">Receiver</th>
              <th className=" p-2 ">Amount</th>
              <th className=" p-2 ">Date</th>
              <th className=" p-2  md:hidden">Action</th>
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
                    className={`${index % 4 === 0} hover:bg-gray-100 leading-10`}
                  >
                    <td className=" ">
                      {transaction.sender}
                    </td>
                    <td className="   ">
                      {transaction.receiver}
                    </td>
                    <td className=" text-base  ">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td className=" text-base  ">
                      {formattedDate}
                    </td>
                    <td className="p-2 md:px-6 text-base md:hidden  ">
                      <Ellipsis className="m-auto" />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className=" p-4">No recent transactions found!</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recent;