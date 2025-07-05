import { apiClient } from '../api/apiClient';
import { MEDIA_ENDPOINTS } from '../api/config';
export interface MediaItem {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  thumbnail?: string;
  modified: string;
  starred?: boolean;
  shared?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}
export interface MediaSearchParams {
  query?: string;
  type?: string[];
  tags?: string[];
  starred?: boolean;
  shared?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
/**
 * Media service for handling media files
 */
export const mediaService = {
  /**
   * Get list of media files
   */
  async getMediaList(params: MediaSearchParams = {}): Promise<{
    items: MediaItem[];
    total: number;
  }> {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('query', params.query);
      if (params.type?.length) params.type.forEach(t => queryParams.append('type', t));
      if (params.tags?.length) params.tags.forEach(t => queryParams.append('tag', t));
      if (params.starred !== undefined) queryParams.append('starred', params.starred.toString());
      if (params.shared !== undefined) queryParams.append('shared', params.shared.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      const url = `${MEDIA_ENDPOINTS.LIST_MEDIA}?${queryParams.toString()}`;
      return await apiClient.get(url);
    } catch (error) {
      console.error('Get media list error:', error);
      throw error;
    }
  },
  /**
   * Upload media file
   */
  async uploadMedia(file: File, metadata: Record<string, any> = {}): Promise<MediaItem> {
    try {
      return await apiClient.uploadMedia(MEDIA_ENDPOINTS.UPLOAD_MEDIA, file, metadata);
    } catch (error) {
      console.error('Upload media error:', error);
      throw error;
    }
  },
  /**
   * Delete media file
   */
  async deleteMedia(id: string): Promise<void> {
    try {
      const url = MEDIA_ENDPOINTS.DELETE_MEDIA.replace(':id', id);
      await apiClient.delete(url);
    } catch (error) {
      console.error('Delete media error:', error);
      throw error;
    }
  },
  /**
   * Get media details
   */
  async getMediaDetails(id: string): Promise<MediaItem> {
    try {
      const url = MEDIA_ENDPOINTS.GET_MEDIA_DETAILS.replace(':id', id);
      return await apiClient.get(url);
    } catch (error) {
      console.error('Get media details error:', error);
      throw error;
    }
  },
  /**
   * Update media metadata
   */
  async updateMedia(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    try {
      const url = MEDIA_ENDPOINTS.UPDATE_MEDIA.replace(':id', id);
      return await apiClient.put(url, updates);
    } catch (error) {
      console.error('Update media error:', error);
      throw error;
    }
  },
  /**
   * Toggle star status
   */
  async toggleStar(id: string, starred: boolean): Promise<MediaItem> {
    try {
      const url = MEDIA_ENDPOINTS.UPDATE_MEDIA.replace(':id', id);
      return await apiClient.put(url, {
        starred
      });
    } catch (error) {
      console.error('Toggle star error:', error);
      throw error;
    }
  },
  /**
   * Toggle share status
   */
  async toggleShare(id: string, shared: boolean): Promise<MediaItem> {
    try {
      const url = MEDIA_ENDPOINTS.UPDATE_MEDIA.replace(':id', id);
      return await apiClient.put(url, {
        shared
      });
    } catch (error) {
      console.error('Toggle share error:', error);
      throw error;
    }
  },
  /**
   * Search media files
   */
  async searchMedia(query: string): Promise<MediaItem[]> {
    try {
      const url = `${MEDIA_ENDPOINTS.SEARCH_MEDIA}?query=${encodeURIComponent(query)}`;
      return await apiClient.get(url);
    } catch (error) {
      console.error('Search media error:', error);
      throw error;
    }
  }
};