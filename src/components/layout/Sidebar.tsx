import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BarChart2Icon, CalendarIcon, MessageSquareIcon, UsersIcon, PenToolIcon, RocketIcon, GlobeIcon, FolderIcon } from 'lucide-react';
interface SidebarProps {
  id?: string;
  isVisible: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}
export const Sidebar = ({
  id,
  isDarkMode = true
}: SidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  const menuItems = [{
    icon: <HomeIcon size={18} />,
    title: 'Dashboard',
    href: '/'
  }, {
    icon: <PenToolIcon size={18} />,
    title: 'Content',
    href: '/content'
  }, {
    icon: <RocketIcon size={18} />,
    title: 'Autopilot',
    href: '/autopilot'
  }, {
    icon: <FolderIcon size={18} />,
    title: 'Media',
    href: '/media'
  }, {
    icon: <BarChart2Icon size={18} />,
    title: 'Analytics',
    href: '/analytics'
  }, {
    icon: <CalendarIcon size={18} />,
    title: 'Calendar',
    href: '/calendar'
  }, {
    icon: <MessageSquareIcon size={18} />,
    title: 'Messages',
    href: '/messages'
  }, {
    icon: <UsersIcon size={18} />,
    title: 'Team',
    href: '/team'
  }, {
    icon: <GlobeIcon size={18} />,
    title: 'Social',
    href: '/social-accounts'
  }];
  return <div id={id} className="fixed left-4 top-20 bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-xl shadow-lg flex flex-col z-40 p-2 w-[56px] overflow-visible">
      {menuItems.map((item, index) => (
        <div key={item.href} className="relative h-10 mb-1.5 last:mb-0">
          <Link 
            to={item.href} 
            className={`
              relative flex items-center h-10 rounded-lg
              transition-all duration-300 ease-in-out group
              ${isActive(item.href) ? 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 text-white' : ''}
            `}
            style={{ width: '40px' }}
          >
            {/* Hover background effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-100/5 dark:from-gray-800/20 dark:to-gray-800/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            {/* Blur effect on hover */}
            <span className="absolute inset-0 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Glass effect */}
            <span className="absolute inset-0 backdrop-blur-sm bg-white/[0.01] dark:bg-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            {/* Icon */}
            <span className={`
                relative z-10 w-10 h-10 flex items-center justify-center flex-shrink-0
                transition-all duration-300 group-hover:scale-105
                ${isActive(item.href) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
              `}>
              {item.icon}
            </span>
            {/* Title with fade in animation */}
            <span className={`
                absolute left-10 top-1/2 -translate-y-1/2 ml-2
                text-sm font-medium whitespace-nowrap
                transition-all duration-300 ease-in-out
                ${isActive(item.href) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                opacity-0 group-hover:opacity-100 group-hover:translate-x-2
                bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-md shadow-lg
                pointer-events-none
              `}>
              {item.title}
            </span>
            {/* Active indicator */}
            {isActive(item.href) && (
              <span className="absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent opacity-50" />
            )}
          </Link>
        </div>
      ))}
    </div>;
};