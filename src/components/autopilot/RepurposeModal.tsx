// Dev-Rules §Component Standards
import { useState } from 'react';
import { IRepurposeConfig, TPlatform } from '../../types/autopilot';

interface RepurposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  originalContent: string;
  onRepurpose: (config: IRepurposeConfig) => Promise<void>;
}

export const RepurposeModal = ({ 
  isOpen, 
  onClose, 
  contentId,
  originalContent,
  onRepurpose
}: RepurposeModalProps) => {
  const [config, setConfig] = useState<IRepurposeConfig>({
    targetPlatforms: [],
    tone: 'professional',
    includeHashtags: true,
    includeEmojis: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onRepurpose(config);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const platformOptions: { value: TPlatform; label: string }[] = [
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Repurpose Content</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Platforms
            </label>
            <div className="space-y-2">
              {platformOptions.map((platform) => (
                <label key={platform.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.targetPlatforms.includes(platform.value)}
                    onChange={(e) => {
                      setConfig(prev => ({
                        ...prev,
                        targetPlatforms: e.target.checked
                          ? [...prev.targetPlatforms, platform.value]
                          : prev.targetPlatforms.filter(p => p !== platform.value)
                      }));
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{platform.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeHashtags"
                checked={config.includeHashtags}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, includeHashtags: e.target.checked }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="includeHashtags" className="ml-2 block text-sm text-gray-700">
                Include Hashtags
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeEmojis"
                checked={config.includeEmojis}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, includeEmojis: e.target.checked }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="includeEmojis" className="ml-2 block text-sm text-gray-700">
                Include Emojis
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || config.targetPlatforms.length === 0}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting || config.targetPlatforms.length === 0
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Generating...' : 'Generate Variations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
