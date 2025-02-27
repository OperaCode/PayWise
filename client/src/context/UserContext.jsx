
import React, { createContext, useEffect, useState } from 'react'


export const UserContext = createContext();
const savedUser = localStorage.getItem("user");

const UserProvider = ({children}) => {  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Assuming you store userId in local storage
        if (userId) {
          const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={{user,setUser}}> {children} </UserContext.Provider>;
  
};

export default UserProvider