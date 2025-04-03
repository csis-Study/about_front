import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginSelect from './pages/LoginSelect';
import ClientLogin from './pages/ClientLogin';
import SystemLogin from './pages/SystemLogin';
import ClientDashboard from './pages/ClientDashboard';
import SystemDashboard from './pages/SystemDashboard';
import PrivateRoute from './components/PrivateRoute';

const AppRouter = () => {
  return (
    <Routes>
      {/* 登录相关路由 */}
      <Route path="/" element={<LoginSelect />} />
      <Route path="/login/client" element={<ClientLogin />} />
      <Route path="/login/system" element={<SystemLogin />} />

      {/* 受保护的路由 */}
      <Route
        path="/client/*"
        element={
          <PrivateRoute allowedRoles={['client']}>
            <ClientDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/system/*"
        element={
          <PrivateRoute allowedRoles={['admin', 'manager', 'advisor', 'analyst']}>
            <SystemDashboard />
          </PrivateRoute>
        }
      />

      {/* 默认重定向到登录选择页面 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;