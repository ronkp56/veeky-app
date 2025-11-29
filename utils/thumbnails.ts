/**
 * thumbnails.ts
 *
 * Utility for generating a thumbnail image URL based on the video's location.
 *
 * Purpose:
 * --------------------------------------------------------------------
 * In the influencer profile screen (and any grid-based display),
 * we need a static image preview of the trip — without loading
 * the entire video. For the MVP, we generate thumbnails based on
 * keyword matching inside the location string.
 *
 * How it works:
 * --------------------------------------------------------------------
 * ✔ Checks if the location string contains certain keywords
 * ✔ Returns a curated Unsplash image for that region
 * ✔ Falls back to a default travel-themed image if no match is found
 *
 * Notes:
 * --------------------------------------------------------------------
 * • This is intentionally lightweight and simple.
 * • In the future, thumbnails may come from:
 *      - The backend (pre-generated)
 *      - Creator uploads
 *      - Extracted from video via ffmpeg cloud worker
 * • The current method supports rapid development and testing.
 */

export const getThumbnailForLocation = (location: string): string => {
  // Greece / Santorini
  if (location.includes('Greece') || location.includes('Santorini'))
    return 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=600&fit=crop';

  // Dubai + UAE related
  if (location.includes('Dubai'))
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=600&fit=crop';

  // Spain / Barcelona
  if (location.includes('Barcelona') || location.includes('Spain'))
    return 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=600&fit=crop';

  // Swiss Alps
  if (location.includes('Alps') || location.includes('Swiss'))
    return 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&h=600&fit=crop';

  /**
   * Default fallback:
   * A generic travel image for any unidentified location.
   */
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=600&fit=crop';
};
