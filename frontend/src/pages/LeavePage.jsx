import React, { useState, useEffect } from 'react';
import { Umbrella, Calendar, Clock, MessageSquare, Send } from 'lucide-react';
import { api } from '../Admin/adminApi';
import LeaveHistory from './LeaveHistory';

const LeaveRequest = ({ employeeId, onLeaveSubmitted }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'vacation',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('leaves', { ...formData, employeeId: employeeId });
      setSuccess(true);
      setFormData({
        startDate: '',
        endDate: '',
        leaveType: 'vacation',
        reason: ''
      });
      setTimeout(() => setSuccess(false), 3000);
      if (onLeaveSubmitted) {
        onLeaveSubmitted();
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError(error.response?.data?.error || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Umbrella className="mr-2 text-blue-500" /> Request Leave
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Leave request submitted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="mr-1 w-4 h-4" /> Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="mr-1 w-4 h-4" /> End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Clock className="mr-1 w-4 h-4" /> Leave Type
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal</option>
            <option value="bereavement">Bereavement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <MessageSquare className="mr-1 w-4 h-4" /> Reason
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          {submitting ? 'Submitting...' : (
            <>
              <Send className="mr-2 w-4 h-4" /> Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const LeavePage = () => {
  const [employeeId, setEmployeeId] = React.useState(null);
  const [refreshHistory, setRefreshHistory] = React.useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('dashboard');
        setEmployeeId(response.data._id);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleLeaveSubmitted = () => {
    setRefreshHistory((prev) => !prev);
  };

  return (
    <div>
      <LeaveRequest employeeId={employeeId} onLeaveSubmitted={handleLeaveSubmitted} />
      {employeeId && <LeaveHistory key={refreshHistory} employeeId={employeeId} />}
    </div>
  );
};

export default LeavePage;




