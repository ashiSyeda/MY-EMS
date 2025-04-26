import Leave from '../models/Leave.mjs';
import Employee from '../models/Employee.mjs';

// Employee submits leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, leaveType, reason } = req.body;
    
    const leave = new Leave({
      employee: employeeId,
      startDate,
      endDate,
      leaveType,
      reason
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get leave requests for employee
export const getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin gets all pending leave requests
export const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'pending' })
      .populate('employee', 'name position department')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin approves/rejects leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, adminComment },
      { new: true }
    ).populate('employee', 'name email');
    
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    res.json(leave);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};