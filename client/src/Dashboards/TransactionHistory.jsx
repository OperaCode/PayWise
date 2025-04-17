import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import logo from "../assets/paywise-logo.png";
import { Moon, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // For Excel export
import { jsPDF } from "jspdf"; // For PDF export
import { Input, Select } from "antd";
import ReceiptModal from "../modals/ReceiptModal";

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
  const [sortOption, setSortOption] = useState(""); // State for sorting
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // You can change this to any number of items per page

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const paginatedTransactions = filteredTransactions.slice(
    indexOfFirst,
    indexOfLast
  );

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
        // Limit to 10 transactions
        const allTransactions = data.data || [];
        setTransactions(allTransactions);
        console.log(allTransactions);
        setFilteredTransactions(allTransactions);
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
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      switch (option) {
        case "date-newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-highest":
          return b.amount - a.amount;
        case "amount-lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    setFilteredTransactions(sortedTransactions);
    setCurrentPage(1);
  };

  // Open receipt modal
  const openReceiptModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Close receipt modal and navigate back
  const closeReceiptModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    navigate("/transactions"); // Navigate back to the transaction page
  };

  // Export transaction history as Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredTransactions.map((tx) => ({
        Date: new Date(tx.createdAt).toLocaleDateString(),
        Recipient:
          tx.paymentType === "Funding"
            ? `${tx.user?.firstName || "Self"} (Self)`
            : tx.recipientBiller?.name
            ? tx.recipientBiller.name
            : tx.recipientUser
            ? `${tx.recipientUser.firstName} ${tx.recipientUser.lastName}`
            : "Unknown",
        Amount: `$${tx.amount.toFixed(2)}`,
        Type: tx.paymentType,
        Status: tx.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transaction_history.xlsx");
  };

  // Download receipt as PDF
  const convertToBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const downloadReceiptPdf = async () => {
    const doc = new jsPDF();
    const logoBase64 = await convertToBase64(logo); // convert imported image

    // Logo
    doc.addImage(logoBase64, "PNG", 85, 10, 40, 20); // X=85 centers it roughly
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Transaction Receipt", 105, 40, { align: "center" });

    // Line spacing
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    let y = 60;
    const lineHeight = 10;

    const labelStyle = () => {
      doc.setFont(undefined, "bold");
    };
    const valueStyle = () => {
      doc.setFont(undefined, "normal");
    };

    // Transaction ID
    labelStyle();
    doc.text("Transaction ID:", 20, y);
    valueStyle();
    doc.text(`${selectedTransaction._id}`, 70, y);
    y += lineHeight;

    // Payment Reference
    labelStyle();
    doc.text("Payment Reference:", 20, y);
    valueStyle();
    doc.text(`${selectedTransaction.transactionRef}`, 70, y);
    y += lineHeight;

    // Date
    labelStyle();
    doc.text("Date:", 20, y);
    valueStyle();
    doc.text(
      `${new Date(selectedTransaction.createdAt).toLocaleDateString()}`,
      70,
      y
    );
    y += lineHeight;

    // Amount
    labelStyle();
    doc.text("Amount:", 20, y);
    valueStyle();
    doc.text(`$${selectedTransaction.amount.toFixed(2)}`, 70, y);
    y += lineHeight;

    // Recipient
    labelStyle();
    doc.text("Recipient:", 20, y);
    valueStyle();
    const recipient =
      selectedTransaction.paymentType === "Funding"
        ? `${selectedTransaction.user?.firstName || "Self"} (Self)`
        : selectedTransaction.recipientBiller?.name ||
          (selectedTransaction.recipientUser
            ? `${selectedTransaction.recipientUser.firstName} ${selectedTransaction.recipientUser.lastName}`
            : "Unknown");
    doc.text(recipient, 70, y);
    y += lineHeight;

    // Status
    labelStyle();
    doc.text("Status:", 20, y);
    valueStyle();
    doc.text(`${selectedTransaction.status}`, 70, y);
    y += lineHeight;

    doc.save("receipt.pdf");
  };

  return (
    <div className="lg:flex h-full ">
      <SideBar />

      {/* Main Content */}
      <div className="flex-col w-full pt-8 lg:ml-78 ">
        <div className="flex items-center justify-end px-10 py-4 gap-2">
          <h1 className="text-cyan- text-xl font-bold">
            Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}!
          </h1>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
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
        <div className="w-full min-h-screen">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">
              All Transactions
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4">
              <Input
                type="text"
                placeholder="Search by recipient or category"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md "
              />

              <Select
                value={sortOption}
                onChange={handleSort}
                className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
              >
                <Select.Option value="">Sort By</Select.Option>
                <Select.Option value="date-newest">Date: Newest</Select.Option>
                <Select.Option value="date-oldest">Date: Oldest</Select.Option>
                <Select.Option value="amount-highest">
                  Amount: High to Low
                </Select.Option>
                <Select.Option value="amount-lowest">
                  Amount: Low to High
                </Select.Option>
              </Select>
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
                  {paginatedTransactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="text-center hover:bg-gray-50 hover:text-black cursor-pointer"
                    >
                      <td className="p-2">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {tx.paymentType === "Funding"
                          ? `${tx.user?.firstName || "Self"} (Self)`
                          : tx.recipientBiller?.name ||
                            (tx.recipientUser
                              ? `${tx.recipientUser.firstName} ${tx.recipientUser.lastName}`
                              : "Unknown")}
                      </td>

                      <td className="p-2">${tx.amount.toFixed(2)}</td>
                      <td className="p-2">{tx.paymentType}</td>
                      <td className="p-2">{tx.status}</td>
                      <td className="p-2">
                        <button
                          onClick={() => openReceiptModal(tx)}
                          className="h-10 text-white p-2 bg-cyan-800 rounded-xl hover:cursor-pointer text-xs font-semibold hover:bg-cyan-500 transition w-30"
                        >
                          View Receipt
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
              {/* Pagination */}
              {/* Pagination Controls */}
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white flex items-center justify-center gap-2 rounded-md disabled:bg-gray-400  w-1/7  hover:scale-105 cursor-pointer"
                >
                  <ArrowLeft size={14}/> Previous 
                </button>
                <span className="text-lg font-medium">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredTransactions.length / pageSize)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < Math.ceil(filteredTransactions.length / pageSize)
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredTransactions.length / pageSize)
                  }
                  className="px-4 py-2 bg-blue-600 text-white flex items-center gap-2 justify-center rounded-md disabled:bg-gray-400 w-1/7  hover:scale-105 cursor-pointer"
                >
                  Next <ArrowRight size={14}/>
                </button>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={exportToExcel}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer transition hover:scale-105 border-2"
              >
                Export Transactions as Excel
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Receipt */}
        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 text-black rounded-lg w-2/5">
              <div className="mb-4 text-center">
                <img src={logo} alt="PayWise Logo" className="h-20 mx-auto" />
                <h2 className="text-xl font-bold mt-2">Transaction Receipt</h2>
              </div>

              <div id="receipt-content" className="space-y-4 ">
                <p>
                  <strong>Transaction ID:</strong> {selectedTransaction._id}
                </p>
                <p>
                  <strong>Payment Reference:</strong>{" "}
                  {selectedTransaction.transactionRef}
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
                  {selectedTransaction.paymentType === "Funding"
                    ? `${selectedTransaction.user?.firstName || "Self"} (Self)`
                    : selectedTransaction.recipientBiller?.name ||
                      (selectedTransaction.recipientUser
                        ? `${selectedTransaction.recipientUser.firstName} ${selectedTransaction.recipientUser.lastName}`
                        : "Unknown")}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTransaction.status}
                </p>
              </div>
              <div className="mt-4 flex justify-between">

                <button
                  onClick={closeReceiptModal}
                  className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={downloadReceiptPdf}
                  className="bg-blue-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
          //   <ReceiptModal closeReceiptModal={closeReceiptModal}/>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
