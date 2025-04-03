import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdvisorDashboard from './pages/system/AdvisorDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import RiskOfficerDashboard from './pages/system/RiskOfficerDashboard';
import ComplianceOfficerDashboard from './pages/system/ComplianceOfficerDashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* 系统用户路由 */}
      <Route path="/system/advisor-dashboard" element={<AdvisorDashboard />} />
      <Route path="/system/risk-dashboard" element={<RiskOfficerDashboard />} />
      <Route path="/system/compliance-dashboard" element={<ComplianceOfficerDashboard />} />
      
      {/* 客户路由 */}
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      
      {/* 旧路由 - 保留向后兼容性 */}
      <Route path="/advisor" element={<AdvisorDashboard />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/risk" element={<RiskOfficerDashboard />} />
      <Route path="/compliance" element={<ComplianceOfficerDashboard />} />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
