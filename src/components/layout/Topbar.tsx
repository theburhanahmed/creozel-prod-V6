import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, BellIcon, MailIcon, HelpCircleIcon, SettingsIcon, LogOutIcon, ChevronDownIcon, SunIcon, MoonIcon, CheckIcon, ClockIcon, XIcon, DollarSignIcon, CreditCardIcon, PlusCircleIcon, BarChart2Icon, TrendingUpIcon, RefreshCwIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../hooks/useCredits';

interface TopbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleMenu: () => void;
  isMobile: boolean;
}

export const Topbar = ({
  isDarkMode,
  toggleDarkMode,
  toggleMenu,
  isMobile
}: TopbarProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMailbox, setShowMailbox] = useState(false);
  const [showCreditsMenu, setShowCreditsMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mailboxRef = useRef<HTMLDivElement>(null);
  const creditsMenuRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { creditsInfo, refreshCredits } = useCredits();
  // Add messages data
  const messages = [{
    id: 1,
    sender: 'Alex Thompson',
    subject: 'Project Update',
    preview: "Hey, I've just reviewed the latest...",
    time: '10:30 AM',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    id: 2,
    sender: 'Sarah Wilson',
    subject: 'Design Review',
    preview: 'The new designs look great! Just a few...',
    time: 'Yesterday',
    unread: false,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    id: 3,
    sender: 'Mark Davis',
    subject: 'Team Meeting',
    preview: 'Reminder: Team sync tomorrow at...',
    time: '2 days ago',
    unread: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }];
  // Add notifications data
  const notifications = [{
    id: 1,
    title: 'New Follower',
    message: 'John Smith started following you',
    time: 'Just now',
    read: false
  }, {
    id: 2,
    title: 'Content Published',
    message: "Your video 'Getting Started with AI' is now live",
    time: '2 hours ago',
    read: false
  }, {
    id: 3,
    title: 'Analytics Update',
    message: 'Your latest post reached 1,000 views',
    time: 'Yesterday',
    read: true
  }];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (mailboxRef.current && !mailboxRef.current.contains(event.target as Node)) {
        setShowMailbox(false);
      }
      if (creditsMenuRef.current && !creditsMenuRef.current.contains(event.target as Node)) {
        setShowCreditsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return <div className="fixed top-0 right-0 left-16 h-16 z-30">
      {/* Main topbar container - matching CardMenu style */}
      <div className="mx-4 mt-4 p-2 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-xl shadow-lg flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4 pl-2">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              C
            </div>
            {/* Company name */}
            <h1 className="text-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text transform hover:scale-105 transition-transform duration-300">
              Creozel
            </h1>
          </div>
          <div className="h-6 w-px bg-gray-200/20 dark:bg-gray-700/20" />
          <div className="relative"></div>
        </div>
        {/* Right section */}
        <div className="flex items-center gap-1 pr-2">
          {/* Credits button */}
          <div className="relative" ref={creditsMenuRef}>
            <button 
              className="relative flex justify-center items-center w-auto px-2 h-9 rounded-lg overflow-hidden z-10 transition-all duration-300 ease-in-out hover:bg-gray-100/10 dark:hover:bg-gray-800/20" 
              onClick={() => {
                setShowCreditsMenu(!showCreditsMenu);
                setShowMailbox(false);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              disabled={creditsInfo.loading}
            >
              <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                <span className="text-sm font-medium text-green-500">
                  Credits:
                </span>
                {creditsInfo.loading ? (
                  <div className="flex items-center gap-1">
                    <RefreshCwIcon size={12} className="animate-spin text-gray-500" />
                    <span className="text-sm font-medium text-gray-500">...</span>
                  </div>
                ) : creditsInfo.error ? (
                  <span className="text-sm font-medium text-red-500">Error</span>
                ) : (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {creditsInfo.balance}
                  </span>
                )}
              </span>
            </button>
            {/* Credits dropdown */}
            {showCreditsMenu && <div className="absolute right-0 mt-2 w-64 py-2 bg-white/[0.02] dark:bg-[#1A2234]/90 rounded-xl shadow-lg border border-white/[0.05] backdrop-blur-xl z-50 animate-in">
                <div className="px-4 py-2 border-b border-gray-200/10 dark:border-gray-700/30">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Credits Balance
                    </p>
                    <div className="flex items-center gap-2">
                      {creditsInfo.loading ? (
                        <RefreshCwIcon size={14} className="animate-spin text-gray-500" />
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            refreshCredits();
                          }}
                          className="p-1 hover:bg-gray-100/10 dark:hover:bg-gray-800/20 rounded transition-colors"
                          title="Refresh credits"
                        >
                          <RefreshCwIcon size={14} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                      )}
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {creditsInfo.loading ? '...' : creditsInfo.balance}
                      </span>
                    </div>
                  </div>
                  {creditsInfo.error ? (
                    <p className="text-xs text-red-500 mt-1">
                      {creditsInfo.error}
                    </p>
                  ) : creditsInfo.lastPurchase ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last purchase: {creditsInfo.lastPurchase}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      No purchase history
                    </p>
                  )}
                </div>
                <div className="py-1">
                  <Link to="/credits/add" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/10 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                    <PlusCircleIcon size={16} className="mr-2 text-green-500 dark:text-green-400" />
                    <span className="text-sm">Add Credits</span>
                  </Link>
                  <Link to="/credits/transactions" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/10 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                    <TrendingUpIcon size={16} className="mr-2 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm">Transaction History</span>
                  </Link>
                  <Link to="/credits/usage" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/10 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                    <BarChart2Icon size={16} className="mr-2 text-purple-500 dark:text-purple-400" />
                    <span className="text-sm">Usage History</span>
                  </Link>
                </div>
              </div>}
          </div>
          {/* Theme Toggle - Matching CardMenu button style */}
          <button onClick={toggleDarkMode} className="relative flex justify-center items-center w-9 h-9 rounded-lg overflow-hidden z-10 hover:w-[110px] transition-all duration-300 ease-in-out group">
            <span className="absolute left-[12px] w-6 h-6 flex-shrink-0 z-20 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110">
              {isDarkMode ? <SunIcon size={18} className="text-yellow-400" /> : <MoonIcon size={18} />}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            <span className="text-sm text-gray-700 dark:text-gray-300 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out text-center pl-7 w-full opacity-0 group-hover:opacity-100">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          </button>
          {/* Mail button */}
          <div className="relative" ref={mailboxRef}>
            <button className="relative flex justify-center items-center w-9 h-9 rounded-lg overflow-hidden z-10 hover:w-[110px] transition-all duration-300 ease-in-out group" onClick={() => {
            setShowMailbox(!showMailbox);
            setShowNotifications(false);
            setShowProfileMenu(false);
            setShowCreditsMenu(false);
          }}>
              <span className="absolute left-[12px] w-6 h-6 flex-shrink-0 z-20 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110">
                <MailIcon size={18} />
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
              <span className="text-sm text-gray-700 dark:text-gray-300 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out text-center pl-7 w-full opacity-0 group-hover:opacity-100">
                Mail
              </span>
            </button>
            {/* Mail dropdown - keeping existing content */}
            {showMailbox && <div className="absolute right-0 mt-2 w-80 py-2 bg-white/[0.02] dark:bg-[#1A2234]/90 rounded-xl shadow-lg border border-white/[0.05] backdrop-blur-xl z-50 animate-in">
                <div className="px-4 py-2 border-b border-gray-200/10 dark:border-gray-700/30 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Messages
                  </p>
                  <Link to="/messages" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    View All
                  </Link>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {messages.map(message => <div key={message.id} className={`px-4 py-3 hover:bg-white/[0.02] dark:hover:bg-gray-800/30 transition-colors cursor-pointer ${message.unread ? 'bg-indigo-500/5 dark:bg-indigo-900/10' : ''}`}>
                      <div className="flex gap-3">
                        <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {message.sender}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                              {message.time}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {message.preview}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}
          </div>
          {/* Notifications button */}
          <div className="relative" ref={notificationsRef}>
            <button className="relative flex justify-center items-center w-9 h-9 rounded-lg overflow-hidden z-10 hover:w-[110px] transition-all duration-300 ease-in-out group" onClick={() => {
            setShowNotifications(!showNotifications);
            setShowMailbox(false);
            setShowProfileMenu(false);
            setShowCreditsMenu(false);
          }}>
              <span className="absolute left-[12px] w-6 h-6 flex-shrink-0 z-20 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110">
                <BellIcon size={18} />
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
              <span className="text-sm text-gray-700 dark:text-gray-300 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out text-center pl-7 w-full opacity-0 group-hover:opacity-100">
                Alerts
              </span>
            </button>
            {/* Notifications dropdown - keeping existing content */}
            {showNotifications && <div className="absolute right-0 mt-2 w-80 py-2 bg-white/[0.02] dark:bg-[#1A2234]/90 rounded-xl shadow-lg border border-white/[0.05] backdrop-blur-xl z-50 animate-in">
                <div className="px-4 py-2 border-b border-gray-200/10 dark:border-gray-700/30 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications
                  </p>
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.map(notification => <div key={notification.id} className={`px-4 py-3 hover:bg-white/[0.02] dark:hover:bg-gray-800/30 transition-colors relative ${!notification.read ? 'bg-indigo-500/5 dark:bg-indigo-900/10' : ''}`}>
                      {!notification.read && <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full"></span>}
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                          <ClockIcon size={12} className="mr-1" />
                          {notification.time}
                        </span>
                        {!notification.read && <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                            Mark as read
                          </button>}
                      </div>
                    </div>)}
                </div>
              </div>}
          </div>
          {/* Profile button */}
          <div className="relative" ref={profileMenuRef}>
            <button className="relative flex justify-center items-center w-9 h-9 rounded-lg overflow-hidden z-10 hover:w-[110px] transition-all duration-300 ease-in-out group" onClick={() => {
            setShowProfileMenu(!showProfileMenu);
            setShowNotifications(false);
            setShowMailbox(false);
            setShowCreditsMenu(false);
          }}>
              <span className="absolute left-[12px] w-6 h-6 flex-shrink-0 z-20">
                {user?.avatar ? (
                  <img src={user.avatar} alt="User avatar" className="w-6 h-6 rounded-full object-cover border border-white/[0.05]" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border border-white/[0.05]">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
              <span className="text-sm text-gray-700 dark:text-gray-300 translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out text-center pl-7 w-full opacity-0 group-hover:opacity-100">
                Profile
              </span>
            </button>
            {/* Profile dropdown - keeping existing content */}
            {showProfileMenu && <div className="absolute right-0 mt-2 w-48 py-2 bg-white/[0.02] dark:bg-[#1A2234]/90 rounded-xl shadow-lg border border-white/[0.05] backdrop-blur-xl z-50 animate-in">
                <div className="px-4 py-2 border-b border-gray-200/10 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || 'No email'}
                  </p>
                </div>
                <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/10 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 hover:translate-x-1">
                  <SettingsIcon size={16} className="mr-2" />
                  <span className="text-sm">Settings</span>
                </Link>
                <Link to="/help" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/10 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 hover:translate-x-1">
                  <HelpCircleIcon size={16} className="mr-2" />
                  <span className="text-sm">Help</span>
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/auth/login', { replace: true });
                  }}
                  className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100/10 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 hover:translate-x-1"
                >
                  <LogOutIcon size={16} className="mr-2" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
