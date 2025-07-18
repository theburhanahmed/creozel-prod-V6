import React, { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, SparklesIcon, TextIcon, HashIcon, MessageSquareIcon, MusicIcon, ImageIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
interface SmartOptimizerSidebarProps {
  contentFormat: string;
  onApplySuggestion: (type: string, value: any) => void;
}
export const SmartOptimizerSidebar: React.FC<SmartOptimizerSidebarProps> = ({
  contentFormat,
  onApplySuggestion
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  // TODO: Fetch optimization suggestions from production data source (Supabase or backend)
  const [optimizedTitles, setOptimizedTitles] = useState<string[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [viralCaptions, setViralCaptions] = useState<string[]>([]);
  const [backgroundMusic, setBackgroundMusic] = useState<any[]>([]);
  // Toggle the sidebar collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setActiveSection(null);
  };
  // Toggle a specific section
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };
  // Get appropriate format-specific examples
  const getFormatSpecificContent = () => {
    switch (contentFormat) {
      case 'short-video':
        return {
          title: '5 Phone Hacks Nobody Told You About',
          thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
      case 'long-video':
        return {
          title: 'The Complete Guide to Personal Productivity Systems',
          thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
      case 'image-post':
        return {
          title: 'Transform Your Workspace with These 5 Items',
          thumbnail: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
      case 'carousel':
        return {
          title: '7 Steps to a More Productive Morning Routine',
          thumbnail: 'https://images.unsplash.com/photo-1506485338023-6ce5f36692df?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
      case 'story':
        return {
          title: 'A Day in the Life of a Productive Person',
          thumbnail: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
      case 'blog-post':
        return {
          title: 'The Ultimate Guide to Time Blocking for Maximum Productivity',
          thumbnail: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
      case 'email-newsletter':
        return {
          title: "5 Productivity Tools Our Team Can't Live Without",
          thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
      default:
        return {
          title: 'How to Boost Your Productivity in 3 Simple Steps',
          thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3'
        };
    }
  };
  const formatSpecific = getFormatSpecificContent();
  if (isCollapsed) {
    return <div className="fixed right-0 top-1/3 transform -translate-y-1/2 z-20">
        <button onClick={toggleCollapse} className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-l-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition-colors">
          <SparklesIcon size={18} className="mr-2" />
          <ChevronRightIcon size={18} />
        </button>
      </div>;
  }
  return <div className="sticky top-20 h-[calc(100vh-5rem)] flex flex-col w-full max-w-xs">
      <Card className="flex-1 overflow-hidden border-gray-700 bg-[#1A2234] shadow-lg">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <SparklesIcon size={18} className="mr-2" />
              <h3 className="font-medium">Smart Optimizer</h3>
            </div>
            <button onClick={toggleCollapse} className="p-1 hover:bg-white/10 rounded-full transition-colors" aria-label="Collapse sidebar">
              <ChevronLeftIcon size={18} />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Optimized Title */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => toggleSection('title')} className="w-full flex items-center justify-between bg-gray-800/50 p-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center text-green-400 mr-3">
                    <TextIcon size={14} />
                  </div>
                  <span className="font-medium text-white">
                    Optimized Title
                  </span>
                </div>
                <ChevronRightIcon size={16} className={`text-gray-400 transition-transform ${activeSection === 'title' ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === 'title' && <div className="p-3 border-t border-gray-700">
                  <div className="space-y-3">
                    {optimizedTitles.map((title, index) => <div key={index} className="p-2 bg-gray-800 rounded-md border border-gray-700 hover:border-green-500/50 transition-colors">
                        <p className="text-sm text-white mb-2">{title}</p>
                        <Button size="sm" variant="outline" className="w-full border-gray-700 hover:bg-gray-700" leftIcon={<CheckCircleIcon size={14} />} onClick={() => onApplySuggestion('title', title)}>
                          Apply
                        </Button>
                      </div>)}
                  </div>
                </div>}
            </div>
            {/* Trending Hashtags */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => toggleSection('hashtags')} className="w-full flex items-center justify-between bg-gray-800/50 p-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 mr-3">
                    <HashIcon size={14} />
                  </div>
                  <span className="font-medium text-white">
                    Trending Hashtags
                  </span>
                </div>
                <ChevronRightIcon size={16} className={`text-gray-400 transition-transform ${activeSection === 'hashtags' ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === 'hashtags' && <div className="p-3 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trendingHashtags.map((tag, index) => <span key={index} className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded-full text-xs font-medium">
                        {tag}
                      </span>)}
                  </div>
                  <Button size="sm" variant="outline" className="w-full border-gray-700 hover:bg-gray-700" leftIcon={<CheckCircleIcon size={14} />} onClick={() => onApplySuggestion('hashtags', trendingHashtags)}>
                    Apply All Hashtags
                  </Button>
                </div>}
            </div>
            {/* Viral Caption */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => toggleSection('caption')} className="w-full flex items-center justify-between bg-gray-800/50 p-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 mr-3">
                    <MessageSquareIcon size={14} />
                  </div>
                  <span className="font-medium text-white">Viral Caption</span>
                </div>
                <ChevronRightIcon size={16} className={`text-gray-400 transition-transform ${activeSection === 'caption' ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === 'caption' && <div className="p-3 border-t border-gray-700">
                  <div className="space-y-3">
                    {viralCaptions.map((caption, index) => <div key={index} className="p-2 bg-gray-800 rounded-md border border-gray-700 hover:border-purple-500/50 transition-colors">
                        <p className="text-sm text-white mb-2">{caption}</p>
                        <Button size="sm" variant="outline" className="w-full border-gray-700 hover:bg-gray-700" leftIcon={<CheckCircleIcon size={14} />} onClick={() => onApplySuggestion('caption', caption)}>
                          Apply
                        </Button>
                      </div>)}
                  </div>
                </div>}
            </div>
            {/* Background Music */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => toggleSection('music')} className="w-full flex items-center justify-between bg-gray-800/50 p-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 mr-3">
                    <MusicIcon size={14} />
                  </div>
                  <span className="font-medium text-white">
                    Background Music
                  </span>
                </div>
                <ChevronRightIcon size={16} className={`text-gray-400 transition-transform ${activeSection === 'music' ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === 'music' && <div className="p-3 border-t border-gray-700">
                  <div className="space-y-3">
                    {backgroundMusic.map((track, index) => <div key={index} className="p-2 bg-gray-800 rounded-md border border-gray-700 hover:border-amber-500/50 transition-colors">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-white">
                            {track.name}
                          </p>
                          <span className="text-xs text-gray-400">
                            {track.duration}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          By {track.artist}
                        </p>
                        <Button size="sm" variant="outline" className="w-full border-gray-700 hover:bg-gray-700" leftIcon={<CheckCircleIcon size={14} />} onClick={() => onApplySuggestion('music', track)}>
                          Apply
                        </Button>
                      </div>)}
                  </div>
                </div>}
            </div>
            {/* AI-Generated Thumbnail */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => toggleSection('thumbnail')} className="w-full flex items-center justify-between bg-gray-800/50 p-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 mr-3">
                    <ImageIcon size={14} />
                  </div>
                  <span className="font-medium text-white">
                    AI-Generated Thumbnail
                  </span>
                </div>
                <ChevronRightIcon size={16} className={`text-gray-400 transition-transform ${activeSection === 'thumbnail' ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === 'thumbnail' && <div className="p-3 border-t border-gray-700">
                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded-md border border-gray-700 overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={formatSpecific.thumbnail} alt="AI-generated thumbnail" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-400 mb-2">
                          AI-optimized thumbnail for "{formatSpecific.title}"
                        </p>
                        <Button size="sm" variant="outline" className="w-full border-gray-700 hover:bg-gray-700" leftIcon={<CheckCircleIcon size={14} />} onClick={() => onApplySuggestion('thumbnail', formatSpecific.thumbnail)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full border-gray-700 hover:bg-gray-700" onClick={() => onApplySuggestion('generateThumbnail', true)}>
                      Generate More Options
                    </Button>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </Card>
    </div>;
};