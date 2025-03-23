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
  Milestone,
  TabletSmartphone,
  MessageSquareMore,
  LogOut,
} from "lucide-react";

const dashboardLinks = [
  { title: "Home", route: "/homedash" },
  { title: "Make Payment", route: "/history" },
  { title: "Manage Billers", route: "/room" },
  { title: "Rewards and Analytics", route: "/room" },
  { title: "Messages", route: "/room" },
  { title: "Settings", route: "/room" },
  { title: "Log Out", route: "/login" },
];

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
        "http://localhost:3000/user/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.removeItem("userToken");
        navigate("/login");
        //toast.success("Logout successful!");
      } else {
        console.error("Logout failed");
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An error occurred while logging out.");
    }
  };

  return (
    <aside className=" lg:flex lg:h-screen lg:fixed border-r-1 shadow-md border-neutral-500 font-headerFont  ">
      <div className="lg:p-5  rounded px-3">
        <div className="flex justify-between items-center lg:flex-col">
          {/* Logo */}
          <div className=" p-4 lg:pt-14 ">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="hover:cursor-pointer w-50 bg-zinc-200 rounded-lg"
              />
            </Link>
          </div>

          {/* Menu Items */}
          <div className="   font-headerFont w-full ">
            <ul className="flex justify-end gap-1 text-c lg:space-y-8 lg:p-8  w-full lg:flex-col">
              <Link to="/dashboard">
                <div className="flex gap-2 items-center hover:text-cyan-900 ">
                  <House size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer  md:block hover:text-cyan-900 font-bold lg:text-md ">
                    {" "}
                    Home
                  </li>
                </div>
              </Link>

              <Link to="/billers">
                <div className=" gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <TabletSmartphone size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer  font-bold lg:text-md ">
                    Manage Billers
                  </li>
                </div>
              </Link>

              <Link to="/payment">
                <div className=" gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <DollarSign size={17} strokeWidth={3} />
                  <li className="hover:cursor-pointer  font-bold lg:text-md ">
                    Make Payment
                  </li>
                </div>
              </Link>

              <Link to="/analytics">
                <div className=" gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <Milestone strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold w-full lg:text-md a">
                    Rewards and Analytics
                  </li>
                </div>
              </Link>
              <Link to="/messages">
                <div className="gap-2 items-center hover:text-cyan-900 hidden lg:flex ">
                  <MessageSquareMore strokeWidth={3} />
                  <li className="hover:cursor-pointer font-bold lg:text-md">
                    Messages
                  </li>
                </div>
              </Link>

              <div className="flex gap-2 items-center hover:text-cyan-900 ">
                <LogOut strokeWidth={3} />
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
        <div className="fixed inset-0  bg-opacity-50  justify-center  flex items-center  bg-opacity-50 z-50">
          <div className="  rounded-lg bg-zinc-300 text-black shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              className="top-4 left-4 p-4 text-lg "
              onClick={toggleModal} // Close the modal
            >
              <SquareX className="w-10 h-10 hover:cursor-pointer hover:text-cyan-900 " />
            </button>
            {/* Modal Menu Items */}
            <ul className="leading-10 text-xl p-4">
              <Link to="/billers">
                <li className="hover:text-cyan-900  font-bold cursor-pointer">
                  Manage Billers
                </li>
              </Link>
              <Link to="/payment">
                <li className="hover:text-cyan-900 font-bold  cursor-pointer">
                  Make Payment
                </li>
              </Link>

              <Link to="/analytics">
                <li className="hover:text-cyan-900 font-bold  cursor-pointer">
                  Rewards and Analytics
                </li>
              </Link>
              <Link to="/messages">
                <li className="hover:text-cyan-900 font-bold  cursor-pointer">
                  Messages
                </li>
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
