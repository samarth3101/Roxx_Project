import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';
import { Modal } from '../components/Modal';
import {
  Users,
  Store,
  Star,
  UserPlus,
  PlusCircle,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Building2,
  User,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard = () => {
  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Tab: 'users' or 'stores'
  const [activeTab, setActiveTab] = useState('users');

  // Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userFilters, setUserFilters] = useState({
    search: '',
    role: '',
  });
  const [userSort, setUserSort] = useState({ field: 'createdAt', order: 'desc' });

  // Stores State
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storeFilters, setStoreFilters] = useState({ search: '' });
  const [storeSort, setStoreSort] = useState({ field: 'name', order: 'asc' });

  // Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [availableOwners, setAvailableOwners] = useState([]);

  // Form States - Add User
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  // Form States - Add Store
  const [newStoreData, setNewStoreData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [addStoreLoading, setAddStoreLoading] = useState(false);
  const [addStoreError, setAddStoreError] = useState('');

  // Load Dashboard Data
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        search: userFilters.search,
        role: userFilters.role,
        sortField: userSort.field,
        sortOrder: userSort.order,
      });
      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      setStoresLoading(true);
      const params = new URLSearchParams({
        search: storeFilters.search,
        sortField: storeSort.field,
        sortOrder: storeSort.order,
      });
      const res = await api.get(`/admin/stores?${params.toString()}`);
      if (res.data.success) {
        setStores(res.data.data.stores);
      }
    } catch (err) {
      console.error('Failed to load admin stores:', err);
    } finally {
      setStoresLoading(false);
    }
  };

  const fetchAvailableOwners = async () => {
    try {
      const res = await api.get('/admin/store-owners-available');
      if (res.data.success) {
        setAvailableOwners(res.data.data.owners);
      }
    } catch (err) {
      console.error('Failed to load available store owners:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userFilters, userSort]);

  useEffect(() => {
    fetchStores();
  }, [storeFilters, storeSort]);

  // Handle Sorts
  const handleUserSort = (field) => {
    setUserSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleStoreSort = (field) => {
    setStoreSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Add User Validation
  const isUserNameValid = newUserData.name.trim().length >= 20 && newUserData.name.trim().length <= 60;
  const isUserAddressValid = newUserData.address.trim().length > 0 && newUserData.address.trim().length <= 400;
  const isUserEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserData.email.trim());
  const hasUserPassLength = newUserData.password.length >= 8 && newUserData.password.length <= 16;
  const hasUserPassUpper = /[A-Z]/.test(newUserData.password);
  const hasUserPassSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newUserData.password);
  const isUserFormValid = isUserNameValid && isUserAddressValid && isUserEmailValid && hasUserPassLength && hasUserPassUpper && hasUserPassSpecial;

  // Add Store Validation
  const isStoreNameValid = newStoreData.name.trim().length >= 20 && newStoreData.name.trim().length <= 60;
  const isStoreAddressValid = newStoreData.address.trim().length > 0 && newStoreData.address.trim().length <= 400;
  const isStoreEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStoreData.email.trim());
  const isStoreFormValid = isStoreNameValid && isStoreAddressValid && isStoreEmailValid && !!newStoreData.ownerId;

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddUserError('');
    if (!isUserFormValid) {
      setAddUserError('Please fulfill all validation criteria.');
      return;
    }

    setAddUserLoading(true);
    try {
      const res = await api.post('/admin/users', newUserData);
      if (res.data.success) {
        setIsAddUserOpen(false);
        setNewUserData({ name: '', email: '', password: '', address: '', role: 'USER' });
        fetchUsers();
        fetchStats();
        fetchAvailableOwners();
      }
    } catch (err) {
      setAddUserError(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setAddStoreError('');
    if (!isStoreFormValid) {
      setAddStoreError('Please fill out all store fields and select an owner.');
      return;
    }

    setAddStoreLoading(true);
    try {
      const res = await api.post('/admin/stores', newStoreData);
      if (res.data.success) {
        setIsAddStoreOpen(false);
        setNewStoreData({ name: '', email: '', address: '', ownerId: '' });
        fetchStores();
        fetchStats();
        fetchUsers();
        fetchAvailableOwners();
      }
    } catch (err) {
      setAddStoreError(err.response?.data?.message || err.message || 'Failed to create store');
    } finally {
      setAddStoreLoading(false);
    }
  };

  const openAddStoreModal = () => {
    fetchAvailableOwners();
    setIsAddStoreOpen(true);
  };

  // User Table Columns
  const userColumns = [
    {
      header: 'User Name',
      field: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {row.name}
          </span>
          <span className="text-[11px] text-slate-500">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Role',
      field: 'role',
      render: (row) => {
        if (row.role === 'ADMIN') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Admin
            </span>
          );
        }
        if (row.role === 'STORE_OWNER') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Building2 className="w-3 h-3 text-amber-600" />
              Store Owner
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <User className="w-3 h-3 text-slate-600" />
            Normal User
          </span>
        );
      },
    },
    {
      header: 'Address',
      field: 'address',
      render: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-xs" title={row.address}>
          {row.address}
        </span>
      ),
    },
    {
      header: 'Store Rating (Owners)',
      field: 'storeRating',
      render: (row) => {
        if (row.role === 'STORE_OWNER') {
          if (row.storeRating !== null && row.storeRating !== undefined) {
            return (
              <div className="flex items-center gap-1.5">
                <StarRating value={row.storeRating} readOnly size="sm" />
                <span className="text-xs font-bold text-amber-600">
                  {row.storeRating.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-500">
                  ({row.totalStoreRatings || 0})
                </span>
              </div>
            );
          }
          return <span className="text-xs text-slate-400 italic">No store assigned</span>;
        }
        return <span className="text-xs text-slate-400">—</span>;
      },
    },
    {
      header: 'Actions',
      field: 'actions',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedUserDetail(row)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  // Store Table Columns
  const storeColumns = [
    {
      header: 'Store Name',
      field: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {row.name}
          </span>
          <span className="text-[11px] text-slate-500">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Address',
      field: 'address',
      render: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-sm" title={row.address}>
          {row.address}
        </span>
      ),
    },
    {
      header: 'Assigned Owner',
      field: 'owner',
      sortable: false,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-800">
            {row.owner?.name || 'Unassigned'}
          </span>
          <span className="text-[10px] text-slate-500">{row.owner?.email}</span>
        </div>
      ),
    },
    {
      header: 'Overall Rating',
      field: 'rating',
      render: (row) => (
        <div className="flex items-center gap-2">
          <StarRating value={row.rating} readOnly size="sm" />
          <span className="text-xs font-bold text-amber-600">
            {row.rating > 0 ? row.rating.toFixed(1) : 'Unrated'}
          </span>
          <span className="text-[10px] text-slate-500">
            ({row.totalRatings} {row.totalRatings === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            System Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform overview, store management, user controls, and rating analytics
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddUserOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
          <button
            type="button"
            onClick={openAddStoreModal}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5 text-slate-800 hover:border-slate-400"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Add Store</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          subtitle="Admins, Store Owners & Normal Users"
        />
        <StatCard
          title="Total Registered Stores"
          value={stats.totalStores}
          icon={Store}
          color="amber"
          subtitle="Active stores listed on platform"
        />
        <StatCard
          title="Total Ratings Submitted"
          value={stats.totalRatings}
          icon={Star}
          color="emerald"
          subtitle="Customer reviews & scores (1-5)"
        />
      </div>

      {/* Tab Selector & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Users Directory ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stores')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stores'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Stores Catalog ({stores.length})
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Click table column headers to sort ascending / descending
          </div>
        </div>

        {/* Tab 1: Users View */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter by Name, Email, or Address..."
                  value={userFilters.search}
                  onChange={(e) =>
                    setUserFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="relative">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={userFilters.role}
                  onChange={(e) =>
                    setUserFilters((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs bg-white appearance-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="USER">Normal User</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <DataTable
              columns={userColumns}
              data={users}
              sortField={userSort.field}
              sortOrder={userSort.order}
              onSort={handleUserSort}
              loading={usersLoading}
              emptyMessage="No users matching your filters found."
            />
          </div>
        )}

        {/* Tab 2: Stores View */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            {/* Stores Filter Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Filter stores by Name, Email, or Address..."
                value={storeFilters.search}
                onChange={(e) =>
                  setStoreFilters({ search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            {/* Stores Table */}
            <DataTable
              columns={storeColumns}
              data={stores}
              sortField={storeSort.field}
              sortOrder={storeSort.order}
              onSort={handleStoreSort}
              loading={storesLoading}
              emptyMessage="No stores found."
            />
          </div>
        )}
      </div>

      {/* Modal: Add User */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New User to Platform"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {addUserError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{addUserError}</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Full Name (20 to 60 characters)
              </label>
              <span className="text-[11px] text-slate-400">{newUserData.name.length}/60</span>
            </div>
            <input
              type="text"
              required
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              placeholder="e.g. Alexander James Store Owner 1"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role
            </label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs bg-white cursor-pointer"
            >
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address (max 400 characters)
            </label>
            <textarea
              required
              rows={2}
              value={newUserData.address}
              onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
              placeholder="e.g. 450 Commercial Avenue, Market District"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password (8-16 chars, 1 uppercase, 1 special character)
            </label>
            <input
              type="password"
              required
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              placeholder="e.g. AdminPass@2026"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="btn-secondary text-xs px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isUserFormValid || addUserLoading}
              className="btn-primary text-xs px-4 py-2"
            >
              {addUserLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Store */}
      <Modal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        title="Register New Store"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateStore} className="space-y-4">
          {addStoreError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{addStoreError}</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Store Name (20 to 60 characters)
              </label>
              <span className="text-[11px] text-slate-400">{newStoreData.name.length}/60</span>
            </div>
            <input
              type="text"
              required
              value={newStoreData.name}
              onChange={(e) => setNewStoreData({ ...newStoreData, name: e.target.value })}
              placeholder="e.g. Apex Grand Artisan Emporium"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Store Email Address
            </label>
            <input
              type="email"
              required
              value={newStoreData.email}
              onChange={(e) => setNewStoreData({ ...newStoreData, email: e.target.value })}
              placeholder="store@example.com"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Store Address (max 400 characters)
            </label>
            <textarea
              required
              rows={2}
              value={newStoreData.address}
              onChange={(e) => setNewStoreData({ ...newStoreData, address: e.target.value })}
              placeholder="e.g. 742 Evergreen Terrace, Commercial Core"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Store Owner (Must be a registered STORE_OWNER without a store)
            </label>
            {availableOwners.length > 0 ? (
              <select
                required
                value={newStoreData.ownerId}
                onChange={(e) => setNewStoreData({ ...newStoreData, ownerId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs bg-white cursor-pointer"
              >
                <option value="">Select a Store Owner...</option>
                {availableOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                No unassigned Store Owners found. Please create a user with role "Store Owner" first.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsAddStoreOpen(false)}
              className="btn-secondary text-xs px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isStoreFormValid || addStoreLoading}
              className="btn-primary text-xs px-4 py-2"
            >
              {addStoreLoading ? 'Registering...' : 'Register Store'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View User Details */}
      {selectedUserDetail && (
        <Modal
          isOpen={!!selectedUserDetail}
          onClose={() => setSelectedUserDetail(null)}
          title="User Information & Details"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div>
                <span className="text-slate-500 block font-medium">Full Name:</span>
                <span className="text-slate-900 text-sm font-semibold">{selectedUserDetail.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Email:</span>
                <span className="text-slate-700">{selectedUserDetail.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Role:</span>
                <span className="font-bold text-blue-600">{selectedUserDetail.role}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Address:</span>
                <span className="text-slate-700">{selectedUserDetail.address}</span>
              </div>

              {selectedUserDetail.role === 'STORE_OWNER' && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block font-medium">Managed Store & Rating:</span>
                  {selectedUserDetail.store ? (
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{selectedUserDetail.store.name}</span>
                      <div className="flex items-center gap-1.5">
                        <StarRating value={selectedUserDetail.storeRating || 0} readOnly size="sm" />
                        <span className="font-bold text-amber-600">
                          {selectedUserDetail.storeRating ? selectedUserDetail.storeRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No store assigned yet</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="btn-secondary text-xs px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
