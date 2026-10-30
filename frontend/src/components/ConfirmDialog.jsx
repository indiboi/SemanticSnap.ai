import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading = false, variant = 'danger' }) {
  if (!isOpen) return null;

  const confirmStyles = variant === 'danger'
    ? 'bg-error-500 hover:bg-error-500/90 text-white'
    : 'bg-accent-600 hover:bg-accent-500 text-white';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm" onClick={!loading ? onCancel : undefined} />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-dark-850 border border-dark-700/50 rounded-2xl shadow-2xl overflow-hidden"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-error-500/10 rounded-xl shrink-0">
                  <AlertTriangle className="w-5 h-5 text-error-500" />
                </div>
                <div>
                  <h3 id="confirm-title" className="text-base font-semibold text-dark-50">{title}</h3>
                  <p id="confirm-message" className="text-sm text-dark-300 mt-1.5 leading-relaxed">{message}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600/50 rounded-xl text-sm font-medium text-dark-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-70 cursor-pointer ${confirmStyles}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
