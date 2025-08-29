import React from 'react';
import { ChevronLeftIcon, PhoneIcon, VideoIcon, InfoIcon, MoreVerticalIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface MessageHeaderProps {
  conversation: any;
  onBack: () => void;
  showBackButton: boolean;
}
export const MessageHeader: React.FC<MessageHeaderProps> = ({
  conversation,
  onBack,
  showBackButton
}) => {
  return <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-800">
      {showBackButton && <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <ChevronLeftIcon size={20} />
        </button>}
      <div className="relative">
        <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full object-cover" />
        {conversation.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {conversation.name}
        </h3>
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          {conversation.isOnline ? 'Online' : 'Last seen recently'}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <PhoneIcon size={18} />
        </Button>
        <Button variant="ghost" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <VideoIcon size={18} />
        </Button>
        <Button variant="ghost" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <InfoIcon size={18} />
        </Button>
        <Button variant="ghost" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <MoreVerticalIcon size={18} />
        </Button>
      </div>
    </div>;
};
