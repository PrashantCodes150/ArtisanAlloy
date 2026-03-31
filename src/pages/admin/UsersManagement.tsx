import { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  MoreVertical
} from 'lucide-react';
import api from '../../services/api';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'manager';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let url = `/users?page=${page}&limit=${limit}&sort=-createdAt`;
      if (roleFilter !== 'all') {
        url += `&role=${roleFilter}`;
      }
      const response = await api.get(url);
      setUsers(response.data.data.users);
      setTotal(response.data.total || response.data.results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await api.patch(`/users/${userId}`, { role });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/users/${userId}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(total / limit);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/10';
      case 'manager': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-jewelry-gold">Users</h1>
        <p className="text-jewelry-cream/60 font-sans mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jewelry-cream/50" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="manager">Managers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-jewelry-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchUsers} className="mt-4 text-jewelry-gold hover:underline">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-jewelry-cream/60 text-sm font-sans bg-jewelry-dark-light/50">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Email Verified</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-sans">
                  {filteredUsers.map((user) => {
                    return (
                      <tr key={user._id} className="border-t border-jewelry-gold/10 hover:bg-jewelry-gold/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-jewelry-gold/20 flex items-center justify-center">
                              <span className="text-jewelry-gold font-medium">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-jewelry-cream font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-jewelry-cream/50 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${getRoleColor(user.role)}`}
                          >
                            <option value="customer">Customer</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              user.isActive
                                ? 'bg-green-400/10 text-green-400'
                                : 'bg-red-400/10 text-red-400'
                            }`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-4">
                          <span className={`flex items-center gap-1 text-sm ${
                            user.isEmailVerified ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            <Mail className="w-4 h-4" />
                            {user.isEmailVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 text-jewelry-cream/70 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="p-4">
                          <button className="p-2 rounded-lg hover:bg-jewelry-gold/10 text-jewelry-cream/50">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-jewelry-cream/50">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-jewelry-gold/10">
                <p className="text-jewelry-cream/60 text-sm">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream disabled:opacity-50 hover:bg-jewelry-gold/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-jewelry-cream px-4">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream disabled:opacity-50 hover:bg-jewelry-gold/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
