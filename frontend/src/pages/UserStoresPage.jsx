import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';
import { TweenNumber } from '../components/TweenNumber';
import { Modal } from '../components/Modal';
import {
  Store,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Plus,
  Check,
  AlertCircle,
  MapPin,
} from 'lucide-react';

export const UserStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [sort, setSort] = useState({ field: 'name', order: 'asc' });

  // Rating Modal / Action State
  const [ratingModalStore, setRatingModalStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [justRatedStoreId, setJustRatedStoreId] = useState(null);

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
        setRatingSuccess('Rating saved.');
        const updatedStoreId = ratingModalStore.id;
        setJustRatedStoreId(updatedStoreId);

        setTimeout(() => {
          setRatingModalStore(null);
          setRatingSuccess('');
          fetchStores();
        }, 1000);

        setTimeout(() => {
          setJustRatedStoreId(null);
        }, 2500);
      }
    } catch (err) {
      setRatingError(err.response?.data?.message || err.message || 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  // List View Columns
  const columns = [
    {
      header: 'Store name',
      field: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[6px] bg-[#FAF9F6] border border-[#E8E5DF] flex items-center justify-center text-[#C9714F] shrink-0">
            <Store className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[#1A1815]">{row.name}</span>
            <span className="text-[11px] text-[#8A8578]">{row.email}</span>
          </div>
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
      header: 'Overall rating',
      field: 'overallRating',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <StarRating
            value={row.overallRating}
            readOnly
            size="sm"
            triggerSequentialAnimation={justRatedStoreId === row.id}
          />
          <span className="text-xs tabular-nums text-[#2B2924] font-medium">
            {justRatedStoreId === row.id ? (
              <TweenNumber value={row.overallRating} />
            ) : row.overallRating > 0 ? (
              row.overallRating.toFixed(1)
            ) : (
              'Unrated'
            )}
          </span>
          <span className="text-[11px] text-[#8A8578]">
            ({row.totalRatings})
          </span>
        </div>
      ),
    },
    {
      header: 'Your rating',
      field: 'userRating',
      render: (row) => {
        if (row.userRating) {
          return (
            <div className="flex items-center gap-1.5">
              <StarRating
                value={row.userRating}
                readOnly
                size="sm"
                triggerSequentialAnimation={justRatedStoreId === row.id}
              />
              <span className="text-xs tabular-nums text-[#C9714F] font-medium">
                {row.userRating} / 5
              </span>
            </div>
          );
        }
        return <span className="text-xs text-[#8A8578] italic">Unrated</span>;
      },
    },
    {
      header: '',
      field: 'action',
      sortable: false,
      className: 'text-right w-28',
      render: (row) => {
        const hasRated = !!row.userRating;
        return (
          <button
            type="button"
            onClick={() => openRatingModal(row)}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5] ${
              hasRated
                ? 'text-[#2B2924] bg-[#FFFFFF] border border-[#E8E5DF] hover:bg-[#FAF9F6]'
                : 'text-[#FFFFFF] bg-[#C9714F] hover:bg-[#B5613F]'
            }`}
          >
            {hasRated ? (
              <>
                <Edit2 className="w-3 h-3 text-[#8A8578]" />
                <span>Modify</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>Rate</span>
              </>
            )}
          </button>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E5DF]">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1815] tracking-tight">
            Store explorer
          </h1>
          <p className="text-xs text-[#8A8578] mt-0.5">
            Search verified stores and submit ratings
          </p>
        </div>

        {/* Search and Grid/List Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8A8578] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by store name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="craft-input pl-8 py-1.5 text-xs w-64"
            />
          </div>

          <div className="inline-flex rounded-[8px] bg-[#FFFFFF] border border-[#E8E5DF] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-[6px] transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#FAF9F6] text-[#1A1815]'
                  : 'text-[#8A8578] hover:text-[#1A1815]'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[6px] transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#FAF9F6] text-[#1A1815]'
                  : 'text-[#8A8578] hover:text-[#1A1815]'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stores Content View */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={stores}
          sortField={sort.field}
          sortOrder={sort.order}
          onSort={handleSort}
          loading={loading}
          emptyTitle="No stores found"
          emptyDescription="No registered stores match your search query."
          emptyAction={
            search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="btn-secondary text-xs py-1 px-2.5"
              >
                Clear search
              </button>
            ) : null
          }
        />
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-16 text-center text-[#8A8578]">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[#C9714F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs">Loading stores...</p>
              </div>
            </div>
          ) : stores.length === 0 ? (
            <div className="col-span-full craft-card p-12 text-center text-[#8A8578] space-y-2">
              <p className="text-sm font-medium text-[#1A1815]">No stores found</p>
              <p className="text-xs text-[#8A8578]">Try adjusting your search criteria.</p>
              {search && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="btn-secondary text-xs py-1 px-2.5"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          ) : (
            stores.map((store) => {
              const hasRated = !!store.userRating;
              return (
                <div
                  key={store.id}
                  className="craft-card p-4 flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-[6px] bg-[#FAF9F6] border border-[#E8E5DF] flex items-center justify-center text-[#C9714F] shrink-0">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-medium text-sm text-[#1A1815] line-clamp-1" title={store.name}>
                          {store.name}
                        </h3>
                      </div>

                      <span className="text-[11px] tabular-nums font-medium text-[#2B2924] shrink-0">
                        {justRatedStoreId === store.id ? (
                          <TweenNumber value={store.overallRating} />
                        ) : store.overallRating > 0 ? (
                          store.overallRating.toFixed(1)
                        ) : (
                          '—'
                        )}
                        <span className="text-[#8A8578] font-normal text-[10px] ml-0.5">★</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#8A8578] flex items-start gap-1 line-clamp-2" title={store.address}>
                      <MapPin className="w-3 h-3 text-[#8A8578] shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8E5DF] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#8A8578]">Your rating</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <StarRating
                          value={store.userRating || 0}
                          readOnly
                          size="sm"
                          triggerSequentialAnimation={justRatedStoreId === store.id}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openRatingModal(store)}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A6FA5] ${
                        hasRated
                          ? 'text-[#2B2924] bg-[#FFFFFF] border border-[#E8E5DF] hover:bg-[#FAF9F6]'
                          : 'text-[#FFFFFF] bg-[#C9714F] hover:bg-[#B5613F]'
                      }`}
                    >
                      {hasRated ? (
                        <>
                          <Edit2 className="w-3 h-3 text-[#8A8578]" />
                          <span>Modify</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Rate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal: Rating Submission / Modification */}
      {ratingModalStore && (
        <Modal
          isOpen={!!ratingModalStore}
          onClose={() => setRatingModalStore(null)}
          title={
            ratingModalStore.userRating
              ? `Modify rating: ${ratingModalStore.name}`
              : `Rate store: ${ratingModalStore.name}`
          }
          maxWidth="max-w-sm"
        >
          <form onSubmit={submitRating} className="space-y-4 text-center">
            {ratingError && (
              <div className="p-2.5 bg-[#FAF9F6] border border-[#B5544A]/30 rounded-[8px] text-[#B5544A] text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{ratingError}</span>
              </div>
            )}

            {ratingSuccess && (
              <div className="p-2.5 bg-[#FAF9F6] border border-[#6B8F6B]/30 rounded-[8px] text-[#6B8F6B] text-xs flex items-center gap-2 justify-center">
                <Check className="w-4 h-4 shrink-0" />
                <span>{ratingSuccess}</span>
              </div>
            )}

            <div className="space-y-2 py-2">
              <p className="text-xs text-[#8A8578]">
                Select a score from 1 to 5 stars
              </p>
              <div className="py-2 flex items-center justify-center">
                <StarRating
                  value={selectedRating}
                  onChange={(val) => setSelectedRating(val)}
                  size="xl"
                />
              </div>
              <p className="text-sm font-semibold tabular-nums text-[#C9714F]">
                {selectedRating} out of 5 stars
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E5DF]">
              <button
                type="button"
                onClick={() => setRatingModalStore(null)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={ratingSubmitting}
                className="btn-primary text-xs py-1.5 px-3.5"
              >
                {ratingSubmitting ? 'Saving...' : 'Confirm rating'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
