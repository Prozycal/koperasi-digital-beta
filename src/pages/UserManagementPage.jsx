import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import RankBadge from '../components/RankBadge';
import KPCoin from '../components/KPCoin';
import { FiSearch, FiX, FiCheck } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg text-sm ${
          currentPage === 1
            ? 'bg-gray-300/10 text-gray-500 cursor-not-allowed'
            : 'bg-navyDark text-white hover:bg-navyDarkest'
        }`}
      >
        Previous
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 rounded-lg text-sm ${
            currentPage === index + 1
              ? 'bg-creamyLight text-navyDarkest font-bold'
              : 'bg-navyDark text-white hover:bg-navyDarkest'
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-lg text-sm ${
          currentPage === totalPages
            ? 'bg-gray-300/10 text-gray-500 cursor-not-allowed'
            : 'bg-navyDark text-white hover:bg-navyDarkest'
        }`}
      >
        Next
      </button>
    </div>
  );
};

const TableInfo = ({ total, currentPage, itemsPerPage }) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);
  
  return (
    <div className="text-sm text-gray-300 mt-4">
      Showing {start} to {end} of {total} entries
    </div>
  );
};

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const [loading, setLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState('');

  // Verify admin authentication
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/admin-login');
      return;
    }

    // Verify token is valid admin token
    const verifyAdmin = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          
          if (!response.data.isAdmin) {
            localStorage.removeItem('authToken');
            navigate('/admin-login');
          }
        } catch (error) {
          console.error('Verification error:', error);
          localStorage.removeItem('authToken');
          navigate('/admin-login');
        }
      };

    verifyAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
        setLoading(true);
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5000/api/admin/users`, {
            params: { search: searchQuery },
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('API Response:', response.data); // Debug log
        
        if (Array.isArray(response.data)) {
            setUsers(response.data);
        } else {
            console.error('Unexpected response format:', response.data);
            setUsers([]);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error('Unauthorized access');
            navigate('/admin-login');
        } else {
            toast.error('Failed to fetch users: ' + (error.response?.data?.message || 'Unknown error'));
        }
        setUsers([]);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
  setCurrentPage(1);
}, [searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleBanUser = async () => {
    if (!banReason.trim()) {
      toast.error('Please provide a reason for banning');
      return;
    }
  
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        `http://localhost:5000/api/admin/users/${selectedUser.id}/ban`,
        { reason: banReason },
        { headers: { Authorization: `Bearer ${authToken}` }}
      );
      
      toast.success(`User ${selectedUser.username} has been banned`);
      setShowBanModal(false);
      setBanReason('');
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user: ' + (error.response?.data?.message || 'Unknown error'));
      if (error.response?.status === 401) {
        navigate('/admin-login');
      }
    }
  };

  const handleUnbanUser = async (user) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        `http://localhost:5000/api/admin/users/${user.id}/unban`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` }}
      );
      
      toast.success(`User ${user.username} has been unbanned`);
      fetchUsers();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user: ' + (error.response?.data?.message || 'Unknown error'));
      if (error.response?.status === 401) {
        navigate('/admin-login');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
        <div className="text-left">
                            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                                <span className="text-white">Managemen </span>
                                <span className="text-creamyLight">User</span>
                                
                            </h2>
                            <p className="text-gray-300">
            Total Users: <span className="font-semibold">{users.length}</span>
          </p>
                        </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white/10 
                border border-white/20 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-creamyLight focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
  <thead>
    <tr className="bg-white/10">
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-white/10">
    {currentUsers.map((user) => (
      <tr key={user.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              {user.profile_picture ? (
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={`http://localhost:5000${user.profile_picture}`}
                  alt={user.username}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-navyDark to-navyDarkest 
                  flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">
                {user.display_name || user.username}
              </div>
              <div className="text-sm text-gray-400">
                ID: {user.id}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-300">@{user.username}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
  <RankBadge tier={user.rank_tier || 'User'} />
</td>
<td className="px-6 py-4 whitespace-nowrap">
  <KPCoin 
    amount={parseInt(user.konest_points) || 0}
    className="text-sm text-white"
  />
</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium rounded-full
            ${user.is_banned 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-green-500/20 text-green-400'}`}
          >
            {user.is_banned ? 'Banned' : 'Active'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {user.is_banned ? (
            <button
              onClick={() => handleUnbanUser(user)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs 
                font-medium rounded-md text-green-400 bg-green-500/10 hover:bg-green-500/20 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/50 
                transition-all duration-200"
            >
              <FiCheck className="mr-1.5" />
              Unban
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowBanModal(true);
              }}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs 
                font-medium rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50 
                transition-all duration-200"
            >
              <FiX className="mr-1.5" />
              Ban
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
        <div className="p-4">
    <TableInfo
      total={users.length}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
    />
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-navyDarkest border border-white/10 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Ban User: <span className="text-creamyLight">{selectedUser?.username}</span>
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ban Reason
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md 
                  text-white placeholder-gray-400 focus:ring-2 focus:ring-creamyLight 
                  focus:border-transparent resize-none"
                rows="3"
                placeholder="Enter reason for banning..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason('');
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 
                  hover:bg-white/10 rounded-md transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 
                  hover:bg-red-500 rounded-md transition-all duration-200"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;