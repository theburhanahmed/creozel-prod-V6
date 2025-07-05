import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { XIcon, ChevronRightIcon, BarChart2Icon, HelpCircleIcon, MousePointerClickIcon, PlusIcon, MinusIcon, ClockIcon, CornerDownRightIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
export interface InteractiveElement {
  id: string;
  type: 'poll' | 'quiz' | 'cta';
  title: string;
  question?: string;
  options?: string[];
  ctaText?: string;
  ctaLink?: string;
  timestamp: string;
  duration: number;
}
interface InteractiveElementSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddElement: (element: InteractiveElement) => void;
  currentTime: string;
}
export const InteractiveElementSidebar = ({
  isOpen,
  onClose,
  onAddElement,
  currentTime
}: InteractiveElementSidebarProps) => {
  const [elementType, setElementType] = useState<'poll' | 'quiz' | 'cta'>('poll');
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [ctaText, setCtaText] = useState('Learn More');
  const [ctaLink, setCtaLink] = useState('');
  const [timestamp, setTimestamp] = useState(currentTime);
  const [duration, setDuration] = useState(10);
  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    } else {
      toast.error('Maximum 4 options allowed');
    }
  };
  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    } else {
      toast.error('Minimum 2 options required');
    }
  };
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  const handleAddElement = () => {
    // Validate fields
    if (!title) {
      toast.error('Please enter a title');
      return;
    }
    if (elementType === 'poll' || elementType === 'quiz') {
      if (!question) {
        toast.error('Please enter a question');
        return;
      }
      if (options.some(option => !option.trim())) {
        toast.error('Please fill in all options');
        return;
      }
    } else if (elementType === 'cta') {
      if (!ctaText) {
        toast.error('Please enter CTA text');
        return;
      }
      if (!ctaLink) {
        toast.error('Please enter CTA link');
        return;
      }
    }
    const newElement: InteractiveElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      title,
      question: elementType === 'poll' || elementType === 'quiz' ? question : undefined,
      options: elementType === 'poll' || elementType === 'quiz' ? options : undefined,
      ctaText: elementType === 'cta' ? ctaText : undefined,
      ctaLink: elementType === 'cta' ? ctaLink : undefined,
      timestamp,
      duration
    };
    onAddElement(newElement);
    toast.success('Interactive element added', {
      description: `${title} will appear at ${timestamp} in your video`
    });
    // Reset form
    setTitle('');
    setQuestion('');
    setOptions(['', '']);
    setCtaText('Learn More');
    setCtaLink('');
    setDuration(10);
  };
  if (!isOpen) return null;
  return <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl z-50 border-l border-gray-200 dark:border-gray-700 flex flex-col animate-in">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Add Interactive Element
        </h3>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close">
          <XIcon size={18} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Element Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setElementType('poll')} className={`flex flex-col items-center p-3 border rounded-lg ${elementType === 'poll' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <BarChart2Icon size={24} className={elementType === 'poll' ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400'} />
              <span className="mt-1 text-sm">Poll</span>
            </button>
            <button type="button" onClick={() => setElementType('quiz')} className={`flex flex-col items-center p-3 border rounded-lg ${elementType === 'quiz' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <HelpCircleIcon size={24} className={elementType === 'quiz' ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400'} />
              <span className="mt-1 text-sm">Quiz</span>
            </button>
            <button type="button" onClick={() => setElementType('cta')} className={`flex flex-col items-center p-3 border rounded-lg ${elementType === 'cta' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <MousePointerClickIcon size={24} className={elementType === 'cta' ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400'} />
              <span className="mt-1 text-sm">CTA</span>
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder={`Element title (e.g., ${elementType === 'poll' ? 'Quick Poll' : elementType === 'quiz' ? 'Knowledge Check' : 'Website Link'}`} />
        </div>
        {(elementType === 'poll' || elementType === 'quiz') && <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question
              </label>
              <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder={elementType === 'poll' ? "What's your favorite feature?" : "What's the correct answer?"} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Options
                </label>
                <button type="button" onClick={handleAddOption} className="flex items-center text-xs text-cyan-600 dark:text-cyan-400">
                  <PlusIcon size={14} className="mr-1" />
                  Add Option
                </button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => <div key={index} className="flex items-center gap-2">
                    <input type="text" value={option} onChange={e => handleOptionChange(index, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder={`Option ${index + 1}`} />
                    {elementType === 'quiz' && <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" title="Mark as correct answer">
                        <CheckIcon size={14} />
                      </button>}
                    <button type="button" onClick={() => handleRemoveOption(index)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      <MinusIcon size={14} />
                    </button>
                  </div>)}
              </div>
            </div>
          </>}
        {elementType === 'cta' && <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <input type="text" value={ctaText} onChange={e => setCtaText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Learn More" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link URL
              </label>
              <input type="url" value={ctaLink} onChange={e => setCtaLink(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="https://example.com" />
            </div>
          </>}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timestamp
          </label>
          <div className="flex items-center gap-2">
            <ClockIcon size={16} className="text-gray-500" />
            <input type="text" value={timestamp} onChange={e => setTimestamp(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="00:30" />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter when this element should appear in the video
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (seconds)
          </label>
          <div className="flex items-center gap-2">
            <input type="range" min="5" max="30" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            <span className="text-sm font-medium w-8 text-right">
              {duration}s
            </span>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-start gap-2">
            <AlertCircleIcon size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Interactive elements will only be visible when your video is
              published to platforms that support interactivity.
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="primary" className="w-full" onClick={handleAddElement}>
          Add to Video
        </Button>
      </div>
    </div>;
};