import React from 'react';
import { Template, useTemplates } from '../../hooks/useTemplates';
import { LoaderIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface TemplatePickerProps {
  platform: string;
  onSelect: (template: Template) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({ platform, onSelect }) => {
  const { templates, loading, error } = useTemplates(platform);

  if (loading) return <div className="flex items-center gap-2 text-sm text-gray-500"><LoaderIcon size={14} className="animate-spin"/> Loading templates…</div>;
  if (error) return <div className="text-sm text-red-500">Failed to load templates</div>;
  if (!templates.length) return <div className="text-sm text-gray-400">No templates available</div>;

  return (
    <div className="space-y-2">
      {templates.map(t => (
        <Button key={t.id} variant="outline" size="sm" className="w-full justify-start" onClick={() => onSelect(t)}>
          {t.name}
        </Button>
      ))}
    </div>
  );
};
