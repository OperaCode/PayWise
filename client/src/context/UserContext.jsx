import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
//   const savedUser = localStorage.getItem("user");
//   const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);

const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Get user ID from storage
        if (userId ) { // Fetch only if user is not already set
          const response = await axios.get(`http://localhost:3000/user/${userId}`);
          console.log("Fetched User Data:", response.data); // Debugging
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // Runs only once on mount

  // ✅ Keep localStorage updated when user data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
