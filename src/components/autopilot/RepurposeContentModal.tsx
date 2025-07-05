import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { VideoIcon, ImageIcon, FileTextIcon, LayoutIcon, BookOpenIcon, MailIcon, SparklesIcon, ArrowRightIcon, CheckIcon, Loader2Icon } from 'lucide-react';
interface ContentItem {
  id: string;
  title: string;
  type: string;
  platform: string;
  thumbnail?: string;
  engagement: 'low' | 'average' | 'viral';
  stats: {
    views: string;
    likes: string;
    shares: string;
    ctr: string;
  };
  suggestions: string[];
}
interface RepurposeContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem;
  onRepurpose: (formatTo: string) => void;
}
interface FormatOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  compatibility: number; // 0-100
  color: string;
}
export const RepurposeContentModal: React.FC<RepurposeContentModalProps> = ({
  isOpen,
  onClose,
  content,
  onRepurpose
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  // Get the source format display name
  const getSourceFormatName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'Video';
      case 'image':
        return 'Image';
      case 'carousel':
        return 'Carousel';
      case 'blog':
        return 'Blog Post';
      case 'story':
        return 'Story';
      case 'email':
        return 'Email';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  // Determine available repurpose options based on source content type
  const getRepurposeOptions = (sourceType: string): FormatOption[] => {
    const sourceFormat = sourceType.toLowerCase();
    // Define all possible format options
    const allFormats: Record<string, FormatOption> = {
      video: {
        id: 'video',
        name: 'Video',
        icon: <VideoIcon size={20} />,
        description: 'Short or long form video content',
        compatibility: 0,
        color: 'from-orange-500 to-amber-500'
      },
      image: {
        id: 'image',
        name: 'Image Post',
        icon: <ImageIcon size={20} />,
        description: 'Single image with caption',
        compatibility: 0,
        color: 'from-purple-500 to-pink-500'
      },
      carousel: {
        id: 'carousel',
        name: 'Carousel',
        icon: <LayoutIcon size={20} />,
        description: 'Multi-slide image carousel',
        compatibility: 0,
        color: 'from-blue-500 to-indigo-500'
      },
      blog: {
        id: 'blog',
        name: 'Blog Post',
        icon: <FileTextIcon size={20} />,
        description: 'Long-form written content',
        compatibility: 0,
        color: 'from-emerald-500 to-teal-500'
      },
      story: {
        id: 'story',
        name: 'Story',
        icon: <BookOpenIcon size={20} />,
        description: 'Vertical, ephemeral content',
        compatibility: 0,
        color: 'from-indigo-500 to-violet-500'
      },
      email: {
        id: 'email',
        name: 'Email Newsletter',
        icon: <MailIcon size={20} />,
        description: 'Email-optimized content',
        compatibility: 0,
        color: 'from-cyan-500 to-blue-500'
      }
    };
    // Set compatibility scores based on source format
    if (sourceFormat === 'video') {
      allFormats.carousel.compatibility = 90;
      allFormats.blog.compatibility = 85;
      allFormats.image.compatibility = 75;
      allFormats.story.compatibility = 80;
      allFormats.email.compatibility = 70;
    } else if (sourceFormat === 'image') {
      allFormats.carousel.compatibility = 95;
      allFormats.story.compatibility = 90;
      allFormats.video.compatibility = 60;
      allFormats.blog.compatibility = 65;
      allFormats.email.compatibility = 75;
    } else if (sourceFormat === 'carousel') {
      allFormats.video.compatibility = 85;
      allFormats.story.compatibility = 95;
      allFormats.blog.compatibility = 80;
      allFormats.image.compatibility = 90;
      allFormats.email.compatibility = 75;
    } else if (sourceFormat === 'blog') {
      allFormats.video.compatibility = 85;
      allFormats.carousel.compatibility = 90;
      allFormats.email.compatibility = 95;
      allFormats.story.compatibility = 70;
      allFormats.image.compatibility = 65;
    }
    // Filter out the source format and sort by compatibility
    return Object.values(allFormats).filter(format => format.id !== sourceFormat).sort((a, b) => b.compatibility - a.compatibility);
  };
  const repurposeOptions = getRepurposeOptions(content.type);
  // Simulate analysis of content
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  // Handle format selection
  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId);
  };
  // Handle repurpose action
  const handleRepurpose = () => {
    if (!selectedFormat) return;
    setIsConverting(true);
    // Simulate conversion process
    setTimeout(() => {
      onRepurpose(selectedFormat);
      setIsConverting(false);
    }, 2000);
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Repurpose Content" size="lg" actions={<div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isConverting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRepurpose} disabled={!selectedFormat || isConverting} leftIcon={isConverting ? <Loader2Icon className="animate-spin" size={16} /> : <SparklesIcon size={16} />}>
            {isConverting ? 'Converting...' : 'Convert and Edit'}
          </Button>
        </div>}>
      <div className="space-y-6">
        {/* Source Content Info */}
        <div className="flex items-start gap-4">
          {content.thumbnail && <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
              <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
            </div>}
          <div className="flex-1">
            <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-1">
              {content.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="flex items-center">
                <span className="capitalize">{content.type}</span>
              </span>
              <span>•</span>
              <span>{content.platform}</span>
              <span>•</span>
              <span>{content.stats.views} views</span>
            </div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Source: {getSourceFormatName(content.type)}
            </div>
          </div>
        </div>
        {/* Analyzing State */}
        {isAnalyzing ? <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <Loader2Icon size={24} className="animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Analyzing Content
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Our AI is analyzing your {getSourceFormatName(content.type)} to
              determine the best repurposing options...
            </p>
          </div> : <>
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <SparklesIcon size={16} className="mr-2 text-indigo-500" />
                Available Repurpose Options
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a format to convert your{' '}
                {getSourceFormatName(content.type)} into:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repurposeOptions.map(option => <div key={option.id} onClick={() => handleFormatSelect(option.id)} className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-3
                      ${selectedFormat === option.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                    `}>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white
                      bg-gradient-to-br ${option.color}
                    `}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {option.name}
                        </h5>
                        {selectedFormat === option.id && <CheckIcon size={16} className="text-indigo-500" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                      <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{
                    width: `${option.compatibility}%`
                  }}></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Compatibility
                        </span>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {option.compatibility}%
                        </span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Selected Format Preview */}
            {selectedFormat && <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Conversion Preview
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <span className="capitalize">{content.type}</span>
                    </div>
                    <ArrowRightIcon size={16} className="text-indigo-500" />
                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <span className="capitalize">{selectedFormat}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      Your {getSourceFormatName(content.type)} will be
                      intelligently transformed into a{' '}
                      {['a', 'e', 'i', 'o', 'u'].includes(selectedFormat[0].toLowerCase()) ? 'n' : ''}{' '}
                      {getSourceFormatName(selectedFormat)} while preserving:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside pl-2">
                      <li>Core message and key points</li>
                      <li>Brand voice and style</li>
                      <li>Important data and statistics</li>
                      {selectedFormat === 'carousel' && <li>Visual elements organized into slides</li>}
                      {selectedFormat === 'video' && <li>Visual narrative structure</li>}
                      {selectedFormat === 'blog' && <li>Extended content with proper formatting</li>}
                      {selectedFormat === 'email' && <li>Call-to-action elements</li>}
                    </ul>
                  </div>
                </div>
              </div>}
          </>}
      </div>
    </Modal>;
};