import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [globalUser, setGlobalUser] = useState(null);

  return (
    <UserContext.Provider value={{ globalUser, setGlobalUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
