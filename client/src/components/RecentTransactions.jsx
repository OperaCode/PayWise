// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/paywise-logo.png"
// import { Input, Select } from "antd";
// import { jsPDF } from "jspdf"; // For PDF export
// import { ScrollText } from 'lucide-react';

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// const Recent = () => {
//   const [history, setHistory] = useState([]);
//  // const [history, setHistory] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) {
//           console.error("User ID not found in localStorage");
//           return;
//         }

//         const response = await axios.get(
//           `${BASE_URL}/payment/history/${userId}`,
//           {
//             withCredentials: true,
//           }
//         );
//         const limitedHistory = (response.data.data || []).slice(0, 6);
//         setHistory(limitedHistory);
//       } catch (error) {
//         console.error(
//           "Error fetching payment history:",
//           error.response?.data || error.message
//         );
//       }
//     };

//     fetchHistory();
//   }, []);

//   // Filter and sort transactions
//   const filteredHistory = history
//     .filter((payment) => {
//       const recipient =
//         payment.recipientBiller?.name ||
//         (payment.recipientUser
//           ? `${payment.recipientUser.firstName} ${payment.recipientUser.lastName}`
//           : "");
//       const category = payment.recipientBiller?.serviceType || "";
//       const searchText = searchQuery.toLowerCase();
//       return (
//         recipient.toLowerCase().includes(searchText) ||
//         category.toLowerCase().includes(searchText)
//       );
//     })
//     .sort((a, b) => {
//       if (sortOption === "date-newest") {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       } else if (sortOption === "date-oldest") {
//         return new Date(a.createdAt) - new Date(b.createdAt);
//       } else if (sortOption === "amount-highest") {
//         return b.amount - a.amount;
//       } else if (sortOption === "amount-lowest") {
//         return a.amount - b.amount;
//       }
//       return 0;
//     });

//   // Handle row click and show the modal
//   const handleTransactionClick = (payment) => {
//     setSelectedTransaction(payment);
//     setIsModalOpen(true); // Show the modal
//   };

//   // Close the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedTransaction(null);
//   };


//   const handleSort = (option) => {
//     setSortOption(option);
//     const sortedTransactions = [...filteredTransactions].sort((a, b) => {
//       switch (option) {
//         case "date-newest":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case "date-oldest":
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case "amount-highest":
//           return b.amount - a.amount;
//         case "amount-lowest":
//           return a.amount - b.amount;
//         default:
//           return 0;
//       }
//     });
//     setFilteredTransactions(sortedTransactions);
//   };



//   const convertToBase64 = async (url) => {
//     const res = await fetch(url);
//     const blob = await res.blob();
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.readAsDataURL(blob);
//     });
//   };

//   const downloadReceiptPdf = async () => {
//       const doc = new jsPDF();
//       const logoBase64 = await convertToBase64(logo); // convert imported image
  
//       // Logo 
//       doc.addImage(logoBase64, "PNG", 85, 10, 40, 20); // X=85 centers it roughly
//       doc.setFontSize(18);
//       doc.setFont(undefined, "bold");
//       doc.text("Transaction Receipt", 105, 40, { align: "center" });
  
//       // Line spacing
//       doc.setFontSize(12);
//       doc.setFont(undefined, "normal");
//       let y = 60;
//       const lineHeight = 10;
  
//       const labelStyle = () => {
//         doc.setFont(undefined, "bold");
//       };
//       const valueStyle = () => {
//         doc.setFont(undefined, "normal");
//       };
  
//       // Transaction ID
//       labelStyle();
//       doc.text("Transaction ID:", 20, y);
//       valueStyle();
//       doc.text(`${selectedTransaction._id}`, 70, y);
//       y += lineHeight;
  
//       // Payment Reference
//       labelStyle();
//       doc.text("Payment Reference:", 20, y);
//       valueStyle();
//       doc.text(`${selectedTransaction.transactionRef}`, 70, y);
//       y += lineHeight;
  
//       // Date
//       labelStyle();
//       doc.text("Date:", 20, y);
//       valueStyle();
//       doc.text(
//         `${new Date(selectedTransaction.createdAt).toLocaleDateString()}`,
//         70,
//         y
//       );
//       y += lineHeight;
  
