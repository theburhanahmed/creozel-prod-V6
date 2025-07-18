import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

interface UseContentChargeParams {
  userId: string;
  contentType: string;
  providerId?: string;
}

export function useContentCharge({ userId, contentType, providerId }: UseContentChargeParams) {
  const [chargeInfo, setChargeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !contentType) return;
    setLoading(true);
    setError(null);
    setChargeInfo(null);
    supabase.functions
      .invoke('calculate-content-charge', {
        body: { userId, contentType, providerId },
      })
      .then(({ data, error }) => {
        if (error) setError(error.message || 'Failed to fetch charge');
        else setChargeInfo(data);
        setLoading(false);
      });
  }, [userId, contentType, providerId]);

  return { chargeInfo, loading, error };
} 