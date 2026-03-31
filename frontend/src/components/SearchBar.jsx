import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = ['all', 'house', 'apartment', 'condo', 'villa', 'studio', 'commercial'];

export default function SearchBar({ filters, onChange, onReset, sortValue, onSortChange, resultsSummary }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <div
      className="mb-8 rounded-[2rem] border border-white/45 px-5 py-4 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(247,251,255,0.42) 100%)',
        boxShadow: '0 18px 45px rgba(116, 146, 182, 0.10), inset 0 1px 0 rgba(255,255,255,0.55)',
      }}
    >

      {/* Main search row */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Text search */}
        <div
          className="flex h-[42px] w-full min-w-0 items-center gap-3 rounded-full px-4 border sm:w-[270px] sm:flex-shrink-0"
          style={{
            background: 'linear-gradient(90deg, rgba(187,216,244,0.72) 0%, rgba(198,219,247,0.58) 35%, rgba(214,225,249,0.48) 100%)',
            borderColor: 'rgba(150, 186, 223, 0.72)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.48), 0 8px 24px rgba(149, 177, 209, 0.08)',
          }}
        >
          <Search size={16} className="text-[#4f6a90] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by title, city, or description..."
            value={filters.search || ''}
            onChange={e => onChange('search', e.target.value)}
            className="input-clean min-w-0 bg-transparent text-[0.95rem] text-[#355075] placeholder:text-[#7b96bb]"
          />
        </div>

        {/* Category select */}
        <select
          value={filters.category || 'all'}
          onChange={e => onChange('category', e.target.value)}
          className="input-clean h-[42px] w-[calc(50%-0.375rem)] min-w-[140px] flex-1 rounded-full px-4 text-sm cursor-pointer border backdrop-blur-sm transition-all duration-300 hover:border-[#96b8dc] hover:bg-white/72 sm:w-[148px] sm:flex-none"
          style={{
            background: 'rgba(205, 224, 246, 0.52)',
            borderColor: 'rgba(150, 186, 223, 0.72)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.44)',
          }}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Types' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Sort select */}
        <div className="relative min-w-[132px] flex-1 sm:flex-none">
          <ArrowUpDown
            size={13}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8da3bf]"
          />
          <select
            value={sortValue}
            onChange={onSortChange}
            className="input-clean h-[42px] w-full appearance-none rounded-full pl-9 pr-8 text-sm text-ink cursor-pointer backdrop-blur-sm transition-all duration-300 hover:border-[#9ab7da] hover:bg-white/82 focus:border-[#7da3cf] sm:w-[142px]"
            style={{
              background: 'rgba(255, 255, 255, 0.66)',
              borderColor: 'rgba(184, 206, 230, 0.9)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.58)',
            }}
          >
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="price-asc">Price Low</option>
            <option value="price-desc">Price High</option>
            <option value="views-desc">Most Viewed</option>
          </select>
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced(s => !s)}
          className={`flex h-[42px] min-w-[120px] flex-1 items-center justify-center gap-2 rounded-full border px-3.5 font-body text-xs tracking-wide transition-all sm:flex-none ${
            showAdvanced
              ? 'text-cream border-ink'
              : 'text-[#547198] hover:border-[#7fabc9] hover:text-ink'
          }`}
          style={showAdvanced ? {
            background: 'rgba(15,31,61,0.92)',
            boxShadow: '0 10px 24px rgba(15,31,61,0.14)',
          } : {
            background: 'rgba(205, 224, 246, 0.50)',
            borderColor: 'rgba(150, 186, 223, 0.72)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.44)',
          }}
        >
          <SlidersHorizontal size={13} />
          Filters
        </button>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="flex h-[42px] min-w-[110px] flex-1 items-center justify-center gap-1.5 rounded-full border px-3.5 font-body text-xs text-[#547198] transition-all hover:text-red-500 hover:border-red-200 sm:flex-none"
          style={{
            background: 'rgba(205, 224, 246, 0.44)',
            borderColor: 'rgba(150, 186, 223, 0.72)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.44)',
          }}
        >
          <X size={13} />
          Reset
        </button>

        {resultsSummary ? (
          <p className="w-full pt-1 text-left font-body text-xs tracking-[0.04em] text-[#5f789c] sm:ml-auto sm:w-auto sm:pt-0 sm:text-right">
            {resultsSummary}
          </p>
        ) : null}

      </div>

      {/* Advanced filters — shown when toggle is active */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-stone grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* Min price */}
          <div>
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
              Min Price
            </label>
            <input
              type="number"
              placeholder="5,00,000"
              value={filters.minPrice || ''}
              onChange={e => onChange('minPrice', e.target.value)}
              className="input-clean bg-cream-2 border border-stone rounded-xl px-3 py-2"
            />
          </div>

          {/* Max price */}
          <div>
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
              Max Price
            </label>
            <input
              type="number"
              placeholder="1,00,00,000"
              value={filters.maxPrice || ''}
              onChange={e => onChange('maxPrice', e.target.value)}
              className="input-clean bg-cream-2 border border-stone rounded-xl px-3 py-2"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms || 'any'}
              onChange={e => onChange('bedrooms', e.target.value)}
              className="input-clean bg-cream-2 border border-stone rounded-xl px-3 py-2 cursor-pointer"
            >
              {['any', '1', '2', '3', '4', '5'].map(v => (
                <option key={v} value={v}>
                  {v === 'any' ? 'Any' : `${v}+`}
                </option>
              ))}
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
              Bathrooms
            </label>
            <select
              value={filters.bathrooms || 'any'}
              onChange={e => onChange('bathrooms', e.target.value)}
              className="input-clean bg-cream-2 border border-stone rounded-xl px-3 py-2 cursor-pointer"
            >
              {['any', '1', '2', '3', '4'].map(v => (
                <option key={v} value={v}>
                  {v === 'any' ? 'Any' : `${v}+`}
                </option>
              ))}
            </select>
          </div>

          {/* Amenity checkboxes */}
          <div className="col-span-2 md:col-span-4 flex flex-wrap gap-3 pt-1">
            {[
              { key: 'parking', label: 'Parking' },
              { key: 'furnished', label: 'Furnished' },
              { key: 'pool', label: 'Pool' },
              { key: 'gym', label: 'Gym' },
              { key: 'petFriendly', label: 'Pet Friendly' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border font-body text-xs cursor-pointer transition-all ${
                  filters[key] === 'true'
                    ? 'bg-ink text-cream border-ink'
                    : 'bg-cream-2 text-mist border-stone hover:border-ink'
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters[key] === 'true'}
                  onChange={e => onChange(key, e.target.checked ? 'true' : '')}
                  className="hidden"
                />
                {label}
              </label>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
