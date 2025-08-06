// Dev-Rules §Component Standards: Example Implementation
'use client';

import { useState } from 'react';
import { RepurposeModal } from '../autopilot/RepurposeModal';
import { useRepurpose } from '../../hooks/useRepurpose';

export const ContentEditorExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { repurpose, isRepurposing, error } = useRepurpose();
  const [content, setContent] = useState('');
  const [repurposedContent, setRepurposedContent] = useState<Record<string, string>>({});

  const handleRepurpose = async (config: any) => {
    try {
      const result = await repurpose('example-content-123', config);
      setRepurposedContent(prev => ({
        ...prev,
        ...result.result
      }));
    } catch (err) {
      console.error('Failed to repurpose content:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Content Editor</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your content here..."
        />
      </div>

      <div className="flex justify-end mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={!content.trim()}
        >
          Repurpose Content
        </button>
      </div>

      {Object.keys(repurposedContent).length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Repurposed Content</h2>
          <div className="space-y-4">
            {Object.entries(repurposedContent).map(([platform, text]) => (
              <div key={platform} className="border rounded-lg p-4">
                <h3 className="font-medium capitalize mb-2">{platform}</h3>
                <p className="whitespace-pre-wrap">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <RepurposeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentId="example-content-123"
        originalContent={content}
        onRepurpose={handleRepurpose}
      />
    </div>
  );
};

export default ContentEditorExample;
