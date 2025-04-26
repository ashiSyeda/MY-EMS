// AttendanceWidget.jsx
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AttendanceWidget = ({ employeeId }) => {
  const [attendance, setAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // Check for active attendance on component mount
  useEffect(() => {
    const fetchActiveAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/auth/attendance/history?`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.length > 0) {
          const latest = data[0];
          if (!latest.checkOut) {
            setAttendance(latest);
          }
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchActiveAttendance();
  }, []);

  const handleAttendance = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/auth/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAttendance(data.attendance);
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Attendance operation failed');
      }
    } catch (error) {
      console.error('Attendance error:', error);
      toast.error('Network error during attendance operation');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonState = () => {
    if (!attendance) {
      return {
        text: 'Check In',
        icon: <CheckCircle className="w-4 h-4 mr-2" />,
        bgColor: 'bg-green-600 hover:bg-green-700',
      };
    } else if (attendance && !attendance.checkOut) {
      return {
        text: 'Check Out',
        icon: <XCircle className="w-4 h-4 mr-2" />,
        bgColor: 'bg-red-600 hover:bg-red-700',
      };
    } else {
      return {
        text: 'Check In',
        icon: <CheckCircle className="w-4 h-4 mr-2" />,
        bgColor: 'bg-green-600 hover:bg-green-700',
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Toaster position="top-right" />
      <h3 className="text-xl font-semibold mb-4">Attendance</h3>
      
      <div className="flex flex-col space-y-4">
        {/* Single Attendance Button */}
        <button
          onClick={handleAttendance}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg ${buttonState.bgColor} text-white flex items-center justify-center`}
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              {buttonState.icon}
              {buttonState.text}
            </>
          )}
        </button>

        {/* Status Display */}
        {attendance?.checkIn && (
          <div className="text-sm text-gray-600">
            <p>Checked In: {new Date(attendance.checkIn).toLocaleString()}</p>
            {attendance.checkOut && (
              <p>Checked Out: {new Date(attendance.checkOut).toLocaleString()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceWidget;



  
