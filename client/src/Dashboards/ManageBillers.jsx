import React, { useState } from "react";
import BarChart from "../charts/BarChart";

const ManageBillers = () => {
  const [billers, setBillers] = useState([
    {
      _id: "1",
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
      _id: "2",
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
      _id: "3",
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
      _id: "4",
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

  const [modalOpen, setModalOpen] = useState(false);
  const [currentBiller, setCurrentBiller] = useState(null);
  const [newBiller, setNewBiller] = useState({
    name: "",
    billerType: "vendor",
    accountNumber: "",
    bankName: "",
    serviceType: "Food and Groceries",
    phone: "",
    amount: "",
  });

  const serviceTypeOptions = [
    "Food and Groceries",
    "Utilities and Rent",
    "Beneficiary and Sponsor",
    "Others",
  ];

  const handleSaveBiller = () => {
    if (currentBiller) {
      setBillers((prevBillers) =>
        prevBillers.map((b) => (b._id === currentBiller._id ? newBiller : b))
      );
    } else {
      setBillers([...billers, { ...newBiller, _id: Date.now().toString() }]);
    }
    setModalOpen(false);
    setNewBiller({
      name: "",
      billerType: "Vendor",
      accountNumber: "",
      bankName: "",
      serviceType: "Food and Groceries",
      phone: "",
      email: "",
      amount: "$50",
      createdAt: new Date().toISOString(),
    });
    setCurrentBiller(null);
  };

  const handleDeleteBiller = (id) => {
    setBillers(billers.filter((biller) => biller._id !== id));
  };

  return (
    <div className="p-6">
      <div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Billers</h2>
          <button
            className=" text-md flex  p-3 rounded-md hover:cursor-pointer  text-white  bg-cyan-800 font-bold   hover:bg-cyan-500 transition hover:cursor "
            onClick={() => {
              setCurrentBiller(null);
              setModalOpen(true);
            }}
          >
            + Add Biller
          </button>
        </div>

        <table className="mt-4 w-full text-md  border border-gray-300">
          <thead>
            <tr className="">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Biller Type</th>
              <th className="p-2 border">Service Type</th>
              <th className="p-2 border hidden md:table-cell">Account Number</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border hidden md:table-cell">Bank Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {billers.map((biller) => (
              <tr key={biller._id} className="text-center border">
                <td className="p-1 border">{biller.name}</td>
                <td className="p-1 border">{biller.billerType}</td>
                <td className="p-1 border">{biller.serviceType}</td>
                <td className="p-1 border hidden md:table-cell">{biller.accountNumber}</td>
                <td className="p-1 border">{biller.amount}</td>
                <td className="p-1 border hidden md:table-cell">{biller.bankName || "N/A"}</td>
                <td className="p-1 border">
                  <div className="flex justify-center">
                    <button
                      className="border px-3 rounded mr-2 hover:bg-green-700 hover:text-white hover:cursor-pointer   py-1  font-bold "
                      onClick={() => {
                        setCurrentBiller(biller);
                        setNewBiller(biller);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="hover:bg-red-600 hover:text-white hover:cursor-pointer border px-3 py-1 rounded font-bold"
                      onClick={() => handleDeleteBiller(biller._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:w-4xl m-auto p-4">
        <BarChart/>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {currentBiller ? "Edit Biller" : "Add Biller"}
            </h3>
            <input
              className="border p-2 w-md mb-2"
              placeholder="Biller Name"
              value={newBiller.name}
              onChange={(e) =>
                setNewBiller({ ...newBiller, name: e.target.value })
              }
            />
            <select
              className="border p-2 w-md mb-2"
              value={newBiller.billerType}
              onChange={(e) =>
                setNewBiller({ ...newBiller, billerType: e.target.value })
              }
            >
              <option value="vendor">Vendor</option>
              <option value="beneficiary">Beneficiary</option>
            </select>
            <input
              className="border p-2 w-md mb-2"
              placeholder="Account Number"
              value={newBiller.accountNumber}
              onChange={(e) =>
                setNewBiller({ ...newBiller, accountNumber: e.target.value })
              }
            />
            <input
              className="border p-2 w-md mb-2"
              placeholder="Bank Name"
              value={newBiller.bankName}
              onChange={(e) =>
                setNewBiller({ ...newBiller, bankName: e.target.value })
              }
            />
            <select
              className="border p-2 w-md mb-2"
              value={newBiller.serviceType}
              onChange={(e) =>
                setNewBiller({ ...newBiller, serviceType: e.target.value })
              }
            >
              {serviceTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              className="border p-2 w-md mb-2"
              placeholder="amount"
              value={newBiller.amount}
              onChange={(e) =>
                setNewBiller({ ...newBiller, amount: e.target.value })
              }
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleSaveBiller}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBillers;
