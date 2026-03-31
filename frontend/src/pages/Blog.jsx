import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import api from '../utils/api';
import { formatDate } from '../utils/helper';
import { useAuth } from '../context/AuthContext';
import { ArticleSkeleton } from '../components/Skeleton';
function ArticleCard({ article, isAdmin }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <Link to={`/article/${article._id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </Link>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-body text-xs text-mist flex items-center gap-1.5">
            <Calendar size={11} />
            {formatDate(article.publishedAt)}
          </span>
        </div>

        <Link to={`/article/${article._id}`}>
          <h3 className="font-display text-lg text-ink font-light mb-2 hover:text-brand-500 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>

        <p className="font-body text-xs text-mist leading-relaxed line-clamp-3 mb-4">
          {article.content}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-stone">
          <Link
            to={`/article/${article._id}`}
            className="font-body text-xs text-brand-500 hover:text-brand-600 tracking-wider uppercase"
          >
            Read More →
          </Link>

          {isAdmin && (
            <Link
              to={`/admin/edit-article/${article._id}`}
              className="font-body text-xs text-mist hover:text-ink transition-colors"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const { user }   = useAuth();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/company/blog')
      .then(res => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section
        className="relative h-64 flex items-end pb-12 px-6"
        style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 100%)' }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
            Insights & Ideas
          </p>
          <h1 className="font-display text-5xl text-white font-light">Blog</h1>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Admin create button */}
          {user?.role === 'admin' && (
            <div className="flex justify-end mb-8">
              <Link
                to="/admin/create-article"
                className="btn-ink px-6 py-2.5 text-xs tracking-wider"
              >
                + New Post
              </Link>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-ink font-light mb-2">
                No posts yet
              </p>
              <p className="font-body text-sm text-mist">
                Check back soon for insights and updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <ArticleCard key={post._id} article={post} isAdmin={user?.role === 'admin'} />
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}