/**
 * storage.ts
 *
 * Lightweight in-memory storage layer for Veeky.
 *
 * What this module is responsible for:
 * --------------------------------------------------------------------
 * ✔ Track which videos are:
 *    - Saved (bookmarked)
 *    - Liked (hearted)
 * ✔ Store comments for each video (per session, in memory only)
 * ✔ Provide a simple synchronous API used by:
 *    - VideoItem
 *    - WebVideoFeed
 *    - CommentsModal
 *
 * Important notes:
 * --------------------------------------------------------------------
 * • This implementation is **in-memory only**:
 *      - All data is reset when the app or page reloads.
 * • There is **no persistence** to AsyncStorage / localStorage.
 * • This is great for an MVP and development.
 *   Later you can swap the internals with a persistent solution
 *   while keeping the same method signatures.
 */

/**
 * Single comment structure used for video comments.
 */
type Comment = {
  id: string;        // Unique identifier for the comment
  videoId: string;   // The video this comment belongs to
  text: string;      // Comment text
  timestamp: number; // Unix timestamp (ms) of when the comment was created
};

/**
 * Internal data stores
 * --------------------------------------------------------------------
 * savedVideos  : which video IDs the user has saved
 * likedVideos  : which video IDs the user has liked
 * videoComments: mapping videoId → array of comments
 */
let savedVideos: Set<string> = new Set();
let likedVideos: Set<string> = new Set();
let videoComments: Map<string, Comment[]> = new Map();

/**
 * Public storage API used across the app.
 */
export const storage = {
  /**
   * Get all saved video IDs.
   * Used if you ever want to show a "Saved" list.
   */
  getSavedVideos: (): string[] => Array.from(savedVideos),

  /**
   * Get all liked video IDs.
   * Used if you ever want to show a "Liked" list.
   */
  getLikedVideos: (): string[] => Array.from(likedVideos),

  /**
   * Check if a video is currently saved.
   */
  isSaved: (videoId: string): boolean => savedVideos.has(videoId),

  /**
   * Check if a video is currently liked.
   */
  isLiked: (videoId: string): boolean => likedVideos.has(videoId),

  /**
   * Toggle save state for a video.
   *
   * - If the video is already saved → remove it from savedVideos.
   * - If not saved → add it to savedVideos.
   *
   * Returns:
   *  - true  → video is now saved
   *  - false → video is now unsaved
   */
  toggleSave: (videoId: string): boolean => {
    if (savedVideos.has(videoId)) {
      savedVideos.delete(videoId);
      return false;
    } else {
      savedVideos.add(videoId);
      return true;
    }
  },

  /**
   * Toggle like state for a video.
   *
   * - If the video is already liked → remove it from likedVideos.
   * - If not liked → add it to likedVideos.
   *
   * Returns:
   *  - true  → video is now liked
   *  - false → video is now unliked
   */
  toggleLike: (videoId: string): boolean => {
    if (likedVideos.has(videoId)) {
      likedVideos.delete(videoId);
      return false;
    } else {
      likedVideos.add(videoId);
      return true;
    }
  },

  /**
   * Get all comments for a specific video.
   *
   * Always returns an array (empty if there are no comments yet).
   */
  getComments: (videoId: string): Comment[] => {
    return videoComments.get(videoId) || [];
  },

  /**
   * Add a new comment to a video.
   *
   * - Creates a Comment object with:
   *      • id        : timestamp-based ID (string)
   *      • videoId   : the given videoId
   *      • text      : comment text
   *      • timestamp : current Date.now()
   * - Appends it to the video’s existing comments array.
   *
   * Returns:
   *  - The newly created Comment object.
   */
  addComment: (videoId: string, text: string): Comment => {
    const comment: Comment = {
      id: Date.now().toString(),
      videoId,
      text,
      timestamp: Date.now(),
    };

    const existing = videoComments.get(videoId) || [];
    videoComments.set(videoId, [...existing, comment]);

    return comment;
  },
};
