import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import api from '../utils/api';
import { formatDate } from '../utils/helper';
import { useAuth } from '../context/AuthContext';
import { ArticleSkeleton } from '../components/Skeleton';

export default function Press() {
  const { user }    = useAuth();
  const [releases,  setReleases]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.get('/company/press')
      .then(res => setReleases(res.data))
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
            Media & News
          </p>
          <h1 className="font-display text-5xl text-white font-light">Press</h1>
        </div>
      </section>

      {/* Releases */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-10">

          {/* Admin create button */}
          {user?.role === 'admin' && (
            <div className="flex justify-end mb-8">
              <Link
                to="/admin/create-article"
                className="btn-ink px-6 py-2.5 text-xs tracking-wider"
              >
                + New Press Release
              </Link>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          ) : releases.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-ink font-light mb-2">
                No press releases yet
              </p>
              <p className="font-body text-sm text-mist">
                Check back soon for news and announcements.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {releases.map(release => (
                <div
                  key={release._id}
                  className="glass-panel p-6 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex gap-6 items-start">

                    {/* Image */}
                    <Link to={`/article/${release._id}`} className="flex-shrink-0">
                      <div className="w-32 h-24 rounded-xl overflow-hidden">
                        <img
                          src={release.image}
                          alt={release.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 border border-amber-500/30 font-body text-[0.6rem] uppercase tracking-wider">
                          Press Release
                        </span>
                        <span className="font-body text-xs text-mist flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(release.publishedAt)}
                        </span>
                      </div>

                      <Link to={`/article/${release._id}`}>
                        <h3 className="font-display text-lg text-ink font-light mb-2 hover:text-brand-500 transition-colors line-clamp-2">
                          {release.title}
                        </h3>
                      </Link>

                      <p className="font-body text-xs text-mist line-clamp-2 mb-3">
                        {release.content}
                      </p>

                      <div className="flex items-center gap-4">
                        <Link
                          to={`/article/${release._id}`}
                          className="font-body text-xs text-brand-500 hover:text-brand-600 uppercase tracking-wider"
                        >
                          Read Full Release →
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to={`/admin/edit-article/${release._id}`}
                            className="font-body text-xs text-mist hover:text-ink transition-colors"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}