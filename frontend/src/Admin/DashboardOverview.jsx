import React, { useState, useEffect } from 'react';
import { fetchAllEmployees } from './adminApi';

const DashboardOverview = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchAllEmployees();
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-indigo-700 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-indigo-900">{employees.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-green-700 mb-2">Active Leaves</h3>
          <p className="text-3xl font-bold text-green-900">--</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-yellow-700 mb-2">Pending Approvals</h3>
          <p className="text-3xl font-bold text-yellow-900">--</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
