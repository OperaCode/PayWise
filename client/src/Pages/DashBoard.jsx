import React, { useEffect, useState } from "react";
// import Graph from "../Layouts/Graph";
// import { IoAddCircle } from "react-icons/io5";
// import Recent from "../Layouts/Recent";
// import AddExpenseModal from "../Modals/AddExpenseModal";
//  import { ClipLoader } from 'react-spinners';
import { toast } from "react-toastify";
import axios from "axios";
import p2p from "../assets/p2p.png"
import schedulepay from "../assets/schedulepay.png"
import analytics from "../assets/analytics.png"
import autopay from "../assets/autopay.png"
import { SmartphoneNfc, HandCoins, CalendarSync, ChartNoAxesCombined } from 'lucide-react';
import { Line } from "react-chartjs-2";
import Graph from "../charts/PieChart";
import Heatmap from "../charts/HeatMap"
// import { useNavigate } from "react-router-dom";


const override = {
    display: 'block',
    margin: '100px auto',
};

const BASE_URL = import.meta.env.VITE_BASE_URL;



const DashBoard = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    //   useEffect(() => {
    //     const fetchRecentTransaction = async () => {
    //       setIsLoading(true);
    //       try {
    //         const response = await axios.get(`${BASE_URL}/expense`, { withCredentials: true });
    //         setTransactions(response.data);
    //         toast.success(response?.data?.message);
    //       } catch (error) {
    //         console.error(error);
    //         toast.error(error?.response?.data?.message || "Failed to fetch transactions");
    //       } finally {
    //         setIsLoading(false);
    //       }
    //     };
    //     fetchRecentTransaction();
    //   }, [BASE_URL]);

    //   const handleAddTransaction = (newTransaction) => {
    //     setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    //   };

    //   const totalExpenses = Array.isArray(transactions) 
    //   ? transactions.reduce((acc, transaction) => acc + (transaction.amount || 0), 0) 
    //   : 0;
    //   const totalFoodGroceries = Array.isArray(transactions)
    //   ? transactions.filter(transaction => transaction.category === "Food and groceries").reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
    //   : 0;
    //   const totalUtilities = Array.isArray(transactions)
    //   ? transactions.filter(transaction => transaction.category === "Utilities").reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
    //   : 0;

    // const totalTransportation = Array.isArray(transactions)
    //   ? transactions.filter(transaction => transaction.category === "Transportation").reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
    //   : 0;
    //   if (isLoading) return <ClipLoader color='1a80e5' cssOverride={override} loading={isLoading} />;

    return (
        <section className=" w-full">
            
            
            <div className="lg:flex px-4">
                {/* Balance Section */}
            <div className=" flex-1 h-full font-bodyFont  p-8 w-full">
                <h1 className=" font-bold mb-4 text-xl">Current Balance:</h1>
                <div className="p-2 bg-zinc-100 flex w-80 justify-between rounded-lg shadow-md  border-3 border-neutral-500">
                    <div>
                        <p className="text-gray-900 text-sm md:text-xs">Wallet Balance:</p>
                        <h2 className="text-lg font-bold text-gray-700">${300}</h2>
                    </div>
                    <button className=" bg-cyan-700 text-white p-2 rounded-xl text-xs font-semibold hover:bg-green-900 transition hover:cursor">
                        Fund Wallet
                    </button>

                </div>
                       {/* Quick Links */}
                <div>
                <h1 className="font-semibold py-4 md:text-lg">Quick Links</h1>
                <div className="flex items-center gap-6 justify-around px-6 ">
                    <div className="items-center rounded-md  flex flex-col hover:scale-105 ">
                        <HandCoins className="hover:text-cyan-900 font-extrabold" />
                        <p className="font-bold text-sm hover:cursor-pointer ">P2P</p>
                    </div>
                    <div className="items-center rounded-md  flex flex-col hover:cursor-pointer hover:scale-105">
                        <CalendarSync className="hover:text-cyan-900 font-extrabold" />
                        <p className="font-bold hover:cursor-pointer text-sm">SCHEDULE-PAY</p>
                    </div>
                    <div className="items-center flex hover:cursor-pointer flex-col rounded-md  hover:scale-105">
                        <SmartphoneNfc className="hover:text-cyan-900 font-extrabold" />
                        <p className="font-bold text-sm">AUTOPAY</p>
                    </div>
                    <div className="items-center flex flex-col hover:cursor-pointer rounded-md  hover:scale-105">
                        {/* <img src={analytics} alt="" /> */}
                        <ChartNoAxesCombined classname='hover:text-cyan-900' />
                        <p className="font-bold text-sm hover:text-cyan-900">ANALYTICS</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Heat Map Section */}
            <div className="flex-1 w-full p-10  h-full">
                <Heatmap />
            </div>
            </div>




            {/* Pie Chart Section */}
            <div className=" p-4">
            <Graph />
          </div>



        </section>
    );
};

export default DashBoard;