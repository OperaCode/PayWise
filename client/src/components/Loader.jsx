import React, { useState, useEffect } from "react";
import loaderGif from "../assets/loader.gif";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000); // Simulate loading
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <img src={loaderGif} alt="Loading..." className="" />
      ) : (
        <h1 className="text-xl font-bold">Content Loaded!</h1>
      )}
    </div>
  );
};

export default Loader;
