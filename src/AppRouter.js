import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/LoginUser';
import LoginSystem from './pages/Login/LoginSystem';
import ClientsPage from './pages/Layout/ClientHome';
import AdvisorPage from './pages/Layout/AdvisorHome';
import RiskOfficerPage from './pages/Layout/RiskOfficerHome';
import ComplianceOfficerPage from './pages/Layout/ComplianceOfficerHome';
import AdminPage from './pages/Layout/AdminHome';
import AuthGuard from './components/AuthGuard';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/client-login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/system-login" element={<LoginSystem />} />
        <Route
          path="/clients"
          element={
            <AuthGuard>
              <ClientsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/advisor"
          element={
            <AuthGuard>
              <AdvisorPage />
            </AuthGuard>
          }
        />
        <Route
          path="/risk-officer"
          element={
            <AuthGuard>
              <RiskOfficerPage />
            </AuthGuard>
          }
        />
        <Route
          path="/compliance-officer"
          element={
            <AuthGuard>
              <ComplianceOfficerPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminPage />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;