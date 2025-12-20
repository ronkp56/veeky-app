export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  verified: boolean;
  created_at: string;
};

export type Video = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: 'Trips' | 'Lodging' | 'Entertainment';
  location: string | null;
  price: string | null;
  days: number | null;
  itinerary: any;
  tags: string[] | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  created_at: string;
  profile?: Profile;
};

export type Like = {
  id: string;
  user_id: string;
  video_id: string;
  created_at: string;
};

export type Save = {
  id: string;
  user_id: string;
  video_id: string;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  video_id: string;
  text: string;
  created_at: string;
  profile?: Profile;
};

export type Follow = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};
