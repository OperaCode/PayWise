import React, { createContext, useState, useEffect } from "react";
import loaderGif from "../assets/loader.gif";

export const LoaderContext = createContext();

const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false); // Default: Not loading

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {loading && ( // Show loader only when loading is true
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-100 bg-opacity-80">
          <img src={loaderGif} alt="Loading..." className="w-24 h-24" />
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;
