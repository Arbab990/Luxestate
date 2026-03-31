import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
export function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success(`Welcome back, ${result.data.username}`);
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-ink mb-1">
            Lux<em>Estate</em>
          </h1>
          <p className="font-body text-xs text-mist tracking-[0.2em] uppercase">
            Admin Portal
          </p>
        </div>

        {/* Form card */}
        <div className="glass-panel p-8">
          <h2 className="font-display text-xl text-ink mb-6">
            Sign in to continue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email field */}
            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@luxestate.com"
                required
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block font-body text-xs text-mist uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-clean bg-cream-2 border border-stone focus:border-ink rounded-xl px-4 py-3"
              />
            </div>

            {/* Inline error message */}
            {error && (
              <p className="font-body text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-ink w-full py-3 mt-2 tracking-widest text-xs uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>

        {/* Subtle hint */}
        <p className="text-center font-body text-xs text-mist/50 mt-6">
          Restricted access — authorized personnel only
        </p>

      </div>
    </div>
  );
}