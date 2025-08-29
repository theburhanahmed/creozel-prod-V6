import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertCircleIcon, ExternalLinkIcon, ShieldIcon } from 'lucide-react';
interface LoginRedirectProps {
  isAdmin: boolean;
  adminUrl?: string;
}
export const LoginRedirect: React.FC<LoginRedirectProps> = ({
  isAdmin,
  adminUrl = '/admin'
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (isAdmin) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = adminUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAdmin, adminUrl]);
  const handleRedirectNow = () => {
    window.location.href = adminUrl;
  };
  const handleGoToCustomerDashboard = () => {
    navigate('/');
  };
  if (!isAdmin) return null;
  return <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50">
      <Card className="max-w-md w-full animate-in opacity-0 p-0 overflow-hidden">
        <div className="bg-red-500 p-1"></div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
              <ShieldIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Access Restricted
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You're logged in as an administrator
              </p>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircleIcon className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  This interface is for customers only. Administrators must use
                  the dedicated admin dashboard to manage the platform.
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                  Redirecting to admin panel in {countdown} seconds...
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-between">
            <Button variant="outline" onClick={handleGoToCustomerDashboard}>
              Continue as Customer
            </Button>
            <Button variant="primary" onClick={handleRedirectNow} leftIcon={<ExternalLinkIcon size={16} />}>
              Go to Admin Panel Now
            </Button>
          </div>
        </div>
      </Card>
    </div>;
};
