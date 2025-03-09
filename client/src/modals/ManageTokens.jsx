// import React from 'react'

// const modals = () => {
//   return (
//     <div>

//     </div>
//   )
// }

// export default modals

import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./css"

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ManageTokens = ({ onAddTransaction, onClose }) => {
  const [addExpense, setAddExpense] = useState({
    title: "",
    amount: "",
    category: "",
    method: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddExpense((prevExpense) => ({ ...prevExpense, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, category, method } = addExpense;
    if (!title || !amount || !category || !method) {
      toast.error("Oops, all fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/expense/createExpense`,
        addExpense,
        { withCredentials: true }
      );
      if (response?.data) {
        onAddTransaction(response.data);
        toast.success("Expense added successfully");
        setAddExpense({ title: "", amount: "", category: "", method: "" }); // Reset form
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-indigo-800 rounded-lg shadow-lg lg:w-96 p-8 border-2 border-white">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-white mb-1"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Add Title"
              className="w-full px-2 py-2 border-b-2 border-gray-300 rounded bg-indigo-500 text-white"
              onChange={handleInputChange}
              value={addExpense.title}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-white mb-1"
            >
              Category:
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-2 py-2 border-b-2 border-gray-300 rounded bg-indigo-500 text-white"
              onChange={handleInputChange}
              value={addExpense.category}
            >
              <option value="" className="text-black">
                Select Category
              </option>
              <option value="Food and groceries" className="text-black">
                Food and Groceries
              </option>
              <option value="Transportation" className="text-black">
                Transportation
              </option>
              <option value="Utilities" className="text-black">
                Utilities
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="method"
              className="block text-sm font-medium text-white mb-1"
            >
              Method:
            </label>
            <select
              id="method"
              name="method"
              className="w-full px-2 py-2 border-b-2 border-gray-300 rounded bg-indigo-500 text-white"
              onChange={handleInputChange}
              value={addExpense.method}
            >
              <option value="" className="text-black">
                Select Method
              </option>
              <option value="Bank Transfer" className="text-black">
                Bank Transfer
              </option>
              <option value="Cash" className="text-black">
                Cash
              </option>
              <option value="Credit Card" className="text-black">
                Credit Card
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-white mb-1"
            >
              Amount:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <input
                id="amount"
                name="amount"
                type="number"
                className="w-full pl-8 px-2 py-2 border-b-2 border-gray-300 rounded bg-indigo-500 text-white"
                placeholder="0.00"
                onChange={handleInputChange}
                value={addExpense.amount}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTokens;
