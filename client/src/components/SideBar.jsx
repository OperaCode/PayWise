import React, { useState } from "react";
import logo from "../assets/paywise-logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  House,
  Menu,
  SquareX,
  CircleDollarSign,
  TabletSmartphone,
  UserRoundCog,
  ArrowRightLeft,
  LogOut,
  BadgeDollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SideBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const logoutUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        localStorage.removeItem("userToken");
        toast.success("Logged out successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out.");
    }
  };

  return (
    <aside className="lg:flex lg:flex-col lg:h-screen lg:w-64 lg:fixed border-r shadow-md z-50">
      {/* Logo + Mobile Menu Button */}
      <div className="flex items-center justify-between p-4 lg:flex-col lg:justify-start">
        <img
          src={logo}
          alt="Logo"
          className="w-40 bg-zinc-100 rounded-lg cursor-pointer"
        />
        <Menu
          className="size-8 lg:hidden cursor-pointer hover:text-cyan-900"
          onClick={toggleModal}
        />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex flex-col gap-6 p-4 font-headerFont">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-cyan-900">
          <House size={17} strokeWidth={3} /> <span className="font-bold">Home</span>
        </Link>
        <Link to="/billers" className="flex items-center gap-2 hover:text-cyan-900">
          <TabletSmartphone size={17} strokeWidth={3} /> <span className="font-bold">Manage Billers</span>
        </Link>
        <Link to="/analytics" className="flex items-center gap-2 hover:text-cyan-900">
          <CircleDollarSign size={17} strokeWidth={3} /> <span className="font-bold">Rewards & Analytics</span>
        </Link>
        <Link to="/transactions" className="flex items-center gap-2 hover:text-cyan-900">
          <ArrowRightLeft size={17} strokeWidth={3} /> <span className="font-bold">Transaction History</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-2 hover:text-cyan-900">
          <UserRoundCog size={17} strokeWidth={3} /> <span className="font-bold">Profile Settings</span>
        </Link>
        <button onClick={logoutUser} className="flex items-center gap-2 hover:text-cyan-900">
          <LogOut size={17} strokeWidth={3} /> <span className="font-bold">Log Out</span>
        </button>
      </nav>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={toggleModal}
            />
            {/* Sliding menu */}
            <motion.div
              key="menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-4 z-50"
            >
              <button onClick={toggleModal} className="mb-4">
                <SquareX className="w-8 h-8 hover:text-cyan-900" />
              </button>
              <nav className="flex flex-col gap-6 font-headerFont">
                <Link to="/billers" onClick={toggleModal} className="flex items-center gap-2">
                  <TabletSmartphone size={17} strokeWidth={3} /> Manage Billers
                </Link>
                <Link to="/analytics" onClick={toggleModal} className="flex items-center gap-2">
                  <BadgeDollarSign size={17} strokeWidth={3} /> Rewards & Analytics
                </Link>
                <Link to="/transactions" onClick={toggleModal} className="flex items-center gap-2">
                  <ArrowRightLeft size={17} strokeWidth={3} /> Transaction History
                </Link>
                <Link to="/settings" onClick={toggleModal} className="flex items-center gap-2">
                  <UserRoundCog size={17} strokeWidth={3} /> Profile Settings
                </Link>
                <button onClick={logoutUser} className="flex items-center gap-2">
                  <LogOut size={17} strokeWidth={3} /> Log Out
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default SideBar;
