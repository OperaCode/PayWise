import React, { useContext, useState } from "react";
import logo from "../assets/paywise-logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  House,
  Menu,
  SquareX,
  DollarSign,
  CircleDollarSign,
  TabletSmartphone,
  UserRoundCog,
  ArrowRightLeft,
  LogOut,
  BadgeDollarSign,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SideBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  //logOutUser
  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/logout`,
        { withCredentials: true }
      );

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
    <aside className=" lg:flex lg:h-screen lg:fixed border-r-1 shadow-md border-neutral-500 font-headerFont  ">
      <div className="lg:p-5  rounded px-3">
        <div className="flex justify-between items-center lg:flex-col">
          {/* Logo */}
          <div className=" p-4 lg:pt-14 ">
            <img
              src={logo}
              alt="Logo"
              className="hover:cursor-pointer w-50 bg-zinc-100 rounded-lg"
            />
          </div>

          {/* Menu Items */}
          <div className="   font-headerFont w-full ">
            <ul className="flex justify-end gap-1 text-c lg:space-y-8 lg:p-8  w-full lg:flex-col">
              <Link to="/dashboard">
                <div className="flex gap-2 items-center hover:text-cyan-900 ">
                  <House size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer  md:block hover:text-cyan-900 font-bold text-s lg:text-md ">
                    {" "}
                    Home
                  </li>
                </div>
              </Link>

              <Link to="/billers">
                <div className=" gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <TabletSmartphone size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer  font-bold text-sm lg:text-md ">
                    Manage Billers
                  </li>
                </div>
              </Link>

              <Link to="/analytics">
                <div className=" gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <CircleDollarSign size={20} strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold w-full lg:text-md a">
                    Rewards and Analytics
                  </li>
                </div>
              </Link>
              <Link to="/transactions">
                <div className="gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <ArrowRightLeft size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold lg:text-md">
                    Transaction History
                  </li>
                </div>
              </Link>
              <Link to="/settings">
                <div className="gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <UserRoundCog size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold lg:text-md">
                    Profile Settings
                  </li>
                </div>
              </Link>

              <div className="flex gap-2 items-center hover:text-cyan-900 ">
                <LogOut size={17} strokeWidth={3} />
                <li
                  className="hover:cursor-pointer hover:text-cyan-900  md:block font-bold lg:text-md"
                  onClick={logoutUser}
                >
                  Log Out
                </li>
              </div>
            </ul>
          </div>

          {/* Menu Icon for Small Screens */}
          <div className="ml-3">
            <Menu
              className="size-10 lg:hidden hover:cursor-pointer hover:text-cyan-900 "
              onClick={toggleModal} // Toggle modal visibility on click
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-40 bg-opacity-40 border-l-2 ease-in-out transition duration-500 ${
            isModalOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-zinc-300 text-black shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
              isModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Close Button */}
            <button
              className="top-4 left-4 p-4 text-lg "
              onClick={toggleModal} // Close the modal
            >
              <SquareX className="w-10 h-10 hover:cursor-pointer hover:text-cyan-900 " />
            </button>
            {/* Modal Menu Items */}
            <ul className="leading-10 text-xl p-4">
              <Link to="/billers" onClick={toggleModal}>
                <div className=" gap-2 items-center hover:text-cyan-900 flex ">
                  <TabletSmartphone size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer  font-bold lg:text-md ">
                    Manage Billers
                  </li>
                </div>
              </Link>
              <Link to="/analytics" onClick={toggleModal}>
                <div className=" gap-2 items-center hover:text-cyan-900 flex ">
                  <BadgeDollarSign size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold w-full lg:text-md a">
                    Rewards and Analytics
                  </li>
                </div>
              </Link>
              <Link to="/transactions" onClick={toggleModal}>
                <div className="gap-2 items-center hover:text-cyan-900  flex ">
                  <ArrowRightLeft size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold lg:text-md">
                    Transaction History
                  </li>
                </div>
              </Link>
              <Link to="/settings" onClick={toggleModal}>
                <div className="gap-2 items-center hover:text-cyan-900  flex ">
                  <UserRoundCog size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold lg:text-md">
                    Profile Settings
                  </li>
                </div>
              </Link>
              {/* <Link to="/profile-setting">
                <li className="hover:text-cyan-900 font-bold  cursor-pointer">Settings</li>
              </Link>
               */}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideBar;
