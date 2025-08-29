import React, { useState } from 'react';
import { Type as TypeIcon, AlignLeft as AlignLeftIcon, Bold as BoldIcon, Italic as ItalicIcon, List as ListIcon, Link as LinkIcon, Image as ImageIcon, Clock as ClockIcon, MessageSquare as MessageSquareIcon, ExternalLink as ExternalLinkIcon, ChevronDown as ChevronDownIcon, Check as CheckIcon, Sparkles as SparklesIcon, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { AIEnhancementPanel } from './AIEnhancementPanel';
interface RichTextViewerProps {
  content: string;
  format: 'blog' | 'email';
  metadata?: {
    title?: string;
    readTime?: number;
    subjectLine?: string;
    previewText?: string;
  };
}
export const RichTextViewer: React.FC<RichTextViewerProps> = ({
  content,
  format,
  metadata
}) => {
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [showPersonalizationMenu, setShowPersonalizationMenu] = useState<boolean>(false);
  const [showToneMenu, setShowToneMenu] = useState<boolean>(false);
  const [selectedTone, setSelectedTone] = useState<string>('professional');
  const [showAIPanel, setShowAIPanel] = useState<boolean>(false);
  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');
  const tones = [{
    id: 'professional',
    name: 'Professional',
    icon: <TypeIcon size={14} />
  }, {
    id: 'friendly',
    name: 'Friendly',
    icon: <MessageSquareIcon size={14} />
  }, {
    id: 'bold',
    name: 'Bold',
    icon: <BoldIcon size={14} />
  }];
  const personalizationTokens = [{
    id: 'first_name',
    name: 'First Name',
    example: 'John'
  }, {
    id: 'last_name',
    name: 'Last Name',
    example: 'Doe'
  }, {
    id: 'company',
    name: 'Company',
    example: 'Acme Inc.'
  }, {
    id: 'custom_field',
    name: 'Custom Field',
    example: 'Value'
  }];
  const handleAddCTA = () => {
    // In a real implementation, this would add a CTA to the content
    alert('Adding CTA button to content');
  };
  const handleAddBullets = () => {
    // In a real implementation, this would convert text to bullets
    alert('Converting section to bullet points');
  };
  const handleToneChange = (tone: string) => {
    setSelectedTone(tone);
    setShowToneMenu(false);
    // In a real implementation, this would change the tone of the content
    alert(`Changing tone to ${tone}`);
  };
  const handleInsertToken = (token: string) => {
    // In a real implementation, this would insert a personalization token
    alert(`Inserting ${token} token`);
    setShowPersonalizationMenu(false);
  };
  return <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Metadata Bar */}
      {metadata && <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {metadata.readTime !== undefined && <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <ClockIcon size={12} className="mr-1" />
                <span>{metadata.readTime} min read</span>
              </div>}
            {format === 'email' && metadata.subjectLine && <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Subject:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metadata.subjectLine}
                </span>
              </div>}
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400" onClick={() => setEditingMode(!editingMode)}>
            {editingMode ? 'Exit Edit Mode' : 'Edit Content'}
          </Button>
        </div>}
      {/* Formatting Toolbar - Only visible in edit mode */}
      {editingMode && <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 flex flex-wrap gap-1">
          <Button variant="ghost" size="sm" className="!p-1.5">
            <BoldIcon size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="!p-1.5">
            <ItalicIcon size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="!p-1.5">
            <AlignLeftIcon size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="!p-1.5">
            <LinkIcon size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="!p-1.5">
            <ImageIcon size={14} />
          </Button>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <div className="relative">
            <Button variant="ghost" size="sm" className="!py-1.5 flex items-center gap-1" onClick={() => setShowToneMenu(!showToneMenu)}>
              {tones.find(t => t.id === selectedTone)?.icon}
              <span className="text-xs">
                {tones.find(t => t.id === selectedTone)?.name} Tone
              </span>
              <ChevronDownIcon size={12} />
            </Button>
            {showToneMenu && <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 w-48">
                <div className="py-1">
                  {tones.map(tone => <button key={tone.id} className={`flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedTone === tone.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => handleToneChange(tone.id)}>
                      <span className="mr-2">{tone.icon}</span>
                      {tone.name}
                      {selectedTone === tone.id && <CheckIcon size={14} className="ml-auto" />}
                    </button>)}
                </div>
              </div>}
          </div>
          <Button variant="ghost" size="sm" className="!py-1.5 flex items-center gap-1" onClick={handleAddBullets}>
            <ListIcon size={14} />
            <span className="text-xs">Add Bullets</span>
          </Button>
          <Button variant="ghost" size="sm" className="!py-1.5 flex items-center gap-1" onClick={handleAddCTA}>
            <ExternalLinkIcon size={14} />
            <span className="text-xs">Add CTA</span>
          </Button>
          {format === 'email' && <div className="relative">
              <Button variant="ghost" size="sm" className="!py-1.5 flex items-center gap-1" onClick={() => setShowPersonalizationMenu(!showPersonalizationMenu)}>
                <UserIcon size={14} />
                <span className="text-xs">Personalize</span>
                <ChevronDownIcon size={12} />
              </Button>
              {showPersonalizationMenu && <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 w-56">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      Insert Personalization Token
                    </div>
                    {personalizationTokens.map(token => <button key={token.id} className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" onClick={() => handleInsertToken(token.id)}>
                        <span>{token.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {`{{${token.id}}}`}
                        </span>
                      </button>)}
                  </div>
                </div>}
            </div>}
        </div>}
      {/* Email Preview Text - Only for email format */}
      {format === 'email' && metadata?.previewText && <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Preview text:
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {metadata.previewText}
            </span>
          </div>
        </div>}
      {/* Content */}
      <div className="p-6">
        {metadata?.title && <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {metadata.title}
          </h2>}
        <div className="prose dark:prose-invert prose-sm max-w-none">
          {paragraphs.map((paragraph, index) => {
          // Check if paragraph is a heading
          if (paragraph.startsWith('# ')) {
            return <h2 key={index} className="text-lg font-bold mt-4 mb-2">
                  {paragraph.replace('# ', '')}
                </h2>;
          }
          // Check if paragraph is a subheading
          if (paragraph.startsWith('## ')) {
            return <h3 key={index} className="text-md font-bold mt-3 mb-2">
                  {paragraph.replace('## ', '')}
                </h3>;
          }
          // Check if paragraph is a list
          if (paragraph.includes('\n- ')) {
            const [listTitle, ...listItems] = paragraph.split('\n- ');
            return <div key={index} className="my-3">
                  {listTitle && <p className="mb-2">{listTitle}</p>}
                  <ul className="list-disc pl-4 space-y-1">
                    {listItems.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>;
          }
          // Regular paragraph
          return <p key={index} className="mb-4">
                {paragraph}
              </p>;
        })}
          {/* Example CTA button that might be added */}
          {format === 'blog' && <div className="my-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-lg">
              <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                Want to learn more?
              </p>
              <Button variant="primary" className="mt-2" rightIcon={<ExternalLinkIcon size={14} />}>
                Read the Full Guide
              </Button>
            </div>}
          {/* Example personalization in email */}
          {format === 'email' && <div className="my-6">
              <p>Best regards,</p>
              <p>
                The Team at <strong>Your Company</strong>
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="primary" className="w-full mb-3" rightIcon={<ExternalLinkIcon size={14} />}>
                  Get Started Today
                </Button>
              </div>
            </div>}
        </div>
      </div>
      {/* AI Enhancement Button */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <Button variant="outline" leftIcon={<SparklesIcon size={14} className="text-indigo-500" />} onClick={() => setShowAIPanel(true)}>
          Enhance with AI
        </Button>
      </div>
      {/* AI Enhancement Panel */}
      <AIEnhancementPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} contentFormat={format} contentTitle={metadata?.title} />
    </div>;
};
