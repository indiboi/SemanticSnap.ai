import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Info, Trash2, Download } from 'lucide-react';
import AuthenticatedImage from './AuthenticatedImage';

export default function ImageViewer({ media, allMedia, onClose, onNavigate, onInfo, onDelete }) {
  const currentIndex = allMedia ? allMedia.findIndex(m => m.id === media?.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allMedia.length - 1;

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(allMedia[currentIndex + 1]);
  }, [hasNext, currentIndex, allMedia, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(allMedia[currentIndex - 1]);
  }, [hasPrev, currentIndex, allMedia, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!media) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-dark-950/95 backdrop-blur-xl flex items-center justify-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Viewing ${media.original_name}`}
      >
        {/* Top toolbar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10" onClick={e => e.stopPropagation()}>
          <h2 className="text-sm font-medium text-dark-200 truncate max-w-[50%]">{media.original_name}</h2>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onInfo(media)}
              className="p-2.5 bg-dark-800/60 backdrop-blur-sm rounded-xl text-dark-300 hover:text-accent-400 transition-colors cursor-pointer"
              aria-label="View info"
            >
              <Info className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(media)}
              className="p-2.5 bg-dark-800/60 backdrop-blur-sm rounded-xl text-dark-300 hover:text-error-500 transition-colors cursor-pointer"
              aria-label="Delete image"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2.5 bg-dark-800/60 backdrop-blur-sm rounded-xl text-dark-300 hover:text-dark-50 transition-colors cursor-pointer"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Navigation arrows */}
        {hasPrev && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-dark-800/60 backdrop-blur-sm rounded-xl text-dark-300 hover:text-dark-50 transition-colors z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}
        {hasNext && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-dark-800/60 backdrop-blur-sm rounded-xl text-dark-300 hover:text-dark-50 transition-colors z-10 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}

        {/* Image */}
        <motion.div
          key={media.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          <AuthenticatedImage
            mediaId={media.id}
            alt={media.original_name}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </motion.div>

        {/* Bottom counter */}
        {allMedia && allMedia.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-800/60 backdrop-blur-sm rounded-lg text-xs text-dark-300">
            {currentIndex + 1} / {allMedia.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
