import React from 'react';
import { Button } from '../ui/Button';
import { UploadIcon } from 'lucide-react';
interface UploadZoneProps {
  icon: React.ReactNode;
  title: string;
  accept?: string;
  onUpload?: (file: File) => void;
}
export const UploadZone = ({
  icon,
  title,
  accept,
  onUpload
}: UploadZoneProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };
  return <div className="text-center">
      <div className="mx-auto text-gray-400 mb-4">{icon}</div>
      <label>
        <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
        <Button variant="outline" leftIcon={<UploadIcon size={16} />} className="cursor-pointer" as="span">
          {title}
        </Button>
      </label>
    </div>;
};