//       // Amount
//       labelStyle();
//       doc.text("Amount:", 20, y);
//       valueStyle();
//       doc.text(`$${selectedTransaction.amount.toFixed(2)}`, 70, y);
//       y += lineHeight;
  
//       // Recipient
//       labelStyle();
//       doc.text("Recipient:", 20, y);
//       valueStyle();
//       const recipient =
//         selectedTransaction.paymentType === "Funding"
//           ? `${selectedTransaction.user?.firstName || "Self"} (Self)`
//           : selectedTransaction.recipientBiller?.name ||
//             (selectedTransaction.recipientUser
//               ? `${selectedTransaction.recipientUser.firstName} ${selectedTransaction.recipientUser.lastName}`
//               : "Unknown");
//       doc.text(recipient, 70, y);
//       y += lineHeight;
  
//       // Status
//       labelStyle();
//       doc.text("Status:", 20, y);
//       valueStyle();
//       doc.text(`${selectedTransaction.status}`, 70, y);
//       y += lineHeight;
  
//       doc.save("receipt.pdf");
//     };

//     const handleSearch = (e) => {
//       const query = e.target.value.toLowerCase();
//       setSearchQuery(query);
//       const filtered = transactions.filter(
//         (tx) =>
//           tx.recipientBiller?.name.toLowerCase().includes(query) ||
//           `${tx.recipientUser?.firstName} ${tx.recipientUser?.lastName}`
//             .toLowerCase()
//             .includes(query)
//       );
//       setFilteredTransactions(filtered);
//     };

//   return (
//     <div>
//       <div className="w-full text-center">
//         <h2 className="text-xl md:text-2xl font-bold p-2">Recent Transactions</h2>
//       </div>

//       {/* <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4">
//         <input
//           type="text"
//           placeholder="Search by recipient or category"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
//         />

//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
//         >
//           <option value="">Sort By</option>
//           <option value="date-newest">Date: Newest</option>
//           <option value="date-oldest">Date: Oldest</option>
//           <option value="amount-highest">Amount: High to Low</option>
//           <option value="amount-lowest">Amount: Low to High</option>
//         </select>
//       </div> */}


//         <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4">
//                       <Input
//                         type="text"
//                         placeholder="Search by recipient or category"
//                         value={searchQuery}
//                         onChange={handleSearch}
//                         className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md "
//                       />
        
//                       <Select
//                         value={sortOption}
//                         onChange={handleSort}
//                         className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
//                       >
//                         <Select.Option value="">Sort By</Select.Option>
//                         <Select.Option value="date-newest">Date: Newest</Select.Option>
//                         <Select.Option value="date-oldest">Date: Oldest</Select.Option>
//                         <Select.Option value="amount-highest">
//                           Amount: High to Low
//                         </Select.Option>
//                         <Select.Option value="amount-lowest">
//                           Amount: Low to High
//                         </Select.Option>
//                       </Select>
//                     </div>
        


//       <div className="p-2 m-auto text-center">
//         <table className="w-full text-sm md:text-lg border-collapse border-gray-300 mt-4">
//           <thead>
//             <tr>
//               <th className="p-2 border-gray-300">Date</th>
//               <th className="p-2 border-gray-300">Recipient</th>
//               <th className="p-2 border-gray-300">Category</th>
//               <th className="p-2 border-gray-300">Type</th>
//               <th className="p-2 border-gray-300">Amount</th>
//               <th className="p-2 border-gray-300">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredHistory.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="p-4 text-gray-500">
//                   No payments found.
//                 </td>
//               </tr>
//             ) : (
//               filteredHistory.map((payment) => (
//                 <tr
//                   key={payment._id}
//                   onClick={() => handleTransactionClick(payment)}
//                   className="cursor-pointer hover:bg-gray-100 hover:text-black border-b transition-colors"
//                 >
//                   <td className="p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
//                   <td className="p-2">
//                     {payment.paymentType === "Funding"
//                       ? `${payment.user?.firstName || "Self"} (Self)`
//                       : payment.recipientBiller?.name ||
//                         (payment.recipientUser
//                           ? `${payment.recipientUser.firstName} ${payment.recipientUser.lastName}`
//                           : "Unknown")}
//                   </td>
//                   <td className="p-2">{payment.recipientBiller?.serviceType || "Others"}</td>
//                   <td className="p-2">{payment.paymentType}</td>
//                   <td className="p-2">${payment.amount.toFixed(2)}</td>
//                   <td className="p-2">{payment.status}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for displaying receipt */}
//       {isModalOpen && selectedTransaction && (
//          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg w-2/5 text-black">
//                       <div className="mb-4 text-center">
//                         <img src={logo} alt="PayWise Logo" className="h-20 mx-auto" />
//                         <h2 className="text-xl font-bold mt-2">Transaction Receipt</h2>
//                       </div>
        
