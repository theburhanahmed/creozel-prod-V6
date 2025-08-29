import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { socialService } from '../../../services/social/socialService';

const InstagramCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (!code || !state) {
      toast.error('Missing code or state in Instagram callback');
      navigate('/settings');
      return;
    }
    (async () => {
      try {
        toast.loading('Connecting your Instagram account...');
        await socialService.connect('instagram', code, state);
        toast.dismiss();
        toast.success('Instagram account connected!');
        navigate('/settings');
      } catch (err: any) {
        toast.dismiss();
        toast.error('Failed to connect Instagram: ' + (err.message || err));
        navigate('/settings');
      }
    })();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-gray-700 dark:text-gray-200">Connecting your Instagram account...</div>
    </div>
  );
};

export default InstagramCallback;
