import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // For Excel export
import { jsPDF } from "jspdf"; // For PDF export

const BASE_URL = import.meta.env.VITE_BASE_URL;

const TransactionHistory = () => {
  const [username, setUserName] = useState(" ");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, setUser } = useState(" ");
  const [profilePicture, setProfilePicture] = useState(" ");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const navigate = useNavigate();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserId = localStorage.getItem("userId");
        const response = await axios.get(`${BASE_URL}/user/${UserId}`, {
          withCredentials: true,
        });
        const data = response?.data;
        const user = data?.user;
        setUserName(user.firstName);
        setProfilePicture(user.profilePicture || "default_image.jpg");
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    };

    fetchUser();
  }, [setUser]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const { data } = await axios.get(
          `${BASE_URL}/payment/history/${userId}`,
          {
            withCredentials: true,
          }
        );
        setTransactions(data.data || []);
        setFilteredTransactions(data.data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = transactions.filter(
      (tx) =>
        tx.recipientBiller?.name.toLowerCase().includes(query) ||
        `${tx.recipientUser?.firstName} ${tx.recipientUser?.lastName}`
          .toLowerCase()
          .includes(query)
    );
    setFilteredTransactions(filtered);
  };

  // Open receipt modal
  const openReceiptModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Close receipt modal
  const closeReceiptModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Export transaction history as Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTransactions.map(tx => ({
      Date: new Date(tx.createdAt).toLocaleDateString(),
      Recipient: tx.recipientBiller?.name || `${tx.recipientUser?.firstName} ${tx.recipientUser?.lastName}`,
      Amount: `$${tx.amount.toFixed(2)}`,
      Type: tx.paymentType,
      Status: tx.status,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transaction_history.xlsx");
  };

  // Download receipt as PDF
  const downloadReceiptPdf = () => {
    const doc = new jsPDF();
    doc.text(`Transaction ID: ${selectedTransaction._id}`, 10, 10);
    doc.text(`Date: ${new Date(selectedTransaction.createdAt).toLocaleDateString()}`, 10, 20);
    doc.text(`Amount: $${selectedTransaction.amount.toFixed(2)}`, 10, 30);
    doc.text(`Recipient: ${selectedTransaction.recipientUser?.firstName || "Unknown"}`, 10, 40);
    doc.text(`Status: ${selectedTransaction.status}`, 10, 50);
    doc.save("receipt.pdf");
  };

  return (
    <div className="lg:flex">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full pt-8 lg:ml-78">
        <div className="flex items-center justify-end px-10 py-4 gap-2">
          <h1 className="text-cyan- text-xl font-bold">
            Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}!
          </h1>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              // onChange={handleSelectFile}
              className="hidden"
              id="profileUpload"
              multiple={false}
            />
            <label htmlFor="profileUpload">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 cursor-pointer hover:opacity-80 transition"
              />
            </label>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 bg-blue-950 dark:bg-gray-700 rounded-2xl hover:cursor-pointer"
          >
            {theme === "light" ? (
              <Moon className="text-white" />
            ) : (
              <Sun className="text-yellow-400" />
            )}
          </button>
        </div>

        {/* Transaction Table */}
        <div className="w-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
              All Transactions
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4">
              <input
                type="text"
                placeholder="Search by recipient or category"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md "
              />
            </div>

            <div className="overflow-x-auto">
              <table
                id="transactions-table"
                className="min-w-full text-sm md:text-lg border-collapse  border-gray-300 mt-4"
              >
                <thead>
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Recipient</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="text-center hover:bg-gray-50 hover:text-black cursor-pointer"
                    >
                      <td className="p-2">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {tx.recipientBiller?.name ||
                          `${tx.recipientUser?.firstName || "Unknown"} ${
                            tx.recipientUser?.lastName || ""
                          }`}
                      </td>
                      <td className="p-2">${tx.amount.toFixed(2)}</td>
                      <td className="p-2">{tx.paymentType}</td>
                      <td className="p-2">{tx.status}</td>
                      <td className="p-2">
                        <button
                          onClick={() => openReceiptModal(tx)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        No transactions available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Receipt */}
        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Receipt</h2>
              <div id="receipt-content">
                <p>
                  <strong>Transaction ID:</strong> {selectedTransaction._id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedTransaction.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Amount:</strong> $
                  {selectedTransaction.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Recipient:</strong>{" "}
                  {selectedTransaction.recipientUser?.firstName || "Unknown"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTransaction.status}
                </p>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={downloadReceiptPdf}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download PDF
                </button>
                <button
                  onClick={closeReceiptModal}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Export Transactions as Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
