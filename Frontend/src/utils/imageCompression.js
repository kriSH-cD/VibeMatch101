import imageCompression from 'browser-image-compression';
import { MAX_PROFILE_IMAGE_SIZE, MAX_POST_IMAGE_SIZE } from './constants';

/**
 * Compresses an image file before upload.
 *
 * @param {File}   file       – the original image file
 * @param {'profile'|'post'} type – determines the max allowed size
 * @returns {Promise<File>}  – compressed file
 */
export async function compressImage(file, type = 'post') {
  const maxSize = type === 'profile' ? MAX_PROFILE_IMAGE_SIZE : MAX_POST_IMAGE_SIZE;
  const maxWidthOrHeight = type === 'profile' ? 800 : 1920;

  // Skip compression if already within limits
  if (file.size <= maxSize) return file;

  const options = {
    maxSizeMB: maxSize / (1024 * 1024),
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to compress image. Please try a smaller file.');
  }
}

/**
 * Validates that the file is a supported image type.
 */
export function isValidImageType(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowed.includes(file.type);
}
