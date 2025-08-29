import React from 'react';
import { CheckIcon, CheckCheckIcon, FileIcon, ImageIcon, DownloadIcon } from 'lucide-react';
interface MessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
    attachments?: {
      type: 'image' | 'file';
      url: string;
      name?: string;
      size?: string;
    }[];
  };
}
export const MessageBubble: React.FC<MessageProps> = ({
  message
}) => {
  const isUser = message.sender === 'user';
  const getStatusIcon = () => {
    switch (message.status) {
      case 'read':
        return <CheckCheckIcon size={14} className="text-emerald-500" />;
      case 'delivered':
        return <CheckCheckIcon size={14} className="text-gray-400" />;
      case 'sent':
        return <CheckIcon size={14} className="text-gray-400" />;
      default:
        return null;
    }
  };
  return <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] space-y-1`}>
        {/* Message bubble */}
        <div className={`rounded-2xl p-3 shadow-sm 
            ${isUser ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'}
          `}>
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && <div className="space-y-2 mb-2">
              {message.attachments.map((attachment, index) => <div key={index}>
                  {attachment.type === 'image' ? <div className="rounded-lg overflow-hidden">
                      <img src={attachment.url} alt={attachment.name || 'Image attachment'} className="w-full h-auto" />
                    </div> : <div className={`flex items-center gap-2 p-2 rounded-md ${isUser ? 'bg-emerald-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${isUser ? 'bg-emerald-700' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        <FileIcon size={16} className={isUser ? 'text-emerald-300' : 'text-gray-500 dark:text-gray-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {attachment.name}
                        </p>
                        {attachment.size && <p className={`text-xs ${isUser ? 'text-emerald-200' : 'text-gray-500 dark:text-gray-400'}`}>
                            {attachment.size}
                          </p>}
                      </div>
                      <button className={`p-1 rounded-full ${isUser ? 'hover:bg-emerald-700' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                        <DownloadIcon size={16} className={isUser ? 'text-emerald-200' : 'text-gray-500 dark:text-gray-400'} />
                      </button>
                    </div>}
                </div>)}
            </div>}
          {/* Message text */}
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        {/* Timestamp and status */}
        <div className={`flex items-center text-xs gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-500 dark:text-gray-400">
            {message.timestamp}
          </span>
          {isUser && getStatusIcon()}
        </div>
      </div>
    </div>;
};
