import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import api from '../utils/api';
import { formatDate } from '../utils/helper';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ArticleDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const [article,  setArticle]  = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get(`/company/article/${id}`)
      .then(res => setArticle(res.data))
      .catch(() => {
        toast.error('Article not found');
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-64 w-full rounded-2xl" />
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-body text-xs text-mist hover:text-ink transition-colors mb-8 uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Cover image */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '16/9' }}>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-body font-medium uppercase tracking-wider ${
            article.type === 'blog'
              ? 'bg-brand-500/20 text-brand-600 border border-brand-500/30'
              : 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
          }`}>
            {article.type === 'blog' ? 'Blog' : 'Press Release'}
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs text-mist">
            <Calendar size={12} />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl text-ink font-light mb-3 leading-tight">
          {article.title}
        </h1>

        <p className="font-body text-xs text-mist mb-8">
          By {article.author}
        </p>

        {/* Divider */}
        <div className="border-t border-stone mb-8" />

        {/* Content */}
        <div className="font-body text-mist text-sm leading-relaxed whitespace-pre-wrap mb-12">
          {article.content}
        </div>

        {/* Admin edit link */}
        {user?.role === 'admin' && (
          <div className="pt-8 border-t border-stone">
            <Link
              to={`/admin/edit-article/${article._id}`}
              className="btn-ghost px-6 py-2.5 text-xs tracking-wider"
            >
              Edit This Article
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}