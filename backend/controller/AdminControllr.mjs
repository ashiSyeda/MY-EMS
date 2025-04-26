// controllers/adminController.js
import Employee from '../models/Employee.mjs';
import Salary from '../models/Salary.mjs';

// View all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee' });
  }
};

// Update an existing employee
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee' });
  }
};
// Get salary for a specific employee
  
// Update salary for an employee

export default{getAllEmployees,createEmployee,updateEmployee}