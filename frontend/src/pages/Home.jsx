import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  House,
  Building2,
  Building,
  Landmark,
  Sofa,
  Store,
} from 'lucide-react';
import api from '../utils/api';
import { formatPrice, categoryIcons } from '../utils/helper';
import { useCountUp } from '../hooks/useCountUp';
import PropertyCard from '../components/PropertyCard';
import { CardSkeleton } from '../components/Skeleton';

const categoryLucideIcons = {
  house: House,
  apartment: Building2,
  condo: Building,
  villa: Landmark,
  studio: Sofa,
  commercial: Store,
};

/* ── Stat card — only used on Home page ─────────────────── */
function StatCard({ value, label, icon, suffix = '+' }) {
  const count = useCountUp(value || 0);
  return (
    <div className="text-center">
      <div className="text-cream/40 flex justify-center mb-2">{icon}</div>
      <div className="font-display text-3xl md:text-4xl text-cream font-light mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-body text-xs text-cream/40 tracking-widest uppercase">
        {label}
      </div>
    </div>
  );
}

/* ── Home page ───────────────────────────────────────────── */
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/listings/featured'),
      api.get('/company/stats'),
    ]).then(([listingsRes, statsRes]) => {
      setFeatured(listingsRes.data);
      setStats(statsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Background video */}
<video
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  aria-hidden="true"
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/videos/hero-loop-4.mp4" type="video/mp4" />
</video>

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(15,31,61,0.25)' }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-body text-xs tracking-[0.35em] uppercase text-white/60 mb-6">
            Premium Real Estate
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white font-light leading-tight mb-6">
            Find Your <em>Dream</em><br />Property
          </h1>
          <p className="font-body text-white text-lg max-w-xl mx-auto mb-10">
            Discover exceptional homes, villas and estates curated for the most discerning buyers.
          </p>
          <div className="flex justify-center">
            <Link to="/listings" className="btn-ink px-8 py-4 text-sm tracking-wider">
              Explore Properties
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="font-body text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/20" />
        </div>

      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="bg-ink text-cream py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats ? (
              <>
                <StatCard
                  value={stats.propertiesListed}
                  label="Properties Listed"
                  icon={<TrendingUp size={20} />}
                />
                <StatCard
                  value={stats.familiesHoused}
                  label="Families Housed"
                  icon={<Users size={20} />}
                />
                <StatCard
                  value={stats.yearsTrust}
                  label="Years of Trust"
                  icon={<Award size={20} />}
                  suffix=""
                />
                <StatCard
                  value={stats.clientSatisfaction}
                  label="Client Satisfaction"
                  icon={<Award size={20} />}
                  suffix="%"
                />
              </>
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className="skeleton h-8 w-24"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  />
                  <div
                    className="skeleton h-3 w-32"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-mist mb-3">
              Browse by Type
            </p>
            <h2 className="font-display text-4xl text-ink font-light">
              Find Your Category
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <Link
                key={category}
                to={`/listings?category=${category}`}
                className="w-[180px] group flex flex-col items-center gap-3 p-6 bg-white border border-stone/60 rounded-2xl hover:border-ink hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                {(() => {
                  const Icon = categoryLucideIcons[category];
                  return Icon ? <Icon size={30} className="text-ink/80 group-hover:text-ink transition-colors" /> : <span className="text-3xl">{icon}</span>;
                })()}
                <span className="font-body text-xs tracking-[0.15em] uppercase text-mist group-hover:text-ink transition-colors">
                  {category}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── FEATURED LISTINGS ──────────────────────────────── */}
      <section className="py-20 bg-cream-2">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-mist mb-3">
                Hand Picked
              </p>
              <h2 className="font-display text-4xl text-ink font-light">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/listings?featured=true"
              className="hidden md:flex items-center gap-2 font-body text-xs tracking-wider uppercase text-mist hover:text-ink transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : featured.map(listing => (
                  <PropertyCard key={listing._id} listing={listing} />
                ))
            }
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/listings?featured=true" className="btn-ghost px-8">
              View All Properties
            </Link>
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section className="py-20 bg-ink">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-cream/40 mb-3">
              Client Stories
            </p>
            <h2 className="font-display text-4xl text-cream font-light">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Mitchell',
                role: 'Property Investor',
                text: 'LuxEstate found us a stunning Malibu villa that exceeded every expectation. Their attention to detail and market knowledge is unmatched.',
                initials: 'SM',
              },
              {
                name: 'James Rivera',
                role: 'Tech Executive',
                text: 'The team made our Beverly Hills purchase completely seamless. From the first viewing to closing, we felt like we were in expert hands.',
                initials: 'JR',
              },
              {
                name: 'Emma Chen',
                role: 'Art Director',
                text: 'I had very specific requirements for my New York penthouse. LuxEstate listened carefully and delivered something truly extraordinary.',
                initials: 'EC',
              },
            ].map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-cream/10 bg-cream/5"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="font-body text-cream/60 text-sm leading-relaxed mb-6">
                  "{t.text}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center font-body text-xs text-cream/60 tracking-wider">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-body text-sm text-cream font-medium">
                      {t.name}
                    </div>
                    <div className="font-body text-xs text-cream/40">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-mist mb-4">
            Ready to Begin?
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink font-light mb-6">
            Your Perfect Property<br /><em>Awaits</em>
          </h2>
          <p className="font-body text-mist text-lg mb-10 max-w-xl mx-auto">
            Browse our curated collection of luxury properties and find the home you have always dreamed of.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/listings" className="btn-ink px-10 py-4 text-sm tracking-wider">
              Browse Properties
            </Link>
            <Link to="/about" className="btn-ghost px-10 py-4 text-sm tracking-wider">
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
