import React from 'react';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
interface DetailContentProps {
  children: React.ReactNode;
  tabs?: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  toolbarItems?: React.ReactNode[];
  className?: string;
}
export const DetailContent = ({
  children,
  tabs,
  activeTab,
  onTabChange,
  toolbarItems,
  className = ''
}: DetailContentProps) => {
  return <Card className={className}>
      <div className="space-y-4">
        {tabs && <Tabs tabs={tabs} defaultTabId={activeTab} onChange={onTabChange} variant="enclosed" />}
        {toolbarItems && <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
            {toolbarItems}
          </div>}
        <div className="p-4">{children}</div>
      </div>
    </Card>;
};
