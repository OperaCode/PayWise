import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/paywise-logo.png"
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const ReceiptPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`/payment/receipt/${transactionId}`);
        setTransaction(response.data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast.error("Error fetching transaction data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  const downloadReceiptPdf = () => {
    if (transaction) {
      const doc = new jsPDF();
      doc.text("Receipt", 20, 20);
      doc.text(`Transaction ID: ${transaction._id || "N/A"}`, 20, 30);
      doc.text(
        `Date: ${transaction.createdAt
          ? new Date(transaction.createdAt).toLocaleDateString()
          : "N/A"}`,
        20,
        40
      );
      doc.text(
        `Amount: $${transaction.amount ? transaction.amount.toFixed(2) : "N/A"}`,
        20,
        50
      );
      doc.text(
        `Recipient: ${transaction.recipientUser?.firstName || "Unknown"}`,
        20,
        60
      );
      doc.text(`Status: ${transaction.status || "N/A"}`, 20, 70);
      doc.save("receipt.pdf");
    }
  };

  const closeReceiptModal = () => {
    navigate(-1); // Go back to previous page
  };

  if (!transaction && !loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-1/3 text-center">
          <p className="text-red-500">Transaction not found.</p>
          <button
            onClick={closeReceiptModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (loading) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-xl">
        {/* Logo Header */}
        <div className="mb-4 text-center">
          <img src={logo} alt="PayWise Logo" className="h-12 mx-auto" />
          <h2 className="text-xl font-bold mt-2">Transaction Receipt</h2>
        </div>

        {/* Receipt Info */}
        <div id="receipt-content" className="space-y-2 text-sm">
          <p><strong>Transaction ID:</strong> {transaction._id || "N/A"}</p>
          <p>
            <strong>Date:</strong>{" "}
            {transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Amount:</strong> $
            {transaction.amount ? transaction.amount.toFixed(2) : "N/A"}
          </p>
          <p>
            <strong>Recipient:</strong>{" "}
            {transaction.recipientUser?.firstName || "Unknown"}
          </p>
          <p><strong>Status:</strong> {transaction.status || "N/A"}</p>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={downloadReceiptPdf}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
          <button
            onClick={closeReceiptModal}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
