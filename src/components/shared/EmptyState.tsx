import React from 'react';
import { Button } from '../ui/Button';
import { PlusIcon } from 'lucide-react';
interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
export const EmptyState = ({
  title,
  description,
  icon,
  action
}: EmptyStateProps) => {
  return <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {action && <Button variant="primary" leftIcon={<PlusIcon size={16} />} onClick={action.onClick}>
          {action.label}
        </Button>}
    </div>;
};