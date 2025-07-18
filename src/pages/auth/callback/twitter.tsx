import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { socialService } from '../../../services/social/socialService';

const TwitterCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
    if (!code || !state || !codeVerifier) {
      toast.error('Missing code, state, or code_verifier in Twitter callback');
      navigate('/settings');
      return;
    }
    (async () => {
      try {
        toast.loading('Connecting your Twitter account...');
        // You may need to pass codeVerifier to the backend if required by your Edge Function
        await socialService.connect('twitter', code, state);
        toast.dismiss();
        toast.success('Twitter account connected!');
        navigate('/settings');
      } catch (err: any) {
        toast.dismiss();
        toast.error('Failed to connect Twitter: ' + (err.message || err));
        navigate('/settings');
      }
    })();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-gray-700 dark:text-gray-200">Connecting your Twitter account...</div>
    </div>
  );
};

export default TwitterCallback; 