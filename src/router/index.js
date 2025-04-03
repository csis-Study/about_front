import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginSelect from '../pages/LoginSelect';
import ClientLogin from '../pages/ClientLogin';
import SystemLogin from '../pages/SystemLogin';

// 使用懒加载的方式导入仪表板组件
const ClientDashboard = React.lazy(() => import('../pages/client/ClientDashboard'));
const AdminDashboard = React.lazy(() => import('../pages/system/AdminDashboard'));
const ManagerDashboard = React.lazy(() => import('../pages/system/ManagerDashboard'));
const RiskOfficerDashboard = React.lazy(() => import('../pages/system/RiskOfficerDashboard'));
const ComplianceOfficerDashboard = React.lazy(() => import('../pages/system/ComplianceOfficerDashboard'));
const AdvisorDashboard = React.lazy(() => import('../pages/system/AdvisorDashboard'));

// 包装私有路由的高阶组件 - 完全使用localStorage验证，不依赖Redux
const PrivateRoute = ({ children, allowedRoles }) => {
  // 简化身份验证逻辑
  // 对于开发阶段，可以直接返回children，跳过验证
  // 注释掉验证代码，以方便开发和测试
  /*
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  
  if (!isAuthenticated) {
    return <Navigate to="/login/system" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login/system" replace />;
  }
  */
  
  return (
    <React.Suspense fallback={<div>加载中...</div>}>
      {children}
    </React.Suspense>
  );
};

const router = [
  {
    path: '/',
    element: <LoginSelect />
  },
  {
    path: '/login/client',
    element: <ClientLogin />
  },
  {
    path: '/login/system',
    element: <SystemLogin />
  },
  {
    path: '/client/*',
    element: (
      <PrivateRoute allowedRoles={['client']}>
        <ClientDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/system/admin/*',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/system/manager/*',
    element: (
      <PrivateRoute allowedRoles={['manager']}>
        <ManagerDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/system/advisor/*',
    element: (
      <PrivateRoute allowedRoles={['advisor']}>
        <AdvisorDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/system/risk/*',
    element: (
      <PrivateRoute allowedRoles={['risk']}>
        <RiskOfficerDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/system/compliance/*',
    element: (
      <PrivateRoute allowedRoles={['compliance']}>
        <ComplianceOfficerDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default router;