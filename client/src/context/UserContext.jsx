import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const savedUser = localStorage.getItem("user");
const defaultUser = savedUser ? JSON.parse(savedUser) : null;

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Refresh user data from backend
  const refreshUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/${UserId}`, {
        withCredentials: true, // If you're using cookies/sessions
      });
      setUser(res.data); // Update the context with fresh data
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
