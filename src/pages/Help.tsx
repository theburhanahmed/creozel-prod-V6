import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchIcon } from 'lucide-react';
export const Help = () => {
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find answers and support
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search help articles..." className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200 w-64" />
          </div>
        </div>
      </div>
      <Card>
        <div className="h-[600px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          Help center content coming soon
        </div>
      </Card>
    </div>;
};