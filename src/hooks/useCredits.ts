import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { creditsService, CreditsInfo as ServiceCreditsInfo } from '../services/credits/creditsService';

interface CreditsInfo {
  balance: number;
  lastPurchase?: string;
  loading: boolean;
  error: string | null;
}

export const useCredits = () => {
  const { user, isAuthenticated } = useAuth();
  const [creditsInfo, setCreditsInfo] = useState<CreditsInfo>({
    balance: 0,
    loading: true,
    error: null
  });

  const fetchCredits = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCreditsInfo(prev => ({ ...prev, loading: false, balance: 0 }));
      return;
    }

    try {
      setCreditsInfo(prev => ({ ...prev, loading: true, error: null }));

      // Fetch user credits using the credits service
      const serviceCreditsInfo: ServiceCreditsInfo = await creditsService.getUserCredits();

      setCreditsInfo({
        balance: serviceCreditsInfo.balance,
        lastPurchase: serviceCreditsInfo.lastPurchase,
        loading: false,
        error: null
      });

    } catch (err: any) {
      console.error('Unexpected error fetching credits:', err);
      setCreditsInfo(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch credits'
      }));
    }
  }, [isAuthenticated, user]);

  // Fetch credits when user changes or component mounts
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Refresh credits function for manual refresh
  const refreshCredits = useCallback(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    creditsInfo,
    refreshCredits
  };
};
