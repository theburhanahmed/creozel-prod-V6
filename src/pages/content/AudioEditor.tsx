import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MicIcon, PlayIcon, PauseIcon, DownloadIcon, RefreshCwIcon, SparklesIcon, Volume2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { supabase } from '../../../supabase/client';
import { useContentCharge } from '../../hooks/useContentCharge';

export const AudioEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('pNInz6obpgDQGcFmaJgB'); // Default voice ID
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.5);
  const [model, setModel] = useState('eleven_monolingual_v1');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Fetch userId on mount
    supabase.auth.getUser().then(res => {
      if (res?.data?.user?.id) setUserId(res.data.user.id);
    });
  }, []);

  // For charge preview, use 'audio' as the contentType
  const { chargeInfo, loading: chargeLoading, error: chargeError } = useContentCharge({ userId, contentType: 'audio' });

  const voiceOptions = [
    { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam (Professional)' },
    { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (Friendly)' },
    { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi (Energetic)' },
    { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella (Warm)' },
    { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold (Deep)' },
  ];

  const modelOptions = [
    { value: 'eleven_monolingual_v1', label: 'Monolingual (English)' },
    { value: 'eleven_multilingual_v1', label: 'Multilingual' },
    { value: 'eleven_multilingual_v2', label: 'Multilingual v2' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsGenerating(true);
    setGeneratedAudio('');
    setIsPlaying(false);

    try {
      const { data, error } = await supabase.functions.invoke('ai-elevenlabs', {
        body: {
          type: 'audio',
          prompt,
          options: {
            voiceId: selectedVoice,
            model,
            stability,
            similarityBoost,
          },
        },
      });

      if (error || data?.error) {
        throw error || new Error(data?.error);
      }

      // Handle different response formats
      const audioData = data?.audio_base64 || data?.content?.audio_base64 || data?.audio;
      
      if (audioData) {
        setGeneratedAudio(audioData);
        toast.success('Audio generated successfully!');
      } else {
        throw new Error('No audio data received from the API');
      }
    } catch (error: any) {
      toast.error('Failed to generate audio', { 
        description: error.message || 'Unknown error occurred' 
      });
      console.error('Audio generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = async () => {
    if (!generatedAudio) return;
    
    try {
      // Convert base64 to blob
      const byteCharacters = atob(generatedAudio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Audio downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download audio');
    }
  };

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  // Create audio element when audio is generated
  useEffect(() => {
    if (generatedAudio) {
      const audio = new Audio(`data:audio/mpeg;base64,${generatedAudio}`);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        toast.error('Failed to load generated audio');
        setGeneratedAudio('');
      };
      setAudioElement(audio);
    }
  }, [generatedAudio]);

  const placeholderText = "Enter the text you want to convert to speech, e.g., 'Welcome to our company! We are excited to share our latest innovations with you today.'";

  return (
    <ContentLayout
      title="AI Audio Generator"
      description="Convert text to natural-sounding speech using AI-powered voice synthesis"
    >
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <MicIcon className="h-8 w-8 text-green-500" />
            AI Audio Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform text into natural-sounding speech with AI-powered voice synthesis
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
                Text to Speech
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholderText}
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Voice Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {voiceOptions.map((voice) => (
                    <option key={voice.value} value={voice.value}>
                      {voice.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={isGenerating}
                >
                  {modelOptions.map((modelOption) => (
                    <option key={modelOption.value} value={modelOption.value}>
                      {modelOption.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stability: {stability}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={stability}
                    onChange={(e) => setStability(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Variable</span>
                    <span>Stable</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Similarity: {similarityBoost}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={similarityBoost}
                    onChange={(e) => setSimilarityBoost(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Different</span>
                    <span>Similar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              isLoading={isGenerating}
              loadingText="Generating Audio..."
              leftIcon={<SparklesIcon className="h-5 w-5" />}
              fullWidth
              size="lg"
            >
              Generate Audio
            </Button>
          </Card>

          {/* Output Section */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Audio
              </h3>
              {generatedAudio && (
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

            {/* Audio Player */}
            <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Creating your audio...
                  </p>
                </div>
              ) : generatedAudio ? (
                <div className="w-full space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <Volume2Icon className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Audio Ready!
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Your text has been converted to speech
                    </p>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={handlePlayPause}
                      variant="primary"
                      size="lg"
                      className="w-16 h-16 rounded-full p-0"
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-8 w-8" />
                      ) : (
                        <PlayIcon className="h-8 w-8" />
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use the play button to listen to your generated audio
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <MicIcon className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your generated audio will appear here
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            💡 Tips for Better Audio
          </h3>
          <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
            <li>• Use clear, well-structured sentences for better pronunciation</li>
            <li>• Include punctuation to guide natural speech patterns</li>
            <li>• Keep sentences at a reasonable length for clarity</li>
            <li>• Use the stability slider to control voice consistency</li>
            <li>• Experiment with different voices for various content types</li>
          </ul>
        </Card>
      </div>
    </ContentLayout>
  );
};
