import { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import {
  Calendar,
  LayoutGrid,
  CheckSquare,
  Square,
  Trash2,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Filter
} from 'lucide-react';

import Navbar from '../components/Navbar';
import GalleryGrid from '../components/GalleryGrid';
import ImageViewer from '../components/ImageViewer';
import MetadataPanel from '../components/MetadataPanel';
import UploadModal from '../components/UploadModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getUserMedia, searchMedia, deleteMedia } from '../api/media';

export default function GalleryPage() {
  // Media state
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearch, setActiveSearch] = useState('');

  // Filters state (Time Period & File Type)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    fileType: 'all',
  });

  // Grouping & Collapse state
  const [isGrouped, setIsGrouped] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  // Bulk Selection & Delete state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Single delete & Viewer modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerMedia, setViewerMedia] = useState(null);
  const [infoMedia, setInfoMedia] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Hero animation ref
  const heroRef = useRef(null);

  // GSAP hero entrance
  useLayoutEffect(() => {
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(heroRef.current.querySelectorAll('.hero-animate'), {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }, heroRef);
      return () => ctx.revert();
    }
  }, []);

  // Fetch gallery
  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserMedia();
      setMedia(data.files || []);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load your gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Search handler
  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setActiveSearch('');
      fetchGallery();
      return;
    }

    setIsSearching(true);
    setActiveSearch(query);
    setLoading(true);
    setError(null);

    try {
      const results = await searchMedia(query);
      setMedia(Array.isArray(results) ? results : []);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [fetchGallery]);

  // Filtering: Filter media by Date Range and File Type
  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      // 1. Date Range Filter
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom + 'T00:00:00');
        const itemDate = new Date(item.created_at);
        if (itemDate < from) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo + 'T23:59:59');
        const itemDate = new Date(item.created_at);
        if (itemDate > to) return false;
      }

      // 2. File Type Filter
      if (filters.fileType && filters.fileType !== 'all') {
        const mime = (item.media_type || '').toLowerCase();
        const name = (item.original_name || '').toLowerCase();

        if (filters.fileType === 'image') {
          if (!mime.startsWith('image/') && !name.match(/\.(jpg|jpeg|png|webp|gif|bmp|svg)$/)) return false;
        } else if (filters.fileType === 'video') {
          if (!mime.startsWith('video/') && !name.match(/\.(mp4|mov|avi|mkv|webm)$/)) return false;
        } else if (filters.fileType === 'jpg') {
          if (!mime.includes('jpeg') && !name.match(/\.(jpg|jpeg)$/)) return false;
        } else if (filters.fileType === 'png') {
          if (!mime.includes('png') && !name.endsWith('.png')) return false;
        } else if (filters.fileType === 'webp') {
          if (!mime.includes('webp') && !name.endsWith('.webp')) return false;
        } else if (filters.fileType === 'mp4') {
          if (!mime.includes('mp4') && !name.endsWith('.mp4')) return false;
        }
      }

      return true;
    });
  }, [media, filters]);

  // Single Delete handler
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await deleteMedia(deleteTarget.id);
      toast.success('Media deleted successfully');

      setMedia(prev => prev.filter(m => m.id !== deleteTarget.id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });

      if (viewerMedia?.id === deleteTarget.id) {
        setViewerMedia(null);
      }

      setDeleteTarget(null);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Failed to delete media';
      toast.error(detail);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, viewerMedia]);

  // Bulk Delete handler
  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);

    const idsToDelete = Array.from(selectedIds);
    try {
      const results = await Promise.allSettled(
        idsToDelete.map(id => deleteMedia(id))
      );

      const successfulIds = [];
      const failedIds = [];

      results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          successfulIds.push(idsToDelete[index]);
        } else {
          failedIds.push(idsToDelete[index]);
        }
      });

      if (successfulIds.length > 0) {
        setMedia(prev => prev.filter(m => !successfulIds.includes(m.id)));
        toast.success(`Successfully deleted ${successfulIds.length} item${successfulIds.length !== 1 ? 's' : ''}`);
      }

      if (failedIds.length > 0) {
        toast.error(`Failed to delete ${failedIds.length} item${failedIds.length !== 1 ? 's' : ''}`);
      }

      // Close viewer if it was viewing any deleted item
      if (viewerMedia && successfulIds.includes(viewerMedia.id)) {
        setViewerMedia(null);
      }

      setSelectedIds(new Set());
      setIsSelectMode(false);
      setBulkDeleteDialogOpen(false);
    } catch (err) {
      toast.error('An error occurred during bulk deletion');
    } finally {
      setBulkDeleting(false);
    }
  }, [selectedIds, viewerMedia]);

  // Selection handlers
  const handleToggleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (next.size > 0) {
        setIsSelectMode(true);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(filteredMedia.map(m => m.id)));
    setIsSelectMode(true);
  }, [filteredMedia]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setIsSelectMode(false);
  }, []);

  const handleSelectGroup = useCallback((groupItemIds, shouldSelect) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      groupItemIds.forEach(id => {
        if (shouldSelect) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      if (next.size > 0) setIsSelectMode(true);
      return next;
    });
  }, []);

  // Collapse / Accordion handlers
  const handleToggleGroupCollapse = useCallback((key) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // Compute all unique date keys from filteredMedia for Global Collapse/Expand
  const allDateKeys = useMemo(() => {
    const set = new Set();
    filteredMedia.forEach(m => {
      if (m.created_at) {
        const key = m.created_at.split('T')[0];
        set.add(key);
      }
    });
    return Array.from(set);
  }, [filteredMedia]);

  const areAllCollapsed = allDateKeys.length > 0 && allDateKeys.every(k => collapsedGroups.has(k));

  const handleToggleAllCollapse = useCallback(() => {
    if (areAllCollapsed) {
      setCollapsedGroups(new Set());
    } else {
      setCollapsedGroups(new Set(allDateKeys));
    }
  }, [areAllCollapsed, allDateKeys]);

  // Upload success — refresh gallery
  const handleUploadSuccess = useCallback(() => {
    if (activeSearch) {
      setSearchQuery('');
      setActiveSearch('');
    }
    fetchGallery();
  }, [fetchGallery, activeSearch]);

  const hasActiveFilters = Boolean(
    filters.dateFrom || filters.dateTo || (filters.fileType && filters.fileType !== 'all')
  );

  return (
    <div className="min-h-dvh bg-dark-950 pb-20">
      <Navbar
        onSearch={handleSearch}
        onUploadClick={() => setUploadOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Hero header & Interactive Toolbar */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Title / Search status */}
          <div>
            {activeSearch ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <h1 className="text-xl sm:text-2xl font-bold text-dark-50 tracking-tight">
                  Semantic results for "<span className="text-accent-400">{activeSearch}</span>"
                </h1>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleSearch('');
                  }}
                  className="text-xs sm:text-sm text-dark-400 hover:text-accent-400 transition-colors cursor-pointer bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-700/60"
                >
                  ← Clear search
                </button>
              </motion.div>
            ) : (
              <div>
                <h1 className="hero-animate text-2xl sm:text-3xl font-bold text-dark-50 tracking-tight">
                  Your Gallery
                </h1>
                <p className="hero-animate text-sm text-dark-400 mt-1">
                  {filteredMedia.length > 0
                    ? `${filteredMedia.length} item${filteredMedia.length !== 1 ? 's' : ''}${hasActiveFilters ? ' matching filters' : ''}`
                    : loading
                    ? 'Loading media...'
                    : 'Upload images or videos to get started'}
                </p>
              </div>
            )}
          </div>

          {/* Right Toolbar Controls (View Toggle, Collapse Toggle, Select Mode) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Grouped vs Flat View Toggle */}
            <button
              type="button"
              onClick={() => setIsGrouped(!isGrouped)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                isGrouped
                  ? 'bg-dark-850 border-dark-700 text-dark-200 hover:text-white hover:bg-dark-800'
                  : 'bg-accent-600/20 border-accent-500/40 text-accent-300'
              }`}
              title={isGrouped ? 'Switch to Flat Grid' : 'Switch to Grouped by Date'}
            >
              {isGrouped ? (
                <>
                  <Calendar className="w-4 h-4 text-accent-400" />
                  <span>Grouped</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-4 h-4 text-accent-400" />
                  <span>Flat Grid</span>
                </>
              )}
            </button>

            {/* Collapse All / Expand All (Only visible in Grouped View) */}
            {isGrouped && allDateKeys.length > 1 && (
              <button
                type="button"
                onClick={handleToggleAllCollapse}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-dark-850 hover:bg-dark-800 border border-dark-700 text-dark-300 hover:text-white transition-colors cursor-pointer"
                title={areAllCollapsed ? 'Expand all date groups' : 'Collapse all date groups'}
              >
                {areAllCollapsed ? (
                  <>
                    <ChevronDown className="w-4 h-4 text-accent-400" />
                    <span>Expand All</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 text-accent-400" />
                    <span>Collapse All</span>
                  </>
                )}
              </button>
            )}

            {/* Select Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isSelectMode) {
                  handleClearSelection();
                } else {
                  setIsSelectMode(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                isSelectMode
                  ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30 border-accent-500'
                  : 'bg-dark-850 hover:bg-dark-800 border-dark-700 text-dark-200 hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>{isSelectMode ? 'Selecting' : 'Select'}</span>
            </button>
          </div>
        </div>

        {/* Active Filter Badges Strip */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 flex-wrap pt-4 mt-2 border-t border-dark-800/60"
          >
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-accent-400" /> Active Filters:
            </span>

            {filters.dateFrom && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-850 text-xs text-dark-200 border border-dark-700">
                From: <span className="text-white font-medium">{filters.dateFrom}</span>
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, dateFrom: '' }))}
                  className="hover:text-error-400 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.dateTo && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-850 text-xs text-dark-200 border border-dark-700">
                To: <span className="text-white font-medium">{filters.dateTo}</span>
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, dateTo: '' }))}
                  className="hover:text-error-400 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.fileType && filters.fileType !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-850 text-xs text-dark-200 border border-dark-700 uppercase">
                Type: <span className="text-white font-medium">{filters.fileType}</span>
                <button
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, fileType: 'all' }))}
                  className="hover:text-error-400 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={() => setFilters({ dateFrom: '', dateTo: '', fileType: 'all' })}
              className="text-xs text-accent-400 hover:text-accent-300 font-medium underline cursor-pointer ml-2"
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Gallery content */}
      <div className="max-w-7xl mx-auto">
        <GalleryGrid
          media={filteredMedia}
          loading={loading}
          error={error}
          onRetry={activeSearch ? () => handleSearch(activeSearch) : fetchGallery}
          onImageClick={setViewerMedia}
          onImageInfo={setInfoMedia}
          onImageDelete={setDeleteTarget}
          searchQuery={activeSearch}
          isGrouped={isGrouped}
          selectedIds={selectedIds}
          isSelectMode={isSelectMode}
          onToggleSelect={handleToggleSelect}
          onSelectGroup={handleSelectGroup}
          collapsedGroups={collapsedGroups}
          onToggleGroupCollapse={handleToggleGroupCollapse}
        />
      </div>

      {/* Floating Bulk Action Bar (appears in select mode or when items are selected) */}
      <AnimatePresence>
        {(isSelectMode || selectedIds.size > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl p-3 bg-dark-900/95 backdrop-blur-2xl border border-dark-600/80 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between gap-3"
          >
            {/* Left: Count */}
            <div className="flex items-center gap-2.5 pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                {selectedIds.size} of {filteredMedia.length} selected
              </span>
            </div>

            {/* Middle: Select All / Deselect All */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  selectedIds.size === filteredMedia.length
                    ? handleClearSelection
                    : handleSelectAll
                }
                className="px-3 py-1.5 text-xs font-medium bg-dark-800 hover:bg-dark-750 text-dark-200 hover:text-white rounded-xl border border-dark-700/60 transition-colors cursor-pointer"
              >
                {selectedIds.size === filteredMedia.length ? 'Deselect All' : 'Select All'}
              </button>

              {/* Delete Selected (Bulk Delete) */}
              <button
                type="button"
                disabled={selectedIds.size === 0}
                onClick={() => setBulkDeleteDialogOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-error-500 hover:bg-error-600 disabled:opacity-40 text-white rounded-xl shadow-md shadow-error-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}</span>
              </button>
            </div>

            {/* Right: Exit / Done button */}
            <button
              type="button"
              onClick={handleClearSelection}
              className="px-3 py-1.5 text-xs font-medium text-dark-400 hover:text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image viewer lightbox */}
      {viewerMedia && (
        <ImageViewer
          media={viewerMedia}
          allMedia={filteredMedia}
          onClose={() => setViewerMedia(null)}
          onNavigate={setViewerMedia}
          onInfo={(m) => { setInfoMedia(m); }}
          onDelete={(m) => { setDeleteTarget(m); }}
        />
      )}

      {/* Metadata side panel */}
      <MetadataPanel
        media={infoMedia}
        isOpen={!!infoMedia}
        onClose={() => setInfoMedia(null)}
      />

      {/* Upload modal */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Single Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Media"
        message={`Are you sure you want to delete "${deleteTarget?.original_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Bulk Delete confirmation */}
      <ConfirmDialog
        isOpen={bulkDeleteDialogOpen}
        title={`Delete ${selectedIds.size} Media Item${selectedIds.size !== 1 ? 's' : ''}`}
        message={`Are you sure you want to delete the ${selectedIds.size} selected item${selectedIds.size !== 1 ? 's' : ''}? They will be permanently removed from your vault.`}
        confirmLabel={`Delete ${selectedIds.size} Item${selectedIds.size !== 1 ? 's' : ''}`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteDialogOpen(false)}
        loading={bulkDeleting}
      />
    </div>
  );
}
