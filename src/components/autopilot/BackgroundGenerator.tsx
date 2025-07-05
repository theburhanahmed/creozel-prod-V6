import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { ImageIcon, RefreshCwIcon, CheckIcon, Wand2Icon, SparklesIcon, LoaderIcon, XIcon } from 'lucide-react';
interface BackgroundGeneratorProps {
  onSelectBackground: (background: string) => void;
  selectedBackground?: string;
}
export const BackgroundGenerator = ({
  onSelectBackground,
  selectedBackground
}: BackgroundGeneratorProps) => {
  const [sceneContext, setSceneContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<string[]>([]);
  // Mock backgrounds for preview
  const mockBackgrounds = ['https://images.unsplash.com/photo-1532456745301-b2c645d8b80d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'];
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate background generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedBackgrounds(mockBackgrounds);
      toast.success('Backgrounds generated', {
        description: 'AI has created 4 background options for your video'
      });
    }, 2000);
  };
  const handleAutoGenerate = () => {
    setSceneContext(''); // Clear any existing context
    setIsGenerating(true);
    // Simulate automatic background generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedBackgrounds(mockBackgrounds.slice(0, 3)); // Fewer options for auto
      toast.success('Auto backgrounds generated', {
        description: 'AI has automatically created background options based on your script'
      });
    }, 1500);
  };
  const handleSelectBackground = (background: string) => {
    onSelectBackground(background);
    toast.success('Background selected', {
      description: 'Your selected background will be used for this scene'
    });
  };
  return <div className="space-y-4">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <Wand2Icon size={18} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Generate AI Background
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Create dynamic backgrounds for your video scenes
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scene Context
            </label>
            <div className="flex gap-2">
              <input type="text" value={sceneContext} onChange={e => setSceneContext(e.target.value)} placeholder="e.g., 'office workspace with modern tech' or 'abstract gradient'" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" disabled={isGenerating} />
              <Button variant="primary" onClick={handleGenerate} disabled={isGenerating || !sceneContext.trim()}>
                {isGenerating ? <>
                    <LoaderIcon size={16} className="mr-2 animate-spin" />
                    Generating...
                  </> : <>
                    <SparklesIcon size={16} className="mr-2" />
                    Generate
                  </>}
              </Button>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink px-3 text-xs text-gray-500 dark:text-gray-400">
              or
            </span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleAutoGenerate} disabled={isGenerating}>
            <RefreshCwIcon size={16} className="mr-2" />
            Auto-Generate from Script
          </Button>
        </div>
      </div>
      {generatedBackgrounds.length > 0 && <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Background
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {generatedBackgrounds.map((bg, index) => <div key={index} className={`
                  aspect-video rounded-lg overflow-hidden border-2 cursor-pointer relative
                  ${selectedBackground === bg ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}
                `} onClick={() => handleSelectBackground(bg)}>
                <img src={bg} alt={`Background option ${index + 1}`} className="w-full h-full object-cover" />
                {selectedBackground === bg && <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <CheckIcon size={14} className="text-white" />
                  </div>}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  <SparklesIcon size={10} className="inline mr-1" />
                  AI Generated
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
};