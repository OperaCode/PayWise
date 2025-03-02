import React, { useEffect, useState, useContext } from "react";
import image from "../assets/category.png"
import { UserContext } from "../context/UserContext";
import { SmartphoneNfc, HandCoins, CalendarSync, ChartNoAxesCombined } from 'lucide-react';
import Line from "../charts/LineGraph"
import {Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import LineGraph from "../charts/LineGraph";
import Graph from "../charts/PieChart";


const override = {
    display: 'block',
    margin: '100px auto',
};

const BASE_URL = import.meta.env.VITE_BASE_URL;



const DashBoard = () => {
    const { user } = useContext(UserContext);
     //console.log(user)
    const [walletBalance, setWalletBalance] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {

        //To fetch user information
        const fetchUser = async () => {
    
          try {
            const UserId = localStorage.getItem("userId"); 
            const response = await axios.get(`http://localhost:3000/user/${UserId}`, { withCredentials: true });
            
            const fetchedUser = response?.data?.user;
            console.log(fetchedUser)
            setWalletBalance(fetchedUser.wallet.balance);
          } catch (error) {
            toast.error("Error Fetching User")
            console.log("Error fetching user:", error);
          }
        };
    
        // const fetchTransactions = async () => {
        //   try {
        //     const UserId = localStorage.getItem("userId");
        //     const response = await axios.get(`http://localhost:3000/transactions/${UserId}`, { withCredentials: true });
        //     setTransactions(response.data); // Assuming response.data is an array of transactions
        //   } catch (error) {
        //     console.log("Error fetching transactions:", error);
        //   }
        // };
    
        fetchUser();
        // fetchTransactions();
      }, []);


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
        <section className="p-8 ">


            <div className="lg:flex  gap-4 ">
                {/* Wallet Balance Section */}
                <div className=" flex-1 h-full font-bodyFont w-full ">
                    <h1 className=" font-bold mb-4 text-xl py-2">Current Balance:</h1>
                    <div className="p-4 bg-zinc-100 flex w-100 justify-between rounded-lg shadow-md items-center border-4 border-neutral-500">
                        <div className="p-2">
                            <p className="text-gray-900 text-sm md:text-md font-bold">Wallet Balance:</p>
                            <h2 className="text-xl font-bold text-gray-700">${walletBalance? walletBalance: 0}</h2>
                        </div>
                        <button className=" hover:cursor-pointer h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-xs font-semibold hover:bg-cyan-600 transition hover:cursor">
                            Add Money
                        </button>
                      
                        <button className=" hover:cursor-pointer h-10 text-white p-2 bg-cyan-800 rounded-xl text-xs font-semibold hover:bg-cyan-500 transition hover:cursor">
                            Manage Tokens
                        </button>

                    </div>
                    {/* Quick Links */}
                    <div>
                        <h1 className="font-semibold py-4 md:text-lg">Quick Links</h1>
                        <div className="flex items-center gap-6 justify-around px-6 ">
                            <div className="items-center rounded-md space-y-2 flex flex-col hover:scale-105 ">
                                <HandCoins className="hover:text-cyan-900 font-extrabold" />
                                <p className="font-bold text-sm hover:cursor-pointer ">P2P</p>
                            </div>
                            <div className="items-center rounded-md space-y-2 flex flex-col hover:cursor-pointer hover:scale-105">
                                <CalendarSync className="hover:text-cyan-900 font-extrabold" />
                                <p className="font-bold hover:cursor-pointer text-sm">SCHEDULE-PAY</p>
                            </div>
                            <div className="items-center flex hover:cursor-pointer flex-col rounded-md space-y-2 hover:scale-105">
                                <SmartphoneNfc className="hover:text-cyan-900 font-extrabold" />
                                <p className="font-bold text-sm">AUTOPAY</p>
                            </div>
                            <div className="items-center flex flex-col hover:cursor-pointer rounded-md space-y-2 hover:scale-105">
                                {/* <img src={analytics} alt="" /> */}
                                <ChartNoAxesCombined classname='hover:text-cyan-900' />
                                <p className="font-bold text-sm hover:text-cyan-900">ANALYTICS</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Graph Section */}
                <div className="flex-1 w-full lg:w-50 ">
                    <Line />
                </div>
            </div>

            {/* Pie Chart Section */}
            <div className=" md:flex justify-center  ">
                <Graph />
                <div className="flex justify-center w-2/3 m-auto">
                    <p className="font-semibold text-right ">All your transaction intelligently sorted into categories &#x1F609;
                        !</p>
                    <img src={image} alt="" className="w-90 h-90 m-auto" />
                </div>
            </div>



        </section>
    );
};

export default DashBoard;