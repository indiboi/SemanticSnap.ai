import client from './client';

/**
 * GET /media/
 * Returns: { files: [{ id, original_name, media_type, file_size, status, created_at, image_url }] }
 */
export const getUserMedia = async () => {
  const response = await client.get('/media/');
  return response.data;
};

/**
 * POST /media/upload
 * Multipart: file field
 * Returns: { message, file: { id, original_name, media_type, file_size, status, created_at } }
 */
export const uploadMedia = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await client.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 2 min for large files
    onUploadProgress,
  });
  return response.data;
};

/**
 * GET /media/search?q=<query>
 * Returns: [{ id, original_name, media_type, file_size, created_at, score }]
 */
export const searchMedia = async (query) => {
  const response = await client.get('/media/search', {
    params: { q: query },
  });
  return response.data;
};

/**
 * GET /media/{media_id}
 * Returns: { id, original_name, media_type, file_size, created_at }
 */
export const getMediaById = async (mediaId) => {
  const response = await client.get(`/media/${mediaId}`);
  return response.data;
};

/**
 * GET /media/{media_id}/file
 * Returns raw file bytes (blob)
 */
export const getMediaFile = async (mediaId) => {
  const response = await client.get(`/media/${mediaId}/file`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * DELETE /media/{media_id}
 * Returns: { message, id }
 */
export const deleteMedia = async (mediaId) => {
  const response = await client.delete(`/media/${mediaId}`);
  return response.data;
};
