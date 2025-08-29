import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { toast } from 'sonner';
import { VideoIcon, ChevronLeftIcon, SaveIcon, PlayIcon, PauseIcon, MicIcon, ImageIcon, UploadIcon, TypeIcon, LayoutIcon, SlashIcon, TextIcon, PlusIcon, BarChart2Icon, MousePointerClickIcon, HelpCircleIcon, PaletteIcon, CheckIcon, GlobeIcon, RefreshCwIcon, UserIcon, Volume2Icon, SparklesIcon, Wand2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InteractiveElementSidebar, InteractiveElement } from '../../components/autopilot/InteractiveElementSidebar';
import { VoiceTrainingModal } from '../../components/autopilot/VoiceTrainingModal';
import { AudioPreview } from '../../components/autopilot/AudioPreview';
import { BackgroundGenerator } from '../../components/autopilot/BackgroundGenerator';
// Mock brand settings
const mockBrandSettings = {
  primaryColor: '#4f46e5',
  secondaryColor: '#8b5cf6',
  accentColor: '#ec4899',
  fontPrimary: 'sans-serif',
  fontSecondary: 'sans-serif',
  voiceTone: 'professional',
  logo: 'https://via.placeholder.com/200x80?text=Brand+Logo'
};
export const VideoGenerator = () => {
  const [activeTab, setActiveTab] = useState('script');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [script, setScript] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('female-1');
  const [voiceSettings, setVoiceSettings] = useState({
    speed: 1,
    pitch: 1
  });
  const [videoPreview, setVideoPreview] = useState('');
  const [showInteractivePanel, setShowInteractivePanel] = useState(false);
  const [interactiveElements, setInteractiveElements] = useState<InteractiveElement[]>([]);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [useBranding, setUseBranding] = useState(true);
  const [brandSettings, setBrandSettings] = useState(mockBrandSettings);
  const [useMyVoice, setUseMyVoice] = useState(false);
  const [hasClonedVoice, setHasClonedVoice] = useState(false);
  const [showVoiceTrainingModal, setShowVoiceTrainingModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | undefined>(undefined);
  const [selectedBackground, setSelectedBackground] = useState<string | undefined>(undefined);
  const [hasAIBackground, setHasAIBackground] = useState(false);
  const [mediaOption, setMediaOption] = useState('auto-generate');
  const [backgroundOption, setBackgroundOption] = useState('image');
  const tabs = [{
    id: 'script',
    label: 'Script'
  }, {
    id: 'voiceover',
    label: 'Voiceover'
  }, {
    id: 'media',
    label: 'Media'
  }, {
    id: 'timeline',
    label: 'Timeline'
  }];
  const voices = [{
    id: 'female-1',
    name: 'Sarah',
    gender: 'Female',
    accent: 'American'
  }, {
    id: 'male-1',
    name: 'Michael',
    gender: 'Male',
    accent: 'American'
  }, {
    id: 'female-2',
    name: 'Emma',
    gender: 'Female',
    accent: 'British'
  }, {
    id: 'male-2',
    name: 'James',
    gender: 'Male',
    accent: 'British'
  }, {
    id: 'female-3',
    name: 'Olivia',
    gender: 'Female',
    accent: 'Australian'
  }, {
    id: 'male-3',
    name: 'Noah',
    gender: 'Male',
    accent: 'Australian'
  }];
  const languages = [{
    code: 'english',
    name: 'English',
    flag: '🇺🇸'
  }, {
    code: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸'
  }, {
    code: 'french',
    name: 'French',
    flag: '🇫🇷'
  }, {
    code: 'german',
    name: 'German',
    flag: '🇩🇪'
  }, {
    code: 'italian',
    name: 'Italian',
    flag: '🇮🇹'
  }, {
    code: 'japanese',
    name: 'Japanese',
    flag: '🇯🇵'
  }, {
    code: 'chinese',
    name: 'Chinese',
    flag: '🇨🇳'
  }, {
    code: 'korean',
    name: 'Korean',
    flag: '🇰🇷'
  }];
  const handleGenerate = () => {
    if (!prompt.trim() && !script.trim()) {
      toast.error('Please enter a prompt or script');
      return;
    }
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setScript(prompt ? `Here's a script generated from your prompt: "${prompt}"\n\n` + "In today's fast-paced digital world, staying productive can be challenging. " + 'Let me share three simple tech tips that can save you hours each week.\n\n' + 'First, use keyboard shortcuts. CTRL+SHIFT+V pastes without formatting, saving you from manual reformatting.\n\n' + 'Second, try the Pomodoro technique with a 25-minute focus timer. There are great apps for this.\n\n' + 'Finally, use text expansion tools to create shortcuts for phrases you type frequently.\n\n' + 'Which of these tips will you try first? Comment below!' : script);
      // Set video preview if we're generating from a prompt
      if (prompt) {
        setVideoPreview('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcHV0ZXIlMjB3b3JrfGVufDB8fDB8fHww');
      }
      toast.success('Content generated successfully!');
      setActiveTab('voiceover');
    }, 2000);
  };
  const handleSave = () => {
    toast.success('Video saved to library', {
      description: 'Your video has been saved to your media library.'
    });
  };
  const handleAddInteractiveElement = (element: InteractiveElement) => {
    setInteractiveElements([...interactiveElements, element]);
    setShowInteractivePanel(false);
  };
  const getElementIcon = (type: string) => {
    switch (type) {
      case 'poll':
        return <BarChart2Icon size={14} className="text-indigo-500" />;
      case 'quiz':
        return <HelpCircleIcon size={14} className="text-amber-500" />;
      case 'cta':
        return <MousePointerClickIcon size={14} className="text-emerald-500" />;
      default:
        return null;
    }
  };
  const toggleBranding = () => {
    setUseBranding(!useBranding);
    toast.success(useBranding ? 'Brand styling disabled' : 'Brand styling enabled', {
      description: useBranding ? 'Your content will use default styling' : 'Your brand settings will be applied to this content'
    });
  };
  const handleVoiceToggle = () => {
    if (!hasClonedVoice && !useMyVoice) {
      setShowVoiceTrainingModal(true);
    } else {
      setUseMyVoice(!useMyVoice);
      if (!useMyVoice) {
        setSelectedVoice('my-voice');
        toast.success('Using your cloned voice', {
          description: 'Your AI voice clone will be used for this content'
        });
      } else {
        setSelectedVoice('female-1');
      }
    }
  };
  const handleVoiceTrainingComplete = () => {
    setHasClonedVoice(true);
    setUseMyVoice(true);
    setSelectedVoice('my-voice');
    toast.success('Voice clone created successfully!', {
      description: 'Your voice is now available for use in your content'
    });
  };
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    generateAudioPreview(language);
  };
  const generateAudioPreview = (language: string = selectedLanguage) => {
    if (!script.trim()) {
      toast.error('Please enter a script first');
      return;
    }
    setIsGeneratingAudio(true);
    // Simulate audio generation
    setTimeout(() => {
      setIsGeneratingAudio(false);
      // Mock audio URL - in a real app, this would be a generated audio file
      setAudioPreview('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      toast.success('Audio preview generated', {
        description: `Preview generated in ${languages.find(l => l.code === language)?.name || language}`
      });
    }, 1500);
  };
  const handleBackgroundSelect = (background: string) => {
    setSelectedBackground(background);
    setHasAIBackground(true);
    // Update the video preview with the selected background
    setVideoPreview(background);
  };
  // Get current voice name
  const getCurrentVoiceName = () => {
    if (useMyVoice) return 'Your Voice';
    const voice = voices.find(v => v.id === selectedVoice);
    return voice ? voice.name : 'Default Voice';
  };
  // Get current language name
  const getCurrentLanguageName = () => {
    const language = languages.find(l => l.code === selectedLanguage);
    return language ? language.name : 'English';
  };
  // Reset audio preview when voice or language changes
  useEffect(() => {
    setAudioPreview(undefined);
  }, [selectedVoice, selectedLanguage, useMyVoice]);
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/autopilot" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ChevronLeftIcon size={16} />
            <span>Back to Pipelines</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Faceless Video Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create engaging faceless videos from text
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<LayoutIcon size={16} />} as={Link} to="/autopilot/templates">
            Templates
          </Button>
          <Button variant="primary" leftIcon={<SaveIcon size={16} />} onClick={handleSave}>
            Save Video
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-6">
              <Tabs tabs={tabs} onChange={setActiveTab} variant="enclosed" />
              <div className="p-4">
                {activeTab === 'script' && <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Generate from Prompt
                      </label>
                      <div className="flex gap-2">
                        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Enter a topic or prompt for your video" />
                        <Button variant="primary" onClick={handleGenerate} isLoading={isGenerating}>
                          Generate
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Script
                      </label>
                      <textarea value={script} onChange={e => setScript(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Write or paste your script here" rows={10} />
                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setActiveTab('voiceover')} disabled={!script.trim()}>
                          Next: Voiceover
                        </Button>
                      </div>
                    </div>
                  </div>}
                {activeTab === 'voiceover' && <div className="space-y-6">
                    {/* Use My Voice toggle */}
                    <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Use My Voice
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {hasClonedVoice ? 'Your AI voice clone is ready to use' : 'Create an AI clone of your voice for videos'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button type="button" onClick={handleVoiceToggle} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useMyVoice ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} role="switch" aria-checked={useMyVoice}>
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useMyVoice ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                    {/* AI Voices Grid */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {useMyVoice ? 'Your Voice' : 'Select Voice'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {useMyVoice ? <div className="p-4 border rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/30 ring-2 ring-indigo-500/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                                <MicIcon size={18} />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  Your Voice
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  AI-cloned • Natural
                                </p>
                              </div>
                            </div>
                          </div> : voices.map(voice => <div key={voice.id} onClick={() => setSelectedVoice(voice.id)} className={`
                                p-4 border rounded-lg cursor-pointer
                                ${selectedVoice === voice.id ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-2 ring-cyan-500/50' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}
                              `}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                  <MicIcon size={18} />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">
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
                    {/* Voice Settings */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Speed
                        </label>
                        <input type="range" min="0.5" max="2" step="0.1" value={voiceSettings.speed} onChange={e => setVoiceSettings({
                      ...voiceSettings,
                      speed: parseFloat(e.target.value)
                    })} className="w-full" />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Slow</span>
                          <span>Normal ({voiceSettings.speed}x)</span>
                          <span>Fast</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pitch
                        </label>
                        <input type="range" min="0.5" max="1.5" step="0.1" value={voiceSettings.pitch} onChange={e => setVoiceSettings({
                      ...voiceSettings,
                      pitch: parseFloat(e.target.value)
                    })} className="w-full" />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Low</span>
                          <span>Normal ({voiceSettings.pitch}x)</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                    {/* Language Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dubbing Languages
                        </h3>
                        <Button variant="outline" size="sm" leftIcon={<Volume2Icon size={14} />} onClick={() => generateAudioPreview()} disabled={isGeneratingAudio || !script.trim()}>
                          Generate Preview
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                        {languages.map(language => <button key={language.code} onClick={() => handleLanguageChange(language.code)} className={`
                              flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
                              ${selectedLanguage === language.code ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
                            `}>
                            <span className="text-lg">{language.flag}</span>
                            <span>{language.name}</span>
                          </button>)}
                      </div>
                      {/* Audio Preview */}
                      {(audioPreview || isGeneratingAudio) && <AudioPreview audioSrc={audioPreview} text={script.substring(0, 100)} voiceName={getCurrentVoiceName()} language={getCurrentLanguageName()} isLoading={isGeneratingAudio} />}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('script')}>
                        Back
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('media')}>
                        Next: Media
                      </Button>
                    </div>
                  </div>}
                {activeTab === 'media' && <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                          Media Options
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input type="radio" id="auto-generate" name="media-option" value="auto-generate" checked={mediaOption === 'auto-generate'} onChange={() => setMediaOption('auto-generate')} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300" />
                            <label htmlFor="auto-generate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Auto-generate images from script
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="upload-media" name="media-option" value="upload-media" checked={mediaOption === 'upload-media'} onChange={() => setMediaOption('upload-media')} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300" />
                            <label htmlFor="upload-media" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Upload your own media
                            </label>
                          </div>
                        </div>
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Background Options
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <input type="radio" id="solid-color" name="background-option" value="solid-color" checked={backgroundOption === 'solid-color'} onChange={() => setBackgroundOption('solid-color')} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300" />
                              <label htmlFor="solid-color" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Solid Color
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="gradient" name="background-option" value="gradient" checked={backgroundOption === 'gradient'} onChange={() => setBackgroundOption('gradient')} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300" />
                              <label htmlFor="gradient" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Gradient
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="image" name="background-option" value="image" checked={backgroundOption === 'image'} onChange={() => setBackgroundOption('image')} className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300" />
                              <label htmlFor="image" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                Image
                                {hasAIBackground && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                    <SparklesIcon size={8} />
                                    AI
                                  </span>}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                          Text Options
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Font
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm">
                              <option>Sans Serif</option>
                              <option>Serif</option>
                              <option>Monospace</option>
                              <option>Display</option>
                              <option>Handwriting</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Size
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm">
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                                <option>Extra Large</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Color
                              </label>
                              <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-300 cursor-pointer"></div>
                                <div className="w-8 h-8 rounded-full bg-black cursor-pointer"></div>
                                <div className="w-8 h-8 rounded-full bg-cyan-500 cursor-pointer"></div>
                                <input type="color" className="w-8 h-8 rounded-full cursor-pointer p-0 border-0" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Background Generator */}
                    {backgroundOption === 'image' && <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <BackgroundGenerator onSelectBackground={handleBackgroundSelect} selectedBackground={selectedBackground} />
                      </div>}
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('voiceover')}>
                        Back
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('timeline')}>
                        Next: Timeline
                      </Button>
                    </div>
                  </div>}
                {activeTab === 'timeline' && <div className="space-y-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Timeline
                      </h3>
                      <Button variant="outline" size="sm" leftIcon={<PlusIcon size={14} />} onClick={() => {
                    setCurrentTime('00:30');
                    setShowInteractivePanel(true);
                  }}>
                        + Interactive Element
                      </Button>
                    </div>
                    <div className="h-32 rounded-lg bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-sm p-4 border border-indigo-200/30 dark:border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)] dark:shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                      <div className="relative w-full h-full">
                        {/* Timeline track */}
                        <div className="absolute top-2 left-0 right-0 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md opacity-70 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        {/* Interactive elements */}
                        {interactiveElements.map(element => {
                      // Convert timestamp (e.g. "00:30") to position percentage
                      const [minutes, seconds] = element.timestamp.split(':').map(Number);
                      const totalSeconds = minutes * 60 + seconds;
                      const positionPercent = Math.min(totalSeconds / 165 * 100, 100); // assuming 2:45 video length
                      return <div key={element.id} className="absolute top-12 h-10 flex items-center justify-center" style={{
                        left: `${positionPercent}%`,
                        transform: 'translateX(-50%)'
                      }}>
                              <div className="relative group">
                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-indigo-500 flex items-center justify-center shadow-md cursor-pointer">
                                  {getElementIcon(element.type)}
                                </div>
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-md shadow-lg px-3 py-2 text-xs w-32 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-200 dark:border-gray-700">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {element.title}
                                  </p>
                                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    {element.timestamp}
                                  </p>
                                </div>
                                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-px h-2 bg-indigo-500"></div>
                              </div>
                            </div>;
                    })}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('media')}>
                        Back
                      </Button>
                      <Button variant="primary" leftIcon={<SaveIcon size={16} />} onClick={handleSave}>
                        Generate & Save Video
                      </Button>
                    </div>
                  </div>}
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          {/* Brand Toggle Card */}
          <Card className="border-l-4" style={{
          borderLeftColor: useBranding ? brandSettings.primaryColor : '#e5e7eb'
        }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                background: useBranding ? `linear-gradient(to right bottom, ${brandSettings.primaryColor}, ${brandSettings.secondaryColor})` : 'var(--tw-gradient-from)'
              }}>
                  <PaletteIcon size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Brand Styling
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {useBranding ? 'Your brand styling is applied' : 'Using default styling'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button onClick={toggleBranding} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useBranding ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} role="switch" aria-checked={useBranding}>
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useBranding ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </Card>
          <Card title="Video Preview">
            <div className="space-y-4">
              <div className="aspect-[9/16] rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
                {videoPreview ? <>
                    <img src={videoPreview} alt="Video preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="neon" size="lg" className="rounded-full w-12 h-12 p-0" onClick={() => setIsPlaying(!isPlaying)} style={useBranding ? {
                    backgroundColor: brandSettings.primaryColor
                  } : {}}>
                        {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                      </Button>
                    </div>
                    {/* Branded overlay with logo if branding is enabled */}
                    {useBranding && brandSettings.logo && <div className="absolute top-4 left-4 max-w-[100px] max-h-[40px]">
                        <img src={brandSettings.logo} alt="Brand logo" className="max-w-full max-h-full object-contain" />
                      </div>}
                    <div className="absolute bottom-4 left-0 right-0 px-4 text-center">
                      <div className="backdrop-blur-sm text-white text-sm py-2 px-4 rounded-lg inline-block" style={useBranding ? {
                    backgroundColor: `${brandSettings.primaryColor}CC`,
                    fontFamily: brandSettings.fontPrimary,
                    border: `1px solid ${brandSettings.secondaryColor}40`
                  } : {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                  }}>
                        <TypeIcon size={14} className="inline mr-2" />
                        Text will appear here
                      </div>
                    </div>
                    {/* Dynamic Badge for AI Backgrounds */}
                    {hasAIBackground && <div className="absolute top-4 right-4 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg" style={{
                  backgroundColor: 'rgba(79, 70, 229, 0.9)'
                }}>
                        <SparklesIcon size={12} />
                        <span>Dynamic AI Background</span>
                      </div>}
                    {/* Show interactive elements badge if there are any */}
                    {interactiveElements.length > 0 && !hasAIBackground && <div className="absolute top-4 right-4 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg" style={useBranding ? {
                  backgroundColor: brandSettings.accentColor
                } : {
                  backgroundColor: 'rgba(79, 70, 229, 0.9)'
                }}>
                        <MousePointerClickIcon size={12} />
                        <span>Interactive</span>
                      </div>}
                    {/* Voice & Language badge */}
                    {activeTab === 'voiceover' && <div className="absolute top-4 right-4 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg" style={{
                  backgroundColor: 'rgba(79, 70, 229, 0.9)'
                }}>
                        <MicIcon size={12} />
                        <span>
                          {useMyVoice ? 'Your Voice' : getCurrentVoiceName()}
                        </span>
                        <span>•</span>
                        <span>{getCurrentLanguageName()}</span>
                      </div>}
                  </> : <div className="text-center p-6">
                    <VideoIcon size={48} className="mx-auto text-gray-400 mb-4" style={useBranding ? {
                  color: brandSettings.primaryColor
                } : {}} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fill out the form to generate a preview
                    </p>
                  </div>}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-1">
                  <strong>Resolution:</strong> 1080x1920 (9:16)
                </p>
                <p className="mb-1">
                  <strong>Format:</strong> MP4
                </p>
                <p>
                  <strong>Duration:</strong> {videoPreview ? '00:45' : '00:00'}
                </p>
              </div>
              {/* Features List */}
              <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video Features
                </h4>
                <div className="space-y-2">
                  {hasAIBackground && <div className="flex items-center gap-2 text-xs p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/20">
                      <SparklesIcon size={14} className="text-indigo-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Dynamic AI Background
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          AI-generated scene visuals
                        </p>
                      </div>
                    </div>}
                  {interactiveElements.length > 0 && <div className="flex items-center gap-2 text-xs p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                      <MousePointerClickIcon size={14} className="text-emerald-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Interactive Elements
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {interactiveElements.length} interactive element
                          {interactiveElements.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>}
                  {useMyVoice && hasClonedVoice && <div className="flex items-center gap-2 text-xs p-2 rounded-md bg-purple-50 dark:bg-purple-900/20">
                      <MicIcon size={14} className="text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Personal Voice Clone
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Your voice is being used
                        </p>
                      </div>
                    </div>}
                </div>
              </div>
              {/* Voice Information */}
              {activeTab === 'voiceover' && useMyVoice && hasClonedVoice && <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Voice
                  </h4>
                  <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                          <MicIcon size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            Personal Voice Clone
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            5 samples • Good quality
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7" leftIcon={<RefreshCwIcon size={12} />} onClick={() => setShowVoiceTrainingModal(true)}>
                        Improve
                      </Button>
                    </div>
                  </div>
                </div>}
            </div>
          </Card>
          {/* Brand Preview Card */}
          {useBranding && videoPreview && <Card title="Brand Preview">
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium" style={{
                  color: brandSettings.primaryColor
                }}>
                      Brand Elements
                    </h4>
                    <CheckIcon size={16} className="text-green-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">
                        Colors
                      </p>
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded-full" style={{
                      backgroundColor: brandSettings.primaryColor
                    }}></div>
                        <div className="w-5 h-5 rounded-full" style={{
                      backgroundColor: brandSettings.secondaryColor
                    }}></div>
                        <div className="w-5 h-5 rounded-full" style={{
                      backgroundColor: brandSettings.accentColor
                    }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">
                        Typography
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {brandSettings.fontPrimary.charAt(0).toUpperCase() + brandSettings.fontPrimary.slice(1)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 dark:text-gray-400 mb-1">
                        Voice Tone
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {brandSettings.voiceTone.charAt(0).toUpperCase() + brandSettings.voiceTone.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your brand styling is applied to this video. You can toggle
                  branding on/off using the switch above.
                </p>
                <Button variant="outline" size="sm" className="w-full" as={Link} to="/settings">
                  Edit Brand Settings
                </Button>
              </div>
            </Card>}
        </div>
      </div>
      <InteractiveElementSidebar isOpen={showInteractivePanel} onClose={() => setShowInteractivePanel(false)} onAddElement={handleAddInteractiveElement} currentTime={currentTime} />
      <VoiceTrainingModal isOpen={showVoiceTrainingModal} onClose={() => setShowVoiceTrainingModal(false)} onComplete={handleVoiceTrainingComplete} />
    </div>;
};
