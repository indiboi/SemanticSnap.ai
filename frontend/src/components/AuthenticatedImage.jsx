import { useAuthenticatedImage } from '../hooks/useAuthenticatedImage';
import { ImageOff } from 'lucide-react';

/**
 * Renders an image fetched via authenticated blob URL.
 * Shows skeleton while loading, error icon on failure.
 */
export default function AuthenticatedImage({ mediaId, alt = '', className = '', onClick }) {
  const { src, loading, error } = useAuthenticatedImage(mediaId);

  if (loading) {
    return (
      <div className={`bg-dark-800 animate-pulse flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-full bg-dark-700" />
      </div>
    );
  }

  if (error || !src) {
    return (
      <div className={`bg-dark-800 flex items-center justify-center ${className}`}>
        <ImageOff className="w-8 h-8 text-dark-500" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      loading="lazy"
      draggable={false}
    />
  );
}
