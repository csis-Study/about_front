// import React, { createContext, useContext, useState } from 'react';

// const UserContext = createContext();

// const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// const useUser = () => {
//     return useContext(UserContext);
// };

// export { UserProvider, useUser };

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