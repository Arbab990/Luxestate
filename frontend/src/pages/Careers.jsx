import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Building, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function JobCard({ job, isAdmin }) {
  return (
    <div
      className={`glass-panel p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group ${
        job.isActive ? '' : 'opacity-75'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl text-ink font-light group-hover:text-brand-500 transition-colors">
              {job.title}
            </h3>
            {isAdmin && (
              <span
                className={`rounded-full px-3 py-1 font-body text-[0.65rem] uppercase tracking-[0.18em] ${
                  job.isActive
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border border-stone bg-cream-2 text-mist'
                }`}
              >
                {job.isActive ? 'Open' : 'Closed'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="flex items-center gap-1.5 font-body text-xs text-mist">
              <Building size={12} /> {job.department}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-mist">
              <MapPin size={12} /> {job.location}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-mist">
              <Clock size={12} /> {job.type}
            </span>
          </div>

          <p className="font-body text-xs text-mist leading-relaxed line-clamp-2">
            {job.description}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to={`/admin/edit-career/${job._id}`}
              className="font-body text-xs text-mist hover:text-ink transition-colors"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Careers() {
  const { user }  = useAuth();
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const request = user?.role === 'admin'
      ? api.get('/company/careers/all')
      : api.get('/company/careers');

    request
      .then(res => setJobs(res.data))
      .finally(() => setLoading(false));
  }, [user?.role]);

  const openJobs = jobs.filter(job => job.isActive !== false);
  const closedJobs = jobs.filter(job => job.isActive === false);

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section
        className="relative h-64 flex items-end pb-12 px-6"
        style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 100%)' }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
            Join the Team
          </p>
          <h1 className="font-display text-5xl text-white font-light">Careers</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-cream-2">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl text-ink font-light mb-4">
            Build Something Extraordinary
          </h2>
          <p className="font-body text-mist text-sm leading-relaxed">
            At LuxEstate, we are looking for passionate individuals who share our commitment to excellence. Join our team and help shape the future of luxury real estate.
          </p>
        </div>
      </section>

      {/* Jobs list */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-10">

          {/* Admin create button */}
          {user?.role === 'admin' && (
            <div className="flex justify-end mb-8">
              <Link
                to="/admin/create-career"
                className="btn-ink px-6 py-2.5 text-xs tracking-wider"
              >
                + Post New Role
              </Link>
            </div>
          )}

          <h2 className="font-display text-2xl text-ink font-light mb-8">
            Open Positions
          </h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-panel p-6 space-y-3">
                  <div className="skeleton h-5 w-48" />
                  <div className="skeleton h-3 w-32" />
                  <div className="skeleton h-3 w-full" />
                </div>
              ))}
            </div>
          ) : openJobs.length === 0 ? (
            <div className="text-center py-20 glass-panel">
              <p className="font-display text-2xl text-ink font-light mb-2">
                No open positions
              </p>
              <p className="font-body text-sm text-mist">
                Check back soon — we are always growing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {openJobs.map(job => (
                <JobCard key={job._id} job={job} isAdmin={user?.role === 'admin'} />
              ))}
            </div>
          )}

          {user?.role === 'admin' && !loading && closedJobs.length > 0 && (
            <div className="mt-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-ink font-light">
                    Closed Positions
                  </h2>
                  <p className="mt-2 font-body text-sm text-mist">
                    Closed roles stay here so you can reopen them from the edit screen.
                  </p>
                </div>
                <div className="rounded-full border border-stone bg-white px-4 py-2 font-body text-xs uppercase tracking-[0.18em] text-mist">
                  {closedJobs.length} closed
                </div>
              </div>

              <div className="space-y-4">
                {closedJobs.map(job => (
                  <JobCard key={job._id} job={job} isAdmin />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
