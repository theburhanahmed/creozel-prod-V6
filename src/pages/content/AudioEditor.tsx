import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { MicIcon, UploadIcon, SparklesIcon, Volume2Icon, LoaderIcon, VolumeXIcon, PlayIcon, PauseIcon, ChevronLeftIcon, FileTextIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { CardMenu } from '../../components/ui/Card';
export const AudioEditor = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState('female1');
  const [script, setScript] = useState('');
  const handleGenerate = () => {
    if (!script.trim()) {
      toast.error('Please enter some text to convert');
      return;
    }
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      toast.success('Audio generated successfully!');
    }, 2000);
  };
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2">
            <ChevronLeftIcon size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audio Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and edit audio content using AI
          </p>
        </div>
      </div>
      {/* Content Type Navigation */}
      <div className="flex justify-center mb-6">
        <CardMenu items={[{
        icon: <FileTextIcon size={16} />,
        title: 'Text',
        href: '/content/text'
      }, {
        icon: <ImageIcon size={16} />,
        title: 'Image',
        href: '/content/image'
      }, {
        icon: <VideoIcon size={16} />,
        title: 'Video',
        href: '/content/video'
      }, {
        icon: <MicIcon size={16} />,
        title: 'Audio',
        href: '/content/audio'
      }]} className="shadow-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="h-fit">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="script" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text to Convert
              </label>
              <textarea id="script" value={script} onChange={e => setScript(e.target.value)} placeholder="Enter the text you want to convert to speech..." className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500" rows={4} />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice Selection
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[{
                id: 'female1',
                name: 'Sarah',
                gender: 'Female',
                accent: 'American'
              }, {
                id: 'male1',
                name: 'James',
                gender: 'Male',
                accent: 'American'
              }, {
                id: 'female2',
                name: 'Emma',
                gender: 'Female',
                accent: 'British'
              }, {
                id: 'male2',
                name: 'Michael',
                gender: 'Male',
                accent: 'British'
              }].map(voice => <div key={voice.id} onClick={() => setSelectedVoice(voice.id)} className={`
                      p-3 border rounded-lg cursor-pointer transition-all
                      ${selectedVoice === voice.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500/50' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}
                    `}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                        <MicIcon size={14} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {voice.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {voice.gender} • {voice.accent}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            <Button variant="primary" size="lg" leftIcon={isGenerating ? <LoaderIcon className="animate-spin" /> : <SparklesIcon />} onClick={handleGenerate} disabled={isGenerating || !script.trim()} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {isGenerating ? 'Generating...' : 'Generate Audio'}
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
              Upload Audio
            </Button>
          </div>
        </Card>
        {/* Output Card */}
        <Card className="h-fit">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <MicIcon size={18} className="text-green-500" />
              Generated Audio
            </h3>
          </div>
          <div className="p-6">
            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
              {isGenerating ? <div className="text-center p-6">
                  <LoaderIcon size={40} className="mx-auto text-green-500 animate-spin mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generating your audio...
                  </p>
                </div> : audioUrl ? <div className="w-full p-6 space-y-6">
                  <div className="flex justify-center">
                    <Button variant="neon" size="lg" className="rounded-full w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600" onClick={handlePlayPause}>
                      {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {/* Waveform visualization would go here */}
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        {volume === 0 ? <VolumeXIcon size={20} /> : <Volume2Icon size={20} />}
                      </button>
                      <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="flex-1" />
                    </div>
                  </div>
                </div> : <div className="text-center p-6">
                  <MicIcon size={40} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your generated audio will appear here
                  </p>
                </div>}
            </div>
          </div>
        </Card>
      </div>
    </div>;
};