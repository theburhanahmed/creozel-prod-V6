import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { SmileIcon, PaperclipIcon, SendIcon, MicIcon, ImageIcon, FileIcon, XIcon, PlusIcon } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
interface MessageInputProps {
  onSend: () => void;
}
export const MessageInput: React.FC<MessageInputProps> = ({
  onSend
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      // In a real app, you would send the message to your API
      console.log('Sending message:', message, attachments);
      setMessage('');
      setAttachments([]);
      onSend();
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  return <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
      {/* Attachment preview */}
      {attachments.length > 0 && <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {attachments.map((file, index) => <div key={index} className="relative group">
              <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt="Attachment" className="w-full h-full object-cover" /> : <FileIcon size={24} className="text-gray-500" />}
              </div>
              <button className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeAttachment(index)}>
                <XIcon size={12} className="text-white" />
              </button>
            </div>)}
        </div>}
      {/* Input area */}
      <div className="flex items-end gap-2">
        <div className="relative">
          <Button variant="ghost" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" onClick={() => {
          setShowAttachmentOptions(!showAttachmentOptions);
          setShowEmojiPicker(false);
        }}>
            <PaperclipIcon size={20} />
          </Button>
          {/* Attachment options */}
          {showAttachmentOptions && <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-2 min-w-[150px]">
              <div className="space-y-1">
                <label className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                  <ImageIcon size={16} className="text-emerald-500" />
                  <span className="text-sm">Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <label className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                  <FileIcon size={16} className="text-blue-500" />
                  <span className="text-sm">Document</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
                <button className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <MicIcon size={16} className="text-red-500" />
                  <span className="text-sm">Voice Message</span>
                </button>
              </div>
            </div>}
        </div>
        <div className="relative flex-1">
          <textarea value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyPress} placeholder="Type a message..." className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" rows={1} style={{
          minHeight: '40px',
          maxHeight: '120px'
        }} />
          <Button variant="ghost" className="absolute right-2 bottom-1 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" onClick={() => {
          setShowEmojiPicker(!showEmojiPicker);
          setShowAttachmentOptions(false);
        }}>
            <SmileIcon size={20} />
          </Button>
          {/* Emoji picker */}
          {showEmojiPicker && <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>}
        </div>
        <Button variant={message.trim() || attachments.length > 0 ? 'primary' : 'outline'} className={`p-2 rounded-full ${message.trim() || attachments.length > 0 ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-gray-500 border-gray-300'}`} onClick={handleSend} disabled={!message.trim() && attachments.length === 0}>
          <SendIcon size={20} />
        </Button>
      </div>
    </div>;
};
