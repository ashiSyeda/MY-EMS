import React, { useState, useEffect } from 'react';
import { fetchLoggedInUserProfile } from './adminApi';
import { Bell, Search, User, Plus, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchLoggedInUserProfile();
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };
    loadUserProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="relative w-64 max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="relative text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {userProfile && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{userProfile.name}</p>
                    <p className="text-xs text-gray-500">{userProfile.position}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 flex-1 overflow-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{location.pathname.split('/').pop()}</h2>
              <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
