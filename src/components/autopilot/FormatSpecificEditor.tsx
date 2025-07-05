import React, { useState } from 'react';
import { VideoIcon, ImageIcon, FileTextIcon, LayoutIcon, BookOpenIcon, MailIcon, ClockIcon, TagIcon, TargetIcon, ListIcon, MessageCircleIcon, HashIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { SparklesIcon } from 'lucide-react';
import { AIEnhancementPanel } from './AIEnhancementPanel';
interface FormatSpecificEditorProps {
  format: string;
  onUpdate: (data: any) => void;
}
export const FormatSpecificEditor: React.FC<FormatSpecificEditorProps> = ({
  format,
  onUpdate
}) => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  // Mock implementation
  const renderEditor = () => {
    return <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content Title
          </label>
          <input type="text" placeholder="Enter a compelling title..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content Description
          </label>
          <textarea rows={3} placeholder="Describe what your content is about..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Keywords (comma separated)
          </label>
          <input type="text" placeholder="productivity, remote work, tips..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Audience
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option>Professionals</option>
            <option>Students</option>
            <option>Parents</option>
            <option>Entrepreneurs</option>
            <option>Tech enthusiasts</option>
          </select>
        </div>
        <div className="pt-4 flex justify-center">
          <Button variant="outline" leftIcon={<SparklesIcon size={16} className="text-indigo-500" />} onClick={() => setShowAIPanel(true)}>
            Enhance with AI
          </Button>
        </div>
      </div>;
  };
  return <div>
      {renderEditor()}
      {/* AI Enhancement Panel */}
      <AIEnhancementPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} contentFormat={format} />
    </div>;
};