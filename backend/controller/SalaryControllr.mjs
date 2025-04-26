import Salary from '../models/Salary.mjs';

// Add new salary record
export const addSalary = async (req, res) => {
  try {
    const { employeeId, name, month, year, basicSalary, allowances, deductions } = req.body;
    
    // Calculate net salary
    const netSalary = basicSalary + allowances - deductions;
    
    const newSalary = new Salary({
      employeeId,
      name,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary
    });

    await newSalary.save();
    res.status(201).json(newSalary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all salaries
export const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ year: -1, month: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get salaries by employee
export const getEmployeeSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({ employeeId: req.params.employeeId });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

