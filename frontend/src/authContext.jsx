/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

// Creating Context
const AuthContext = createContext();

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// if the user logedd in or not
export const AuthProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(() => localStorage.getItem("userId"));

  const value = {
    currUser,
    setCurrUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
