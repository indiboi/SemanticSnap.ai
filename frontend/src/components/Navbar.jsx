import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Upload, LogOut, User, Menu, X, Sparkles, Filter, Sun, Moon } from 'lucide-react';
import FilterPopover from './FilterPopover';

export default function Navbar({
  onSearch,
  onUploadClick,
  searchQuery,
  setSearchQuery,
  filters = { dateFrom: '', dateTo: '', fileType: 'all' },
  onFilterChange = () => {},
}) {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef(null);

  const activeFilterCount =
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    (filters.fileType && filters.fileType !== 'all' ? 1 : 0);

  const handleClearFilters = () => {
    onFilterChange({ dateFrom: '', dateTo: '', fileType: 'all' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
    searchInputRef.current?.focus();
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo - redirects to /gallery if logged in, otherwise / */}
          <Link
            to={user ? "/gallery" : "/"}
            className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity"
            aria-label="SemanticSnap Home"
          >
            <Sparkles className="w-6 h-6 text-accent-400" />
            <span className="text-lg font-bold text-dark-50 tracking-tight hidden sm:block">
              SemanticSnap<span className="text-accent-400">.ai</span>
            </span>
            <span className="text-lg font-bold text-dark-50 tracking-tight sm:hidden">
              SS<span className="text-accent-400">.ai</span>
            </span>
          </Link>

          {/* Search bar + Filter button — desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 items-center gap-2">
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1"
            >
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 group-focus-within:text-accent-400 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search with natural language — e.g. 'sunset over the ocean'"
                  className="w-full pl-10 pr-10 py-2.5 bg-dark-800/80 border border-dark-600/50 rounded-xl text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/25 transition-all"
                  aria-label="Semantic search"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Filter Button Desktop - Square Icon Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeFilterCount > 0
                    ? 'bg-accent-600/15 border-accent-500/50 text-accent-300 shadow-sm shadow-accent-500/20'
                    : 'bg-dark-800/80 hover:bg-dark-750 border-dark-600/50 text-dark-300 hover:text-dark-100'
                }`}
                aria-label="Open search and gallery filters"
                title="Filter by date range and file type"
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <FilterPopover
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                filters={filters}
                onChange={onFilterChange}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Actions — desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-600/50 flex items-center justify-center text-dark-300 hover:text-dark-100 transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-accent-400" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUploadClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
              aria-label="Upload media"
            >
              <Upload className="w-4 h-4" />
              Upload
            </motion.button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2.5 bg-dark-800 hover:bg-dark-750 border border-dark-600/50 rounded-xl text-sm text-dark-200 transition-colors cursor-pointer"
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                <User className="w-4 h-4 text-accent-400" />
                <span className="max-w-[110px] truncate">{user?.name || user?.email}</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 py-1.5 bg-dark-850/95 backdrop-blur-xl border border-dark-600/60 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      {/* User Header */}
                      <div className="px-4 py-3 border-b border-dark-750/70">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-dark-100 truncate">{user?.name}</p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-300 border border-accent-500/20">
                            Vault
                          </span>
                        </div>
                        <p className="text-xs text-dark-400 truncate mt-0.5">{user?.email}</p>
                      </div>

                      {/* Profile & Settings Page Link */}
                      <div className="py-1 border-b border-dark-750/70">
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-dark-200 hover:text-white hover:bg-dark-800 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <User className="w-4 h-4 text-accent-400" />
                            <span>Profile & Settings</span>
                          </div>
                          <span className="text-xs text-accent-400 font-medium">
                            Manage
                          </span>
                        </Link>
                      </div>

                      {/* Sign out */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-300 hover:text-error-400 hover:bg-dark-800 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile actions: Theme toggle & hamburger */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-600/50 flex items-center justify-center text-dark-300 hover:text-dark-100 transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-accent-400" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-dark-300 hover:text-dark-100 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 group-focus-within:text-accent-400 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your gallery..."
                  className="w-full pl-10 pr-10 py-2.5 bg-dark-800/80 border border-dark-600/50 rounded-xl text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-accent-500/50 transition-all"
                  aria-label="Semantic search"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  activeFilterCount > 0
                    ? 'bg-accent-600/15 border-accent-500/50 text-accent-300'
                    : 'bg-dark-800/80 hover:bg-dark-750 border-dark-600/50 text-dark-300'
                }`}
                aria-label="Open search filters"
                title="Filter by date range and file type"
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <FilterPopover
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                filters={filters}
                onChange={onFilterChange}
                onClear={handleClearFilters}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-dark-700/50 bg-dark-900"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="px-3 py-2 border-b border-dark-800 pb-3">
                <p className="text-sm font-semibold text-dark-100">{user?.name}</p>
                <p className="text-xs text-dark-400 mt-0.5">{user?.email}</p>
              </div>

              {/* Profile & Settings Page Link */}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-dark-200 hover:text-white bg-dark-800/70 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-accent-400" />
                  <span>Profile & Settings</span>
                </div>
                <span className="text-xs text-accent-400 font-medium">Manage</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onUploadClick();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-dark-300 hover:text-error-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
