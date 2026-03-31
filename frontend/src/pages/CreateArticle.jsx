import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

const EMPTY_FORM = {
  title:   '',
  content: '',
  type:    'blog',
  image:   '',
};

export default function CreateArticle() {
  const { user }     = useNavigate();
  const navigate     = useNavigate();
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [imgPreview, setImgPreview] = useState('');
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'image') {
      setImgPreview(e.target.value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
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
    if (!form.title || !form.content || !form.image) {
      toast.error('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/company/article', form);
      toast.success('Article published');
      navigate(form.type === 'blog' ? '/blog' : '/press');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-10">

        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink font-light">
            Publish Article
          </h1>
          <p className="font-body text-sm text-mist mt-1">
            Create a new blog post or press release.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Type toggle */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-3">
              Article Type
            </label>
            <div className="flex gap-2">
              {['blog', 'press'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: t }))}
                  className={`flex-1 py-2.5 rounded-xl font-body text-xs tracking-wider uppercase transition-all ${
                    form.type === t
                      ? 'bg-ink text-cream'
                      : 'bg-cream-2 text-mist border border-stone hover:border-ink'
                  }`}
                >
                  {t === 'blog' ? 'Blog Post' : 'Press Release'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Article headline..."
              className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
            />
          </div>

          {/* Image */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-3">
              Cover Image <span className="text-red-400">*</span>
            </label>

            {/* URL input */}
            <input
              name="image"
              value={form.image.startsWith('data:') ? '' : form.image}
              onChange={handleChange}
              placeholder="Paste an image URL..."
              className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 mb-3"
            />

            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 border-t border-stone" />
              <span className="font-body text-xs text-mist">or</span>
              <div className="flex-1 border-t border-stone" />
            </div>

            {/* File upload */}
            <label className="flex items-center justify-center gap-2 py-3 border border-dashed border-stone rounded-xl cursor-pointer hover:border-ink hover:bg-cream-2 transition-all">
              <Upload size={14} className="text-mist" />
              <span className="font-body text-xs text-mist">Upload from device</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Preview */}
            {imgPreview && (
              <div className="mt-3 rounded-xl overflow-hidden border border-stone" style={{ aspectRatio: '16/9' }}>
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="glass-panel p-5">
            <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Write the article content here..."
              className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
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
              className="btn-ink flex-1 py-4 text-xs tracking-wider uppercase disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}