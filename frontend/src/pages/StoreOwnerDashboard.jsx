import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';
import {
  Building2,
  Users,
  MapPin,
  Mail,
  Calendar,
  Award,
} from 'lucide-react';

export const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });

  const fetchOwnerDashboard = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortField: sort.field,
        sortOrder: sort.order,
      });
      const res = await api.get(`/store-owner/dashboard?${params.toString()}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load store owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, [sort]);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columns = [
    {
      header: 'Customer Name',
      field: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{row.user.name}</span>
          <span className="text-[11px] text-slate-500">{row.user.email}</span>
        </div>
      ),
    },
    {
      header: 'Customer Location',
      field: 'address',
      sortable: false,
      render: (row) => (
        <span className="text-xs text-slate-600 line-clamp-1 max-w-xs" title={row.user.address}>
          {row.user.address}
        </span>
      ),
    },
    {
      header: 'Rating Submitted',
      field: 'rating',
      render: (row) => (
        <div className="flex items-center gap-2">
          <StarRating value={row.rating} readOnly size="sm" />
          <span className="text-xs font-bold text-amber-600">
            {row.rating} / 5
          </span>
        </div>
      ),
    },
    {
      header: 'Submitted Date',
      field: 'createdAt',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
  ];

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading store performance metrics...</p>
        </div>
      </div>
    );
  }

  if (!data?.hasStore) {
    return (
      <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-amber-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">No Store Assigned Yet</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your store owner account is registered, but a System Administrator has not assigned a store to your profile yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50/60 via-slate-50 to-blue-50/50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              Store Owner Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900">
              {data.store.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.store.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.store.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 text-center shadow-xs">
              <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
                Store Overall Rating
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <StarRating value={data.averageRating} readOnly size="md" />
                <span className="text-3xl font-extrabold font-display text-amber-600">
                  {data.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard
          title="Average Customer Rating"
          value={`${data.averageRating.toFixed(1)} / 5.0`}
          icon={Award}
          color="amber"
          subtitle="Computed average from all submitted ratings"
        />
        <StatCard
          title="Total Customers Rated"
          value={data.totalRatings}
          icon={Users}
          color="emerald"
          subtitle="Unique customers who submitted ratings"
        />
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900">Customer Reviews & Ratings</h2>
            <p className="text-xs text-slate-500">
              Full breakdown of customers who rated your store
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Click column headers to sort ascending / descending
          </p>
        </div>

        <DataTable
          columns={columns}
          data={data.ratings}
          sortField={sort.field}
          sortOrder={sort.order}
          onSort={handleSort}
          loading={loading}
          emptyMessage="No customer ratings received yet."
        />
      </div>
    </div>
  );
};
