import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageCropper from '../components/ImageCropper';
import RankBadge from '../components/RankBadge';
import KPCoin from '../components/KPCoin';
import { FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    displayName: '',
    profilePicture: null,
    bio: '',
    rank_tier: 'User',
    konest_points: 0
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setUser({
            username: response.data.username,
            displayName: response.data.display_name,
            profilePicture: response.data.profile_picture,
            bio: response.data.bio || '',
            rank_tier: response.data.rank_tier,
            konest_points: response.data.konest_points || 0
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
        if (error.response?.status === 401 || error.response?.status === 404) {
          localStorage.clear();
          navigate('/login');
        }
      }
    };

    fetchUserData();
    // Fetch data every minute to keep it updated
    const interval = setInterval(fetchUserData, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setShowEditModal(true);
    }
  };

  const handleCropComplete = async (blob) => {
    const formData = new FormData();
    formData.append('profile_picture', blob);

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.data) {
          const updatedUser = {
            ...user,
            profilePicture: profileResponse.data.profile_picture,
            konest_points: profileResponse.data.konest_points,
            rank_tier: profileResponse.data.rank_tier
          };

          setUser(updatedUser);

          // Update localStorage
          localStorage.setItem('profilePicture', updatedUser.profilePicture);
          localStorage.setItem('konest_points', updatedUser.konest_points.toString());
          localStorage.setItem('rank_tier', updatedUser.rank_tier);

          toast.success('Profile picture updated successfully!');
        }
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setShowEditModal(false);
      setSelectedImage(null);
    }
  };

  const handleDisplayNameChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { display_name: user.displayName },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      localStorage.setItem('displayName', user.displayName);
      toast.success('Display name updated successfully!');
    } catch (error) {
      console.error('Update display name error:', error);
      toast.error('Failed to update display name');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.clear();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Add validation for minimum password length
    if (passwordForm.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long');
        return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('New passwords do not match');
        return;
    }

    try {
        const token = localStorage.getItem('userToken');
        const response = await axios.put(
            'http://localhost:5000/api/users/password',
            {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.data) {
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            toast.success('Password updated successfully!');
        }
    } catch (error) {
        console.error('Update password error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update password';
        toast.error(errorMessage);
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-snavy to-navyDark py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 mt-12">
          <h1 className="text-3xl font-bold text-navyDark mb-8">Account Settings</h1>

          {/* Profile Picture Section */}
          <div className="mb-8">
          <div className="flex items-center space-x-4">
  <div className="relative">
    {user.profilePicture ? (
      <img
        src={`http://localhost:5000${user.profilePicture}`}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover"
      />
    ) : (
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
        <FiUser size={40} className="text-gray-400" />
      </div>
    )}
    <label className="absolute bottom-0 right-0 bg-snavy text-white p-2 rounded-full cursor-pointer hover:bg-navyDark transition-colors">
      <FiEdit2 size={16} />
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </label>
  </div>
  <div>
    <div className="flex items-center gap-2 mb-1">
      <h2 className="text-xl font-semibold">{user.displayName}</h2>
      <RankBadge tier={user.rank_tier || 'User'} />
    </div>
    <p className="text-gray-500 mb-2">@{user.username}</p>
    <KPCoin 
      amount={user.konest_points || 0}
      className="text-sm text-yellow-400"
    />
  </div>
</div>
          </div>

          {/* Display Name Form */}
          <form onSubmit={handleDisplayNameChange} className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={user.displayName}
                onChange={(e) => setUser({ ...user, displayName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-snavy"
              />
            </div>
            <button
              type="submit"
              className="bg-snavy text-white px-4 py-2 rounded-lg hover:bg-navyDark transition-colors"
            >
              Update Display Name
            </button>
          </form>

          {/* Password Change Form */}
<form onSubmit={handlePasswordChange} className="mb-8">
  <h2 className="text-xl font-semibold mb-4">Change Password</h2>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Current Password
      </label>
      <input
        type="password"
        value={passwordForm.currentPassword}
        onChange={(e) => setPasswordForm(prev => ({
          ...prev,
          currentPassword: e.target.value
        }))}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-snavy"
        required
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        New Password
      </label>
      <input
        type="password"
        value={passwordForm.newPassword}
        onChange={(e) => setPasswordForm(prev => ({
          ...prev,
          newPassword: e.target.value
        }))}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-snavy"
        required
        minLength={6}
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Confirm New Password
      </label>
      <input
        type="password"
        value={passwordForm.confirmPassword}
        onChange={(e) => setPasswordForm(prev => ({
          ...prev,
          confirmPassword: e.target.value
        }))}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-snavy"
        required
        minLength={6}
      />
    </div>
  </div>
  
  <button
    type="submit"
    className="mt-4 bg-snavy text-white px-4 py-2 rounded-lg hover:bg-navyDark transition-colors"
  >
    Update Password
  </button>
</form>

          {/* Delete Account Button */}
          <div className="border-t pt-6">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center text-red-500 hover:text-red-700 transition-colors"
            >
              <FiTrash2 className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Image Crop Modal */}
{showEditModal && selectedImage && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col" style={{ height: 'calc(90vh - 2rem)' }}>
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-bold">Edit Profile Picture</h3>
        <button
          onClick={() => {
            setShowEditModal(false);
            setSelectedImage(null);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedImage(null);
          }}
        />
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Account</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettingsPage;