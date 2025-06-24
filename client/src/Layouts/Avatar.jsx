import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Avatar = ({ name = "", imageUrl, size = "w-14 h-14", loading = false }) => {
  const getInitial = (name) => name.charAt(0).toUpperCase();
  const [loaded, setLoaded] = useState(false);

  const getColorClass = (name) => {
    const colors = [
      "bg-red-600",
      "bg-blue-600",
      "bg-green-600",
      "bg-yellow-500",
      "bg-purple-600",
      "bg-pink-500",
      "bg-indigo-600",
      "bg-rose-500",
      "bg-orange-500",
    ];
    if (!name) return "bg-gray-400";
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const showSpinner = loading || (!loaded && imageUrl);

  return imageUrl ? (
    <div className={`relative ${size} rounded-full border-2 overflow-hidden cursor-pointer bg-gray-200`}>
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
          <ClipLoader size={20} color="#16a34a" />
        </div>
      )}

      <img
        src={imageUrl}
        alt="Avatar"
        className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${
          loaded && !loading ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  ) : (
    <div
      className={`${size} ${getColorClass(
        name
      )} rounded-full text-white flex items-center justify-center font-semibold text-xl cursor-pointer`}
    >
      {getInitial(name)}
    </div>
  );
};

export default Avatar;
