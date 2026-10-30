import { motion } from 'framer-motion';
import { Info, Trash2, Check } from 'lucide-react';
import AuthenticatedImage from './AuthenticatedImage';

export default function ImageCard({
  media,
  index,
  onClick,
  onInfo,
  onDelete,
  isSelected = false,
  isSelectMode = false,
  onToggleSelect = () => {},
}) {
  const handleCardClick = () => {
    if (isSelectMode) {
      onToggleSelect(media.id);
    } else {
      onClick(media);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleSelect(media.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className={`group relative bg-dark-800 rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg ${
        isSelected
          ? 'border-accent-500 shadow-xl shadow-accent-500/15 ring-2 ring-accent-500/40'
          : 'border-dark-700/40 hover:border-accent-500/30 hover:shadow-xl hover:shadow-accent-500/5'
      }`}
    >
      {/* Image container */}
      <div
        className="aspect-square cursor-pointer overflow-hidden relative"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        aria-label={`${isSelectMode ? (isSelected ? 'Deselect' : 'Select') : 'View'} ${media.original_name}`}
      >
        <AuthenticatedImage
          mediaId={media.id}
          alt={media.original_name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isSelected ? 'scale-100' : 'group-hover:scale-105'
          }`}
        />

        {/* Selected tint */}
        {isSelected && (
          <div className="absolute inset-0 bg-accent-900/30 backdrop-brightness-95 pointer-events-none" />
        )}
      </div>

      {/* Select Checkbox (always visible if selected or in selectMode; visible on hover otherwise) */}
      <div
        className={`absolute top-2.5 left-2.5 z-20 transition-all duration-200 ${
          isSelectMode || isSelected
            ? 'opacity-100 scale-100'
            : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
        }`}
      >
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isSelected
              ? 'bg-accent-600 text-white shadow-accent-600/40 scale-105'
              : 'bg-dark-900/80 hover:bg-dark-900 border border-white/30 text-transparent hover:border-white/60 backdrop-blur-md'
          }`}
          aria-label={isSelected ? `Deselect ${media.original_name}` : `Select ${media.original_name}`}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'text-white' : 'text-transparent'}`} />
        </button>
      </div>

      {/* Hover overlay (hidden in select mode) */}
      {!isSelectMode && (
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Bottom info bar */}
      <div className={`absolute bottom-0 left-0 right-0 p-3 translate-y-1 transition-all duration-300 ${
        isSelectMode && isSelected
          ? 'translate-y-0 opacity-100 bg-dark-950/80 backdrop-blur-sm'
          : 'opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
      }`}>
        <p className="text-sm text-dark-100 font-medium truncate pr-16" title={media.original_name}>
          {media.original_name}
        </p>
        {media.score !== undefined && (
          <p className="text-xs text-accent-300 mt-0.5 font-medium">
            Match: {(media.score * 100).toFixed(0)}%
          </p>
        )}
      </div>

      {/* Action buttons (only when not in select mode) */}
      {!isSelectMode && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onInfo(media);
            }}
            className="p-2 bg-dark-900/70 backdrop-blur-sm rounded-lg text-dark-200 hover:text-accent-400 transition-colors cursor-pointer"
            aria-label={`Info for ${media.original_name}`}
          >
            <Info className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(media);
            }}
            className="p-2 bg-dark-900/70 backdrop-blur-sm rounded-lg text-dark-200 hover:text-error-500 transition-colors cursor-pointer"
            aria-label={`Delete ${media.original_name}`}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {/* Status badge */}
      {media.status && media.status !== 'indexed' && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium backdrop-blur-md ${
            media.status === 'processing' ? 'bg-warning-500/20 text-warning-400 border border-warning-500/30' :
            media.status === 'failed' ? 'bg-error-500/20 text-error-400 border border-error-500/30' :
            'bg-dark-700/80 text-dark-300'
          }`}>
            {media.status === 'processing' ? 'Processing...' :
             media.status === 'failed' ? 'Failed' :
             media.status === 'pending' ? 'Pending' : media.status}
          </span>
        </div>
      )}
    </motion.div>
  );
}
