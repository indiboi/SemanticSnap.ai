import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/gallery" replace />;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success('Account created! Please sign in.');
      window.location.href = '/login';
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Signup failed. Please try again.';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-dark-950 p-4 relative">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700/60 flex items-center justify-center text-dark-300 hover:text-dark-100 transition-colors cursor-pointer shadow-md"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-accent-400" />
          )}
        </button>
      </div>
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-600/5 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
            <Sparkles className="w-8 h-8 text-accent-400" />
            <span className="text-2xl font-bold text-dark-50">
              SemanticSnap<span className="text-accent-400">.ai</span>
            </span>
          </Link>
          <p className="text-dark-400 text-sm">Create your account to get started</p>
        </div>

        {/* Card */}
        <div className="bg-dark-850 border border-dark-700/50 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-dark-200 mb-1.5">
                Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your full name"
                className={`w-full px-4 py-2.5 bg-dark-800 border rounded-xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-error-500 focus:ring-error-500/50' : 'border-dark-600/50 focus:border-accent-500/50 focus:ring-accent-500/25'
                }`}
                autoComplete="name"
              />
              {errors.name && <p className="text-xs text-error-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-dark-200 mb-1.5">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 bg-dark-800 border rounded-xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.email ? 'border-error-500 focus:ring-error-500/50' : 'border-dark-600/50 focus:border-accent-500/50 focus:ring-accent-500/25'
                }`}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-dark-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="At least 6 characters"
                  className={`w-full px-4 py-2.5 pr-10 bg-dark-800 border rounded-xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.password ? 'border-error-500 focus:ring-error-500/50' : 'border-dark-600/50 focus:border-accent-500/50 focus:ring-accent-500/25'
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : 'Create account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
