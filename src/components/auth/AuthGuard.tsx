import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { mockUser } from '../../services/mockData';
interface AuthGuardProps {
  children: React.ReactNode;
}
export const AuthGuard = ({
  children
}: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Simulate authentication check
    setTimeout(() => {
      // In a real app, this would check with your auth provider
      // For this demo, we'll use the mock user and always authenticate
      setIsAuthenticated(true);
      // Store mock user in localStorage to simulate persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoading(false);
    }, 500);
  }, []);
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};