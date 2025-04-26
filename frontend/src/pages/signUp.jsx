// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const SignupForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     gender: '',
//     position: '',
//     role: 'employee',
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         navigate('/dashboard');
//       } else {
//         setError(data.message || 'Signup failed');
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       setError('Signup failed. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Employee Signup</h2>
//       <form onSubmit={handleSubmit}>
//         {['name', 'email', 'password', 'position'].map((field) => (
//           <div className="mb-4" key={field}>
//             <label className="block text-gray-700 mb-2 capitalize" htmlFor={field}>
//               {field}
//             </label>
//             <input
//               type={field === 'password' ? 'password' : 'text'}
//               id={field}
//               className="w-full px-3 py-2 border rounded-lg"
//               value={formData[field]}
//               onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
//               required
//             />
//           </div>
//         ))}

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2" htmlFor="gender">Gender</label>
//           <select
//             id="gender"
//             className="w-full px-3 py-2 border rounded-lg"
//             value={formData.gender}
//             onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
//           <select
//             id="role"
//             className="w-full px-3 py-2 border rounded-lg"
//             value={formData.role}
//             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//           >
//             <option value="employee">Employee</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignupForm;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    position: '',
    role: 'employee',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Employee Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Name</span>
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>Email</span>
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <span>Password</span>
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="position" className="block text-gray-700 mb-2">Position</label>
          <input
            type="text"
            id="position"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-gray-700 mb-2">Gender</label>
          <select
            id="gender"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
          <select
            id="role"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;




