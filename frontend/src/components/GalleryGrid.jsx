import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ImageCard from './ImageCard';
import {
  ImageOff,
  RefreshCw,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square
} from 'lucide-react';

function formatDateHeader(dateStr) {
  if (!dateStr) return 'Unknown Date';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Unknown Date';

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Unknown Date';
  }
}

function getGroupKey(dateStr) {
  if (!dateStr) return 'unknown';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'unknown' : d.toISOString().split('T')[0];
  } catch {
    return 'unknown';
  }
}

export default function GalleryGrid({
  media = [],
  loading = false,
  error = null,
  onRetry,
  onImageClick,
  onImageInfo,
  onImageDelete,
  searchQuery = '',
  isGrouped = true,
  selectedIds = new Set(),
  isSelectMode = false,
  onToggleSelect = () => {},
  onSelectGroup = () => {},
  collapsedGroups = new Set(),
  onToggleGroupCollapse = () => {},
}) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-dark-850 rounded-2xl animate-pulse border border-dark-700/30"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-error-500/10 flex items-center justify-center mb-4">
          <ImageOff className="w-8 h-8 text-error-500" />
        </div>
        <h3 className="text-lg font-semibold text-dark-100 mb-1">Something went wrong</h3>
        <p className="text-sm text-dark-400 mb-4 text-center max-w-sm">{error}</p>
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600/50 rounded-xl text-sm text-dark-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Empty state
  if (!media || media.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-accent-400" />
        </div>
        <h3 className="text-lg font-semibold text-dark-100 mb-1">
          {searchQuery ? 'No results found' : 'Your gallery is empty'}
        </h3>
        <p className="text-sm text-dark-400 text-center max-w-sm">
          {searchQuery
            ? `We couldn't find anything matching "${searchQuery}". Try a different keyword or adjust your filters.`
            : 'Upload your first image to get started with AI-powered semantic search.'}
        </p>
      </motion.div>
    );
  }

  // Group media by date
  const groups = useMemo(() => {
    if (!isGrouped) return [];

    const map = {};
    media.forEach((item) => {
      const key = getGroupKey(item.created_at);
      if (!map[key]) {
        map[key] = {
          key,
          dateStr: item.created_at,
          title: formatDateHeader(item.created_at),
          items: [],
        };
      }
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => {
      if (a.key === 'unknown') return 1;
      if (b.key === 'unknown') return -1;
      return b.key.localeCompare(a.key);
    });
  }, [media, isGrouped]);

  // Render Flat Grid View
  if (!isGrouped) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        <AnimatePresence mode="popLayout">
          {media.map((item, index) => (
            <ImageCard
              key={item.id}
              media={item}
              index={index}
              onClick={onImageClick}
              onInfo={onImageInfo}
              onDelete={onImageDelete}
              isSelected={selectedIds.has(item.id)}
              isSelectMode={isSelectMode}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Render Grouped Timeline View
  return (
    <div className="space-y-8 px-4 pb-12">
      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.key);
        const groupItemIds = group.items.map((m) => m.id);
        const allGroupSelected =
          groupItemIds.length > 0 && groupItemIds.every((id) => selectedIds.has(id));
        const someGroupSelected =
          !allGroupSelected && groupItemIds.some((id) => selectedIds.has(id));

        return (
          <div key={group.key} className="space-y-3">
            {/* Group Header Bar with Accordion Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-dark-800/80 sticky top-16 z-30 bg-dark-950/90 backdrop-blur-md">
              <button
                type="button"
                onClick={() => onToggleGroupCollapse(group.key)}
                className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
                aria-expanded={!isCollapsed}
                aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${group.title}`}
              >
                <div className="p-1 rounded-lg bg-dark-850 group-hover:bg-dark-800 text-dark-400 group-hover:text-accent-400 transition-colors">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-400/80" />
                  <span className="text-base sm:text-lg font-bold text-dark-50 tracking-tight group-hover:text-white transition-colors">
                    {group.title}
                  </span>
                </div>

                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-dark-850 text-dark-400 border border-dark-700/50">
                  {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                </span>
              </button>

              {/* Group Quick Select (shown in selectMode or hover) */}
              {isSelectMode && (
                <button
                  type="button"
                  onClick={() => onSelectGroup(groupItemIds, !allGroupSelected)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-dark-850 hover:bg-dark-800 text-dark-300 hover:text-white border border-dark-700/60 transition-colors cursor-pointer"
                >
                  {allGroupSelected ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-accent-400" />
                      <span>Deselect Date</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Select Date</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Group Grid (collapsible) */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-1">
                    {group.items.map((item, index) => (
                      <ImageCard
                        key={item.id}
                        media={item}
                        index={index}
                        onClick={onImageClick}
                        onInfo={onImageInfo}
                        onDelete={onImageDelete}
                        isSelected={selectedIds.has(item.id)}
                        isSelectMode={isSelectMode}
                        onToggleSelect={onToggleSelect}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
