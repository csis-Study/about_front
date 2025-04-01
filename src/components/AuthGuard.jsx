// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// const AuthGuard = ({ children }) => {
//   const location = useLocation();
//   const token = localStorage.getItem('token');

//   if (!token) {
//     return <Navigate to="/client-login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default AuthGuard;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 从 localStorage 中获取用户角色

  // if (!token) {
  //   return <Navigate to="/client-login" state={{ from: location }} replace />;
  // }

  // 定义不同角色允许访问的页面
  const allowedRoutes = {
    advisor: ['/advisor'],
    risk: ['/risk-officer'],
    approval: ['/compliance-officer'],
    admin: ['/admin'],
    client: ['/clients']
  };

  // // 检查用户角色是否有权限访问当前页面
  // if (role && allowedRoutes[role] &&!allowedRoutes[role].includes(location.pathname)) {
  //   return <Navigate to="/client-login" state={{ from: location }} replace />;
  // }

  return children;
};

export default AuthGuard;