import React, { useEffect, useState, useRef } from 'react';
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}
interface TabsProps {
  tabs: Tab[];
  onChange: (tabId: string) => void;
  variant?: 'default' | 'enclosed' | 'pills';
  activeTab?: string;
  defaultTabId?: string;
  className?: string;
}
export const Tabs = ({
  tabs,
  onChange,
  variant = 'default',
  activeTab,
  defaultTabId,
  className = ''
}: TabsProps) => {
  // If activeTab is not provided, use the defaultTabId or first tab as default
  const [activeTabState, setActiveTabState] = useState(activeTab || defaultTabId || tabs[0]?.id);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // Update internal state when external activeTab prop changes
  useEffect(() => {
    if (activeTab) {
      setActiveTabState(activeTab);
    }
  }, [activeTab]);
  // Use the controlled value if provided, otherwise use internal state
  const currentTab = activeTab || activeTabState;
  const handleTabClick = (tabId: string) => {
    if (!activeTab) {
      // Only update internal state if not controlled externally
      setActiveTabState(tabId);
    }
    onChange(tabId);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabCount = tabs.length;
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = (index - 1 + tabCount) % tabCount;
        tabsRef.current[prevIndex]?.focus();
        handleTabClick(tabs[prevIndex].id);
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (index + 1) % tabCount;
        tabsRef.current[nextIndex]?.focus();
        handleTabClick(tabs[nextIndex].id);
        break;
      case 'Home':
        event.preventDefault();
        tabsRef.current[0]?.focus();
        handleTabClick(tabs[0].id);
        break;
      case 'End':
        event.preventDefault();
        tabsRef.current[tabCount - 1]?.focus();
        handleTabClick(tabs[tabCount - 1].id);
        break;
    }
  };
  const getTabStyles = () => {
    switch (variant) {
      case 'enclosed':
        return {
          container: 'border-b border-gray-200 dark:border-gray-700',
          tab: (isActive: boolean) => `
            relative py-3 px-4 text-sm font-medium transition-all duration-200
            ${isActive ? 'text-gray-900 dark:text-white border-b-2 border-green-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          `
        };
      case 'pills':
        return {
          container: 'flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
          tab: (isActive: boolean) => `
            py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
            ${isActive ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          `
        };
      default:
        return {
          container: '',
          tab: (isActive: boolean) => `
            py-2 px-4 text-sm font-medium border-b-2 transition-all duration-200
            ${isActive ? 'border-green-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          `
        };
    }
  };
  const styles = getTabStyles();
  return <div className={`flex ${styles.container} ${className}`} role="tablist" aria-orientation="horizontal">
      {tabs.map((tab, index) => <button key={tab.id} ref={el => tabsRef.current[index] = el} role="tab" aria-selected={currentTab === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={currentTab === tab.id ? 0 : -1} className={`
            flex items-center gap-2 whitespace-nowrap
            ${styles.tab(currentTab === tab.id)}
          `} onClick={() => handleTabClick(tab.id)} onKeyDown={e => handleKeyDown(e, index)}>
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          {tab.label}
          {tab.badge && <span className={`
              px-2 py-0.5 text-xs font-medium rounded-full
              ${currentTab === tab.id ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}
            `}>
              {tab.badge}
            </span>}
        </button>)}
    </div>;
};