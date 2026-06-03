/**
 * Image URL resolution utility
 * Handles base64, local paths, Cloudinary URLs, and external URLs
 */

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

/**
 * Resolves an image source to a usable URL
 * @param {string} image - Image source (base64, path, or URL)
 * @returns {string} - Resolved image URL
 */
export const resolveImageUrl = (image) => {
  if (!image) {
    return '/placeholder-blog.jpg';
  }

  // Already a data URL (base64)
  if (image.startsWith('data:')) {
    return image;
  }

  // Already a full URL (Cloudinary, HTTP, HTTPS)
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  // Local path that needs API_BASE prefix
  if (image.startsWith('/')) {
    return `${API_BASE}${image}`;
  }

  // Relative path - add API_BASE with slash
  return `${API_BASE}/${image}`;
};

/**
 * Batch resolve multiple images
 * @param {array} images - Array of image sources
 * @returns {array} - Array of resolved URLs
 */
export const resolveImageUrls = (images) => {
  return (images || []).map(resolveImageUrl);
};

export default resolveImageUrl;
