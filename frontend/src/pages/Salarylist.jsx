import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get(`${apiUrl}/salaries`);
        setSalaries(response.data);
      } catch (error) {
        console.error('Error fetching salaries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalaries();
  }, []);

  if (loading) return <div>Loading salaries...</div>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Salary Records</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Employee</th>
            <th className="py-2 px-4 border">Month</th>
            <th className="py-2 px-4 border">Basic Salary</th>
            <th className="py-2 px-4 border">Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((salary) => (
            <tr key={salary._id}>
              <td className="py-2 px-4 border">{salary.name}</td>
              <td className="py-2 px-4 border">{salary.month} {salary.year}</td>
              <td className="py-2 px-4 border">${salary.basicSalary}</td>
              <td className="py-2 px-4 border font-bold">${salary.netSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryList;