// Dev-Rules §Code Standards: Custom Hooks
import { useState } from 'react';
import { IRepurposeConfig } from '../types/autopilot';

export const useRepurpose = () => {
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const repurpose = async (contentId: string, config: IRepurposeConfig) => {
    setIsRepurposing(true);
    setError(null);
    
    try {
      // This would be replaced with actual API call to your backend
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          config,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to repurpose content');
      }

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsRepurposing(false);
    }
  };

  return {
    repurpose,
    isRepurposing,
    error,
  };
};

export default useRepurpose;
