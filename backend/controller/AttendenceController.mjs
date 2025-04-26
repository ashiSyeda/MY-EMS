// attendanceController.js
import Attendance from '../models/Attendnce.mjs';
import Employee from '../models/Employee.mjs';

// Unified attendance handler
export const handleAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find the latest attendance record without check-out
    const activeAttendance = await Attendance.findOne({
      employee: employeeId,
      checkOut: null
    }).sort({ checkIn: -1 });

    if (activeAttendance) {
      // If there's an active check-in, perform check-out
      activeAttendance.checkOut = new Date();
      await activeAttendance.save();
      return res.status(200).json({
        message: 'Checked out successfully',
        attendance: activeAttendance
      });
    } else {
      // If no active check-in, perform check-in
      const newAttendance = new Attendance({
        employee: employeeId,
        checkIn: new Date()
      });
      await newAttendance.save();
      return res.status(201).json({
        message: 'Checked in successfully',
        attendance: newAttendance
      });
    }
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance history
export const getAttendanceHistory = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { startDate, endDate } = req.query;

    const query = { employee: employeeId };
    
    if (startDate && endDate) {
      query.checkIn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ checkIn: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default { handleAttendance, getAttendanceHistory };