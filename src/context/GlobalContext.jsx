import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

function GlobalProvider({ children }) {
 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    backendUrl,
    
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}

function useGlobal() {
  const context = useContext(GlobalContext);
  return context;
}

export { GlobalProvider, useGlobal };