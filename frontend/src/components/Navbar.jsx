import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown } from 'lucide-react';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    setDropdown(false);
  }, [location]);
  const lightRoutes = ['/', '/about', '/careers', '/blog', '/press'];
  const onDarkHero = lightRoutes.includes(location.pathname);
  const lightText = onDarkHero && !scrolled;
  const links = [
    { to: '/listings', label: 'Properties' },
    { to: '/listings?category=house', label: 'Houses' },
    { to: '/listings?category=villa', label: 'Villas' },
    { to: '/listings?category=condo', label: 'Condos' },

    
    
  ];
  return (
    <nav className={`navbar-clean ${scrolled ? 'scrolled' : ''}`}>

      {/* Logo */}
      <Link to="/" className="flex flex-col leading-none select-none">
        <span
          className="font-display text-2xl font-light tracking-tight transition-colors duration-400"
          style={{ color: lightText ? '#e1eefb' : '#0f1f3d' }}
        >
          Lux<em>Estate</em>
        </span>
        <span
          className="font-body text-[0.55rem] tracking-[0.22em] uppercase mt-0.5 transition-colors duration-400"
          style={{ color: lightText ? 'rgba(240,247,255,0.55)' : '#4a6080' }}
        >
          Premium Properties
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className="font-body text-xs tracking-[0.14em] uppercase transition-colors duration-300"
            style={{ color: lightText ? '#ffffff' : '#4a6080' }}
            onMouseEnter={e => e.target.style.color = lightText ? '#f0f7ff' : '#0f1f3d'}
            onMouseLeave={e => e.target.style.color = lightText ? '#ffffff' : '#4a6080'}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Desktop right side */}
      <div className="hidden md:flex items-center gap-5">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdown(d => !d)}
              className="flex items-center gap-2 font-body text-xs tracking-[0.1em]"
              style={{ color: lightText ? '#f0f7ff' : '#0f1f3d' }}
            >
              <Avatar src={user.avatar} alt={user.username} size={28} />
              <span className="max-w-[100px] truncate">{user.username}</span>
              <ChevronDown
                size={12}
                style={{ transform: dropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              />
            </button>

            {/* Dropdown menu */}
            {dropdown && (
              <div className="absolute right-0 top-full mt-3 w-44 glass-panel shadow-xl py-2">
                <Link
                  to="/dashboard"
                  className="block px-5 py-2.5 text-xs tracking-wider uppercase text-mist hover:text-ink hover:bg-cream-2 transition-colors font-body"
                >
                  Dashboard
                </Link>
                <hr className="border-stone my-1 mx-5" />
                <button
                  onClick={async () => { await logout(); navigate('/'); }}
                  className="block w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase text-mist hover:text-red-600 hover:bg-cream-2 transition-colors font-body"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(m => !m)}
        style={{ color: lightText ? '#f0f7ff' : '#0f1f3d' }}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 glass-panel border-t border-stone shadow-xl md:hidden py-6 px-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="block py-3 font-body text-xs tracking-[0.16em] uppercase text-mist hover:text-ink border-b border-cream-2"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                to="/dashboard"
                className="block py-3 font-body text-xs tracking-[0.16em] uppercase text-mist"
              >
                Dashboard
              </Link>
              <button
                onClick={async () => { await logout(); navigate('/'); }}
                className="block py-3 font-body text-xs tracking-[0.16em] uppercase text-red-500 w-full text-left"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}

    </nav>
  );
}
