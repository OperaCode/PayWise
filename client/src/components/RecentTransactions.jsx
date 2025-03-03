import React, { useEffect, useState } from "react";
import { Ellipsis, Search } from "lucide-react";

import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;




const Transactions = [
  {
    recipient: "Bob Smith",
    date: "2025-02-20T14:30:00Z",
    amount: 120.5,
    status:"Scheduled",
  },
  {
    recipient: "David Wilson",
    date: "2025-02-21T10:15:00Z",
    amount: 250.75,
    status:"Scheduled",
  },
  {
    recipient: "Fiona Davis",
    date: "2025-02-22T08:45:00Z",
    amount: 89.99,
    status:"Scheduled",
  },
  {
    recipient: "Hannah Lee",
    date: "2025-02-23T16:00:00Z",
    amount: 310.2,
    status:"Scheduled",
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
            <button className="text-md flex  p-3 rounded-md hover:cursor-pointer  text-white  bg-cyan-800 font-bold   hover:bg-cyan-500 transition hover:cursor">See all</button>
          </Link>

        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-4 m-auto  text-center">
        <table className="w-full text-lg">
          <thead>
            <tr className="">
             
              <th className=" p-2 ">Recipient</th>
              <th className=" p-2 ">Date</th>
              <th className=" p-2 ">Amount</th>
              <th className=" p-2  ">Status</th>
              <th className=" p-2  ">Action</th>
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
                      {transaction.recipient}
                    </td>
                    <td className=" text-base  ">
                      {formattedDate}
                    </td>

                    <td className=" text-base  ">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td className="   ">
                      {transaction.status.toLocaleString()}
                    </td>
                    
                    
                    <td className="p-2 md:px-6 text-base   ">
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