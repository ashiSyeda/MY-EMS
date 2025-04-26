// import React, { useState, useEffect } from 'react';
// import { api } from '../Admin/adminApi';
// import { Check, X, Clock, Calendar, AlertCircle } from 'lucide-react';

// const LeaveHistory = ({ employeeId }) => {
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const response = await api.get(`leaves/employee/${employeeId}`);
//         setLeaves(response.data);
//       } catch (error) {
//         console.error('Error fetching leave history:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchLeaves();
//   }, [employeeId]);

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'approved': return <Check className="text-green-500" />;
//       case 'rejected': return <X className="text-red-500" />;
//       default: return <Clock className="text-yellow-500" />;
//     }
//   };

//   if (loading) return <div>Loading leave history...</div>;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold mb-4 flex items-center">
//         <Calendar className="mr-2 text-blue-500" /> My Leave History
//       </h2>
      
//       {leaves.length === 0 ? (
//         <div className="text-gray-500">No leave requests found</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {leaves.map((leave) => (
//                 <tr key={leave._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap capitalize">{leave.leaveType}</td>
//                   <td className="px-6 py-4">{leave.reason}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {getStatusIcon(leave.status)}
//                       <span className="ml-2 capitalize">{leave.status}</span>
//                       {leave.adminComment && (
//                         <span className="ml-2 text-gray-500" title={leave.adminComment}>
//                           <AlertCircle className="w-4 h-4" />
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeaveHistory;
import React, { useState, useEffect } from 'react';
import { api } from '../Admin/adminApi';
import { Check, X, Clock, Calendar, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const LeaveHistory = ({ employeeId }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLeave, setExpandedLeave] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await api.get(`leaves/employee/${employeeId}`);
        setLeaves(response.data);
      } catch (error) {
        console.error('Error fetching leave history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaves();
  }, [employeeId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <Check className="text-green-500" />;
      case 'rejected': return <X className="text-red-500" />;
      default: return <Clock className="text-yellow-500" />;
    }
  };

  const toggleExpandLeave = (leaveId) => {
    setExpandedLeave(expandedLeave === leaveId ? null : leaveId);
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="mr-3 w-5 h-5 text-indigo-600" /> 
          <span>My Leave History</span>
        </h2>
      </div>
      
      {leaves.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No leave requests found
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {leaves.map((leave) => (
            <div key={leave._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                onClick={() => toggleExpandLeave(leave._id)}
              >
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="mr-4">
                    {getStatusIcon(leave.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDateRange(leave.startDate, leave.endDate)}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {leave.leaveType}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize mr-4 ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                    leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {leave.status}
                  </div>
                  {expandedLeave === leave._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedLeave === leave._id && (
                <div className="mt-4 pl-10 pr-4 pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Reason</h4>
                    <p className="text-gray-800">{leave.reason}</p>
                  </div>
                  
                  {leave.adminComment && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
                        Admin Comment
                      </h4>
                      <p className="text-gray-800">{leave.adminComment}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Applied On</h4>
                      <p className="text-gray-800">
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Days</h4>
                      <p className="text-gray-800">
                        {leave.days} day{leave.days !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;