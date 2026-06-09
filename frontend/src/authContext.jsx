import React, { createContext, useState, useEffect, useContext } from "react";

// Creating Context
const AuthContext = createContext();

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// if the user logedd in or not
export const AuthProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrUser(userId);
    }
  }, []);
  const value = {
    currUser,
    setCurrUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
