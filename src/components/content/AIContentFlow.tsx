import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles as SparklesIcon, Send as SendIcon, Edit as EditIcon, Loader2Icon, Save as SaveIcon, Download as DownloadIcon } from 'lucide-react';
interface AIContentFlowProps {
  type: 'text' | 'image' | 'audio' | 'video';
  onGenerate: (prompt: string) => void;
  onEdit: () => void;
  isGenerating: boolean;
  isPreview: boolean;
  previewContent: React.ReactNode;
  editorContent: React.ReactNode;
}
export const AIContentFlow = ({
  type,
  onGenerate,
  onEdit,
  isGenerating,
  isPreview,
  previewContent,
  editorContent
}: AIContentFlowProps) => {
  const [prompt, setPrompt] = useState('');
  const getTypeDetails = () => {
    switch (type) {
      case 'text':
        return {
          title: 'Generate Text Content',
          placeholder: 'Write a blog post about...',
          gradient: 'from-blue-500 to-indigo-600',
          color: 'text-blue-500',
          shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'
        };
      case 'image':
        return {
          title: 'Generate Image',
          placeholder: 'Create an image of...',
          gradient: 'from-purple-500 to-pink-500',
          color: 'text-purple-500',
          shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]'
        };
      case 'audio':
        return {
          title: 'Generate Audio',
          placeholder: 'Create a podcast intro about...',
          gradient: 'from-amber-500 to-orange-500',
          color: 'text-amber-500',
          shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]'
        };
      case 'video':
        return {
          title: 'Generate Video',
          placeholder: 'Create a video explaining...',
          gradient: 'from-emerald-500 to-teal-500',
          color: 'text-emerald-500',
          shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]'
        };
    }
  };
  const details = getTypeDetails();
  if (isPreview) {
    return <div className="space-y-4 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-medium ${details.color} text-neon`}>
            AI Generated Preview
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<EditIcon size={16} className={details.color} />} onClick={onEdit} className="hover:scale-105 transition-transform backdrop-blur-sm">
              Edit Content
            </Button>
            <Button variant="neon" size="sm" leftIcon={<SaveIcon size={16} />} className="hover:scale-105 transition-transform">
              Save
            </Button>
            <Button variant="outline" size="sm" leftIcon={<DownloadIcon size={16} className={details.color} />} className="hover:scale-105 transition-transform backdrop-blur-sm">
              Export
            </Button>
          </div>
        </div>
        <Card blur glow className="transition-all duration-300 animate-float">
          {previewContent}
        </Card>
      </div>;
  }
  if (isGenerating) {
    return <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 dark:border-purple-500/30 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 animate-gradient" />
        <div className="relative p-8 flex flex-col items-center justify-center">
          <Loader2Icon size={40} className={`animate-spin ${details.color} mb-4`} />
          <p className={`${details.color} text-neon text-lg font-medium`}>
            Generating your {type} content...
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            This might take a moment
          </p>
        </div>
      </Card>;
  }
  return editorContent || <Card blur className="border border-indigo-500/20 dark:border-purple-500/30 relative overflow-hidden animate-float">
        <div className="absolute -inset-[10px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl animate-gradient" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${details.gradient} flex items-center justify-center text-white ${details.shadow} transition-all duration-300 hover:scale-110 relative overflow-hidden group animate-float`} style={{
          transform: 'translateZ(10px)',
          transformStyle: 'preserve-3d'
        }}>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <SparklesIcon size={20} className="relative z-10 animate-pulse-slow" style={{
            transform: 'translateZ(5px)'
          }} />
              <div className="absolute -inset-[100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_65%,white_75%_80%,transparent_100%)] opacity-30"></div>
            </div>
            <div>
              <h3 className={`text-lg font-medium ${details.color} text-neon`}>
                {details.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Describe what you want to create
              </p>
            </div>
          </div>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={details.placeholder} className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-indigo-200/30 dark:border-indigo-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white resize-none h-32 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.1)] dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]" style={{
        transform: 'translateZ(2px)',
        transformStyle: 'preserve-3d'
      }} />
          <div className="flex justify-end">
            <Button variant="neon" onClick={() => onGenerate(prompt)} disabled={!prompt.trim()} leftIcon={<SendIcon size={16} />} className="transition-all duration-300 hover:scale-105 animate-float">
              Generate
            </Button>
          </div>
        </div>
      </Card>;
};