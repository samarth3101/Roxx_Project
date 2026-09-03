import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Sidebar } from '../components/Sidebar';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';
import {
  Building2,
  Calendar,
  MapPin,
  Mail,
  AlertCircle,
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
      header: 'Customer',
      field: 'name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#1A1815]">{row.user.name}</span>
          <span className="text-[11px] text-[#8A8578]">{row.user.email}</span>
        </div>
      ),
    },
    {
      header: 'Location',
      field: 'address',
      sortable: false,
      render: (row) => (
        <span className="text-xs text-[#8A8578] line-clamp-1 max-w-xs" title={row.user.address}>
          {row.user.address}
        </span>
      ),
    },
    {
      header: 'Rating submitted',
      field: 'rating',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <StarRating value={row.rating} readOnly size="sm" />
          <span className="text-xs tabular-nums text-[#2B2924] font-medium">
            {row.rating} / 5
          </span>
        </div>
      ),
    },
    {
      header: 'Date',
      field: 'createdAt',
      render: (row) => (
        <span className="text-xs tabular-nums text-[#8A8578]">
          {new Date(row.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
  ];

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-[#8A8578]">
          <div className="w-5 h-5 border-2 border-[#C9714F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Loading store performance...</p>
        </div>
      </div>
    );
  }

  if (!data?.hasStore) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex">
        <Sidebar activeTab="store" />
        <div className="flex-1 md:pl-[240px] p-8 flex items-center justify-center">
          <div className="craft-card p-8 max-w-md w-full text-center space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#FAF9F6] border border-[#E8E5DF] text-[#C9714F] flex items-center justify-center mx-auto">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-[#1A1815]">No store assigned yet</h2>
            <p className="text-xs text-[#8A8578] leading-relaxed">
              Your store owner account is active, but an administrator has not yet assigned a store to your profile. Please contact your platform admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* 240px Fixed Sidebar */}
      <Sidebar activeTab="store" />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[240px] flex flex-col min-h-screen">
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Header Row */}
          <div className="pb-2 border-b border-[#E8E5DF] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-xl font-semibold text-[#1A1815] tracking-tight">
                {data.store.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A8578] mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8A8578]" />
                  <span>{data.store.address}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#8A8578]" />
                  <span>{data.store.email}</span>
                </span>
              </div>
            </div>

            <span className="text-xs text-[#8A8578]">
              {data.totalRatings} total {data.totalRatings === 1 ? 'rating' : 'ratings'}
            </span>
          </div>

          {/* Hero Stat: Average Rating (Large Tabular Numerals) with Dotted Texture */}
          <div className="craft-card p-6 rounded-[8px] texture-dots hero-glow relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#8A8578] font-normal block">
                  Store average rating
                </span>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className="text-[40px] font-semibold tabular-nums tracking-tight text-[#1A1815] leading-none">
                    {data.averageRating.toFixed(1)}
                  </span>
                  <div className="flex flex-col">
                    <StarRating value={data.averageRating} readOnly size="md" />
                    <span className="text-[11px] text-[#8A8578] mt-0.5">
                      Based on {data.totalRatings} customer {data.totalRatings === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:border-l sm:border-[#E8E5DF] sm:pl-6 text-xs text-[#8A8578] space-y-1">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span>Rating scale:</span>
                  <span className="text-[#2B2924] font-medium">1 to 5 stars</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span>Verified raters:</span>
                  <span className="text-[#2B2924] font-medium tabular-nums">{data.totalRatings} users</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#1A1815]">Customer ratings</h2>
                <p className="text-xs text-[#8A8578]">All submitted ratings for your store</p>
              </div>

              <span className="text-xs text-[#8A8578]">
                Click column headers to sort
              </span>
            </div>

            <DataTable
              columns={columns}
              data={data.ratings}
              sortField={sort.field}
              sortOrder={sort.order}
              onSort={handleSort}
              loading={loading}
              emptyTitle="No customer ratings yet"
              emptyDescription="Ratings submitted by users will appear here."
            />
          </div>
        </main>
      </div>
    </div>
  );
};
