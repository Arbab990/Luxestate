import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function EditCareer() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [form,       setForm]       = useState({ title: '', department: '', location: '', type: 'Full-time', description: '', isActive: true });
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    api.get(`/company/career/${id}`)
      .then(res => {
        const j = res.data;
        setForm({
          title: j.title, department: j.department,
          location: j.location, type: j.type,
          description: j.description, isActive: j.isActive,
        });
      })
      .catch(() => { toast.error('Job not found'); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/company/career/${id}`, form);
      toast.success('Job updated');
      navigate('/careers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/company/career/${id}`);
      toast.success('Job deleted');
      navigate('/careers');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="skeleton h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-ink font-light">Edit Job</h1>
            <p className="font-body text-sm text-mist mt-1">Update or remove this position.</p>
          </div>
          <button onClick={() => setDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-body text-xs transition-all">
            <Trash2 size={14} /> Delete
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel p-6 space-y-5">

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">Job Title</label>
              <input name="title" value={form.title} onChange={handleChange} required
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">Department</label>
                <input name="department" value={form.department} onChange={handleChange} required
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">Location</label>
                <input name="location" value={form.location} onChange={handleChange} required
                  className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3" />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">Employment Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 cursor-pointer">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={6}
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 resize-none" />
            </div>

            {/* Active toggle */}
            <label className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-all w-fit ${
              form.isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-cream-2 text-mist border-stone'
            }`}>
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="hidden" />
              <span className="font-body text-xs tracking-wider">
                {form.isActive ? '● Position Active' : '○ Position Closed'}
              </span>
            </label>

          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate(-1)}
              className="btn-ghost flex-1 py-4 text-xs tracking-wider uppercase">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="btn-ink flex-1 py-4 text-xs tracking-wider uppercase disabled:opacity-60">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal}
        title="Delete this job posting?"
        message="This will permanently remove the position from the careers page."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}