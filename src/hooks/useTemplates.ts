import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

export interface Template {
  id: string;
  platform: string;
  name: string;
  prompt: string;
  example?: string;
  max_length?: number;
}

export function useTemplates(platform: string) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!platform) return;
    setLoading(true);
    setError(null);
    supabase
      .from<Template>('templates')
      .select('*')
      .eq('platform', platform)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTemplates(data || []);
        setLoading(false);
      });
  }, [platform]);

  return { templates, loading, error };
}
