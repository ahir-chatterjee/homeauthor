import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || {};
    setUser(savedUser);
  }, []);

  const setUserAndStore = (newUser) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserAndStore }}>
      {children}
    </UserContext.Provider>
  );
}
