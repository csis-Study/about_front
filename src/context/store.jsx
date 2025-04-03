import React, { createContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const id = localStorage.getItem("id");
    if (token && role && isLoggedIn && id) {
      setUser({ token, role, id });
    }
    if (token && role && isLoggedIn) {
      setUser({ token, role, id });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };