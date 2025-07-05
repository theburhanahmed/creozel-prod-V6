import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, EditIcon, RefreshCwIcon, CalendarIcon, ChevronDownIcon, ImageIcon, FileTextIcon, LayoutIcon, VideoIcon, BookOpenIcon, MailIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon, XIcon, ClockIcon, ExternalLinkIcon, SparklesIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { RichTextViewer } from './RichTextViewer';
import { AIEnhancementPanel } from './AIEnhancementPanel';
interface GeneratedOutputPreviewProps {
  format: string;
  onEdit: () => void;
  onRegenerate: () => void;
  onSchedule: () => void;
}
export const GeneratedOutputPreview: React.FC<GeneratedOutputPreviewProps> = ({
  format,
  onEdit,
  onRegenerate,
  onSchedule
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };
  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(getMaxSlides() - 1, prev + 1));
  };
  const getMaxSlides = () => {
    switch (format) {
      case 'carousel':
        return 5;
      case 'story':
        return 7;
      default:
        return 1;
    }
  };
  const getFormatIcon = () => {
    switch (format) {
      case 'short-video':
      case 'long-video':
        return <VideoIcon size={16} className="text-emerald-500" />;
      case 'image-post':
        return <ImageIcon size={16} className="text-purple-500" />;
      case 'carousel':
        return <LayoutIcon size={16} className="text-blue-500" />;
      case 'story':
        return <BookOpenIcon size={16} className="text-amber-500" />;
      case 'blog-post':
        return <FileTextIcon size={16} className="text-indigo-500" />;
      case 'email-newsletter':
        return <MailIcon size={16} className="text-pink-500" />;
      default:
        return <FileTextIcon size={16} className="text-gray-500" />;
    }
  };
  const getActionButtonText = () => {
    if (format === 'carousel' || format === 'story') {
      return 'Edit Slides';
    }
    return 'Use in Schedule';
  };
  // Render different previews based on format
  const renderPreview = () => {
    switch (format) {
      case 'short-video':
      case 'long-video':
        return renderVideoPreview();
      case 'image-post':
        return renderImagePreview();
      case 'carousel':
      case 'story':
        return renderSlideablePreview();
      case 'blog-post':
        return renderBlogPreview();
      case 'email-newsletter':
        return renderEmailPreview();
      default:
        return <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Select a content format to preview
            </p>
          </div>;
    }
  };
  const renderVideoPreview = () => {
    // Mock video data
    const scenes = [{
      time: '0:00',
      title: 'Introduction'
    }, {
      time: '0:15',
      title: 'Main Point 1'
    }, {
      time: '0:32',
      title: 'Main Point 2'
    }, {
      time: '0:48',
      title: 'Call to Action'
    }, {
      time: '1:00',
      title: 'Conclusion'
    }];
    return <div className="space-y-4">
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop" alt="Video thumbnail" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button variant="neon" size="lg" className="rounded-full w-16 h-16 p-0 bg-indigo-600/70 border-white text-white hover:bg-indigo-700/70" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <PauseIcon size={30} /> : <PlayIcon size={30} className="animate-pulse-slow" />}
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full border border-indigo-400/30 shadow-[0_0_10px_rgba(129,140,248,0.5)]">
            {format === 'short-video' ? 'Short Video' : 'Long-form Video'} •
            1:15
          </div>
          <div className="absolute top-4 right-4">
            <Button variant="neon" size="sm" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20" leftIcon={<SparklesIcon size={14} />} onClick={() => setShowAIPanel(true)}>
              Enhance with AI
            </Button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <VideoIcon size={16} className="mr-2 text-indigo-500" />
              Scenes
            </h3>
            <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => setShowDetails(!showDetails)}>
              <ChevronDownIcon size={16} className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          {showDetails && <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {scenes.map((scene, index) => <div key={index} className={`p-3 flex items-center justify-between ${currentSlide === index ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${currentSlide === index ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {scene.title}
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {scene.time}
                  </span>
                </div>)}
            </div>}
        </div>
      </div>;
  };
  const renderImagePreview = () => {
    return <div className="space-y-4">
        <div className="aspect-square max-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
          <img src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&auto=format&fit=crop" alt="Generated image" className="max-w-full max-h-full object-contain" />
          <div className="absolute top-4 right-4">
            <Button variant="neon" size="sm" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20" leftIcon={<SparklesIcon size={14} />} onClick={() => setShowAIPanel(true)}>
              Enhance with AI
            </Button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Image Caption
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Abstract digital background with vibrant colors. Perfect for your
            next social media post about technology and innovation.
          </p>
        </div>
      </div>;
  };
  const renderSlideablePreview = () => {
    const maxSlides = getMaxSlides();
    const slideImages = ['https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1573164713712-03790a178651?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=500&auto=format&fit=crop'];
    return <div className="space-y-4">
        <div className="relative aspect-[4/5] max-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img src={slideImages[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-medium mb-1">
              {format === 'carousel' ? 'Carousel Slide' : 'Story'}{' '}
              {currentSlide + 1}
            </h3>
            <p className="text-white/80 text-sm">
              {format === 'carousel' ? 'Swipe through to see all slides in this carousel' : 'Tap through to view the complete story'}
            </p>
          </div>
          <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4">
            <div className="flex gap-1">
              {[...Array(maxSlides)].map((_, i) => <div key={i} className={`h-1 rounded-full ${i === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-4'}`} />)}
            </div>
            <Button variant="neon" size="sm" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20" leftIcon={<SparklesIcon size={14} />} onClick={() => setShowAIPanel(true)}>
              Enhance with AI
            </Button>
          </div>
          {/* Navigation arrows */}
          <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors" onClick={handlePrevSlide} disabled={currentSlide === 0}>
            <ChevronLeftIcon size={16} />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors" onClick={handleNextSlide} disabled={currentSlide === maxSlides - 1}>
            <ChevronRightIcon size={16} />
          </button>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentSlide + 1} / {maxSlides}
            </span>
            <div className="flex gap-1">
              {[...Array(maxSlides)].map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full ${i === currentSlide ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`} />)}
            </div>
          </div>
        </div>
      </div>;
  };
  const renderBlogPreview = () => {
    const blogContent = `# 10 Productivity Tips for Remote Work Success
Working remotely offers flexibility but comes with unique challenges. In this article, we'll explore effective strategies to boost your productivity while working from home.
## 1. Create a Dedicated Workspace
Having a specific area designated for work helps create mental boundaries between professional and personal life. Your workspace should be:
- Comfortable and ergonomic
- Free from distractions
- Well-lit with natural light if possible
- Equipped with all necessary tools
## 2. Establish a Routine
Maintaining consistent working hours helps train your brain to be in "work mode" during those times. This creates structure in your day and improves focus.
## 3. Take Regular Breaks
The Pomodoro Technique suggests working for 25 minutes, then taking a 5-minute break. This helps maintain high concentration levels throughout the day.
## 4. Use Productivity Tools
There are numerous apps and software designed to help remote workers stay organized and focused. Some popular options include:
- Project management tools like Asana or Trello
- Time-tracking apps like Toggl
- Communication platforms like Slack
- Focus apps that block distracting websites
## 5. Set Clear Boundaries
Let family members or roommates know your working hours to minimize interruptions. Setting boundaries helps maintain your professional focus.`;
    return <RichTextViewer content={blogContent} format="blog" metadata={{
      title: '10 Productivity Tips for Remote Work Success',
      readTime: 5
    }} />;
  };
  const renderEmailPreview = () => {
    const emailContent = `Dear {{first_name}},
We hope this email finds you well. We're excited to offer you an exclusive discount on our Premium Plan for a limited time.
As a valued subscriber, you can now enjoy all Premium features at 20% off the regular price. This offer is valid until June 30th.
## What You'll Get With Premium
- Unlimited access to all features
- Priority customer support
- Advanced analytics dashboard
- Exclusive monthly webinars
Don't miss this opportunity to upgrade your experience with us!
Best regards,
The Team at Your Company`;
    return <RichTextViewer content={emailContent} format="email" metadata={{
      title: 'Special Offer: 20% Off Our Premium Plan',
      readTime: 2,
      subjectLine: 'Limited Time Offer - 20% Off Premium Plan',
      previewText: 'Exclusive discount for our valued subscribers. Upgrade now and save 20%!'
    }} />;
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            {getFormatIcon()}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Generated Output
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<EditIcon size={14} />} onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline" size="sm" leftIcon={<RefreshCwIcon size={14} />} onClick={onRegenerate}>
            Regenerate
          </Button>
          <Button variant="outline" size="sm" leftIcon={<SparklesIcon size={14} />} onClick={() => setShowAIPanel(true)}>
            Enhance with AI
          </Button>
          <Button variant="primary" size="sm" leftIcon={format === 'carousel' || format === 'story' ? <LayoutIcon size={14} /> : <CalendarIcon size={14} />} onClick={onSchedule}>
            {getActionButtonText()}
          </Button>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        {renderPreview()}
      </div>
      {/* AI Enhancement Panel */}
      <AIEnhancementPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} contentFormat={format} contentTitle="Your content" />
    </div>;
};