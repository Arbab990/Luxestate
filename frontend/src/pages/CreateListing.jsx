import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, X, Upload } from 'lucide-react';
const EMPTY_FORM = {
  title:       '',
  description: '',
  address:     '',
  city:        '',
  state:       '',
  zipCode:     '',
  price:       '',
  category:    'house',
  bedrooms:    '',
  bathrooms:   '',
  area:        '',
  parking:     false,
  furnished:   false,
  pool:        false,
  gym:         false,
  petFriendly: false,
  featured:    false,
  status:      'active',
  images:      [],
};
export default function CreateListing() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const isEditMode   = Boolean(id);

  const [form,       setForm]       = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [loading,    setLoading]    = useState(isEditMode);
  useEffect(() => {
    if (!isEditMode) return;

    api.get(`/listings/${id}`)
      .then(res => {
        const l = res.data;
        setForm({
          title:       l.title       || '',
          description: l.description || '',
          address:     l.address     || '',
          city:        l.city        || '',
          state:       l.state       || '',
          zipCode:     l.zipCode     || '',
          price:       l.price       || '',
          category:    l.category    || 'house',
          bedrooms:    l.bedrooms    || '',
          bathrooms:   l.bathrooms   || '',
          area:        l.area        || '',
          parking:     l.parking     || false,
          furnished:   l.furnished   || false,
          pool:        l.pool        || false,
          gym:         l.gym         || false,
          petFriendly: l.petFriendly || false,
          featured:    l.featured    || false,
          status:      l.status      || 'active',
          images:      l.images      || [],
        });
      })
      .catch(() => {
        toast.error('Could not load listing');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB per image.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.price || !form.city || !form.state) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (form.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price:     Number(form.price),
        bedrooms:  Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area:      Number(form.area),
      };

      if (isEditMode) {
        await api.put(`/listings/${id}`, payload);
        toast.success('Listing updated successfully');
      } else {
        await api.post('/listings', payload);
        toast.success('Listing created successfully');
      }

      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="skeleton h-8 w-48 mx-auto" />
          <div className="skeleton h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink font-light">
            {isEditMode ? 'Edit Listing' : 'Create New Listing'}
          </h1>
          <p className="font-body text-sm text-mist mt-1">
            {isEditMode
              ? 'Update the details of your property listing.'
              : 'Fill in the details below to list your property.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── BASIC INFO ─────────────────────────────── */}
          <section className="glass-panel p-6 space-y-5">
            <h2 className="font-display text-lg text-ink border-b border-stone pb-3">
              Basic Information
            </h2>

            {/* Title */}
            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Stunning Modern Villa with Ocean Views"
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the property in detail..."
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 cursor-pointer"
              >
                {['house', 'apartment', 'condo', 'villa', 'studio', 'commercial'].map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </section>
          {/* ── LOCATION ───────────────────────────────── */}
          <section className="glass-panel p-6 space-y-5">
            <h2 className="font-display text-lg text-ink border-b border-stone pb-3">
              Location
            </h2>

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Street Address <span className="text-red-400">*</span>
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="e.g. 24 Pacific Coast Highway"
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Malibu"
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  State <span className="text-red-400">*</span>
                </label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  placeholder="e.g. CA"
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Zip Code
              </label>
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                placeholder="e.g. 90265"
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
              />
            </div>
          </section>
          {/* ── PRICING & SPECS ────────────────────────── */}
          <section className="glass-panel p-6 space-y-5">
            <h2 className="font-display text-lg text-ink border-b border-stone pb-3">
              Pricing & Specs
            </h2>

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Price (INR) <span className="text-red-400">*</span>

              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 25000000"

                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  Bedrooms <span className="text-red-400">*</span>
                </label>
                <input
                  name="bedrooms"
                  type="number"
                  value={form.bedrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="4"
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  Bathrooms <span className="text-red-400">*</span>
                </label>
                <input
                  name="bathrooms"
                  type="number"
                  value={form.bathrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="3"
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  Area (ft²) <span className="text-red-400">*</span>
                </label>
                <input
                  name="area"
                  type="number"
                  value={form.area}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="3500"
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
                />
              </div>
            </div>
          </section>
          {/* ── AMENITIES ──────────────────────────────── */}
          <section className="glass-panel p-6">
            <h2 className="font-display text-lg text-ink border-b border-stone pb-3 mb-5">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'parking',     label: 'Parking'     },
                { name: 'furnished',   label: 'Furnished'   },
                { name: 'pool',        label: 'Pool'        },
                { name: 'gym',         label: 'Gym'         },
                { name: 'petFriendly', label: 'Pet Friendly'},
              ].map(({ name, label }) => (
                <label
                  key={name}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-body text-xs cursor-pointer transition-all select-none ${
                    form[name]
                      ? 'bg-ink text-cream border-ink'
                      : 'bg-cream-2 text-mist border-stone hover:border-ink'
                  }`}
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {form[name] ? '✓ ' : ''}{label}
                </label>
              ))}
            </div>
          </section>
          {/* ── LISTING SETTINGS ───────────────────────── */}
          <section className="glass-panel p-6 space-y-5">
            <h2 className="font-display text-lg text-ink border-b border-stone pb-3">
              Listing Settings
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div className="flex items-end pb-1">
                <label className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-body text-xs cursor-pointer transition-all select-none w-full justify-center ${
                  form.featured
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-cream-2 text-mist border-stone hover:border-ink'
                }`}>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {form.featured ? '★ Featured' : '☆ Mark as Featured'}
                </label>
              </div>
            </div>
          </section>
          {/* ── IMAGES ─────────────────────────────────── */}
          <section className="glass-panel p-6">
            <h2 className="font-display text-lg text-ink border-b border-stone pb-3 mb-5">
              Images
            </h2>

            {/* Upload button */}
            <label className="flex items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-stone rounded-2xl cursor-pointer hover:border-ink hover:bg-cream-2 transition-all mb-5">
              <Upload size={18} className="text-mist" />
              <span className="font-body text-sm text-mist">
                Click to upload images
              </span>
              <span className="font-body text-xs text-mist/50">
                (max 5MB each)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Image previews */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-stone aspect-square">
                    <img
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {/* First image badge */}
                    {i === 0 && (
                      <div className="absolute bottom-1.5 left-1.5 bg-ink/70 text-white font-body text-[0.55rem] px-2 py-0.5 rounded-full">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* ── SUBMIT ─────────────────────────────────── */}
          <div className="flex gap-4 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-ghost flex-1 py-4 text-xs tracking-wider uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-ink flex-1 py-4 text-xs tracking-wider uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update Listing' : 'Create Listing')
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}