import React, { createContext, useEffect, useState } from 'react'


export const UserContext = createContext();
const savedUser = localStorage.getItem("user");

const defaultUser = savedUser ? JSON.parse(savedUser) : null;

const UserProvider = ({children}) => {
  const [user, setUser] = useState(defaultUser);

  useEffect(()=>{
    if(user){
      localStorage.setItem("user",JSON.stringify(user));
    }else{
      localStorage.removeItem("user");
    }
  }, [user]);

  return <UserContext.Provider value={{user,setUser}}> {children} </UserContext.Provider>;
  
}

export default UserProvider