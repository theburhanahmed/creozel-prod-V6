import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
export const ConversationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return <div className="p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
      <div className="relative">
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search messages" className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700/50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
        <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <FilterIcon size={16} />
        </button>
      </div>
    </div>;
};
