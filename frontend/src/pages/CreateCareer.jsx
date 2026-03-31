import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title:       '',
  department:  '',
  location:    '',
  type:        'Full-time',
  description: '',
};

export default function CreateCareer() {
  const navigate     = useNavigate();
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.department || !form.location || !form.description) {
      toast.error('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/company/career', form);
      toast.success('Job posted successfully');
      navigate('/careers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-10">

        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink font-light">Post New Role</h1>
          <p className="font-body text-sm text-mist mt-1">Add a new open position to the careers page.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="glass-panel p-6 space-y-5">

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g. Senior Property Consultant"
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  Department <span className="text-red-400">*</span>
                </label>
                <input name="department" value={form.department} onChange={handleChange} required
                  placeholder="e.g. Sales"
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <input name="location" value={form.location} onChange={handleChange} required
                  placeholder="e.g. Beverly Hills, CA"
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3" />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Employment Type
              </label>
              <select name="type" value={form.type} onChange={handleChange}
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 cursor-pointer">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Job Description <span className="text-red-400">*</span>
              </label>
              <textarea name="description" value={form.description} onChange={handleChange} required
                rows={6} placeholder="Describe the role, responsibilities, and requirements..."
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 resize-none" />
            </div>

          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate(-1)}
              className="btn-ghost flex-1 py-4 text-xs tracking-wider uppercase">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="btn-ink flex-1 py-4 text-xs tracking-wider uppercase disabled:opacity-60">
              {submitting ? 'Posting...' : 'Post Job'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}