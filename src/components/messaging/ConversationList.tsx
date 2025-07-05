import React from 'react';
import { Badge } from '../ui/Badge';
import { CheckCheckIcon, CheckIcon, ClockIcon, PinIcon } from 'lucide-react';
interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'read' | 'delivered' | 'sent' | 'pending';
  isOnline: boolean;
  isPinned: boolean;
}
interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  activeConversationId?: string;
}
export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  activeConversationId
}) => {
  // Mock conversation data
  const conversations: Conversation[] = [{
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
    lastMessage: 'Can you send me the latest design files?',
    timestamp: '10:42 AM',
    unreadCount: 3,
    status: 'read',
    isOnline: true,
    isPinned: true
  }, {
    id: '2',
    name: 'Alex Wong',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    lastMessage: 'Great job on the presentation yesterday!',
    timestamp: '9:30 AM',
    unreadCount: 0,
    status: 'delivered',
    isOnline: true,
    isPinned: false
  }, {
    id: '3',
    name: 'Marketing Team',
    avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=150&auto=format&fit=crop&q=60',
    lastMessage: 'We need to discuss the campaign metrics',
    timestamp: 'Yesterday',
    unreadCount: 1,
    status: 'sent',
    isOnline: false,
    isPinned: true
  }, {
    id: '4',
    name: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    lastMessage: "I've updated the project timeline",
    timestamp: 'Yesterday',
    unreadCount: 0,
    status: 'read',
    isOnline: false,
    isPinned: false
  }, {
    id: '5',
    name: 'Emma Chen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60',
    lastMessage: 'The client approved our proposal!',
    timestamp: 'Monday',
    unreadCount: 0,
    status: 'read',
    isOnline: true,
    isPinned: false
  }, {
    id: '6',
    name: 'Tech Support',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60',
    lastMessage: 'Your ticket #4578 has been resolved',
    timestamp: 'Monday',
    unreadCount: 0,
    status: 'delivered',
    isOnline: true,
    isPinned: false
  }, {
    id: '7',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
    lastMessage: 'Looking forward to our meeting tomorrow',
    timestamp: 'Last Week',
    unreadCount: 0,
    status: 'read',
    isOnline: false,
    isPinned: false
  }];
  // Sort conversations - pinned first, then by timestamp/unread
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    return 0;
  });
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <CheckCheckIcon size={14} className="text-emerald-500" />;
      case 'delivered':
        return <CheckCheckIcon size={14} className="text-gray-400" />;
      case 'sent':
        return <CheckIcon size={14} className="text-gray-400" />;
      case 'pending':
        return <ClockIcon size={14} className="text-gray-400" />;
      default:
        return null;
    }
  };
  return <div className="flex-1 overflow-y-auto">
      {sortedConversations.map(conversation => <div key={conversation.id} className={`flex items-start gap-3 p-3 cursor-pointer transition-colors relative
      ${conversation.id === activeConversationId ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`} onClick={() => onSelectConversation(conversation)}>
          <div className="relative">
            <img src={conversation.avatar} alt={conversation.name} className="w-12 h-12 rounded-full object-cover" />
            {conversation.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className={`font-medium truncate ${conversation.unreadCount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {conversation.name}
              </h3>
              <span className={`text-xs whitespace-nowrap ml-2 ${conversation.unreadCount > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {conversation.timestamp}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {conversation.lastMessage}
              </p>
              <div className="flex items-center ml-2">
                {conversation.unreadCount > 0 ? <Badge value={conversation.unreadCount} /> : getStatusIcon(conversation.status)}
              </div>
            </div>
          </div>
          {conversation.isPinned && <div className="absolute top-2 right-2 text-gray-400">
              <PinIcon size={12} className="transform rotate-45" />
            </div>}
        </div>)}
    </div>;
};