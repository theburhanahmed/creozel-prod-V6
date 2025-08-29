import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ImageIcon, UploadIcon, SparklesIcon, LoaderIcon, ChevronLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../../supabase/client';
import { useContentCharge } from '../../hooks/useContentCharge';

export const ImageEditor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(res => {
      if (res?.data?.user?.id) setUserId(res.data.user.id);
    });
  }, []);

  const contentType = 'image';
  const { chargeInfo, loading: chargeLoading, error: chargeError } = useContentCharge({ userId, contentType });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'image', prompt },
      });
      if (error || data?.error) throw error || new Error(data?.error);
      setSelectedImage(data?.content?.url || data?.content || '');
      toast.success('Image generated successfully!');
    } catch (error: any) {
      toast.error('Failed to generate image', { description: error.message || 'Unknown error' });
    } finally {
      setIsGenerating(false);
    }
  };

  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2">
            <ChevronLeftIcon size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Image Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and edit images using AI
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="h-fit">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Description
              </label>
              <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the image you want to generate..." className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500" rows={4} />
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
            <Button variant="primary" size="lg" onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {isGenerating ? 'Generating...' : 'Generate Image'}
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
              Upload Image
            </Button>
          </div>
        </Card>
        {/* Output Card */}
        <Card className="h-fit">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-green-500" />
              Generated Image
            </h3>
          </div>
          <div className="p-6">
            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
              {isGenerating ? <div className="text-center p-6">
                  <LoaderIcon size={40} className="mx-auto text-green-500 animate-spin mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generating your image...
                  </p>
                </div> : selectedImage ? <img src={selectedImage} alt="Generated" className="w-full h-full object-cover rounded-lg" /> : <div className="text-center p-6">
                  <ImageIcon size={40} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your generated image will appear here
                  </p>
                </div>}
            </div>
          </div>
        </Card>
      </div>
    </div>;
};
