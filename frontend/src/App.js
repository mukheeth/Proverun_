import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FilterProvider } from '@/contexts/FilterContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/sonner';

// Pages
import LoginPage from '@/pages/LoginPage';
import ExecutiveDashboard from '@/pages/ExecutiveDashboard';
import SalesDashboard from '@/pages/SalesDashboard';
import ClinicalDetailView from '@/pages/ClinicalDetailView';
import MarketAccessVAC from '@/pages/MarketAccessVAC';
import OperationsSupplyChain from '@/pages/OperationsSupplyChain';
import FinanceRevenue from '@/pages/FinanceRevenue';
import NotificationsCenter from '@/pages/NotificationsCenter';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import EnrollmentsPage from '@/pages/EnrollmentsPage';
import PatientsPage from '@/pages/PatientsPage';
import PhysiciansPage from '@/pages/PhysiciansPage';
import InvoicesPage from '@/pages/InvoicesPage';
import VACRequestsPage from '@/pages/VACRequestsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      const hasStoredAuth = checkAuth();
      if (!hasStoredAuth) {
        navigate('/login', { state: { from: location } });
      }
    }
  }, [isAuthenticated, checkAuth, navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

// App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes with App Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FilterProvider>
              <AppLayout />
            </FilterProvider>
          </ProtectedRoute>
        }
      >
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Pages */}
        <Route path="dashboard" element={<ExecutiveDashboard />} />
        <Route path="sales" element={<SalesDashboard />} />
        <Route path="clinical" element={<ClinicalDetailView />} />
        <Route path="vac" element={<MarketAccessVAC />} />
        <Route path="operations" element={<OperationsSupplyChain />} />
        <Route path="finance" element={<FinanceRevenue />} />
        
        {/* Data Entry & Management Pages */}
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="physicians" element={<PhysiciansPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="vac-requests" element={<VACRequestsPage />} />
        
        {/* Supporting Pages */}
        <Route path="notifications" element={<NotificationsCenter />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
