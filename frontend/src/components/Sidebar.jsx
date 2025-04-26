import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Home, 
  Clock, 
  Calendar, 
  User, 
  DollarSign, 
  Settings, 
  LogOut,
  Building,
  FileText,
  Users,
  Menu,
  X
} from 'lucide-react';
import { fetchLoggedInUserProfile } from '../Admin/adminApi';

const Sidebar = () => {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Closed by default on mobile
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const loadUserName = async () => {
      try {
        const profile = await fetchLoggedInUserProfile();
        if (profile && profile.name) {
          setUserName(profile.name);
          localStorage.setItem('userName', profile.name);
        } else {
          const storedName = localStorage.getItem('userName');
          setUserName(storedName || 'User');
        }
      } catch (error) {
        const storedName = localStorage.getItem('userName');
        setUserName(storedName || 'User');
      }
    };

    loadUserName();
  }, [userRole]);

  // Icon size configuration
  const iconSize = 20;
  const iconClass = "w-5 h-5";

  const adminNavItems = [
    { path: '/admin-dashboard/dashboard', icon: <Home className={iconClass} />, label: 'Dashboard' },
    { path: '/admin-dashboard/employees', icon: <Users className={iconClass} />, label: 'Employees' },
    { path: '/admin-dashboard/leaves2', icon: <FileText className={iconClass} />, label: 'Leave Approvals' },
    { path: '/admin-dashboard/employee-salary', icon: <DollarSign className={iconClass} />, label: 'Employee Salary' },
    { path: '/admin-dashboard/settings', icon: <Settings className={iconClass} />, label: 'Settings' },
    { path: '/logout', icon: <LogOut className={iconClass} />, label: 'Logout' }
  ];

  const employeeNavItems = [
    { path: '/dashboard', icon: <Home className={iconClass} />, label: 'Dashboard' },
    { path: '/attendance', icon: <Clock className={iconClass} />, label: 'Attendance' },
    { path: '/leaves', icon: <Calendar className={iconClass} />, label: 'Leaves' },
    { path: '/profile', icon: <User className={iconClass} />, label: 'Profile' },
    { path: '/salary', icon: <DollarSign className={iconClass} />, label: 'Salary' },
    { path: '/settings', icon: <Settings className={iconClass} />, label: 'Settings' },
    { path: '/logout', icon: <LogOut className={iconClass} />, label: 'Logout' }
  ];

  const navItems = userRole === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white focus:outline-none shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
        border-r border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex md:flex-col
      `}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Building className="w-5 h-5 mr-2 text-indigo-600" />
            {userRole === 'admin' ? 'Admin Portal' : 'Employee Portal'}
          </h2>
        </div>
        
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={item.path || index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User profile footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{userName || 'User'}</p>
              <p className="text-xs text-gray-500">{userRole === 'admin' ? 'Admin' : 'Employee'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
export default Sidebar;

