import React from "react";
import { Eye, CirclePlus } from "lucide-react";
import Graph from "../charts/PieChart";
import BarChart from "../charts/BarChart";

const MakePayment = () => {
  return (
    <div className="px-10 lg">
      <div>
        {/* Top Bar */}
        <div className="flex  p-4 justify-between items-center">
          <h1 className="font-bold  text-xl ">Create Invoice</h1>
          {/* <div className="flex gap-4 justify-between  ">
            <button className="hover:cursor-pointer w-30 justify-center h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-xs font-semibold hover:bg-cyan-600 transition hover:cursor">
              <Eye /> Preview
            </button>
            <button className="hover:cursor-pointer w-30 justify-center h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-xs font-semibold hover:bg-cyan-600 transition hover:cursor">
              Approve
            </button>
          </div> */}
        </div>

        {/* Invoice container */}
        <div className="">
          <div className="flex justify-between items-center w-full px-16">
            <h1 className=" text-md md:text-lg font-bold">Invoice Details</h1>
            <h1 className=" text-md md:text-lg font-bold">Currency: USD</h1>
          </div>
          <div className="lg:flex justify-between   p-2">
            <div className="lg:flex-1 p-4 space-y-4 items-center">
              <div className="border p-4 items-center rounded-sm flex gap-1 w-70 hover:cursor-pointer">
                <CirclePlus />
                Add Biller
              </div>
              <div>
                <label htmlFor="VendorId" className="font-bold">Biller ID</label><br />
                <br />
                <input
                  type="text"
                  placeholder="Choose Biller"
                  className="p-1 font-bold rounded-lg w-sm border-2 border-neutral-300 shadow-md"
                />
              </div>
            </div>
            <div className="lg:flex-1 ">
              <form action="" className="space-y-4"><br />
                <label htmlFor="invoiceNumber" className="font-bold">Invoice Number/Reference:</label>
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  className="p-1 w-sm rounded-lg  border-2 border-neutral-300 shadow-md"
                  placeholder="Invoice Reference Number"
                />
                <br />

                <label htmlFor="dueDate" className="font-bold">Due Date:</label><br />
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="p-1 w-sm rounded-lg  border-2 border-neutral-300 shadow-md"
                />
                <br />

                <label htmlFor="amount" className="font-bold">Amount:</label><br />
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="p-1 w-sm rounded-lg  border-2 border-neutral-300 shadow-md"
                />
                <br />

                {/* <button
                  type="submit"
                  className="hover:cursor-pointer h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-xs font-semibold hover:bg-cyan-600 transition hover:cursor m-auto w-xs text-center justify-center"
                >
                  Submit
                </button> */}
                <div className="flex gap-4 justify-center w-sm p-2">
                  <button className="hover:cursor-pointer w-30 justify-center font-bold  h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-sm  hover:bg-cyan-600 transition hover:cursor">
                    <Eye /> Preview
                  </button>
                  <button className="hover:cursor-pointer w-30 justify-center font-bold  h-10 bg-cyan-800 text-white flex p-2 items-center rounded-xl text-sm  hover:bg-cyan-600 transition hover:cursor">
                    Approve
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-4xl m-auto">
        <BarChart />
      </div>
    </div>
  );
};

export default MakePayment;
