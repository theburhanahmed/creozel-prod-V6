import React, { useState } from 'react';
import { SparklesIcon, ClockIcon, BarChart2Icon, LayoutIcon, FileTextIcon, VideoIcon, ImageIcon, RefreshCwIcon, CheckIcon, XIcon, ArrowRightIcon, RocketIcon, ToggleLeftIcon, ToggleRightIcon, CalendarIcon, InstagramIcon, YoutubeIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
interface AIEnhancementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contentFormat: string;
  contentTitle?: string;
}
export const AIEnhancementPanel: React.FC<AIEnhancementPanelProps> = ({
  isOpen,
  onClose,
  contentFormat,
  contentTitle = 'Your content'
}) => {
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [generatingMore, setGeneratingMore] = useState(false);
  // TODO: Fetch AI enhancement suggestions from production data source (Supabase or backend)
  const [alternateFormats, setAlternateFormats] = useState<any[]>([]);
  const [bestTimings, setBestTimings] = useState<any[]>([]);
  const [autoGenerateOptions, setAutoGenerateOptions] = useState<any[]>([]);
  const handleToggleAutopilot = () => {
    setAutopilotEnabled(!autopilotEnabled);
    toast.success(autopilotEnabled ? 'Autopilot disabled' : 'Autopilot enabled', {
      description: autopilotEnabled ? 'You now have manual control over publishing' : 'AI will optimize and publish content automatically'
    });
  };
  const handleGenerateFormat = (formatId: string) => {
    setGeneratingMore(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratingMore(false);
      toast.success(`${formatId} format generated`, {
        description: 'Your content has been transformed to the new format'
      });
    }, 1500);
  };
  const handleScheduleOptimal = (platform: string, time: string) => {
    toast.success(`Scheduled for ${platform}`, {
      description: `Content will be published on ${time} for optimal engagement`
    });
  };
  const handleAutoGenerate = (option: string) => {
    toast.success(`Auto-generating ${option}`, {
      description: 'AI is creating additional content formats for you'
    });
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <SparklesIcon size={16} />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              AI Enhancement Suggestions
            </h3>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={onClose}>
            <XIcon size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Autopilot toggle */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <RocketIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Enable full autopilot for this topic
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let AI handle content creation, optimization, and
                      publishing
                    </p>
                  </div>
                </div>
                <button onClick={handleToggleAutopilot} className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" aria-pressed={autopilotEnabled}>
                  {autopilotEnabled ? <ToggleRightIcon size={22} className="text-indigo-500" /> : <ToggleLeftIcon size={22} className="text-gray-400" />}
                </button>
              </div>
            </div>
            {/* Alternate formats */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <LayoutIcon size={14} className="mr-2 text-indigo-500" />
                Alternate formats for this content
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {alternateFormats.map(format => <div key={format.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                          {format.icon}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {format.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {format.match}% match
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {format.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full" leftIcon={<SparklesIcon size={12} />} onClick={() => handleGenerateFormat(format.id)} disabled={generatingMore}>
                      {generatingMore ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>)}
              </div>
            </div>
            {/* Best time and platform */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <ClockIcon size={14} className="mr-2 text-indigo-500" />
                Best time to publish based on previous engagement
              </h4>
              <div className="space-y-2">
                {bestTimings.map((timing, index) => <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {timing.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {timing.platform}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <CalendarIcon size={12} className="mr-1" />
                          <span>{timing.time}</span>
                          <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">
                            {timing.engagement}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleScheduleOptimal(timing.platform, timing.time)}>
                      Schedule
                    </Button>
                  </div>)}
              </div>
            </div>
            {/* Auto-generate options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <RefreshCwIcon size={14} className="mr-2 text-indigo-500" />
                Content formats that could be auto-generated
              </h4>
              <div className="space-y-2">
                {autoGenerateOptions.map((option, index) => <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {option.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {option.confidence}
                      </span>
                      <Button variant="outline" size="sm" className="mt-1" onClick={() => handleAutoGenerate(option.name)}>
                        Generate
                      </Button>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>;
};
