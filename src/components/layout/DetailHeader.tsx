import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ChevronLeftIcon } from 'lucide-react';
interface DetailHeaderProps {
  title: string;
  description: string;
  backTo: string;
  backLabel?: string;
  actions?: React.ReactNode;
}
export const DetailHeader = ({
  title,
  description,
  backTo,
  backLabel = 'Back',
  actions
}: DetailHeaderProps) => {
  return <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link to={backTo} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
          <ChevronLeftIcon size={16} />
          <span>{backLabel}</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>;
};
