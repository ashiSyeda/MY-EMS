import React from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear user data and token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      // Redirect to login page
      navigate('/login');
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8 text-center">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Logging out...</h1>
    </div>
  );
};

export default Logout;
