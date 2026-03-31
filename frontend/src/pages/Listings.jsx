import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { CardSkeleton } from '../components/Skeleton';
function EmptyState({ onReset }) {
  return (
    <div className="text-center py-24 bg-white rounded-3xl border border-stone border-dashed">
      <div className="text-6xl mb-4">🏡</div>
      <h3 className="font-display text-2xl text-ink font-light mb-2">
        No properties found
      </h3>
      <p className="font-body text-mist text-sm mb-8 max-w-xs mx-auto">
        Try adjusting your filters or search terms to find what you are looking for.
      </p>
      <button onClick={onReset} className="btn-ink px-8 py-3 text-xs tracking-wider">
        Clear All Filters
      </button>
    </div>
  );
}
function Pagination({ page, pages, onPageChange }) {
  const getPageNumbers = () => {
    const nums = [];
    const delta = 2;
    const left = page - delta;
    const right = page + delta;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= left && i <= right)) {
        nums.push(i);
      }
    }

    // Insert ellipsis markers
    const withEllipsis = [];
    let prev = null;
    for (const num of nums) {
      if (prev && num - prev > 1) {
        withEllipsis.push('...');
      }
      withEllipsis.push(num);
      prev = num;
    }
    return withEllipsis;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">

      {/* Previous button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-xl border border-stone font-body text-xs text-mist hover:text-ink hover:border-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((num, i) => (
        num === '...'
          ? <span key={`ellipsis-${i}`} className="font-body text-xs text-mist px-2">...</span>
          : <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-9 h-9 rounded-xl font-body text-xs transition-all ${
                num === page
                  ? 'bg-ink text-cream border border-ink'
                  : 'border border-stone text-mist hover:text-ink hover:border-ink'
              }`}
            >
              {num}
            </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-4 py-2 rounded-xl border border-stone font-body text-xs text-mist hover:text-ink hover:border-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next
      </button>

    </div>
  );
}

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const filters = {
    search:     searchParams.get('search') || '',
    category:   searchParams.get('category') || 'all',
    city:       searchParams.get('city') || '',
    minPrice:   searchParams.get('minPrice') || '',
    maxPrice:   searchParams.get('maxPrice') || '',
    bedrooms:   searchParams.get('bedrooms') || 'any',
    bathrooms:  searchParams.get('bathrooms') || 'any',
    furnished:  searchParams.get('furnished') || '',
    parking:    searchParams.get('parking') || '',
    pool:       searchParams.get('pool') || '',
    gym:        searchParams.get('gym') || '',
    petFriendly: searchParams.get('petFriendly') || '',
    featured:   searchParams.get('featured') || '',
    page:       searchParams.get('page') || '1',
    sort:       searchParams.get('sort') || 'createdAt',
    order:      searchParams.get('order') || 'desc',
  };
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.search)                        params.set('search', filters.search);
      if (filters.category && filters.category !== 'all') params.set('category', filters.category);
      if (filters.city)                          params.set('city', filters.city);
      if (filters.minPrice)                      params.set('minPrice', filters.minPrice);
      if (filters.maxPrice)                      params.set('maxPrice', filters.maxPrice);
      if (filters.bedrooms && filters.bedrooms !== 'any') params.set('bedrooms', filters.bedrooms);
      if (filters.bathrooms && filters.bathrooms !== 'any') params.set('bathrooms', filters.bathrooms);
      if (filters.furnished === 'true')          params.set('furnished', 'true');
      if (filters.parking === 'true')            params.set('parking', 'true');
      if (filters.pool === 'true')               params.set('pool', 'true');
      if (filters.gym === 'true')                params.set('gym', 'true');
      if (filters.petFriendly === 'true')        params.set('petFriendly', 'true');
      if (filters.featured === 'true')           params.set('featured', 'true');

      params.set('page', filters.page);
      params.set('sort', filters.sort);
      params.set('order', filters.order);
      params.set('limit', '12');

      const { data } = await api.get(`/listings?${params.toString()}`);
      setListings(data.listings);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  const handleFilterChange = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== 'any') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Reset to page 1 whenever a filter changes
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const [sort, order] = e.target.value.split('-');
    const next = new URLSearchParams(searchParams);
    next.set('sort', sort);
    next.set('order', order);
    next.set('page', '1');
    setSearchParams(next);
  };
  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl text-ink font-light mb-2">
            Properties
          </h1>
          <p className="font-body text-sm text-mist">
            {loading ? 'Searching...' : `${total} ${total === 1 ? 'property' : 'properties'} found`}
          </p>
        </div>

        {/* Search and filter bar */}
        <SearchBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          sortValue={`${filters.sort}-${filters.order}`}
          onSortChange={handleSortChange}
          resultsSummary={!loading ? `Showing ${listings.length} of ${total}` : 'Searching...'}
        />

        {/* Listings grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <PropertyCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <Pagination
            page={Number(filters.page)}
            pages={pages}
            onPageChange={handlePageChange}
          />
        )}

      </div>
    </div>
  );
}
