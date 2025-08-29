import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { LogInIcon, MailIcon, LockIcon, UserIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../../supabase/client';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess('');
    if (!name || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    try {
      await register(email, password, name);
      setSuccess('Registration successful! Please check your email to verify your account before logging in.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw new Error(error.message);
      // The user will be redirected by Supabase, so no further action needed here
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign up to get started
          </p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertCircleIcon size={16} />
          <span className="text-sm">{error}</span>
        </div>}
        {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-300">
          <span className="text-sm">{success}</span>
        </div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon size={16} className="text-gray-400" />
              </div>
              <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon size={16} className="text-gray-400" />
              </div>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon size={16} className="text-gray-400" />
              </div>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <Button variant="primary" className="w-full" type="submit" leftIcon={<LogInIcon size={16} />} disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              isLoading={googleLoading}
              disabled={googleLoading}
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
              }
            >
              Google
            </Button>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/auth/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            Sign in
          </a>
        </p>
      </div>
    </Card>
  );
};
