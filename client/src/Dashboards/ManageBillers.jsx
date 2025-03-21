import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import Loader from "../components/Loader";
import image from "../assets/avatar.jpg";
import cardBg1 from "../assets/cardBg1.avif";
import cardBg2 from "../assets/cardBg2.webp";

import { Plus, Scroll, ArrowLeft } from "lucide-react";
import { Button, Modal, Input, Select, Switch, DatePicker, Upload } from "antd";

const ManageBillers = () => {
  const [loading, setLoading] = useState(true);
  const [biller, setBiller] = useState(true);
  const [profilePicture, setProfilePicture] = useState(" "); // Default avatar
  const [billers, setBillers] = useState([
    {
      name: "Power Company",
      billerType: "Vendor",
      user: "65d2f8a9c3b6a8e1a4567890",
      accountNumber: "ACC123456",
      bankName: "",
      serviceType: "Utilities and Rent",
      phone: "555-0101",
      // amount: "support@powerco.com",
      amount: "$650",
      createdAt: "2025-02-28T12:00:00Z",
    },
    {
      name: "Internet Provider",
      billerType: "Vendor",
      user: "65d2f8a9c3b6a8e1a4567891",
      accountNumber: "ACC654321",
      bankName: "",
      serviceType: "Utilities and Rent",
      phone: "555-0202",
      email: "support@internet.com",
      amount: "$450",
      createdAt: "2025-02-28T12:30:00Z",
    },
    {
      name: "John Doe",
      billerType: "Beneficiary",
      user: "65d2f8a9c3b6a8e1a4567892",
      accountNumber: "ACC987654",
      bankName: "ABC Bank",
      serviceType: "Beneficiary and Sponsor",
      phone: "555-0303",
      email: "john.doe@example.com",
      amount: "$600",
      createdAt: "2025-02-28T13:00:00Z",
    },
    {
      name: "SuperMart",
      billerType: "Vendor",
      user: "65d2f8a9c3b6a8e1a4567893",
      accountNumber: "ACC321789",
      bankName: "",
      serviceType: "Food and Groceries",
      phone: "555-0404",
      email: "contact@supermart.com",
      amount: "$500",
      createdAt: "2025-02-28T14:00:00Z",
    },
  ]);
  const [showFullList, setShowFullList] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBiller, setCurrentBiller] = useState(null);
  const [newBiller, setNewBiller] = useState({
    name: "",
    email: "",
    billerType: "",
    serviceType: "",
    accountNumber: "",
    bankName: "",
    profilePicture: null,
    amount: "",
  });

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBiller(null);
    setNewBiller({
      name: "",
      billerType: "",
      accountId: "",
      dueDate: "",
      amount: "",
      autoPay: false,
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newbiller, setNew] = useState({ name: "", age: "", gender: "" });
  const [selectedBiller, setSelectedBiller] = useState(null);
  const billerTypes = ["Electricity", "Water", "Internet", "Cable TV", "Other"];

  const handleAddBiller = () => {
    if (billers.length >= 5) {
      alert("You can only add up to 5 billers.");
      return;
    }
  
    setbillers([...billers, { ...newbiller, id: billers.length + 1 }]);
    setIsModalOpen(false);
    setNewbiller({ name: "", age: "", gender: "" });
  };

  // const serviceTypeOptions = [
  //   "Food and Groceries",
  //   "Utilities and Rent",
  //   "Beneficiary and Sponsor",
  //   "Others",
  // ];

  useEffect(() => {
    // Simulate an API call or app initialization delay
    setTimeout(() => setLoading(false), 3000);
  }, []);

 

  const handleCardClick = (biller) => {
    setSelectedBiller(biller);
    setIsModalOpen(true);
  };

  const handleDeleteBiller = (id) => {
    if (confirm("Are you sure you want to delete this biller?")) {
      setBillers((prev) => prev.filter((biller) => biller.id !== id));
      setIsModalOpen(false);
    }
  };

  // const handleSaveBiller = () => {
  //   setBillers((prev) =>
  //     prev.map((biller) =>
  //       biller.id === selectedBiller.id ? selectedBiller : biller
  //     )
  //   );
  //   setIsModalOpen(false);
  // };

  return (
    <>
      {/* {loading?(<Loader/>):(
    )} */}
      <div className="p-6">
        {/* Biller Profile and List */}
        <div className="">
          {showFullList ? (
            // Full List View
            <div>
              <h2 className="text-xl font-bold mb-4">All Billers</h2>

              <ul className="space-y-2">
                {billers.map((biller) => (
                  <li
                    key={biller.id}
                    className="p-2 border-2 rounded-lg shadow-sm  flex justify-between items-center"
                  >
                    {/* Left: Biller Info */}
                    <div>
                      <h3 className="text-lg font-semibold">{biller.name}</h3>
                      <p className="text-sm ">{biller.billerType}</p>
                    </div>

                    {/* Right: AutoPay Switch */}
                    <div className="flex items-center gap-3">
                      <Switch
                        //checked={autoPayStates[biller.id]}
                        onChange={() => toggleAutoPay(biller.id)}
                      />
                      <span className="text-sm text-gray-700">
                        {/* {autoPayStates[biller.id]
                          ? "Auto-Pay On"
                          : "Enable Auto-Pay"} */}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowFullList(false)}
                className="mt-4 px-4 py-2  rounded-lg flex gap-2 justify-center hover:scale-105  border-2 items-center  shadow-md cursor-pointer bg-cyan-700  font-semibold hover:bg-red-400 transition duration-200 ease-in hover:cursor-pointer"
              >
                <ArrowLeft /> Back to Profiles
              </button>
            </div>
          ) : (
            // Default Profile View with Your Requested Features
            <div className="lg:flex flex-col items-center text-center p-2 ">
              <h1 className="ont-bold  py-2 font-bold text-xl p-2 text-center">
                Billers Profile
              </h1>
              <p className="text-center mb-4">
                Start by creating the profile of your biller. You can add as
                much as 5 biller profiles on Paywise{" "}
                <span className="text-green-600">Ugrade Plan</span>.
              </p>

              {/* Cards */}
              <div className="flex gap-4 justify-between  w-full items-center p-4">
                {billers.map((biller) => (
                  <div
                    key={biller.id}
                    onClick={() => handleCardClick(biller)}
                    // style={{
                    //   backgroundImage: `url(${cardBg2})`,
                    // }}
                    className="cursor-pointer border bg-center hover:scale-105 shadow-lg rounded-lg p-4 w-50 flex flex-col items-center"
                  >
                    <img
                      src={biller.avatar || image}
                      alt={biller.name}
                      className="rounded-full w-20 h-20 border-2 cursor-pointer hover:opacity-80 transition"
                    />
                    <h3 className="mt-2 font-bold">{biller.name}</h3>
                    <p className="text-sm font-semibold">{biller.billerType}</p>
                  </div>
                ))}

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="border-2 border-blue-500 w-40 h-32 flex flex-col items-center justify-center rounded-lg cursor-pointer shadow-md hover:scale-105"
                >
                  <span className="text-blue-500 text-xl">+</span>
                  <span className="text-blue-500">Add biller</span>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                You can add a biller anytime from the settings.
              </p>
              <button
                onClick={() => setShowFullList(true)}
                className="flex gap-2 px-6 m-auto mt-4 justify-center hover:scale-105  border-2 items-center rounded-md shadow-md cursor-pointer w-sm bg-cyan-700 text-white py-3  font-semibold hover:bg-green-900 transition hover:cursor-pointer"
              >
                See Full List <Scroll size={20} />
              </button>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-lg text-black">
                <h2 className="text-lg font-semibold text-center">
                  {selectedBiller ? "Biller Profile" : "Add New Biller"}
                </h2>

                {selectedBiller ? (
                  // Viewing or Editing a Biller
                  // Viewing a Biller Profile
                  <div className="flex flex-col items-center ">
                    <img
                      src={selectedBiller.avatar || image}
                      alt={selectedBiller.name}
                      className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <h3 className="mt-2 font-semibold">
                      {selectedBiller.name}
                    </h3>
                    <p className="text-gray-500">{selectedBiller.billerType}</p>

                    {/* Edit Mode */}
                    <div className="w-full space-y-2">
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Name:</label>
                        <Input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          // className=" border shadow-sm rounded"
                          placeholder="Biller Name"
                          value={selectedBiller.name}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Email:</label>
                        <Input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          // className=" border shadow-sm rounded"
                          placeholder="Biller Name"
                          value={selectedBiller.email}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-between">
                        <div className="flex w-full gap-2">
                          <label htmlFor="">Biller Type</label>
                          <Select
                            placeholder="Biller Type"
                            options={billerTypes.map((type) => ({
                              label: type,
                              value: type,
                            }))}
                            value={selectedBiller.billerType}
                            onChange={(value) =>
                              setSelectedBiller({
                                ...selectedBiller,
                                billerType: value,
                              })
                            }
                          />
                        </div>
                        <div className="flex  w-full">
                          <label htmlFor="">Service Type</label>
                          <Select
                            placeholder="Service Type"
                            options={billerTypes.map((type) => ({
                              label: type,
                              value: type,
                            }))}
                            value={selectedBiller.billerType}
                            onChange={(value) =>
                              setSelectedBiller({
                                ...selectedBiller,
                                billerType: value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <label htmlFor="" className="w-35">
                          {" "}
                          Account Number
                        </label>
                        <Input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          placeholder="Account Number"
                          value={selectedBiller.accountId}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="" className="w-30">
                          Bank Name
                        </label>
                        <Input
                          style={{
                            borderWidth: "5px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          placeholder="Bank Name"
                          value={selectedBiller.accountId}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Wallet Address(optional)</label>
                        <Input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          placeholder="Wallet Address"
                          value={selectedBiller.accountId}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              accountId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <label htmlFor="">Due Date</label>
                        <DatePicker
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          placeholder="Due Date"
                          value={
                            selectedBiller.dueDate
                              ? moment(selectedBiller.dueDate)
                              : null
                          }
                          onChange={(date, dateString) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              dueDate: dateString,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Amount:</label>
                        <Input
                          style={{
                            borderWidth: "1px",
                            borderRadius: "6px",
                            padding: "10px",
                          }}
                          placeholder="Amount"
                          type="number"
                          value={selectedBiller.amount}
                          onChange={(e) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <Switch
                          checked={selectedBiller.autoPay}
                          onChange={(checked) =>
                            setSelectedBiller({
                              ...selectedBiller,
                              autoPay: checked,
                            })
                          }
                        />
                        <span className="ml-2">Enable Auto-Pay</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between w-full ">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        // onClick={handleSaveBiller}
                      >
                        Update
                      </button>

                      <button
                        className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        onClick={() => handleDeleteBiller(selectedBiller.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  // Adding a New Biller
                  <div className="flex flex-col items-center">
                    <img
                      src={image}
                      alt={image}
                      className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <h3 className="mt-2 font-semibold">{`Name:`}</h3>
                    <p className="text-gray-500">{newBiller.billerType}</p>

                    {/* Edit Mode */}
                    <div className="w-full space-y-2">
                      <div className="flex gap-2 items-center">
                        <label>Name:</label>
                        <Input
                          placeholder="Biller Name"
                          onChange={(e) =>
                            setNewBiller({ ...newBiller, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label>Email:</label>
                        <Input
                          placeholder="Biller Email"
                          onChange={(e) =>
                            setNewBiller({
                              ...newBiller,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-between">
                        <div className="flex w-full">
                          <label>Biller Type</label>
                          <Select
                            placeholder="Biller Type"
                            options={billerTypes.map((type) => ({
                              label: type,
                              value: type,
                            }))}
                            onChange={(value) =>
                              setNewBiller({ ...newBiller, billerType: value })
                            }
                          />
                        </div>
                        <div className="flex w-full">
                          <label>Service Type</label>
                          <Select
                            placeholder="Biller Type"
                            options={billerTypes.map((type) => ({
                              label: type,
                              value: type,
                            }))}
                            onChange={(value) =>
                              setNewBiller({ ...newBiller, billerType: value })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <label htmlFor="" className="w-35">
                          {" "}
                          Account Number
                        </label>
                        <Input
                          placeholder="Biller Name"
                          onChange={(e) =>
                            setNewBiller({ ...newBiller, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="" className="w-30">
                          Bank Name
                        </label>
                        <Input
                          placeholder="Biller Name"
                          onChange={(e) =>
                            setNewBiller({ ...newBiller, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Wallet Address(optional)</label>
                        <Input
                          placeholder="Biller Name"
                          onChange={(e) =>
                            setNewBiller({ ...newBiller, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <label>Due Date</label>
                        <DatePicker
                          placeholder="Due Date"
                          value={
                            newBiller.dueDate ? moment(newBiller.dueDate) : null
                          }
                          onChange={(date, dateString) =>
                            setNewBiller({
                              ...newBiller,
                              dueDate: dateString,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <label htmlFor="">Amount:</label>
                        <Input
                          placeholder="Biller Name"
                          onChange={(e) =>
                            setNewBiller({ ...newBiller, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <Switch
                          // checked={newBiller.autoPay}
                          onChange={(checked) =>
                            setNewBiller({
                              ...newBiller,
                              autoPay: checked,
                            })
                          }
                        />
                        <span className="ml-2">Enable Auto-Pay</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between w-full">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        //onClick={handleSaveBiller}
                      >
                        Create Biller
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                        onClick={() => handleDeleteBiller(selectedBiller.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-center">
                  <button
                    className="mt-4 hover:bg-red-600 bg-cyan-600 hover:text-white p-2  w-1/2 text-center border-2 cursor-pointer rounded-md hover:scale-105 transition duration-300 ease-in-out"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart Section */}
        <div className="lg:w-4xl m-auto p-4">
          <BarChart />
        </div>
      </div>
    </>
  );
};

export default ManageBillers;
