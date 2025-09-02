import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ImageIcon, DownloadIcon, RefreshCwIcon, SparklesIcon, SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { supabase } from '../../../supabase/client';
import { useContentCharge } from '../../hooks/useContentCharge';

export const ImageEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState('1024x1024');
  const [imageQuality, setImageQuality] = useState('standard');
  const [imageStyle, setImageStyle] = useState('natural');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Fetch userId on mount
    supabase.auth.getUser().then(res => {
      if (res?.data?.user?.id) setUserId(res.data.user.id);
    });
  }, []);

  // For charge preview, use 'image' as the contentType
  const { chargeInfo, loading: chargeLoading, error: chargeError } = useContentCharge({ userId, contentType: 'image' });

  const imageSizes = [
    { value: '1024x1024', label: 'Square (1024x1024)' },
    { value: '1792x1024', label: 'Landscape (1792x1024)' },
    { value: '1024x1792', label: 'Portrait (1024x1792)' },
  ];

  const imageQualities = [
    { value: 'standard', label: 'Standard' },
    { value: 'hd', label: 'HD' },
  ];

  const imageStyles = [
    { value: 'natural', label: 'Natural' },
    { value: 'vivid', label: 'Vivid' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-openai', {
        body: {
          type: 'image',
          prompt,
          options: {
            size: imageSize,
            quality: imageQuality,
            style: imageStyle,
          },
        },
      });

      if (error || data?.error) {
        throw error || new Error(data?.error);
      }

      // Handle different response formats
      const imageUrl = data?.url || data?.image_url || data?.content?.url || data?.content?.image_url;
      
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image URL received from the API');
      }
    } catch (error: any) {
      toast.error('Failed to generate image', { 
        description: error.message || 'Unknown error occurred' 
      });
      console.error('Image generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImageUrl) return;
    
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  const placeholderText = "Describe the image you want to generate, e.g., 'A serene mountain landscape at sunset with a crystal clear lake reflecting the sky, digital art style'";

  return (
    <ContentLayout
      title="AI Image Generator"
      description="Transform your ideas into stunning visuals with AI-powered image generation"
    >
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <ImageIcon className="h-8 w-8 text-green-500" />
            AI Image Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform your ideas into stunning visuals with AI-powered image generation
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
                Image Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholderText}
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Image Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size
                </label>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {imageSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality
                </label>
                <select
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {imageQualities.map((quality) => (
                    <option key={quality.value} value={quality.value}>
                      {quality.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Style
                </label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {imageStyles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
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
              loadingText="Generating Image..."
              leftIcon={<SparklesIcon className="h-5 w-5" />}
              fullWidth
              size="lg"
            >
              Generate Image
            </Button>
          </Card>

          {/* Output Section */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Image
              </h3>
              {generatedImageUrl && (
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

            {/* Image Display */}
            <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Creating your masterpiece...
                  </p>
                </div>
              ) : generatedImageUrl ? (
                <div className="w-full space-y-4">
                  <img
                    src={generatedImageUrl}
                    alt="Generated image"
                    className="w-full h-auto rounded-lg shadow-lg"
                    onError={() => {
                      toast.error('Failed to load generated image');
                      setGeneratedImageUrl('');
                    }}
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Image generated successfully! You can download it or regenerate with different settings.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your generated image will appear here
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            💡 Tips for Better Images
          </h3>
          <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
            <li>• Be specific about style, mood, and composition</li>
            <li>• Include details about lighting, perspective, and artistic style</li>
            <li>• Mention specific colors, textures, or materials</li>
            <li>• Specify the time of day or season for outdoor scenes</li>
            <li>• Add context about the intended use or audience</li>
          </ul>
        </Card>
      </div>
    </ContentLayout>
  );
};
