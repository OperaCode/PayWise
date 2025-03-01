import React, { useState } from "react";

const ManageBillers = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="p-4 flex-1 justify-center">
      <div className="">
        <div className="text-center">
          <h2 className="text-2xl  text-cyan-900 mb-1 font-extrabold">
            Add Biller
          </h2>
          <p className="mb-1">Hello Chief! Let’s get you started</p>
          <p className="py-2 ">Enter Biller Information</p>
        </div>
        <form
          // onSubmit={handleSubmit}
          className="space-y-4 flex flex-col"
        >
          <label htmlFor="Name">
            Biller Full Name(same as on receiving account)
          </label>
          <input
            type="text"
            name="Name"
            placeholder="Biller Name"
            // value={formData.firstName}
            // onChange={handleChange}
            className="w-md p-1 rounded-xl  border-4 border-neutral-500 shadow-lg"
            required
          />

          <label htmlFor="category">Choose Biller Category</label>
          <select
            name="category"
            id=""
            className="w-md p-1 rounded-xl  border-4 border-neutral-500 shadow-lg"
          >
            <option value="">---Select Category---</option>
            <option value="">Vendor</option>
            <option value="">Beneficiary</option>
          </select>

          <label htmlFor="">Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            // value={formData.lastName}
            // onChange={handleChange}
            className="w-md p-1 rounded-xl  border-4 border-neutral-500 shadow-lg"
            required
          />

          <label htmlFor=""></label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            // value={formData.email}
            // onChange={handleChange}
            className="w-md p-1 rounded-xl text-white border-4 border-neutral-500 shadow-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            // value={formData.password}
            // onChange={handleChange}
            className="w-md p-1 rounded-xl  border-4 border-neutral-500 shadow-lg"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            // value={formData.confirmPassword}
            // onChange={handleChange}
            className="w-md p-1 rounded-xl  border-4 border-neutral-500 shadow-lg"
            required
          />

          {/* Display error message */}
          {/* {formValidMessage && <p className="text-red-600">{formValidMessage}</p>} */}

          <div className="flex justify-center">
            <button
              type="submit"
              // disabled={isSubmitting}
              // onClick={handleSubmit}
              className="w-xs border-4 border-neutral-500 shadow-lg py-1 rounded-3xl font-semibold hover:bg-green-900 hover:text-white hover:cursor-pointer transition"
            >
              {loading ? "Registering..." : "Let's get started"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageBillers;
