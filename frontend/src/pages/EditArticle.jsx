import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function EditArticle() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [form,       setForm]       = useState({ title: '', content: '', type: 'blog', image: '' });
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imgPreview, setImgPreview] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    api.get(`/company/article/${id}`)
      .then(res => {
        const a = res.data;
        setForm({ title: a.title, content: a.content, type: a.type, image: a.image });
        setImgPreview(a.image);
      })
      .catch(() => {
        toast.error('Article not found');
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'image') setImgPreview(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
      setImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/company/article/${id}`, form);
      toast.success('Article updated');
      navigate(form.type === 'blog' ? '/blog' : '/press');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/company/article/${id}`);
      toast.success('Article deleted');
      navigate('/blog');
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
            <h1 className="font-display text-3xl text-ink font-light">Edit Article</h1>
            <p className="font-body text-sm text-mist mt-1">Update or delete this article.</p>
          </div>
          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-body text-xs transition-all"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Type toggle */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-3">
              Article Type
            </label>
            <div className="flex gap-2">
              {['blog', 'press'].map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: t }))}
                  className={`flex-1 py-2.5 rounded-xl font-body text-xs tracking-wider uppercase transition-all ${
                    form.type === t ? 'bg-ink text-cream' : 'bg-cream-2 text-mist border border-stone hover:border-ink'
                  }`}
                >
                  {t === 'blog' ? 'Blog Post' : 'Press Release'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3" />
          </div>

          {/* Image */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-3">Cover Image</label>
            <input name="image"
              value={form.image.startsWith('data:') ? '' : form.image}
              onChange={handleChange}
              placeholder="Paste an image URL..."
              className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 mb-3"
            />
            <label className="flex items-center justify-center gap-2 py-3 border border-dashed border-stone rounded-xl cursor-pointer hover:border-ink hover:bg-cream-2 transition-all">
              <Upload size={14} className="text-mist" />
              <span className="font-body text-xs text-mist">Upload from device</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {imgPreview && (
              <div className="mt-3 rounded-xl overflow-hidden border border-stone" style={{ aspectRatio: '16/9' }}>
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">Content</label>
            <textarea name="content" value={form.content} onChange={handleChange} required rows={10}
              className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 resize-none" />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1 py-4 text-xs tracking-wider uppercase">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-ink flex-1 py-4 text-xs tracking-wider uppercase disabled:opacity-60">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal}
        title="Delete this article?"
        message="This will permanently remove the article. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}