import React, { useContext, useState, useEffect } from "react";

const ReceiptModal = (closeReceiptModal) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Download receipt as PDF
  const downloadReceiptPdf = () => {
    const doc = new jsPDF();
    doc.text(`Transaction ID: ${selectedTransaction._id}`, 10, 10);
    doc.text(
      `Date: ${new Date(selectedTransaction.createdAt).toLocaleDateString()}`,
      10,
      20
    );
    doc.text(`Amount: $${selectedTransaction.amount.toFixed(2)}`, 10, 30);
    doc.text(
      `Recipient: ${selectedTransaction.recipientUser?.firstName || "Unknown"}`,
      10,
      40
    );
    doc.text(`Status: ${selectedTransaction.status}`, 10, 50);
    doc.save("receipt.pdf");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <div className="mb-4 text-center">
          <img src={logo} alt="PayWise Logo" className="h-12 mx-auto" />
          <h2 className="text-xl font-bold mt-2">Transaction Receipt</h2>
        </div>

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
            <strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}
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
  );
};

export default ReceiptModal;
