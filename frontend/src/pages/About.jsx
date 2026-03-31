import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, TrendingUp, Heart } from 'lucide-react';
import api from '../utils/api';
import { useCountUp } from '../hooks/useCountUp';
function StatBlock({ value, suffix = '+', label }) {
  const count = useCountUp(value || 0);
  return (
    <div className="text-center">
      <div className="font-display text-4xl text-cream font-light mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-body text-xs text-cream/40 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}
export default function About() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/company/stats').then(res => setStats(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-cream">

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        className="relative h-80 flex items-end pb-12 px-6"
        style={{
          background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
            Our Story
          </p>
          <h1 className="font-display text-5xl text-white font-light">
            About LuxEstate
          </h1>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-mist mb-4">
                Who We Are
              </p>
              <h2 className="font-display text-4xl text-ink font-light mb-6">
                Redefining Luxury<br />Real Estate
              </h2>
              <p className="font-body text-mist text-sm leading-relaxed mb-4">
                LuxEstate was founded with a singular vision — to create the most trusted platform for luxury property transactions. We believe that finding your dream home should be as exceptional as the home itself.
              </p>
              <p className="font-body text-mist text-sm leading-relaxed mb-8">
                Our curated portfolio features only the finest properties, hand-selected by our team of experienced real estate professionals who understand what true luxury means.
              </p>
              <Link to="/listings" className="btn-ink px-8 py-3 text-xs tracking-wider">
                Explore Properties
              </Link>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Award size={22} />, title: 'Excellence', desc: 'Every property in our portfolio meets the highest standards of quality and craftsmanship.' },
                { icon: <Heart size={22} />, title: 'Integrity', desc: 'We operate with complete transparency and put our clients interests first, always.' },
                { icon: <Users size={22} />, title: 'Expertise', desc: 'Our team brings decades of combined experience in luxury real estate markets.' },
                { icon: <TrendingUp size={22} />, title: 'Results', desc: 'We consistently achieve record sale prices for our clients across all markets.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="glass-panel p-5">
                  <div className="text-brand-500 mb-3">{icon}</div>
                  <h3 className="font-display text-base text-ink mb-2">{title}</h3>
                  <p className="font-body text-xs text-mist leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      {stats && (
        <section className="py-16 bg-ink">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatBlock value={stats.propertiesListed} label="Properties Listed" />
              <StatBlock value={stats.familiesHoused}   label="Families Housed"   />
              <StatBlock value={stats.yearsTrust}       label="Years of Trust" suffix="" />
              <StatBlock value={stats.clientSatisfaction} label="Client Satisfaction" suffix="%" />
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-3xl text-ink font-light mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="font-body text-mist text-sm mb-8">
            Browse our exclusive collection of luxury properties.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/listings" className="btn-ink px-8 py-3 text-xs tracking-wider">
              Browse Properties
            </Link>
            <Link to="/careers" className="btn-ghost px-8 py-3 text-xs tracking-wider">
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
