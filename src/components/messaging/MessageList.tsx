import React from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
interface Message {
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
}
interface MessageListProps {
  conversation: any;
  isTyping: boolean;
}
export const MessageList: React.FC<MessageListProps> = ({
  conversation,
  isTyping
}) => {
  // Mock message data for the selected conversation
  const messages: Message[] = [{
    id: '1',
    text: 'Hi there! How are you doing today?',
    sender: 'other',
    timestamp: '10:30 AM',
    status: 'read'
  }, {
    id: '2',
    text: "I'm doing well, thanks for asking! How about you?",
    sender: 'user',
    timestamp: '10:32 AM',
    status: 'read'
  }, {
    id: '3',
    text: "I'm great! I wanted to discuss the upcoming project with you.",
    sender: 'other',
    timestamp: '10:33 AM',
    status: 'read'
  }, {
    id: '4',
    text: "Sure, I'd love to talk about it. What aspects specifically?",
    sender: 'user',
    timestamp: '10:35 AM',
    status: 'read'
  }, {
    id: '5',
    text: "I've been working on some initial designs and wanted to get your feedback before the team meeting tomorrow.",
    sender: 'other',
    timestamp: '10:36 AM',
    status: 'read',
    attachments: [{
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      name: 'Design Preview'
    }]
  }, {
    id: '6',
    text: 'These look amazing! I especially like the color scheme you chose.',
    sender: 'user',
    timestamp: '10:40 AM',
    status: 'read'
  }, {
    id: '7',
    text: 'Thanks! I was inspired by our brand guidelines but wanted to give it a fresh twist.',
    sender: 'other',
    timestamp: '10:41 AM',
    status: 'read'
  }, {
    id: '8',
    text: "I've also prepared a document with all the requirements and specifications.",
    sender: 'other',
    timestamp: '10:42 AM',
    status: 'read',
    attachments: [{
      type: 'file',
      url: '#',
      name: 'Project_Requirements.pdf',
      size: '2.4 MB'
    }]
  }, {
    id: '9',
    text: "Perfect, I'll review this today and get back to you with my thoughts.",
    sender: 'user',
    timestamp: '10:42 AM',
    status: 'delivered'
  }];
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp.includes('AM') || message.timestamp.includes('PM') ? 'Today' : message.timestamp;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  return <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, messages]) => <div key={date} className="space-y-3">
          <div className="flex justify-center">
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
              {date}
            </span>
          </div>
          {messages.map((message: Message) => <MessageBubble key={message.id} message={message} />)}
        </div>)}
      {isTyping && <div className="pl-12 mt-2">
          <TypingIndicator name={conversation.name} avatar={conversation.avatar} />
        </div>}
    </div>;
};