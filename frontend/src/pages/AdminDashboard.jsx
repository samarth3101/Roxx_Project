import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Sidebar } from '../components/Sidebar';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';
import { Modal } from '../components/Modal';
import {
  Users,
  Store,
  Star,
  Plus,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Check,
  X,
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

  // Load Data
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
      if (!isUserNameValid) {
        setAddUserError(`Name must be between 20 and 60 characters. You entered ${newUserData.name.trim().length} characters.`);
      } else if (!isUserEmailValid) {
        setAddUserError('Please enter a valid email address.');
      } else if (!isUserAddressValid) {
        setAddUserError('Address is required and must be under 400 characters.');
      } else if (!hasUserPassLength) {
        setAddUserError(`Password must be between 8 and 16 characters (currently ${newUserData.password.length}).`);
      } else if (!hasUserPassUpper) {
        setAddUserError('Password needs at least one uppercase letter (A-Z).');
      } else if (!hasUserPassSpecial) {
        setAddUserError('Password needs at least one special character (!@#$%^&*...).');
      }
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
      if (!isStoreNameValid) {
        setAddStoreError(`Store name must be between 20 and 60 characters. Currently ${newStoreData.name.trim().length} characters.`);
      } else if (!isStoreEmailValid) {
        setAddStoreError('Please enter a valid email address.');
      } else if (!isStoreAddressValid) {
        setAddStoreError('Store address is required and must be under 400 characters.');
      } else if (!newStoreData.ownerId) {
        setAddStoreError('Please assign a store owner.');
      }
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
      header: 'Name',
      field: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#1A1815]">{row.name}</span>
          <span className="text-[11px] text-[#8A8578]">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Role',
      field: 'role',
      render: (row) => {
        if (row.role === 'ADMIN') {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[#FAF9F6] border border-[#E8E5DF] text-[#4A6FA5]">
              Administrator
            </span>
          );
        }
        if (row.role === 'STORE_OWNER') {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[#FAF9F6] border border-[#E8E5DF] text-[#C9714F]">
              Store owner
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-[#FAF9F6] border border-[#E8E5DF] text-[#8A8578]">
            User
          </span>
        );
      },
    },
    {
      header: 'Address',
      field: 'address',
      render: (row) => (
        <span className="text-xs text-[#8A8578] line-clamp-1 max-w-xs" title={row.address}>
          {row.address}
        </span>
      ),
    },
    {
      header: 'Store rating',
      field: 'storeRating',
      render: (row) => {
        if (row.role === 'STORE_OWNER') {
          if (row.storeRating !== null && row.storeRating !== undefined) {
            return (
              <div className="flex items-center gap-1.5">
                <StarRating value={row.storeRating} readOnly size="sm" />
                <span className="text-xs tabular-nums text-[#2B2924] font-medium">
                  {row.storeRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-[#8A8578]">
                  ({row.totalStoreRatings || 0})
                </span>
              </div>
            );
          }
          return <span className="text-xs text-[#8A8578] italic">Unassigned</span>;
        }
        return <span className="text-xs text-[#8A8578]">—</span>;
      },
    },
    {
      header: '',
      field: 'actions',
      sortable: false,
      className: 'text-right w-10',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedUserDetail(row)}
          className="p-1 text-[#8A8578] hover:text-[#1A1815] hover:bg-[#FAF9F6] rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5]"
          title="View user details"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  // Store Table Columns
  const storeColumns = [
    {
      header: 'Store name',
      field: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#1A1815]">{row.name}</span>
          <span className="text-[11px] text-[#8A8578]">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Address',
      field: 'address',
      render: (row) => (
        <span className="text-xs text-[#8A8578] line-clamp-1 max-w-sm" title={row.address}>
          {row.address}
        </span>
      ),
    },
    {
      header: 'Store owner',
      field: 'owner',
      sortable: false,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs text-[#2B2924]">
            {row.owner?.name || 'Unassigned'}
          </span>
          <span className="text-[11px] text-[#8A8578]">{row.owner?.email}</span>
        </div>
      ),
    },
    {
      header: 'Average rating',
      field: 'rating',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <StarRating value={row.rating} readOnly size="sm" />
          <span className="text-xs tabular-nums text-[#2B2924] font-medium">
            {row.rating > 0 ? row.rating.toFixed(1) : 'Unrated'}
          </span>
          <span className="text-[11px] text-[#8A8578]">
            ({row.totalRatings})
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* 240px Fixed Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area (offset by 240px on md+ screens) */}
      <div className="flex-1 md:pl-[240px] flex flex-col min-h-screen">
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h1 className="text-xl font-semibold text-[#1A1815] tracking-tight">
                System administration
              </h1>
              <p className="text-xs text-[#8A8578] mt-0.5">
                Overview of accounts, stores, and ratings metrics
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddUserOpen(true)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add user</span>
              </button>
              <button
                type="button"
                onClick={openAddStoreModal}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add store</span>
              </button>
            </div>
          </div>

          {/* Dotted Texture Hero Container behind Stat Cards */}
          <div className="p-4 sm:p-5 rounded-[8px] border border-[#E8E5DF] bg-[#FFFFFF] texture-dots hero-glow">
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                title="Total users"
                value={stats.totalUsers}
                icon={Users}
                subtitle="All roles registered"
              />
              <StatCard
                title="Total stores"
                value={stats.totalStores}
                icon={Store}
                subtitle="Active stores on platform"
              />
              <StatCard
                title="Total ratings"
                value={stats.totalRatings}
                icon={Star}
                subtitle="Verified ratings submitted"
              />
            </div>
          </div>

          {/* Table Container (flat and clean, NO dot texture inside) */}
          <div className="space-y-3">
            {/* View Switcher & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex items-center border-b border-[#E8E5DF] gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className={`pb-2 text-xs font-medium transition-colors relative cursor-pointer ${
                    activeTab === 'users'
                      ? 'text-[#1A1815] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C9714F]'
                      : 'text-[#8A8578] hover:text-[#2B2924]'
                  }`}
                >
                  Users ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('stores')}
                  className={`pb-2 text-xs font-medium transition-colors relative cursor-pointer ${
                    activeTab === 'stores'
                      ? 'text-[#1A1815] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C9714F]'
                      : 'text-[#8A8578] hover:text-[#2B2924]'
                  }`}
                >
                  Stores ({stores.length})
                </button>
              </div>

              {/* Filters */}
              {activeTab === 'users' ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#8A8578] absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search name, email, address..."
                      value={userFilters.search}
                      onChange={(e) =>
                        setUserFilters((prev) => ({ ...prev, search: e.target.value }))
                      }
                      className="craft-input pl-8 py-1.5 text-xs w-56"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={userFilters.role}
                      onChange={(e) =>
                        setUserFilters((prev) => ({ ...prev, role: e.target.value }))
                      }
                      className="craft-input py-1.5 text-xs bg-[#FFFFFF] pr-7 cursor-pointer"
                    >
                      <option value="">All roles</option>
                      <option value="ADMIN">Administrator</option>
                      <option value="STORE_OWNER">Store owner</option>
                      <option value="USER">Normal user</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8A8578] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search store name or address..."
                    value={storeFilters.search}
                    onChange={(e) =>
                      setStoreFilters({ search: e.target.value })
                    }
                    className="craft-input pl-8 py-1.5 text-xs w-64"
                  />
                </div>
              )}
            </div>

            {/* Dense Data Tables */}
            {activeTab === 'users' ? (
              <DataTable
                columns={userColumns}
                data={users}
                sortField={userSort.field}
                sortOrder={userSort.order}
                onSort={handleUserSort}
                loading={usersLoading}
                emptyTitle="No users found"
                emptyDescription="No users match the selected search or role filter."
                emptyAction={
                  <button
                    type="button"
                    onClick={() => setUserFilters({ search: '', role: '' })}
                    className="btn-secondary text-xs py-1 px-2.5"
                  >
                    Reset filters
                  </button>
                }
              />
            ) : (
              <DataTable
                columns={storeColumns}
                data={stores}
                sortField={storeSort.field}
                sortOrder={storeSort.order}
                onSort={handleStoreSort}
                loading={storesLoading}
                emptyTitle="No stores registered"
                emptyDescription="There are currently no stores matching your query."
                emptyAction={
                  <button
                    type="button"
                    onClick={openAddStoreModal}
                    className="btn-primary text-xs py-1 px-2.5"
                  >
                    Add a store
                  </button>
                }
              />
            )}
          </div>
        </main>
      </div>

      {/* Modal: Add User */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add user"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateUser} className="space-y-3.5">
          {addUserError && (
            <div className="p-2.5 bg-[#FAF9F6] border border-[#B5544A]/30 rounded-[8px] text-[#B5544A] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addUserError}</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-[#2B2924]">
                Full name (20 to 60 characters)
              </label>
              <span
                className={`text-[11px] tabular-nums ${
                  isUserNameValid
                    ? 'text-[#6B8F6B] font-medium'
                    : newUserData.name.length > 0
                    ? 'text-[#C9A15A]'
                    : 'text-[#8A8578]'
                }`}
              >
                {newUserData.name.length}/60
              </span>
            </div>
            <input
              type="text"
              required
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              placeholder="e.g. Alexander James Store Owner 1"
              className="w-full craft-input"
            />
            {newUserData.name.length > 0 && !isUserNameValid && (
              <p className="text-[11px] text-[#C9A15A] mt-1">
                {newUserData.name.trim().length < 20
                  ? `Needs ${20 - newUserData.name.trim().length} more characters (minimum 20 characters required)`
                  : 'Exceeds maximum length of 60 characters'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2924] mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full craft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2924] mb-1">
              Role
            </label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              className="w-full craft-input bg-[#FFFFFF] cursor-pointer"
            >
              <option value="USER">Normal user</option>
              <option value="STORE_OWNER">Store owner</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2924] mb-1">
              Address (max 400 characters)
            </label>
            <textarea
              required
              rows={2}
              value={newUserData.address}
              onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
              placeholder="Street address, city, state"
              className="w-full craft-input resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2924] mb-1">
              Password (8 to 16 characters)
            </label>
            <input
              type="password"
              required
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full craft-input"
            />
          </div>

          {/* Real-time Password Requirements Checklist */}
          {newUserData.password.length > 0 && (
            <div className="p-2.5 bg-[#FAF9F6] rounded-[8px] border border-[#E8E5DF] space-y-1 text-xs">
              <div className="flex items-center gap-2">
                {hasUserPassLength ? (
                  <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#8A8578]" />
                )}
                <span className={hasUserPassLength ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
                  8 to 16 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUserPassUpper ? (
                  <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#8A8578]" />
                )}
                <span className={hasUserPassUpper ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
                  At least 1 uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUserPassSpecial ? (
                  <Check className="w-3.5 h-3.5 text-[#6B8F6B]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#8A8578]" />
                )}
                <span className={hasUserPassSpecial ? 'text-[#6B8F6B] font-medium' : 'text-[#8A8578]'}>
                  At least 1 special character (!@#$%^&*...)
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addUserLoading}
              className="btn-primary text-xs py-1.5 px-3.5"
            >
              {addUserLoading ? 'Creating...' : 'Create user'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Store */}
      <Modal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        title="Register new store"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateStore} className="space-y-3.5">
          {addStoreError && (
            <div className="p-2.5 bg-[#FAF9F6] border border-[#B5544A]/30 rounded-[8px] text-[#B5544A] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addStoreError}</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-[#2B2924]">
                Store name (20 to 60 characters)
              </label>
              <span
                className={`text-[11px] tabular-nums ${
                  isStoreNameValid
                    ? 'text-[#6B8F6B] font-medium'
                    : newStoreData.name.length > 0
                    ? 'text-[#C9A15A]'
                    : 'text-[#8A8578]'
                }`}
              >
                {newStoreData.name.length}/60
              </span>
            </div>
            <input
              type="text"
              required
              value={newStoreData.name}
              onChange={(e) => setNewStoreData({ ...newStoreData, name: e.target.value })}
              placeholder="e.g. Apex Grand Artisan Emporium"
              className="w-full craft-input"
            />
            {newStoreData.name.length > 0 && !isStoreNameValid && (
              <p className="text-[11px] text-[#C9A15A] mt-1">
                {newStoreData.name.trim().length < 20
                  ? `Needs ${20 - newStoreData.name.trim().length} more characters (minimum 20 characters required)`
                  : 'Exceeds maximum length of 60 characters'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2924] mb-1">
              Store email
            </label>
            <input
              type="email"
              required
              value={newStoreData.email}
              onChange={(e) => setNewStoreData({ ...newStoreData, email: e.target.value })}
              placeholder="store@example.com"
              className="w-full craft-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2924] mb-1">
              Store address
            </label>
            <textarea
              required
              rows={2}
              value={newStoreData.address}
              onChange={(e) => setNewStoreData({ ...newStoreData, address: e.target.value })}
              placeholder="Store location details"
              className="w-full craft-input resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2924] mb-1">
              Assigned store owner
            </label>
            {availableOwners.length > 0 ? (
              <select
                required
                value={newStoreData.ownerId}
                onChange={(e) => setNewStoreData({ ...newStoreData, ownerId: e.target.value })}
                className="w-full craft-input bg-[#FFFFFF] cursor-pointer"
              >
                <option value="">Select an unassigned store owner...</option>
                {availableOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-[#C9A15A] p-2 rounded-[6px] bg-[#FAF9F6] border border-[#E8E5DF]">
                No available store owners found without a store. Create a store owner user first.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddStoreOpen(false)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addStoreLoading}
              className="btn-primary text-xs py-1.5 px-3.5"
            >
              {addStoreLoading ? 'Registering...' : 'Register store'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View User Details */}
      {selectedUserDetail && (
        <Modal
          isOpen={!!selectedUserDetail}
          onClose={() => setSelectedUserDetail(null)}
          title="User details"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5DF] space-y-2">
              <div>
                <span className="text-[#8A8578] block font-normal">Full name</span>
                <span className="text-[#1A1815] text-sm font-medium">{selectedUserDetail.name}</span>
              </div>
              <div>
                <span className="text-[#8A8578] block font-normal">Email</span>
                <span className="text-[#2B2924]">{selectedUserDetail.email}</span>
              </div>
              <div>
                <span className="text-[#8A8578] block font-normal">Role</span>
                <span className="font-medium text-[#4A6FA5]">{selectedUserDetail.role}</span>
              </div>
              <div>
                <span className="text-[#8A8578] block font-normal">Address</span>
                <span className="text-[#2B2924]">{selectedUserDetail.address}</span>
              </div>

              {selectedUserDetail.role === 'STORE_OWNER' && (
                <div className="pt-2 border-t border-[#E8E5DF]">
                  <span className="text-[#8A8578] block font-normal">Managed store & rating</span>
                  {selectedUserDetail.store ? (
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-medium text-[#1A1815]">{selectedUserDetail.store.name}</span>
                      <div className="flex items-center gap-1.5">
                        <StarRating value={selectedUserDetail.storeRating || 0} readOnly size="sm" />
                        <span className="font-medium tabular-nums text-[#2B2924]">
                          {selectedUserDetail.storeRating ? selectedUserDetail.storeRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#8A8578] italic">No store assigned yet</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="btn-secondary text-xs py-1.5 px-3"
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
