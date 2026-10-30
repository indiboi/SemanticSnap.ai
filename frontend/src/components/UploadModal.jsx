import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadMedia } from '../api/media';
import toast from 'react-hot-toast';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
];
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState({});
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Unsupported file type`);
        return false;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: Exceeds 100 MB limit`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => { const n = { ...prev }; delete n[index]; return n; });
    setUploadResults(prev => { const n = { ...prev }; delete n[index]; return n; });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    setUploading(true);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      if (uploadResults[i]?.success) continue;

      try {
        await uploadMedia(files[i], (progressEvent) => {
          const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(prev => ({ ...prev, [i]: pct }));
        });
        setUploadResults(prev => ({ ...prev, [i]: { success: true } }));
        successCount++;
      } catch (err) {
        const detail = err?.response?.data?.detail || 'Upload failed';
        setUploadResults(prev => ({ ...prev, [i]: { success: false, error: detail } }));
        toast.error(`${files[i].name}: ${detail}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully`);
      onUploadSuccess();
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setFiles([]);
    setUploadProgress({});
    setUploadResults({});
    onClose();
  };

  const allUploaded = files.length > 0 && files.every((_, i) => uploadResults[i]?.success);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-dark-850 border border-dark-700/50 rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Upload media"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-dark-700/50">
              <h2 className="text-lg font-semibold text-dark-50">Upload Media</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                disabled={uploading}
                className="p-2 bg-dark-800 hover:bg-dark-700 rounded-xl text-dark-300 hover:text-dark-100 transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-5 space-y-4">
              {/* Drop zone */}
              <div
                ref={dropRef}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                  dragOver
                    ? 'border-accent-500 bg-accent-500/5'
                    : 'border-dark-600/50 hover:border-dark-500 bg-dark-800/30'
                }`}
              >
                <div className="p-3 bg-dark-800 rounded-xl">
                  <Upload className="w-6 h-6 text-accent-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-dark-200">
                    Drop files here or <span className="text-accent-400">browse</span>
                  </p>
                  <p className="text-xs text-dark-400 mt-1">
                    JPEG, PNG, WebP, MP4, MOV, AVI, MKV — up to 100 MB
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_TYPES.join(',')}
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
                className="hidden"
                aria-label="Select files"
              />

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl border border-dark-700/30">
                      <FileImage className="w-5 h-5 text-dark-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark-200 truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-dark-400">
                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                          {uploadProgress[i] !== undefined && !uploadResults[i] && (
                            <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-500 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[i]}%` }}
                              />
                            </div>
                          )}
                          {uploadResults[i]?.success && (
                            <CheckCircle2 className="w-4 h-4 text-success-500" />
                          )}
                          {uploadResults[i]?.success === false && (
                            <AlertCircle className="w-4 h-4 text-error-500" />
                          )}
                        </div>
                      </div>
                      {!uploading && !uploadResults[i]?.success && (
                        <button
                          onClick={() => removeFile(i)}
                          className="p-1.5 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-dark-700/50">
              <button
                onClick={handleClose}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600/50 rounded-xl text-sm font-medium text-dark-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {allUploaded ? 'Done' : 'Cancel'}
              </button>
              {!allUploaded && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUploadAll}
                  disabled={files.length === 0 || uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-600 hover:bg-accent-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload {files.length > 0 ? `(${files.length})` : ''}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
