import { useState, useEffect, useRef } from 'react';
import { getMediaFile } from '../api/media';

// Simple in-memory cache to avoid re-downloading images across components
const blobCache = new Map(); // mediaId -> { url, refCount }

function acquireBlobUrl(mediaId, blob) {
  if (blobCache.has(mediaId)) {
    const entry = blobCache.get(mediaId);
    entry.refCount++;
    return entry.url;
  }
  const url = URL.createObjectURL(blob);
  blobCache.set(mediaId, { url, refCount: 1 });
  return url;
}

function releaseBlobUrl(mediaId) {
  if (!blobCache.has(mediaId)) return;
  const entry = blobCache.get(mediaId);
  entry.refCount--;
  if (entry.refCount <= 0) {
    URL.revokeObjectURL(entry.url);
    blobCache.delete(mediaId);
  }
}

/**
 * Hook that fetches an authenticated image as a blob and returns an object URL.
 * Handles caching, cleanup, stale requests, and error states.
 */
export function useAuthenticatedImage(mediaId) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);
  const currentMediaIdRef = useRef(mediaId);

  useEffect(() => {
    if (!mediaId) {
      setLoading(false);
      return;
    }

    abortRef.current = false;
    currentMediaIdRef.current = mediaId;
    setLoading(true);
    setError(null);

    // Check cache first
    if (blobCache.has(mediaId)) {
      const entry = blobCache.get(mediaId);
      entry.refCount++;
      setSrc(entry.url);
      setLoading(false);
      return () => {
        releaseBlobUrl(mediaId);
      };
    }

    getMediaFile(mediaId)
      .then((blob) => {
        if (abortRef.current || currentMediaIdRef.current !== mediaId) return;
        const url = acquireBlobUrl(mediaId, blob);
        setSrc(url);
      })
      .catch((err) => {
        if (abortRef.current || currentMediaIdRef.current !== mediaId) return;
        setError(err?.response?.status === 404 ? 'Image not found' : 'Failed to load image');
      })
      .finally(() => {
        if (!abortRef.current && currentMediaIdRef.current === mediaId) {
          setLoading(false);
        }
      });

    return () => {
      abortRef.current = true;
      releaseBlobUrl(mediaId);
    };
  }, [mediaId]);

  return { src, loading, error };
}
