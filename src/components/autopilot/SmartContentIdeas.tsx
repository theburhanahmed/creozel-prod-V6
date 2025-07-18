import React, { useState } from 'react';
import { XIcon, SearchIcon, LightbulbIcon, TrendingUpIcon, StarIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface SmartContentIdeasProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIdea: (idea: any) => void;
}
export const SmartContentIdeas: React.FC<SmartContentIdeasProps> = ({
  isOpen,
  onClose,
  onSelectIdea
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // TODO: Fetch content ideas from production data source (Supabase or backend)
  const [contentIdeas, setContentIdeas] = useState<any[]>([]);
  // Example: useEffect(() => { fetchContentIdeas().then(setContentIdeas); }, []);
  const categories = [{
    id: 'all',
    name: 'All Ideas'
  }, {
    id: 'trending',
    name: 'Trending'
  }, {
    id: 'productivity',
    name: 'Productivity'
  }, {
    id: 'lifestyle',
    name: 'Lifestyle'
  }, {
    id: 'technology',
    name: 'Technology'
  }, {
    id: 'wellness',
    name: 'Wellness'
  }];
  const filteredIdeas = contentIdeas.filter(idea => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'trending' && idea.trending || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <LightbulbIcon size={20} className="text-amber-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Smart Content Ideas
              </h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <XIcon size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search for content ideas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="flex overflow-x-auto p-2 border-b border-gray-200 dark:border-gray-700 hide-scrollbar">
            {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium mr-2 transition-colors ${selectedCategory === category.id ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}>
                {category.name}
              </button>)}
          </div>
          <div className="overflow-y-auto max-h-[50vh] p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIdeas.length > 0 ? filteredIdeas.map(idea => <div key={idea.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer" onClick={() => onSelectIdea(idea)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {idea.title}
                      </h3>
                      <div className="flex items-center">
                        {idea.trending && <span className="flex items-center text-xs font-medium text-rose-600 dark:text-rose-400 mr-2">
                            <TrendingUpIcon size={12} className="mr-1" />
                            Trending
                          </span>}
                        <span className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
                          <StarIcon size={12} className="mr-1" />
                          {idea.popularity}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {idea.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize">
                        {idea.category}
                      </span>
                      <Button size="sm" variant="outline">
                        Use This Idea
                      </Button>
                    </div>
                  </div>) : <div className="col-span-2 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No matching ideas found. Try a different search term.
                  </p>
                </div>}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button variant="primary">Create Custom Idea</Button>
          </div>
        </div>
      </div>
    </div>;
};