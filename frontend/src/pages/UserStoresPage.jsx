import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';
import { Modal } from '../components/Modal';
import {
  Store,
  Search,
  Edit3,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const UserStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'name', order: 'asc' });

  // Rating Modal
  const [ratingModalStore, setRatingModalStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        sortField: sort.field,
        sortOrder: sort.order,
      });
      const res = await api.get(`/stores?${params.toString()}`);
      if (res.data.success) {
        setStores(res.data.data.stores);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sort]);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const openRatingModal = (store) => {
    setRatingModalStore(store);
    setSelectedRating(store.userRating || 5);
    setRatingError('');
    setRatingSuccess('');
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!ratingModalStore || !selectedRating) return;

    setRatingSubmitting(true);
    setRatingError('');
    setRatingSuccess('');

    try {
      const res = await api.post('/ratings', {
        storeId: ratingModalStore.id,
        rating: Number(selectedRating),
      });

      if (res.data.success) {
        setRatingSuccess('Rating saved successfully!');
        setTimeout(() => {
          setRatingModalStore(null);
          setRatingSuccess('');
          fetchStores();
        }, 1200);
      }
    } catch (err) {
      setRatingError(err.response?.data?.message || err.message || 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Store Name',
      field: 'name',
      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block group-hover:text-blue-600 transition-colors">
              {row.name}
            </span>
            <span className="text-[11px] text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Address',
      field: 'address',
      render: (row) => (
        <div className="flex items-start gap-1.5 max-w-sm">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-600 line-clamp-2" title={row.address}>
            {row.address}
          </span>
        </div>
      ),
    },
    {
      header: 'Overall Rating',
      field: 'overallRating',
      render: (row) => (
        <div className="flex items-center gap-2">
          <StarRating value={row.overallRating} readOnly size="sm" />
          <span className="text-xs font-bold text-amber-600">
            {row.overallRating > 0 ? row.overallRating.toFixed(1) : 'No reviews'}
          </span>
          <span className="text-[10px] text-slate-500">
            ({row.totalRatings} {row.totalRatings === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      ),
    },
    {
      header: 'Your Submitted Rating',
      field: 'userRating',
      render: (row) => {
        if (row.userRating) {
          return (
            <div className="flex items-center gap-2">
              <StarRating value={row.userRating} readOnly size="sm" />
              <span className="text-xs font-bold text-blue-700">
                {row.userRating} / 5
              </span>
            </div>
          );
        }
        return <span className="text-xs text-slate-400 italic">Not rated yet</span>;
      },
    },
    {
      header: 'Action',
      field: 'action',
      sortable: false,
      render: (row) => {
        const hasRated = !!row.userRating;
        return (
          <button
            type="button"
            onClick={() => openRatingModal(row)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs ${
              hasRated
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            {hasRated ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modify Rating</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Rate Store</span>
              </>
            )}
          </button>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50/50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Community Store Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900">
              Explore & Rate Stores
            </h1>
            <p className="text-sm text-slate-600 max-w-xl">
              Browse registered stores, search by location or name, and share your ratings to help others find top-quality local shops.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Available Stores</p>
              <p className="text-2xl font-bold font-display text-slate-900 mt-0.5">{stores.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Your Rated</p>
              <p className="text-2xl font-bold font-display text-blue-600 mt-0.5">
                {stores.filter((s) => s.userRating).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Content Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search stores by Name or Address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <p className="text-xs text-slate-500">
            Click column headers to sort ascending / descending
          </p>
        </div>

        {/* Stores Table */}
        <DataTable
          columns={columns}
          data={stores}
          sortField={sort.field}
          sortOrder={sort.order}
          onSort={handleSort}
          loading={loading}
          emptyMessage="No stores found matching your search."
        />
      </div>

      {/* Modal: Submit / Modify Rating */}
      {ratingModalStore && (
        <Modal
          isOpen={!!ratingModalStore}
          onClose={() => setRatingModalStore(null)}
          title={
            ratingModalStore.userRating
              ? `Modify Rating for ${ratingModalStore.name}`
              : `Submit Rating for ${ratingModalStore.name}`
          }
          maxWidth="max-w-md"
        >
          <form onSubmit={submitRating} className="space-y-5 text-center">
            {ratingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{ratingError}</span>
              </div>
            )}

            {ratingSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{ratingSuccess}</span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-slate-600">
                Select your score between 1 (Poor) to 5 (Excellent):
              </p>
              <div className="py-3 flex items-center justify-center">
                <StarRating
                  value={selectedRating}
                  onChange={(val) => setSelectedRating(val)}
                  size="xl"
                />
              </div>
              <p className="text-sm font-bold text-amber-600">
                {selectedRating} Star{selectedRating > 1 ? 's' : ''} Selected
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRatingModalStore(null)}
                className="btn-secondary text-xs px-3 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={ratingSubmitting}
                className="btn-primary text-xs px-4 py-2"
              >
                {ratingSubmitting ? 'Saving...' : 'Confirm Rating'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
