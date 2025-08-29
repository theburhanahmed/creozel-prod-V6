import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusIcon, SearchIcon, SmileIcon, PaperclipIcon, SendIcon, InfoIcon, PhoneIcon, VideoIcon, ChevronLeftIcon, MoreVerticalIcon, CheckIcon, CheckCheckIcon, ImageIcon, FileIcon, MicIcon } from 'lucide-react';
import { MessageList } from '../components/messaging/MessageList';
import { ConversationList } from '../components/messaging/ConversationList';
import { MessageInput } from '../components/messaging/MessageInput';
import { MessageHeader } from '../components/messaging/MessageHeader';
import { ConversationSearch } from '../components/messaging/ConversationSearch';
export const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showConversationList, setShowConversationList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setShowConversationList(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (activeConversation) {
      // Simulate typing indicator after selecting a conversation
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeConversation]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);
  const handleSelectConversation = conversation => {
    setActiveConversation(conversation);
    if (isMobileView) {
      setShowConversationList(false);
    }
  };
  const handleBack = () => {
    setShowConversationList(true);
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your conversations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" leftIcon={<PlusIcon size={16} />} className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
            New Message
          </Button>
        </div>
      </div>
      <div className="flex h-[calc(100vh-200px)] min-h-[500px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
        {/* Conversations List - Show on desktop or when in mobile view and no active conversation */}
        {(showConversationList || !isMobileView) && <div className={`${isMobileView ? 'w-full' : 'w-1/3 border-r border-gray-200 dark:border-gray-700'} flex flex-col`}>
            <ConversationSearch />
            <ConversationList onSelectConversation={handleSelectConversation} activeConversationId={activeConversation?.id} />
          </div>}
        {/* Message Thread - Show when there's an active conversation */}
        {activeConversation && (!showConversationList || !isMobileView) ? <div className={`${isMobileView ? 'w-full' : 'w-2/3'} flex flex-col`}>
            <MessageHeader conversation={activeConversation} onBack={handleBack} showBackButton={isMobileView} />
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/30">
              <MessageList conversation={activeConversation} isTyping={isTyping} />
              <div ref={messagesEndRef} />
            </div>
            <MessageInput onSend={scrollToBottom} />
          </div> : !showConversationList ? <div className="w-full flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
                <SendIcon size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No conversation selected
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Choose a conversation from the list or start a new one
              </p>
              <Button variant="outline" onClick={() => setShowConversationList(true)} className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                View Conversations
              </Button>
            </div>
          </div> : <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
                <SendIcon size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a conversation from the list or start a new one
              </p>
            </div>
          </div>}
      </div>
    </div>;
};
