import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bed, Bath, Square, MapPin, Eye, Calendar,
  Check, ArrowLeft, ChevronLeft, ChevronRight,
  House, Building2, Building, Landmark, Sofa, Store
} from 'lucide-react';
import api from '../utils/api';
import {
  formatPrice, formatDate, getCategoryColor,
  categoryIcons, getPlaceholderImage
} from '../utils/helper';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const categoryLucideIcons = {
  house: House,
  apartment: Building2,
  condo: Building,
  villa: Landmark,
  studio: Sofa,
  commercial: Store,
};

/* ── Inquiry Form ────────────────────────────────────────── */
function InquiryForm({ listingId, listingTitle, user }) {
  const [form, setForm] = useState({
    name:    user?.username || '',
    email:   user?.email    || '',
    phone:   user?.phone?.startsWith('+91') ? user.phone : '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
      setForm(prev => ({ ...prev, phone: digits ? `+91 ${digits}` : '+91 ' }));
      return;
    }

    if (name === 'message') {
      setForm(prev => ({ ...prev, message: value.slice(0, 80) }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/inquiries', { ...form, listingId });
      setSubmitted(true);
      toast.success('Inquiry sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
          <Check size={20} className="text-emerald-500" />
        </div>
        <h3 className="font-display text-lg text-ink mb-2">Inquiry Sent</h3>
        <p className="font-body text-xs text-mist">
          Thank you for your interest in {listingTitle}. We will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <h3 className="font-display text-lg text-ink mb-1">Request Information</h3>
      <p className="font-body text-xs text-mist mb-5">
        Interested in this property? Send us a message.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">

        <div>
          <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
            Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onFocus={() => {
              if (!form.phone) {
                setForm(prev => ({ ...prev, phone: '+91 ' }));
              }
            }}
            required
            placeholder="+91 9876543210"
            inputMode="numeric"
            maxLength={14}
            className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block font-body text-xs text-mist uppercase tracking-widest mb-1.5">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={3}
            maxLength={80}
            placeholder="I am interested in this property..."
            className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-2.5 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-ink w-full py-3 text-xs tracking-wider uppercase disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sending...' : 'Send Inquiry'}
        </button>

      </form>
    </div>
  );
}

/* ── Listing Detail Page ─────────────────────────────────── */
export default function ListingDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [listing,   setListing]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => {
        toast.error('Listing not found');
        navigate('/listings');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  /* ── Loading skeleton ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="skeleton h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div
                className="skeleton w-full rounded-2xl"
                style={{ aspectRatio: '16/9' }}
              />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton w-20 h-16 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-40 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  /* ── Derived data ──────────────────────────────────────── */
  const images = listing.images?.length > 0
    ? listing.images
    : [getPlaceholderImage(0)];

  const amenities = [
    { key: 'parking',     label: 'Parking',      active: listing.parking },
    { key: 'furnished',   label: 'Furnished',    active: listing.furnished },
    { key: 'pool',        label: 'Pool',         active: listing.pool },
    { key: 'gym',         label: 'Gym',          active: listing.gym },
    { key: 'petFriendly', label: 'Pet Friendly', active: listing.petFriendly },
  ].filter(a => a.active);
  const CategoryIcon = categoryLucideIcons[listing.category];

  /* ── JSX ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-body text-xs text-mist hover:text-ink transition-colors mb-6 uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT COLUMN ──────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Main image */}
            <div
              className="relative rounded-2xl overflow-hidden bg-cream-2 mb-3"
              style={{ aspectRatio: '16/9' }}
            >
              <img
                src={images[activeImg]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/60 text-white flex items-center justify-center hover:bg-ink transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/60 text-white flex items-center justify-center hover:bg-ink transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-ink/60 text-white font-body text-xs px-3 py-1 rounded-full">
                  {activeImg + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? 'border-ink opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-75'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-6 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${getCategoryColor(listing.category)}`}>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  {CategoryIcon ? <CategoryIcon size={13} /> : categoryIcons[listing.category]}
                  {listing.category}
                </span>
              </span>
              {listing.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-body font-medium bg-amber-500/20 text-amber-700 border border-amber-500/30">
                  ★ Featured
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-body font-medium uppercase tracking-wider ${
                listing.status === 'active'
                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30'
                  : 'bg-gray-500/20 text-gray-600 border border-gray-300'
              }`}>
                {listing.status}
              </span>
            </div>

            {/* Title + address + price */}
            <h1 className="font-display text-3xl md:text-4xl text-ink font-light mb-2">
              {listing.title}
            </h1>
            <div className="flex items-center gap-1 text-mist font-body text-sm mb-4">
              <MapPin size={14} className="text-brand-500" />
              {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
            </div>
            <div className="font-display text-3xl text-ink mb-6">
              {formatPrice(listing.price)}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Bed size={18} />,    value: listing.bedrooms,                    label: 'Bedrooms'  },
                { icon: <Bath size={18} />,   value: listing.bathrooms,                   label: 'Bathrooms' },
                { icon: <Square size={18} />, value: `${listing.area?.toLocaleString()} ft²`, label: 'Area' },
              ].map(({ icon, value, label }) => (
                <div key={label} className="glass-panel p-4 text-center">
                  <div className="text-mist flex justify-center mb-2">{icon}</div>
                  <div className="font-display text-xl text-ink font-light">{value}</div>
                  <div className="font-body text-xs text-mist uppercase tracking-wider mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-display text-xl text-ink mb-3">
                About This Property
              </h2>
              <p className="font-body text-mist text-sm leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-xl text-ink mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {amenities.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-stone rounded-full font-body text-xs text-ink"
                    >
                      <Check size={12} className="text-emerald-500" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta footer */}
            <div className="flex items-center gap-4 font-body text-xs text-mist pt-6 border-t border-stone">
              <span className="flex items-center gap-1.5">
                <Eye size={12} /> {listing.views} views
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> Listed {formatDate(listing.createdAt)}
              </span>
            </div>

          </div>
          {/* END LEFT COLUMN */}

          {/* ── RIGHT SIDEBAR ────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">

            {/* Price card */}
            <div className="glass-panel p-6">
              <div className="font-display text-3xl text-ink mb-1">
                {formatPrice(listing.price)}
              </div>
              <p className="font-body text-xs text-mist uppercase tracking-wider mb-4">
                Asking Price
              </p>
              <div className="border-t border-stone pt-4 space-y-2">
                <div className="flex justify-between font-body text-xs">
                  <span className="text-mist">Category</span>
                  <span className="text-ink capitalize">{listing.category}</span>
                </div>
                <div className="flex justify-between font-body text-xs">
                  <span className="text-mist">Location</span>
                  <span className="text-ink">{listing.city}, {listing.state}</span>
                </div>
                <div className="flex justify-between font-body text-xs">
                  <span className="text-mist">Status</span>
                  <span className="text-ink capitalize">{listing.status}</span>
                </div>
              </div>
            </div>

            {/* Owner card */}
            {listing.owner && (
              <div className="glass-panel p-6">
                <h3 className="font-display text-lg text-ink mb-4">Listed By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={listing.owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.owner.username}`}
                    alt={listing.owner.username}
                    className="w-12 h-12 rounded-full object-cover border border-stone"
                  />
                  <div>
                    <div className="font-body text-sm font-medium text-ink">
                      {listing.owner.username}
                    </div>
                    {listing.owner.bio && (
                      <div className="font-body text-xs text-mist mt-0.5 line-clamp-2">
                        {listing.owner.bio}
                      </div>
                    )}
                  </div>
                </div>
                {listing.owner.phone && (
                  <a
                    href={`tel:${listing.owner.phone}`}
                    className="block w-full text-center btn-ghost py-2.5 text-xs"
                  >
                    {listing.owner.phone}
                  </a>
                )}
              </div>
            )}

            {/* Inquiry form */}
            <InquiryForm
              listingId={listing._id}
              listingTitle={listing.title}
              user={user}
            />

          </div>
          {/* END RIGHT SIDEBAR */}

        </div>
      </div>
    </div>
  );
}
