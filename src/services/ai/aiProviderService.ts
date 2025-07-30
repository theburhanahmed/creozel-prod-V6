import { supabase } from '../../supabase/client';
import { AIProvider } from '../../types/ai';

/**
 * Service to fetch AI providers configuration from Supabase.
 */
class AIProviderService {
  private table = 'ai_providers';

  /**
   * Fetch active providers from DB.
   */
  async getActiveProviders(): Promise<AIProvider[]> {
    const { data, error } = await supabase
      .from<AIProvider>(this.table)
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(error.message);
    return data || [];
  }

  /**
   * Fetch provider by id.
   */
  async getProviderById(id: string): Promise<AIProvider | null> {
    const { data, error } = await supabase
      .from<AIProvider>(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data || null;
  }

  /**
   * Choose default provider for a given content type.
   */
  async getDefaultProvider(contentType: AIProvider['content_types'][number]): Promise<AIProvider | null> {
    const { data, error } = await supabase
      .from<AIProvider>(this.table)
      .select('*')
      .contains('content_types', [contentType])
      .eq('is_default', true)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data || null;
  }
}

export const aiProviderService = new AIProviderService();
