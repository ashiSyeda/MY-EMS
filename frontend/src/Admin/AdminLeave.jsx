import React, { useState, useEffect } from 'react';
import { api } from './adminApi';
import { Check, X, Clock, User, Calendar, MessageSquare } from 'lucide-react';

const LeaveApproval = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      const response = await api.get('leaves/pending');
      if (Array.isArray(response.data)) {
        setPendingLeaves(response.data);
      } else {
        console.error('Unexpected data format for pending leaves:', response.data);
        setPendingLeaves([]);
      }
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      setPendingLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionChange = (leaveId, value) => {
    setDecision({ ...decision, [leaveId]: value });
  };

  const handleCommentChange = (leaveId, comment) => {
    setDecision({ ...decision, [leaveId]: { ...decision[leaveId], adminComment: comment } });
  };

  const submitDecision = async (leaveId) => {
    if (!decision[leaveId]?.status) return;
    
    setUpdating(true);
    try {
      await api.put(`leaves/${leaveId}/status`, {
        status: decision[leaveId].status,
        adminComment: decision[leaveId].adminComment || ''
      });
      fetchPendingLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading pending leave requests...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
        <Clock className="mr-2 text-yellow-500" /> Pending Leave Requests
      </h2>
      
      {pendingLeaves.length === 0 ? (
        <div className="text-gray-500">No pending leave requests</div>
      ) : (
        <div className="space-y-6">
          {pendingLeaves.map((leave) => (
            <div key={leave._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2 text-gray-700">
                <User className="mr-2 text-blue-500" />
                <span className="font-medium">{leave.employee.name}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span>{leave.employee.position}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span>{leave.employee.department}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-2" />
                  <span>
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="capitalize">
                  <span className="font-medium">Type:</span> {leave.leaveType}
                </div>
                
                <div className="flex items-center">
                  <MessageSquare className="mr-2" />
                  <span className="font-medium">Reason:</span> {leave.reason}
                </div>
              </div>
              
              <div className="mt-4">
                <textarea
                  placeholder="Add comment (optional)"
                  value={decision[leave._id]?.adminComment || ''}
                  onChange={(e) => handleCommentChange(leave._id, e.target.value)}
                  className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  rows="2"
                />
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDecisionChange(leave._id, 'approved')}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      decision[leave._id]?.status === 'approved' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    <Check className="mr-2" /> Approve
                  </button>
                  
                  <button
                    onClick={() => handleDecisionChange(leave._id, 'rejected')}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      decision[leave._id]?.status === 'rejected' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <X className="mr-2" /> Reject
                  </button>
                  
                  {decision[leave._id]?.status && (
                    <button
                      onClick={() => submitDecision(leave._id)}
                      disabled={updating}
                      className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {updating ? 'Processing...' : (decision[leave._id]?.status === 'approved' ? 'Approve Request' : 'Reject Request')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;
