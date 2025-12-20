import { supabase } from '../lib/supabase';
import { Video } from '../types/database';

export const videoService = {
  // Get all videos with pagination
  async getVideos(page = 0, limit = 10, category?: string) {
    let query = supabase
      .from('videos')
      .select(`
        *,
        profile:profiles(*)
      `)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Video[];
  },

  // Get single video
  async getVideo(id: string) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Video;
  },

  // Create video
  async createVideo(video: Partial<Video>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('videos')
      .insert({
        ...video,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Video;
  },

  // Like video
  async toggleLike(videoId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: existing } = await supabase
      .from('likes')
      .select()
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single();

    if (existing) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', videoId);
      return false;
    } else {
      await supabase
        .from('likes')
        .insert({ user_id: user.id, video_id: videoId });
      return true;
    }
  },

  // Save video
  async toggleSave(videoId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: existing } = await supabase
      .from('saves')
      .select()
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single();

    if (existing) {
      await supabase
        .from('saves')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', videoId);
      return false;
    } else {
      await supabase
        .from('saves')
        .insert({ user_id: user.id, video_id: videoId });
      return true;
    }
  },
};
