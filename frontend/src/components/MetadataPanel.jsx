import { motion, AnimatePresence } from 'framer-motion';
import { X, FileImage, Calendar, HardDrive, Hash, FileType, Activity } from 'lucide-react';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return 'Unknown';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function MetadataPanel({ media, isOpen, onClose }) {
  if (!media) return null;

  const fields = [
    { label: 'Filename', value: media.original_name, icon: FileImage },
    { label: 'Media ID', value: media.id, icon: Hash },
    { label: 'Content Type', value: media.media_type, icon: FileType },
    { label: 'File Size', value: formatFileSize(media.file_size), icon: HardDrive },
    { label: 'Status', value: media.status, icon: Activity },
    { label: 'Created', value: formatDate(media.created_at), icon: Calendar },
  ];

  if (media.score !== undefined) {
    fields.push({
      label: 'Relevance Score',
      value: `${(media.score * 100).toFixed(1)}%`,
      icon: Activity,
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/50 backdrop-blur-sm z-[110]"
            onClick={onClose}
          />

          {/* Side panel */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-900 border-l border-dark-700/50 shadow-2xl z-[111] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Image metadata"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-dark-700/50">
              <h2 className="text-lg font-semibold text-dark-50">Media Details</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 bg-dark-800 hover:bg-dark-700 rounded-xl text-dark-300 hover:text-dark-100 transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {fields.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-xl border border-dark-700/30"
                >
                  <div className="p-2 bg-dark-750 rounded-lg shrink-0">
                    <Icon className="w-4 h-4 text-accent-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-dark-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-dark-100 mt-0.5 break-all">{value ?? 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
