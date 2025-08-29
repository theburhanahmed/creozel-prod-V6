import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { VideoIcon, UploadIcon, SparklesIcon, PlayIcon, PauseIcon, LoaderIcon, Settings2Icon, ImageIcon, Type as TypeIcon, ChevronLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase/client';
import { useContentCharge } from '../../hooks/useContentCharge';

export const VideoEditor = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('explanatory');
  const [script, setScript] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(res => {
      if (res?.data?.user?.id) setUserId(res.data.user.id);
    });
  }, []);

  const contentType = 'video';
  const { chargeInfo, loading: chargeLoading, error: chargeError } = useContentCharge({ userId, contentType });

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error('Please enter a video script');
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'video', prompt: script, options: { style: selectedStyle } },
      });
      if (error || data?.error) throw error || new Error(data?.error);
      setVideoUrl(data?.content?.url || data?.content || '');
      toast.success('Video generated successfully!');
    } catch (error: any) {
      toast.error('Failed to generate video', { description: error.message || 'Unknown error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const videoStyles = [{
    id: 'explanatory',
    name: 'Explanatory',
    icon: TypeIcon
  }, {
    id: 'promotional',
    name: 'Promotional',
    icon: SparklesIcon
  }, {
    id: 'tutorial',
    name: 'Tutorial',
    icon: Settings2Icon
  }, {
    id: 'social',
    name: 'Social Media',
    icon: ImageIcon
  }];

  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2">
            <ChevronLeftIcon size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Video Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and edit video content using AI
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="h-fit">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="script" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Script
              </label>
              <textarea id="script" value={script} onChange={e => setScript(e.target.value)} placeholder="Enter your video script..." className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500" rows={4} />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {videoStyles.map(style => {
                const Icon = style.icon;
                return <div key={style.id} onClick={() => setSelectedStyle(style.id)} className={`
                        p-3 border rounded-lg cursor-pointer transition-all
                        ${selectedStyle === style.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500/50' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}
                      `}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                          <Icon size={14} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {style.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Optimized for {style.name.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>;
              })}
              </div>
            </div>
            {/* Charge Preview */}
            <div>
              {chargeLoading ? (
                <span>Loading charge...</span>
              ) : chargeError ? (
                <span className="text-red-500">Charge unavailable</span>
              ) : chargeInfo ? (
                <span>
                  <strong>Charge:</strong> {chargeInfo.finalCharge?.toFixed(2)} credits
                  <br />
                  <small>
                    (Base: {chargeInfo.cost_per_unit} + Profit: {chargeInfo.profit_percent}%)
                  </small>
                </span>
              ) : null}
            </div>
            <Button variant="primary" size="lg" leftIcon={isGenerating ? <LoaderIcon className="animate-spin" /> : <SparklesIcon />} onClick={handleGenerate} disabled={isGenerating || !script.trim()} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {isGenerating ? 'Generating...' : 'Generate Video'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  or
                </span>
              </div>
            </div>
            <Button variant="outline" size="lg" leftIcon={<UploadIcon size={18} />} className="w-full">
              Upload Video
            </Button>
          </div>
        </Card>
        {/* Output Card */}
        <Card className="h-fit">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <VideoIcon size={18} className="text-green-500" />
              Generated Video
            </h3>
          </div>
          <div className="p-6">
            <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 overflow-hidden relative">
              {isGenerating ? <div className="text-center p-6">
                  <LoaderIcon size={40} className="mx-auto text-green-500 animate-spin mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generating your video...
                  </p>
                </div> : videoUrl ? <>
                  <img src={videoUrl} alt="Video preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Button variant="neon" size="lg" className="rounded-full w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                    </Button>
                  </div>
                </> : <div className="text-center p-6">
                  <VideoIcon size={40} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your generated video will appear here
                  </p>
                </div>}
            </div>
          </div>
        </Card>
      </div>
    </div>;
};
