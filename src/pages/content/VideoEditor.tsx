import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { VideoIcon, PlayIcon, DownloadIcon, RefreshCwIcon, SparklesIcon, SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { supabase } from '../../../supabase/client';
import { useContentCharge } from '../../hooks/useContentCharge';

export const VideoEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [duration, setDuration] = useState(3);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(576);
  const [fps, setFps] = useState(24);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Fetch userId on mount
    supabase.auth.getUser().then(res => {
      if (res?.data?.user?.id) setUserId(res.data.user.id);
    });
  }, []);

  // For charge preview, use 'video' as the contentType
  const { chargeInfo, loading: chargeLoading, error: chargeError } = useContentCharge({ userId, contentType: 'video' });

  const durationOptions = [
    { value: 3, label: '3 seconds' },
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 15, label: '15 seconds' },
  ];

  const resolutionOptions = [
    { value: { width: 1024, height: 576 }, label: 'HD (1024x576)' },
    { value: { width: 1280, height: 720 }, label: 'HD+ (1280x720)' },
    { value: { width: 1920, height: 1080 }, label: 'Full HD (1920x1080)' },
    { value: { width: 1024, height: 1024 }, label: 'Square (1024x1024)' },
  ];

  const fpsOptions = [
    { value: 24, label: '24 FPS (Film)' },
    { value: 30, label: '30 FPS (Standard)' },
    { value: 60, label: '60 FPS (Smooth)' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedVideoUrl('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-replicate', {
        body: {
          type: 'video',
          prompt,
          options: {
            duration,
            width,
            height,
            fps,
          },
        },
      });

      if (error || data?.error) {
        throw error || new Error(data?.error);
      }

      // Handle different response formats
      const videoUrl = data?.url || data?.video_url || data?.content?.url || data?.content?.video_url;
      
      if (videoUrl) {
        setGeneratedVideoUrl(videoUrl);
        toast.success('Video generated successfully!');
      } else {
        throw new Error('No video URL received from the API');
      }
    } catch (error: any) {
      toast.error('Failed to generate video', { 
        description: error.message || 'Unknown error occurred' 
      });
      console.error('Video generation error:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!generatedVideoUrl) return;
    
    try {
      const response = await fetch(generatedVideoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Video downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download video');
    }
  };

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  const handleResolutionChange = (resolution: { width: number; height: number }) => {
    setWidth(resolution.width);
    setHeight(resolution.height);
  };

  const placeholderText = "Describe the video you want to generate, e.g., 'A majestic eagle soaring over snow-capped mountains at golden hour, cinematic lighting, smooth camera movement'";

  // Simulate progress during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <ContentLayout
      title="AI Video Generator"
      description="Create stunning videos from text descriptions using AI-powered generation"
    >
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <VideoIcon className="h-8 w-8 text-green-500" />
            AI Video Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform your ideas into captivating videos with AI-powered generation
          </p>
        </div>

        {/* Cost Information */}
        {chargeInfo && (
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Estimated cost: {chargeInfo.finalCharge} credits
                </span>
              </div>
              {chargeLoading && <RefreshCwIcon className="h-4 w-4 animate-spin text-blue-600" />}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholderText}
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Video Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resolution
                </label>
                <select
                  onChange={(e) => {
                    const selected = resolutionOptions.find(opt => opt.label === e.target.value);
                    if (selected) handleResolutionChange(selected.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {resolutionOptions.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frame Rate
                </label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {fpsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              isLoading={isGenerating}
              loadingText="Generating Video..."
              leftIcon={<SparklesIcon className="h-5 w-5" />}
              fullWidth
              size="lg"
            >
              Generate Video
            </Button>
          </Card>

          {/* Output Section */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Video
              </h3>
              {generatedVideoUrl && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleRegenerate}
                    variant="outline"
                    size="sm"
                    leftIcon={<RefreshCwIcon className="h-4 w-4" />}
                    disabled={isGenerating}
                  >
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    size="sm"
                    leftIcon={<DownloadIcon className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </div>
              )}
            </div>

            {/* Video Display */}
            <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"
                        style={{ transform: `rotate(${generationProgress * 3.6}deg)` }}
                      ></div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {Math.round(generationProgress)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Creating your video...
                      </p>
                    </div>
                  </div>
                </div>
              ) : generatedVideoUrl ? (
                <div className="w-full space-y-4">
                  <video
                    src={generatedVideoUrl}
                    controls
                    className="w-full h-auto rounded-lg shadow-lg"
                    onError={() => {
                      toast.error('Failed to load generated video');
                      setGeneratedVideoUrl('');
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Video generated successfully! You can download it or regenerate with different settings.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <VideoIcon className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your generated video will appear here
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            💡 Tips for Better Videos
          </h3>
          <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
            <li>• Be specific about camera movement, angles, and transitions</li>
            <li>• Describe lighting, atmosphere, and mood in detail</li>
            <li>• Mention specific colors, textures, and visual elements</li>
            <li>• Include information about pacing and rhythm</li>
            <li>• Specify the intended style (cinematic, documentary, artistic, etc.)</li>
          </ul>
        </Card>
      </div>
    </ContentLayout>
  );
};
