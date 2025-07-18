import { supabase } from '../../../supabase/client';

export interface PipelineContent {
  id: string;
  title: string;
  type: string;
  platform: string;
  thumbnail?: string;
  engagement: 'viral' | 'average' | 'low';
  stats: {
    views: string;
    likes: string;
    shares: string;
    ctr: string;
  };
  suggestions: string[];
}

export interface Pipeline {
  id: string;
  title: string;
  description: string;
  contentType: string;
  platforms: string[];
  schedule: string;
  status: 'active' | 'paused' | 'draft' | 'published';
  stats: {
    posts: number;
    views: string;
    engagement: string;
    growth: string;
  };
  lastRun: string;
  nextRun: string;
  hasInteractiveElements: boolean;
  performanceScore: number;
  content: PipelineContent[];
}

export interface PipelineData {
  pipelines: Pipeline[];
}

export const pipelineService = {
  async getPipelines(): Promise<PipelineData> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(`${process.env.VITE_SUPABASE_DATABASE_URL}/functions/v1/get-pipelines`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pipelines');
    }

    return await response.json();
  },

  async createPipeline(pipelineData: Partial<Pipeline>): Promise<Pipeline> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase
      .from('content_pipelines')
      .insert({
        ...pipelineData,
        user_id: session.user.id,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create pipeline');
    }

    return data;
  },

  async updatePipeline(pipelineId: string, updates: Partial<Pipeline>): Promise<Pipeline> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase
      .from('content_pipelines')
      .update(updates)
      .eq('id', pipelineId)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update pipeline');
    }

    return data;
  },

  async deletePipeline(pipelineId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { error } = await supabase
      .from('content_pipelines')
      .delete()
      .eq('id', pipelineId)
      .eq('user_id', session.user.id);

    if (error) {
      throw new Error('Failed to delete pipeline');
    }
  }
}; 