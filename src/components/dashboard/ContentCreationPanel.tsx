import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { FileTextIcon, ImageIcon, VideoIcon, MicIcon, SparklesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentEngineOrb } from '../3d/ContentEngineOrb';
interface ContentCreationPanelProps {
  onCreateContent: () => void;
}
export const ContentCreationPanel: React.FC<ContentCreationPanelProps> = ({
  onCreateContent
}) => {
  const contentTypes = [{
    type: 'Text',
    icon: <FileTextIcon size={16} />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-900/30',
    path: '/content/text'
  }, {
    type: 'Image',
    icon: <ImageIcon size={16} />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-900/30',
    path: '/content/image'
  }, {
    type: 'Video',
    icon: <VideoIcon size={16} />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-900/30',
    path: '/content/video'
  }, {
    type: 'Audio',
    icon: <MicIcon size={16} />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-900/30',
    path: '/content/audio'
  }];
  return <GlassCard className="hover:shadow-lg transition-all duration-300 relative overflow-visible">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white flex items-center gap-2">
            <SparklesIcon size={16} className="text-amber-500" />
            Create Content
          </h3>
          {/* Small floating orb in the corner */}
          <div className="absolute -top-4 -right-4 transform scale-50 z-10">
            <ContentEngineOrb size={80} onClick={onCreateContent} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {contentTypes.map((content, index) => <Link key={index} to={content.path} className="group">
              <div className="p-3 rounded-lg border border-gray-700 flex items-center gap-2 hover:bg-[#1A2234] hover:shadow-sm transition-all duration-200 group-hover:scale-[1.02]">
                <div className={`w-8 h-8 rounded-full ${content.bgColor} flex items-center justify-center ${content.color}`}>
                  {content.icon}
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {content.type}
                </span>
              </div>
            </Link>)}
        </div>
        <Button variant="primary" className="w-full justify-center bg-gradient-to-r from-[#3FE0A5] to-[#38B897] hover:from-[#38B897] hover:to-[#3FE0A5] animate-pulse-slow border-none shadow-md shadow-[#3FE0A5]/20" leftIcon={<SparklesIcon size={16} />} onClick={onCreateContent}>
          AI-Powered Creation
        </Button>
      </div>
    </GlassCard>;
};