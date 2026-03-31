import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Eye } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getPlaceholderImage } from '../utils/helper';
export default function PropertyCard({ listing }) {
  const [imgErr, setImgErr] = useState(false);
  const [hov, setHov] = useState(false);

  const img = (!imgErr && listing.images?.length > 0)
    ? listing.images[0]
    : getPlaceholderImage(listing._id?.charCodeAt(0) || 0);

  const categoryLabel = listing.category
    ? listing.category.charAt(0).toUpperCase() + listing.category.slice(1)
    : null;
    return (
    <Link
      to={`/listing/${listing._id}`}
      className="block prop-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image section */}
      <div className="prop-card-media" style={{ aspectRatio: '4/3' }}>
        <img
          src={img}
          alt={listing.title}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover"
        />

        {/* Dark gradient + price on hover */}
        <div
          className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(15,31,61,0.65) 0%, transparent 55%)',
            opacity: hov ? 1 : 0
          }}
        >
          <span className="font-display text-white text-3xl font-light">
            {formatPrice(listing.price)}
          </span>
        </div>

        {/* Category badge top left */}
        <div className="absolute top-3 left-3">
          <div className="prop-card-badges">
            {categoryLabel && (
              <span className="prop-card-tag prop-card-tag--category font-body text-[0.6rem] tracking-[0.15em] uppercase">
                {categoryLabel}
              </span>
            )}
          </div>
        </div>

        {/* View count bottom right — fades out on hover */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1 font-body text-white/60 text-xs"
          style={{ opacity: hov ? 0 : 1, transition: 'opacity 0.2s' }}
        >
          <Eye size={11} /> {listing.views || 0}
        </div>
      </div>

      {/* Info section */}
      <div className="prop-card-body p-5 border-t border-cream-2">

        {/* Title and price */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display text-lg font-light text-ink line-clamp-1 leading-snug">
            {listing.title}
          </h3>
          {!hov && (
            <span className="font-body text-sm font-medium whitespace-nowrap flex-shrink-0 text-brand-500">
              {formatPrice(listing.price)}
            </span>
          )}
        </div>

        {/* Location */}
        <p className="font-body text-xs flex items-center gap-1 mb-4 text-mist">
          <MapPin size={11} /> {listing.city}, {listing.state}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-3 border-t border-cream-2 font-body text-xs text-mist">
          <span className="flex items-center gap-1.5">
            <Bed size={12} /> {listing.bedrooms} bd
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={12} /> {listing.bathrooms} ba
          </span>
          <span className="flex items-center gap-1.5">
            <Square size={12} /> {listing.area?.toLocaleString()} ft²
          </span>
        </div>

      </div>
    </Link>
  );
}