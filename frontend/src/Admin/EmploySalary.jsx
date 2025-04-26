import React, { useState, useEffect } from 'react';
import { fetchEmployeeSalary, updateEmployeeSalary } from './adminApi';

const EmployeeSalary = ({ employeeId }) => {
  const [salary, setSalary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    basicSalary: '',
    allowances: '',
    bonuses: '',
    taxDeductions: '',
    insurance: '',
    month: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch salary for the specific employee
  useEffect(() => {
    const getSalary = async () => {
      try {
        const data = await fetchEmployeeSalary(employeeId);
        setSalary(data);
        setForm({
          basicSalary: data.basicSalary !== undefined ? data.basicSalary : '',
          allowances: data.allowances !== undefined ? data.allowances : '',
          bonuses: data.bonuses !== undefined ? data.bonuses : '',
          taxDeductions: data.taxDeductions !== undefined ? data.taxDeductions : '',
          insurance: data.insurance !== undefined ? data.insurance : '',
          month: data.month || ''
        });
      } catch (error) {
        console.error("Error fetching salary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSalary();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  // Handle salary update
  const handleSalaryUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatedSalary = await updateEmployeeSalary(employeeId, {
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances),
        bonuses: Number(form.bonuses),
        taxDeductions: Number(form.taxDeductions),
        insurance: Number(form.insurance),
        month: form.month
      });
      setSalary(updatedSalary);
      alert('Salary updated successfully');
    } catch (error) {
      console.error("Error updating salary:", error);
      alert('Failed to update salary');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h2>Employee Salary</h2>

      {isLoading ? (
        <p>Loading salary...</p>
      ) : (
        <form onSubmit={handleSalaryUpdate}>
          <div>
            <label>Basic Salary:</label>
            <input
              type="number"
              name="basicSalary"
              value={form.basicSalary}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Allowances:</label>
            <input
              type="number"
              name="allowances"
              value={form.allowances}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Bonuses:</label>
            <input
              type="number"
              name="bonuses"
              value={form.bonuses}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Tax Deductions:</label>
            <input
              type="number"
              name="taxDeductions"
              value={form.taxDeductions}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Insurance:</label>
            <input
              type="number"
              name="insurance"
              value={form.insurance}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Month:</label>
            <input
              type="text"
              name="month"
              value={form.month}
              onChange={handleChange}
              placeholder="e.g., Apr-2025"
              required
            />
          </div>
          <div>
            <p>Net Salary: {salary ? salary.netSalary : 'N/A'}</p>
          </div>
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Salary'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmployeeSalary;
