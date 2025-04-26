import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { api } from './adminApi';

// Removed import of AdminDashboard to avoid duplicate portal
// import AdminDashboard from '../Admin/AdminDashbord';

const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api.get('isAdmin');
        if (!response.data.isAdmin) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Admin check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  // Render Outlet to render child routes including DashboardOverview
  return <React.Fragment><Outlet /></React.Fragment>;
};

export default AdminPage;
