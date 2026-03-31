import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  Trash2, Home, Mail, Phone,
  Edit, Upload, PenTool, Plus
} from 'lucide-react';
import { formatPrice, formatDate, getPlaceholderImage } from '../../utils/helper';
import toast from 'react-hot-toast';
import Avatar from '../../components/Avatar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
export default function AdminDashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [inquiries,      setInquiries]      = useState([]);
  const [listings,       setListings]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [tab,            setTab]            = useState('inquiries');
  const [avatarUpdating, setAvatarUpdating] = useState(false);
  const [deleteModal,    setDeleteModal]    = useState({ open: false, id: null });
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    Promise.all([
      api.get('/inquiries'),
      api.get('/listings?limit=100'),
    ]).then(([iRes, lRes]) => {
      setInquiries(iRes.data);
      setListings(lRes.data.listings || []);
    }).catch(() => {
      toast.error('Failed to load dashboard data');
    }).finally(() => setLoading(false));
  }, [navigate, user]);
  const handleDeleteListing = async () => {
    try {
      await api.delete(`/listings/${deleteModal.id}`);
      setListings(prev => prev.filter(l => l._id !== deleteModal.id));
      toast.success('Listing removed');
    } catch {
      toast.error('Failed to delete listing');
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setAvatarUpdating(true);
        const { data } = await api.put(`/users/${user._id}`, {
          avatar: reader.result
        });
        updateUser(data);
        toast.success('Profile picture updated');
      } catch {
        toast.error('Failed to update profile picture');
      } finally {
        setAvatarUpdating(false);
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">

            {/* Avatar with upload on hover */}
            <div className="relative group h-16 w-16 overflow-hidden rounded-full">
              <Avatar
                src={user?.avatar}
                alt={user?.username}
                size={64}
                className="border-2 border-stone shadow-sm"
              />
              <label className="absolute inset-0 rounded-full bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-center">
                <Upload size={16} />
                <span className="text-[0.55rem] uppercase tracking-[0.18em] mt-1">
                  {avatarUpdating ? 'Saving' : 'Upload'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={avatarUpdating}
                />
              </label>
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                Admin Portal
              </h1>
              <p className="text-mist text-sm">
                Welcome back, {user?.username}
              </p>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/create-listing"
              className="btn-ink flex items-center gap-2 text-xs tracking-wider"
            >
              <Plus size={14} /> New Listing
            </Link>
            <Link
              to="/admin/create-article"
              className="btn-ghost flex items-center gap-2 text-xs tracking-wider"
            >
              <PenTool size={14} /> Publish Post
            </Link>
          </div>
        </div>
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="glass-panel rounded-2xl px-5 py-4 min-w-[220px] flex-1 md:flex-none md:w-[260px] hover:-translate-y-1 transition-transform duration-300">
            <Mail size={18} className="text-brand-500 mb-2.5" />
            <div className="text-xl font-bold text-ink font-display leading-none">
              {inquiries.length}
            </div>
            <div className="text-mist text-[0.7rem] mt-2 font-medium tracking-[0.16em] uppercase">
              Inquiry Logs
            </div>
          </div>
          <div className="glass-panel rounded-2xl px-5 py-4 min-w-[220px] flex-1 md:flex-none md:w-[260px] hover:-translate-y-1 transition-transform duration-300">
            <Home size={18} className="text-emerald-600 mb-2.5" />
            <div className="text-xl font-bold text-ink font-display leading-none">
              {listings.length}
            </div>
            <div className="text-mist text-[0.7rem] mt-2 font-medium tracking-[0.16em] uppercase">
              Total Listings
            </div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex gap-1 bg-cream-2 rounded-xl p-1 w-fit mb-8 border border-stone shadow-sm">
          {['inquiries', 'listings'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg text-sm tracking-wide capitalize transition-all ${
                tab === t
                  ? 'bg-ink text-cream shadow-md'
                  : 'text-mist hover:text-ink hover:bg-white/50'
              }`}
            >
              {t === 'inquiries' ? 'Inquiry Logs' : 'Platform Listings'}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-16 text-mist font-body">
            Loading dashboard data...
          </div>
        ) : (
            <>
            {/* ── INQUIRIES TAB ──────────────────────── */}
            {tab === 'inquiries' && (
              <div className="overflow-x-auto glass-panel rounded-2xl">
                {inquiries.length === 0 ? (
                  <div className="text-center py-16 text-mist font-body text-sm">
                    No inquiries yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm text-ink font-body">
                    <thead className="bg-ink text-cream text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 rounded-tl-2xl">Sender</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Listing</th>
                        <th className="px-6 py-4">Message</th>
                        <th className="px-6 py-4 rounded-tr-2xl">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inquiry => (
                        <tr
                          key={inquiry._id}
                          className="border-b border-stone hover:bg-cream-2 transition-colors align-top"
                        >
                          {/* Sender */}
                          <td className="px-6 py-4 font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-ink text-cream flex items-center justify-center text-xs uppercase tracking-wide flex-shrink-0">
                                {inquiry.name?.slice(0, 2) || 'NA'}
                              </div>
                              <span>{inquiry.name}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-mist">
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="hover:text-ink transition-colors"
                            >
                              {inquiry.email}
                            </a>
                          </td>

                          {/* Phone */}
                          <td className="px-6 py-4 text-mist">
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="flex items-center gap-1.5 hover:text-ink transition-colors"
                            >
                              <Phone size={12} />
                              {inquiry.phone}
                            </a>
                          </td>

                          {/* Listing */}
                          <td className="px-6 py-4">
                            <div className="font-medium text-ink text-sm">
                              {inquiry.listing?.title || inquiry.listingTitle}
                            </div>
                            <div className="text-xs text-mist mt-0.5">
                              {inquiry.listing?.city}, {inquiry.listing?.state}
                            </div>
                          </td>

                          {/* Message */}
                          <td className="px-6 py-4 text-mist max-w-xs">
                            <p className="leading-relaxed text-sm">
                              {inquiry.message}
                            </p>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-mist whitespace-nowrap text-xs">
                            {formatDate(inquiry.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {/* ── LISTINGS TAB ───────────────────────── */}
            {tab === 'listings' && (
              <div className="space-y-4">
                {listings.length === 0 ? (
                  <div className="text-center py-16 text-mist font-body text-sm">
                    No listings on the platform yet.
                  </div>
                ) : (
                  listings.map(listing => (
                    <div
                      key={listing._id}
                      className="glass-panel rounded-2xl p-4 flex gap-4 items-center hover:border-brand-500/30 transition-all group"
                    >
                      {/* Thumbnail */}
                      <img
                        src={listing.images?.[0] || getPlaceholderImage()}
                        alt={listing.title}
                        className="w-24 h-20 rounded-xl object-cover flex-shrink-0 shadow-sm"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-ink font-medium text-base truncate group-hover:text-brand-500 transition-colors">
                          {listing.title}
                        </h3>
                        <div className="text-mist text-xs mt-1 font-medium">
                          {listing.city}, {listing.state}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-ink font-display font-semibold">
                            {formatPrice(listing.price)}
                          </span>
                          <span className={`text-[0.65rem] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                            listing.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : listing.status === 'sold'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          to={`/listing/${listing._id}`}
                          className="w-9 h-9 bg-cream rounded-xl flex items-center justify-center text-mist hover:text-ink border border-stone hover:border-ink transition-all"
                          title="View listing"
                        >
                          <Home size={15} />
                        </Link>
                        <Link
                          to={`/edit-listing/${listing._id}`}
                          className="w-9 h-9 bg-cream rounded-xl flex items-center justify-center text-mist hover:text-ink border border-stone hover:border-ink transition-all"
                          title="Edit listing"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: listing._id })}
                          className="w-9 h-9 bg-cream rounded-xl flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 border border-stone hover:border-red-200 transition-all"
                          title="Delete listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
        {/* Confirm delete modal */}
        <ConfirmDeleteModal
          isOpen={deleteModal.open}
          title="Delete this listing?"
          message="This will permanently remove the listing from the platform. This action cannot be undone."
          onConfirm={handleDeleteListing}
          onCancel={() => setDeleteModal({ open: false, id: null })}
        />

      </div>
    </div>
  );
}
        
            
