import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

const ReceiptPage = () => {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`/payment/receipt/${transactionId}`);
                setTransaction(response.data);
            } catch (error) {
                console.error("Error fetching transaction:", error);
                toast.error("Error fetching transaction data.");
            }
        };
        fetchTransaction();
    }, [transactionId]);

    const downloadReceiptPdf = () => {
        const doc = new jsPDF();
        doc.text("Receipt", 20, 20);
        doc.text(`Transaction ID: ${transaction?._id}`, 20, 30);
        doc.text(`Date: ${new Date(transaction?.createdAt).toLocaleDateString()}`, 20, 40);
        doc.text(`Amount: $${transaction?.amount.toFixed(2)}`, 20, 50);
        doc.text(`Recipient: ${transaction?.recipientUser?.firstName || "Unknown"}`, 20, 60);
        doc.text(`Status: ${transaction?.status}`, 20, 70);
        doc.save("receipt.pdf");
    };

    const printReceipt = () => {
        const content = document.getElementById("receipt-content");
        const printWindow = window.open("", "", "height=400,width=800");
        printWindow.document.write("<html><head><title>Receipt</title></head><body>");
        printWindow.document.write(content.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
    };

    if (!transaction) return <div>Loading...</div>;

    return (
        <div>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Receipt</h1>
                <div className="flex justify-end gap-2 mb-4">
                    <button
                        onClick={downloadReceiptPdf}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Export as PDF
                    </button>
                    <button
                        onClick={printReceipt}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Print
                    </button>
                </div>
                <div id="receipt-content">
                    <h2>Transaction ID: {transaction._id}</h2>
                    <p>Date: {new Date(transaction.createdAt).toLocaleDateString()}</p>
                    <p>Amount: ${transaction.amount.toFixed(2)}</p>
                    <p>Recipient: {transaction.recipientUser?.firstName || "Unknown"}</p>
                    <p>Status: {transaction.status}</p>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;
