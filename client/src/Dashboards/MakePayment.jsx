import React from "react";
import { Eye, CirclePlus } from "lucide-react";
import Graph from "../charts/PieChart";

const MakePayment = () => {
  return (
    <div className="px-10 lg">
      <div>
        {/* Top Bar */}
        <div className="flex  p-4 justify-between items-center">
          <h1 className="font-bold  text-xl ">Create Invoice</h1>
          <div className="flex gap-4 justify-between  ">
            <button className="hover:cursor-pointer w-30 justify-center h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-xs font-semibold hover:bg-cyan-600 transition hover:cursor">
              <Eye /> Preview
            </button>
            <button className="hover:cursor-pointer w-30 justify-center h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-xs font-semibold hover:bg-cyan-600 transition hover:cursor">
              Approve
            </button>
          </div>
        </div>

        {/* Invoice container */}
        <div className="">
          <div className="flex justify-between items-center w-full px-10">
            <h1 className=" text-md md:text-lg font-bold">Invoice Details</h1>
            <h1 className=" text-md md:text-lg font-bold">Currency: USD</h1>
          </div>
          <div className="lg:flex justify-between items-center  p-2">
            <div className="lg:flex-1 p-4 space-y-4">
              <div className="border p-4 items-center rounded-sm flex gap-1 w-70 hover:cursor-pointer">
                <CirclePlus />
                Add Biller
              </div>
              <div>
                <label htmlFor="VendorId">Biller ID</label>
                <br />
                <input
                  type="text"
                  placeholder="Choose Biller"
                  className="p-1  rounded-lg  border-2 border-neutral-300 shadow-md"
                />
              </div>
            </div>
            <div className="lg:flex-1 p-4 ">
              <form action="" className="space-y-4">
                <label htmlFor="invoiceNumber">Invoice Number/Reference:</label>
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  className="p-1 w-md rounded-lg  border-2 border-neutral-300 shadow-md"
                  placeholder="Invoice Reference Number"
                />
                <br />

                <label htmlFor="dueDate">Due Date:</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="p-1 w-md rounded-lg  border-2 border-neutral-300 shadow-md"
                />
                <br />

                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="p-1 w-md rounded-lg  border-2 border-neutral-300 shadow-md"
                />
                <br />

                <button
                  type="submit"
                  className="hover:cursor-pointer h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-xs font-semibold hover:bg-cyan-600 transition hover:cursor m-auto w-xs text-center justify-center"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
      <Graph/>
      </div>
    </div>
  );
};

export default MakePayment;
