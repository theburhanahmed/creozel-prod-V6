import React from 'react';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
interface DetailViewProps {
  title: string;
  description?: string;
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  sidebar?: React.ReactNode;
  toolbar?: React.ReactNode;
}
export const DetailView = ({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  sidebar,
  toolbar
}: DetailViewProps) => {
  return <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <Tabs tabs={tabs.map(({
                id,
                label
              }) => ({
                id,
                label
              }))} defaultTabId={activeTab} onChange={onTabChange} variant="enclosed" />
              </div>
              {toolbar && <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
                  {toolbar}
                </div>}
              <div className="p-4">
                {tabs.find(tab => tab.id === activeTab)?.content}
              </div>
            </div>
          </Card>
        </div>
        {sidebar && <div className="lg:w-80 space-y-6">{sidebar}</div>}
      </div>
    </div>;
};
