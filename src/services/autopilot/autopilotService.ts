import { apiClient } from '../api/apiClient';
import { AUTOPILOT_ENDPOINTS } from '../api/config';
export interface Pipeline {
  id: string;
  title: string;
  description: string;
  contentType: string;
  platforms: string[];
  schedule: string;
  status: string;
  stats: {
    posts: number;
    views: string;
    engagement: string;
    growth: string;
  };
  lastRun: string;
  nextRun: string;
  hasInteractiveElements?: boolean;
  performanceScore?: number;
  content?: any[];
}
export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  contentType: string;
  trendScore: number;
  category: string;
}
/**
 * Autopilot service for handling content pipelines
 */
export const autopilotService = {
  /**
   * Get list of pipelines
   */
  async getPipelines(): Promise<Pipeline[]> {
    try {
      return await apiClient.get(AUTOPILOT_ENDPOINTS.LIST_PIPELINES);
    } catch (error) {
      console.error('Get pipelines error:', error);
      throw error;
    }
  },
  /**
   * Get pipeline details
   */
  async getPipeline(id: string): Promise<Pipeline> {
    try {
      const url = AUTOPILOT_ENDPOINTS.GET_PIPELINE.replace(':id', id);
      return await apiClient.get(url);
    } catch (error) {
      console.error('Get pipeline error:', error);
      throw error;
    }
  },
  /**
   * Create new pipeline
   */
  async createPipeline(pipeline: Partial<Pipeline>): Promise<Pipeline> {
    try {
      return await apiClient.post(AUTOPILOT_ENDPOINTS.CREATE_PIPELINE, pipeline);
    } catch (error) {
      console.error('Create pipeline error:', error);
      throw error;
    }
  },
  /**
   * Update pipeline
   */
  async updatePipeline(id: string, updates: Partial<Pipeline>): Promise<Pipeline> {
    try {
      const url = AUTOPILOT_ENDPOINTS.UPDATE_PIPELINE.replace(':id', id);
      return await apiClient.put(url, updates);
    } catch (error) {
      console.error('Update pipeline error:', error);
      throw error;
    }
  },
  /**
   * Delete pipeline
   */
  async deletePipeline(id: string): Promise<void> {
    try {
      const url = AUTOPILOT_ENDPOINTS.DELETE_PIPELINE.replace(':id', id);
      await apiClient.delete(url);
    } catch (error) {
      console.error('Delete pipeline error:', error);
      throw error;
    }
  },
  /**
   * Toggle pipeline status (active/paused)
   */
  async togglePipelineStatus(id: string): Promise<Pipeline> {
    try {
      const url = AUTOPILOT_ENDPOINTS.TOGGLE_PIPELINE_STATUS.replace(':id', id);
      return await apiClient.post(url, {});
    } catch (error) {
      console.error('Toggle pipeline status error:', error);
      throw error;
    }
  },
  /**
   * Generate content for a pipeline
   */
  async generateContent(pipelineId: string, contentData: any): Promise<any> {
    try {
      return await apiClient.post(AUTOPILOT_ENDPOINTS.GENERATE_CONTENT, {
        pipelineId,
        ...contentData
      });
    } catch (error) {
      console.error('Generate content error:', error);
      throw error;
    }
  },
  /**
   * Get content ideas
   */
  async getContentIdeas(category?: string, count?: number): Promise<ContentIdea[]> {
    try {
      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (count) queryParams.append('count', count.toString());
      const url = `${AUTOPILOT_ENDPOINTS.CONTENT_IDEAS}?${queryParams.toString()}`;
      return await apiClient.get(url);
    } catch (error) {
      console.error('Get content ideas error:', error);
      throw error;
    }
  }
};