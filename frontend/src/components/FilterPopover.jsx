import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, X, Check, RotateCcw } from 'lucide-react';

export default function FilterPopover({
  isOpen,
  onClose,
  filters = { dateFrom: '', dateTo: '', fileType: 'all' },
  onChange,
  onClear,
}) {
  if (!isOpen) return null;

  const fileTypeOptions = [
    { id: 'all', label: 'All Types' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Videos' },
    { id: 'jpg', label: 'JPG / JPEG' },
    { id: 'png', label: 'PNG' },
    { id: 'webp', label: 'WEBP' },
    { id: 'mp4', label: 'MP4' },
  ];

  const handleDateQuickSelect = (days) => {
    const today = new Date();
    const toStr = today.toISOString().split('T')[0];
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - days);
    const fromStr = fromDate.toISOString().split('T')[0];

    onChange({
      ...filters,
      dateFrom: fromStr,
      dateTo: toStr,
    });
  };

  const handleThisMonthSelect = () => {
    const today = new Date();
    const toStr = today.toISOString().split('T')[0];
    const fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const fromStr = fromDate.toISOString().split('T')[0];

    onChange({
      ...filters,
      dateFrom: fromStr,
      dateTo: toStr,
    });
  };

  const hasActiveFilters = Boolean(
    filters.dateFrom || filters.dateTo || (filters.fileType && filters.fileType !== 'all')
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Popover Card */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 p-4 sm:p-5 bg-dark-850/95 backdrop-blur-2xl border border-dark-600/60 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-dark-700/60">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-semibold text-dark-50">Filter Media</span>
              </div>

              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onClear}
                    className="flex items-center gap-1 text-xs text-dark-400 hover:text-accent-300 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-dark-800"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Filter 1: Time Period (Date Range) */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent-400" />
                  Time Period (Uploaded Date)
                </label>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="block text-[11px] text-dark-400 mb-1">From:</span>
                    <input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-dark-900 border border-dark-600/60 rounded-xl text-xs text-dark-100 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all scheme-dark"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-dark-400 mb-1">To:</span>
                    <input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-dark-900 border border-dark-600/60 rounded-xl text-xs text-dark-100 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all scheme-dark"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDateQuickSelect(7)}
                    className="px-2 py-1 bg-dark-800 hover:bg-dark-750 border border-dark-700 text-[11px] text-dark-300 hover:text-dark-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Last 7 days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateQuickSelect(30)}
                    className="px-2 py-1 bg-dark-800 hover:bg-dark-750 border border-dark-700 text-[11px] text-dark-300 hover:text-dark-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Last 30 days
                  </button>
                  <button
                    type="button"
                    onClick={handleThisMonthSelect}
                    className="px-2 py-1 bg-dark-800 hover:bg-dark-750 border border-dark-700 text-[11px] text-dark-300 hover:text-dark-100 rounded-lg transition-colors cursor-pointer"
                  >
                    This Month
                  </button>
                  {(filters.dateFrom || filters.dateTo) && (
                    <button
                      type="button"
                      onClick={() => onChange({ ...filters, dateFrom: '', dateTo: '' })}
                      className="px-2 py-1 bg-dark-800 hover:bg-dark-750 border border-dark-700 text-[11px] text-error-400 hover:text-error-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Date
                    </button>
                  )}
                </div>
              </div>

              {/* Filter 2: File Type */}
              <div>
                <label className="block text-xs font-semibold text-dark-200 uppercase tracking-wider mb-2">
                  File Type
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {fileTypeOptions.map((opt) => {
                    const isSelected = (filters.fileType || 'all') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange({ ...filters, fileType: opt.id })}
                        className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30'
                            : 'bg-dark-800 hover:bg-dark-750 text-dark-300 hover:text-dark-100 border border-dark-700/60'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-dark-700/60 flex items-center justify-between">
              <span className="text-[11px] text-dark-400">
                {hasActiveFilters ? 'Filters applied dynamically' : 'No filters active'}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