//                       <div id="receipt-content" className="space-y-4 ">
//                         <p>
//                           <strong>Transaction ID:</strong> {selectedTransaction._id}
//                         </p>
//                         <p>
//                           <strong>Payment Reference:</strong>{" "}
//                           {selectedTransaction.transactionRef}
//                         </p>
//                         <p>
//                           <strong>Date:</strong>{" "}
//                           {new Date(selectedTransaction.createdAt).toLocaleDateString()}
//                         </p>
//                         <p>
//                           <strong>Amount:</strong> $
//                           {selectedTransaction.amount.toFixed(2)}
//                         </p>
//                         <p>
//                           <strong>Recipient:</strong>{" "}
//                           {selectedTransaction.paymentType === "Funding"
//                             ? `${selectedTransaction.user?.firstName || "Self"} (Self)`
//                             : selectedTransaction.recipientBiller?.name ||
//                               (selectedTransaction.recipientUser
//                                 ? `${selectedTransaction.recipientUser.firstName} ${selectedTransaction.recipientUser.lastName}`
//                                 : "Unknown")}
//                         </p>
//                         <p>
//                           <strong>Status:</strong> {selectedTransaction.status}
//                         </p>
//                       </div>
//                       <div className="mt-4 flex justify-between">
//                         <button
//                           onClick={downloadReceiptPdf}
//                           className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 cursor-pointer"
//                         >
//                           Download PDF
//                         </button>
//                         <button
//                           onClick={closeModal}
//                           className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:scale-105 cursor-pointer"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//       )}

