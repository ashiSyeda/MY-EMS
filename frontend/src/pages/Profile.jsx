import { useState, useEffect } from 'react';
import { Edit, Save, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    gender: '',
    position: '',
    department: '',
    contact: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (error) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Profile updated!');
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employee Profile</h2>
        {isEditing ? (
          <div className="space-x-2">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ['Full Name', 'name'],
          ['Email', 'email'],
          ['Gender', 'gender'],
          ['Position', 'position'],
          ['Department', 'department'],
          ['Contact', 'contact']
        ].map(([label, key]) => (
          <div key={key}>
            <label className="block text-gray-700 font-medium mb-1">{label}</label>
            {isEditing && key !== 'email' ? (
              <input
                type="text"
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                disabled={updating}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-100 rounded-lg">{profile[key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
