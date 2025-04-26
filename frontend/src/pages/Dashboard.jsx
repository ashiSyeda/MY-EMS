import React from 'react';
import { Users, Calendar, FileText, BarChart } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
          <Users className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-xl font-semibold text-gray-900">--</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
          <Calendar className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Active Leaves</p>
            <p className="text-xl font-semibold text-gray-900">--</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
          <FileText className="w-10 h-10 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <p className="text-xl font-semibold text-yellow-900">--</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
          <BarChart className="w-10 h-10 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Reports</p>
            <p className="text-xl font-semibold text-gray-900">--</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