//       <div className="flex justify-center mt-4 mb-6">
//         <a
//           href="/transactions"
//           className="bg-cyan-700 hover:bg-green-900 text-white px-6 py-2 rounded-lg transition hover:scale-105 border-2bg-cyan-700 flex items-center gap-2 font-semibold "
//         >
//           See All Transactions
//         <ScrollText size={18}/>
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Recent;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/paywise-logo.png";
import { Input, Select, Button } from "antd";
import { jsPDF } from "jspdf";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Recent = () => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axios.get(`${BASE_URL}/payment/history/${userId}`, {
          withCredentials: true,
        });
        const limitedHistory = (response.data.data || []).slice(0, 6);
        setHistory(limitedHistory);
      } catch (error) {
        console.error("Error fetching payment history:", error.response?.data || error.message);
      }
    };

    fetchHistory();
  }, []);

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
    const logoBase64 = await convertToBase64(logo);

    doc.addImage(logoBase64, "PNG", 85, 10, 40, 20);
    doc.setFontSize(18).setFont(undefined, "bold");
    doc.text("Transaction Receipt", 105, 40, { align: "center" });

    doc.setFontSize(12).setFont(undefined, "normal");
    let y = 60;
    const lineHeight = 10;

    const labelStyle = () => doc.setFont(undefined, "bold");
    const valueStyle = () => doc.setFont(undefined, "normal");

    const tx = selectedTransaction;

    labelStyle(); doc.text("Transaction ID:", 20, y);
    valueStyle(); doc.text(tx._id, 70, y); y += lineHeight;

    labelStyle(); doc.text("Payment Reference:", 20, y);
    valueStyle(); doc.text(tx.transactionRef, 70, y); y += lineHeight;

    labelStyle(); doc.text("Date:", 20, y);
    valueStyle(); doc.text(new Date(tx.createdAt).toLocaleDateString(), 70, y); y += lineHeight;

    labelStyle(); doc.text("Amount:", 20, y);
    valueStyle(); doc.text(`$${tx.amount.toFixed(2)}`, 70, y); y += lineHeight;

    labelStyle(); doc.text("Recipient:", 20, y);
    valueStyle();
    const recipient =
      tx.paymentType === "Funding"
        ? `${tx.user?.firstName || "Self"} (Self)`
        : tx.recipientBiller?.name ||
          (tx.recipientUser
            ? `${tx.recipientUser.firstName} ${tx.recipientUser.lastName}`
            : "Unknown");
    doc.text(recipient, 70, y); y += lineHeight;

    labelStyle(); doc.text("Status:", 20, y);
    valueStyle(); doc.text(tx.status, 70, y); y += lineHeight;

    doc.save("receipt.pdf");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (value) => {
    setSortOption(value);
  };

  const handleTransactionClick = (payment) => {
    setSelectedTransaction(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Apply filtering and sorting
  const filteredHistory = history
    .filter((payment) => {
      const recipient =
        payment.recipientBiller?.name ||
        (payment.recipientUser
          ? `${payment.recipientUser.firstName} ${payment.recipientUser.lastName}`
          : "");
      const category = payment.recipientBiller?.serviceType || "";
      const searchText = searchQuery.toLowerCase();
      return (
        recipient.toLowerCase().includes(searchText) ||
        category.toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      if (sortOption === "date-newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "date-oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "amount-highest") return b.amount - a.amount;
      if (sortOption === "amount-lowest") return a.amount - b.amount;
      return 0;
    });

  return (
    <div>
      <div className="w-full text-center">
        <h2 className="text-xl md:text-2xl font-bold p-2">Recent Transactions</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4">
        <Input
          placeholder="Search by recipient or category"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2"
        />

        <Select
          value={sortOption}
          onChange={handleSort}
          className="w-full md:w-1/4"
        >
          <Select.Option value="">Sort By</Select.Option>
          <Select.Option value="date-newest">Date: Newest</Select.Option>
          <Select.Option value="date-oldest">Date: Oldest</Select.Option>
          <Select.Option value="amount-highest">Amount: High to Low</Select.Option>
          <Select.Option value="amount-lowest">Amount: Low to High</Select.Option>
        </Select>
      </div>

      <div className="p-2 m-auto text-center">
        <table className="w-full text-sm md:text-lg border-collapse border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="p-2 border-gray-300">Date</th>
              <th className="p-2 border-gray-300">Recipient</th>
              <th className="p-2 border-gray-300">Category</th>
              <th className="p-2 border-gray-300">Type</th>
              <th className="p-2 border-gray-300">Amount</th>
              <th className="p-2 border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((payment) => (
                <tr
                  key={payment._id}
                  onClick={() => handleTransactionClick(payment)}
                  className="cursor-pointer hover:bg-gray-100 hover:text-black border-b transition-colors"
                >
                  <td className="p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    {payment.paymentType === "Funding"
                      ? `${payment.user?.firstName || "Self"} (Self)`
                      : payment.recipientBiller?.name ||
                        (payment.recipientUser
                          ? `${payment.recipientUser.firstName} ${payment.recipientUser.lastName}`
                          : "Unknown")}
                  </td>
                  <td className="p-2">{payment.recipientBiller?.serviceType || "Others"}</td>
                  <td className="p-2">{payment.paymentType}</td>
                  <td className="p-2">${payment.amount.toFixed(2)}</td>
                  <td className="p-2">{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/5 text-black">
            <div className="text-center mb-4">
              <img src={logo} alt="PayWise Logo" className="h-16 mx-auto" />
              <h2 className="text-xl font-bold mt-2">Transaction Receipt</h2>
            </div>

            <div className="space-y-2 text-sm md:text-base">
              <p><strong>ID:</strong> {selectedTransaction._id}</p>
              <p><strong>Reference:</strong> {selectedTransaction.transactionRef}</p>
              <p><strong>Date:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</p>
              <p><strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}</p>
              <p><strong>Recipient:</strong> {selectedTransaction.recipientBiller?.name || selectedTransaction.recipientUser?.firstName || "Self"}</p>
              <p><strong>Status:</strong> {selectedTransaction.status}</p>
            </div>

            <div className="flex justify-between mt-6">
              <Button onClick={closeModal}>Close</Button>
              <Button type="primary" onClick={downloadReceiptPdf}>Download PDF</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recent;
