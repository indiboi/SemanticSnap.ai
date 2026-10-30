import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  Edit3,
  KeyRound,
  Database,
  Cpu,
  Sun,
  Moon,
  LogOut,
  Sliders,
  SlidersHorizontal,
  BellRing
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setHasChanges(val.trim() !== (user?.name || ''));
    if (error) setError('');
  };

  const handleResetName = () => {
    setName(user?.name || '');
    setHasChanges(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Display name cannot be empty');
      return;
    }
    if (trimmed === user?.name) {
      setHasChanges(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateProfile({ name: trimmed });
      toast.success('Your profile name has been updated!');
      setHasChanges(false);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Failed to update profile name';
      setError(detail);
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    return n
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 selection:bg-accent-500/30 selection:text-accent-300 relative overflow-x-hidden pb-20">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[50%] -right-40 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 radial-grid opacity-30" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Back button & Brand */}
          <div className="flex items-center gap-3">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700/60 text-xs sm:text-sm font-medium text-dark-200 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-accent-400" />
              <span>Back to Gallery</span>
            </Link>

            <div className="h-4 w-[1px] bg-dark-700/60 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-400" />
              <span className="text-base font-bold text-dark-50 tracking-tight">
                SemanticSnap<span className="text-accent-400">.ai</span>
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700/60 flex items-center justify-center text-dark-300 hover:text-dark-100 transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-accent-400" />
              )}
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-dark-300 hover:text-error-400 hover:bg-dark-850 border border-dark-700/60 transition-colors cursor-pointer"
              title="Sign out of account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-dark-900 border border-dark-750/70 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden mb-8"
        >
          {/* Subtle inner top glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-accent-600 via-purple-600 to-accent-400 p-[2px] shadow-xl shadow-accent-600/25 shrink-0">
                <div className="w-full h-full bg-dark-900 rounded-[22px] flex items-center justify-center text-2xl font-extrabold text-white">
                  {getInitials(name || user?.name)}
                </div>
              </div>

              {/* Title info */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-50 tracking-tight">
                    {name || user?.name || 'Account Profile'}
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-300">
                    Vault User
                  </span>
                </div>
                <p className="text-sm text-dark-400 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-accent-400" />
                  <span>{user?.email}</span>
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-dark-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>JWT Authenticated</span>
                  </span>
                  <span>•</span>
                  <span>User ID: #{user?.id || '1'}</span>
                </div>
              </div>
            </div>

            {/* Quick Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-dark-800">
              <span className="text-[11px] uppercase tracking-wider text-dark-400 font-semibold">
                Account Status
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active & Synced
              </span>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections Grid */}
        <div className="space-y-8">
          {/* Section 1: Personal Details & Name Editing */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-dark-900 border border-dark-750/70 rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-dark-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-dark-50 tracking-tight">Personal Information</h2>
                  <p className="text-xs text-dark-400">Update your display name and view account identifiers</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Editable Name Field */}
              <div>
                <label
                  htmlFor="profile-name-input"
                  className="block text-xs font-semibold text-dark-200 uppercase tracking-wider mb-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-accent-400" />
                    Full Display Name
                  </span>
                  <span className="text-[11px] text-dark-400 font-normal">
                    {name.length}/100 characters
                  </span>
                </label>

                <div className="relative">
                  <input
                    id="profile-name-input"
                    type="text"
                    maxLength={100}
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 bg-dark-800/90 border rounded-2xl text-sm text-dark-100 placeholder-dark-400 focus:outline-none transition-all ${
                      error
                        ? 'border-error-500 focus:ring-1 focus:ring-error-500'
                        : 'border-dark-600/70 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30'
                    }`}
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-xs text-error-400 mt-2">{error}</p>}
                <p className="text-xs text-dark-400 mt-2">
                  This name is displayed across your media gallery, navigation header, and vaults.
                </p>
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-accent-400" />
                  Primary Email Address
                </label>

                <div className="flex items-center justify-between px-4 py-3 bg-dark-850/80 border border-dark-750/70 rounded-2xl text-sm text-dark-300">
                  <span className="font-medium text-dark-200 truncate">{user?.email}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-dark-800 text-dark-400 border border-dark-700 shrink-0">
                    Read-only
                  </span>
                </div>
                <p className="text-xs text-dark-400 mt-2">
                  Email addresses are permanently linked to your personal multimodal vector store collection.
                </p>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800/80">
                {hasChanges && (
                  <button
                    type="button"
                    onClick={handleResetName}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-dark-300 hover:text-white bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading || !hasChanges || !name.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-accent-600/30 transition-all cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Name...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Section 2: Vault Architecture & Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-dark-900 border border-dark-750/70 rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-dark-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-dark-50 tracking-tight">System & Vault Preferences</h2>
                  <p className="text-xs text-dark-400">Technical configurations and environment settings</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Appearance Setting Row */}
              <div className="p-4 rounded-2xl bg-dark-850/80 border border-dark-750/60 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold tracking-wider text-dark-400 block mb-0.5">
                    Platform Theme
                  </span>
                  <span className="text-sm font-semibold text-dark-100 capitalize">
                    {theme} Mode
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-700 text-xs font-semibold text-dark-200 hover:text-white transition-colors cursor-pointer"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-accent-400" />}
                  <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>

              {/* Vector Dimensions Row */}
              <div className="p-4 rounded-2xl bg-dark-850/80 border border-dark-750/60 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold tracking-wider text-dark-400 block mb-0.5">
                    Vector Dimensions
                  </span>
                  <span className="text-sm font-semibold text-accent-400 font-mono">
                    3,072 D (Gemini-v2)
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20 text-accent-300 font-medium">
                  Optimized
                </span>
              </div>

              {/* Vector Database Row */}
              <div className="p-4 rounded-2xl bg-dark-850/80 border border-dark-750/60 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold tracking-wider text-dark-400 block mb-0.5">
                    Vector Storage Engine
                  </span>
                  <span className="text-sm font-semibold text-dark-100">
                    Qdrant HNSW Index
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                  Online
                </span>
              </div>

              {/* Isolation Scheme Row */}
              <div className="p-4 rounded-2xl bg-dark-850/80 border border-dark-750/60 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold tracking-wider text-dark-400 block mb-0.5">
                    Multi-Tenant Isolation
                  </span>
                  <span className="text-sm font-semibold text-dark-100">
                    Payload User Index
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-dark-800 border border-dark-700 text-dark-300 font-medium">
                  Protected
                </span>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Security & Session */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-dark-900 border border-dark-750/70 rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-dark-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-dark-50 tracking-tight">Security & Authentication</h2>
                  <p className="text-xs text-dark-400">Session status and vault protection parameters</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-dark-850/80 border border-dark-750/60 gap-4">
                <div>
                  <div className="text-sm font-semibold text-dark-100">Active Authentication Session</div>
                  <div className="text-xs text-dark-400 mt-0.5">
                    Your bearer token is securely stored and authenticated for API and image stream requests.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-error-500/10 hover:bg-error-500/20 text-error-400 border border-error-500/30 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate Session</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
