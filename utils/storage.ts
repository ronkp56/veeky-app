type Comment = {
  id: string;
  videoId: string;
  text: string;
  timestamp: number;
};

let savedVideos: Set<string> = new Set();
let videoComments: Map<string, Comment[]> = new Map();

export const storage = {
  getSavedVideos: (): string[] => Array.from(savedVideos),
  
  isSaved: (videoId: string): boolean => savedVideos.has(videoId),
  
  toggleSave: (videoId: string): boolean => {
    if (savedVideos.has(videoId)) {
      savedVideos.delete(videoId);
      return false;
    } else {
      savedVideos.add(videoId);
      return true;
    }
  },
  
  getComments: (videoId: string): Comment[] => {
    return videoComments.get(videoId) || [];
  },
  
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
