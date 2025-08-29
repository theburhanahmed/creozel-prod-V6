import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles as SparklesIcon, Send as SendIcon, Image as ImageIcon, FileText as FileTextIcon, Mic as MicIcon, Video as VideoIcon, Loader2Icon } from 'lucide-react';
interface AIGenerationPanelProps {
  type: 'text' | 'image' | 'audio' | 'video';
  onGenerate: (prompt: string) => void;
}
export const AIGenerationPanel = ({
  type,
  onGenerate
}: AIGenerationPanelProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      onGenerate(prompt);
      setIsGenerating(false);
      setShowPanel(false);
    }, 2000);
  };
  const getTypeIcon = () => {
    switch (type) {
      case 'text':
        return <FileTextIcon size={18} />;
      case 'image':
        return <ImageIcon size={18} />;
      case 'audio':
        return <MicIcon size={18} />;
      case 'video':
        return <VideoIcon size={18} />;
      default:
        return <SparklesIcon size={18} />;
    }
  };
  const getPlaceholder = () => {
    switch (type) {
      case 'text':
        return 'Write a blog post about the benefits of meditation...';
      case 'image':
        return 'Create an image of a sunset over mountains...';
      case 'audio':
        return 'Generate a podcast intro about technology trends...';
      case 'video':
        return 'Create a short video explaining quantum computing...';
      default:
        return 'Describe what you want to create...';
    }
  };
  const getTitle = () => {
    switch (type) {
      case 'text':
        return 'Generate Text Content';
      case 'image':
        return 'Generate Image Content';
      case 'audio':
        return 'Generate Audio Content';
      case 'video':
        return 'Generate Video Content';
      default:
        return 'Generate Content';
    }
  };
  const getGradient = () => {
    switch (type) {
      case 'text':
        return 'from-blue-500 to-indigo-600';
      case 'image':
        return 'from-purple-500 to-pink-500';
      case 'audio':
        return 'from-amber-500 to-orange-500';
      case 'video':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };
  if (!showPanel) return null;
  return <Card className="mb-6 border border-indigo-500/20 dark:border-purple-500/20 relative overflow-hidden">
      <div className="absolute -inset-[10px] bg-[var(--primary-glow)] opacity-20 blur-2xl"></div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/50 relative overflow-hidden group`} style={{
          transform: 'translateZ(10px)',
          transformStyle: 'preserve-3d'
        }}>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <SparklesIcon size={20} className="relative z-10" style={{
            transform: 'translateZ(5px)'
          }} />
            <div className="absolute -inset-[100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_65%,white_75%_80%,transparent_100%)] opacity-30"></div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {getTitle()}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Describe what you want to create and our AI will generate it for
              you
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={getPlaceholder()} className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white resize-none h-32 text-xs transition-all duration-300 focus:shadow-md" style={{
            transform: 'translateZ(2px)'
          }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {getTypeIcon()}
              <span>AI-powered {type} generation</span>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} leftIcon={isGenerating ? <Loader2Icon className="animate-spin" size={14} /> : <SendIcon size={14} />} size="sm" variant={type === 'text' ? 'primary' : type === 'image' ? 'secondary' : type === 'audio' ? 'danger' : 'primary'}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </div>
    </Card>;
};
