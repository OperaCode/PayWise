import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;

// const savedUser = localStorage.getItem("user");
// const defaultUser = savedUser ? JSON.parse(savedUser) : null;

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // to fetch user using token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(`${BASE_URL}/user/client`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(response.data.user);
        console.log(respose.data);
      } catch (error) {
        console.error("Failed to refresh user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);



// Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);



  return (
    <UserContext.Provider value={{ user, setUser,  }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
