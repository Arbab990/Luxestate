import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70 font-body">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl text-cream font-light mb-3">
              Lux<em>Estate</em>
            </h3>
            <p className="text-sm leading-relaxed text-cream/50 max-w-xs">
              The premier destination for luxury real estate. Connecting discerning buyers with extraordinary properties worldwide.
            </p>
          </div>

          {/* Properties column */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-cream/40 mb-4">
              Properties
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/listings', label: 'All Properties' },
                { to: '/listings?category=villa', label: 'Villas' },
                { to: '/listings?category=house', label: 'Houses' },
                { to: '/listings?category=apartment', label: 'Apartments' },
                { to: '/listings?featured=true', label: 'Featured' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-cream/40 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/blog', label: 'Blog' },
                { to: '/press', label: 'Press' },
                { to: '/careers', label: 'Careers' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            © {new Date().getFullYear()} LuxEstate. All rights reserved.
          </p>
          <p className="text-xs text-cream/20 tracking-widest uppercase">
            Premium Properties
          </p>
        </div>

      </div>
    </footer>
  );
}