import { signup, login, logout, getDashboard, getProfile, updateProfile, refreshToken, checkAdminStatus } from "../controller/userController.mjs";
import { createLeaveRequest, getEmployeeLeaves, getPendingLeaves, updateLeaveStatus } from '../controller/LeaveController.mjs';
import { handleAttendance, getAttendanceHistory } from '../controller/AttendenceController.mjs';

import { getAllEmployees, createEmployee, updateEmployee } from "../controller/AdminControllr.mjs";

// Fixed typo in 'SalaryControllr.mjs'
import { tokenVerification, isAdmin } from "../Middleware/tokenVerification.mjs"; 

import { Router } from "express";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", tokenVerification, logout);

// New refresh token route
router.post("/refresh-token", refreshToken);

 // Protected routes
router.get("/dashboard", tokenVerification, getDashboard);
router.get("/profile", tokenVerification, getProfile);
router.put("/profile", tokenVerification, updateProfile);

// Leave routes
router.post('/leaves', tokenVerification, createLeaveRequest);
router.get('/leaves/employee/:employeeId', tokenVerification, getEmployeeLeaves);

// Admin routes
router.get('/leaves/pending', tokenVerification, isAdmin, getPendingLeaves);
router.put('/leaves/:id/status', tokenVerification, isAdmin, updateLeaveStatus); 

// Attendance routes
router.post('/attendance', tokenVerification, handleAttendance);
router.get('/attendance/history', tokenVerification, getAttendanceHistory);

// Salary routes

// Employee-specific routes

router.get('/employees', tokenVerification, isAdmin, getAllEmployees);
router.post('/employees', tokenVerification, isAdmin, createEmployee);
router.put('/employees/:id', tokenVerification, isAdmin, updateEmployee);
router.get('/isAdmin', tokenVerification, checkAdminStatus);

import Salary from '../models/Salary.mjs';

// Get salary for a specific employee by their ID
router.get('/employees/:id/salary', tokenVerification, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findOne({ employee: id });

    if (!salary) {
      return res.status(404).json({ message: 'Salary not found for this employee' });
    }

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching salary details' });
  }
});

// Update salary for a specific employee
router.put('/employees/:id/salary', tokenVerification, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const salaryData = req.body;

    let salary = await Salary.findOne({ employee: id });

    if (salary) {
      salary = await Salary.findOneAndUpdate(
        { employee: id },
        { $set: salaryData },
        { new: true }
      );
    } else {
      salary = new Salary({ employee: id, ...salaryData });
      await salary.save();
    }

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: 'Error updating salary' });
  }
});

export default router;
