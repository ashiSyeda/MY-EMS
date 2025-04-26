import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase } from 'lucide-react';
import { fetchAllEmployees } from './adminApi';

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
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
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Employees</h2>
      {employees.length === 0 ? (
        <div className="text-gray-500">No employees found.</div>
      ) : (
        <ul className="space-y-4">
          {employees.map((employee) => (
            <li
              key={employee._id}
              onClick={() => setSelectedEmployeeId(employee._id)}
              className={`cursor-pointer p-4 rounded-lg border transition-shadow ${
                selectedEmployeeId === employee._id
                  ? 'bg-indigo-100 border-indigo-500 shadow-md'
                  : 'border-gray-200 hover:shadow hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <User className="w-8 h-8 text-indigo-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{employee.position}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{employee.email}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{employee.contact || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeesList;
