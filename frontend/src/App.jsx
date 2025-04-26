import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginPage';
import SignupForm from './pages/signUp';
import Dashboard from './pages/Dashboard';
import SalaryList from './pages/Salarylist';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import LeaveRequest from './pages/LeavePage';
import LeaveHistory from './pages/LeaveHistory';
import LeaveApproval from './Admin/AdminLeave';
import LeavePage from './pages/LeavePage';

import AttendanceWidget from './pages/CheckOut';
import SalaryManagementInner from './pages/SalaryManagementInner';
import AdminPage from './Admin/Adminpage';
import EmployeeSalary from './Admin/EmploySalary';
import DashboardOverview from './Admin/DashboardOverview';
import EmployeesList from './Admin/EmployeesList';
import ReportsSection from './Admin/ReportsSection';
import SettingsPanel from './Admin/SettingsPanel';
import Logout from './pages/Logout';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './components/Home';

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-green-50">
    <Sidebar />
    <main className="flex-1 p-6 md:p-10">
      {children}
    </main>
  </div>
);

const PrivateRoute = ({ children, requiredRole }) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('accessToken');

  if (!token || (requiredRole && userRole !== requiredRole)) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm setUserRole={setUserRole} />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Redirect employee-dashboard to dashboard */}
        <Route path="/employee-dashboard" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout><Profile /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Layout><AttendanceWidget /></Layout>
            </PrivateRoute>
          }
        />
         <Route
          path="/leaves"
          element={
            <PrivateRoute>
              <Layout><LeaveRequest /></Layout>
            </PrivateRoute>
          }
        />
         <Route
          path="/leaves1"
          element={
            <PrivateRoute>
              <Layout><LeaveHistory /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <PrivateRoute>
              <Layout><LeavePage /></Layout>
            </PrivateRoute>
          }
        />
<Route path='/salary' element={<PrivateRoute><SalaryManagementInner /></PrivateRoute>}/>
        {/* Salary Routes */}
        <Route
          path="/salarylist"
          element={
            <PrivateRoute>
              <Layout><SalaryList /></Layout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <Layout>
                {/* Render AdminPage without AdminDashboard to avoid duplicate portal */}
                <AdminPage />
              </Layout>
            </PrivateRoute>
          }
        >
          {/* Only keep DashboardOverview and other child routes */}
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="employees" element={<EmployeesList />} />
          <Route path="leaves" element={<LeaveApproval />} />
          <Route path="salary" element={<EmployeeSalary />} />
          <Route path="reports" element={<ReportsSection />} />
          <Route path="settings" element={<SettingsPanel />} />
          <Route path="employee-salary" element={<SalaryManagementInner />} />
          <Route path="employee-salary/:employeeId" element={<EmployeeSalary />} />
          <Route
            path="leaves2"
            element={
              <PrivateRoute>
                <Layout><LeaveApproval /></Layout>
              </PrivateRoute>
            }
          />
        </Route>

        {/* Logout Route */}
        <Route
          path="/logout"
          element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
