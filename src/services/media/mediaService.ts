import { supabase } from '../../../supabase/client';

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  size?: string;
  duration?: string;
  dimensions?: string;
  created: string;
  published: boolean;
}

export interface MediaData {
  mediaItems: MediaItem[];
}

export const mediaService = {
  async getMediaLibrary(): Promise<MediaData> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/functions/v1/get-media-library`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch media library');
    }

    return await response.json();
  },

  async uploadMedia(file: File, title: string, type: string): Promise<MediaItem> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error('Failed to upload file');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    // Save media item to database
    const { data, error } = await supabase
      .from('media_library')
      .insert({
        title,
        media_type: type,
        file_url: publicUrl,
        file_size: file.size,
        user_id: session.user.id
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to save media item');
    }

    return {
      id: data.id,
      title: data.title,
      type: data.media_type,
      url: data.file_url,
      thumbnail: data.thumbnail_url || data.file_url,
      size: data.file_size,
      duration: data.duration,
      dimensions: data.dimensions,
      created: new Date(data.created_at).toLocaleDateString(),
      published: data.is_published || false
    };
  },

  async deleteMedia(mediaId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', mediaId)
      .eq('user_id', session.user.id);

    if (error) {
      throw new Error('Failed to delete media item');
    }
  },

  async updateMedia(mediaId: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase
      .from('media_library')
      .update(updates)
      .eq('id', mediaId)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update media item');
    }

    return {
      id: data.id,
      title: data.title,
      type: data.media_type,
      url: data.file_url,
      thumbnail: data.thumbnail_url || data.file_url,
      size: data.file_size,
      duration: data.duration,
      dimensions: data.dimensions,
      created: new Date(data.created_at).toLocaleDateString(),
      published: data.is_published || false
    };
  }
}; 