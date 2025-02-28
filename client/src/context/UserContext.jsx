import React, { createContext, useEffect, useState } from "react";
import axios from "axios"; // ✅ Import axios

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const savedUser = localStorage.getItem("user"); // ✅ Fetch from local storage
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null); // ✅ Initialize state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId"); // ✅ Get user ID
        if (userId && !user) { // ✅ Only fetch if user doesn't exist in state
          const response = await axios.get(`http://localhost:3000/user/${userId}`);
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data)); // ✅ Save user data
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // ✅ Run once when component mounts

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
