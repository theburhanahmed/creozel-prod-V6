import React from 'react';
import { Card } from '../ui/Card';
import { FileTextIcon, ImageIcon, VideoIcon, MicIcon, PenToolIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CardMenu } from '../ui/Card';
interface ContentLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}
export const ContentLayout = ({
  children,
  title,
  description
}: ContentLayoutProps) => {
  const location = useLocation();
  const tools = [{
    icon: <FileTextIcon size={16} />,
    title: 'Text',
    href: '/content/text'
  }, {
    icon: <ImageIcon size={16} />,
    title: 'Image',
    href: '/content/image'
  }, {
    icon: <VideoIcon size={16} />,
    title: 'Video',
    href: '/content/video'
  }, {
    icon: <MicIcon size={16} />,
    title: 'Audio',
    href: '/content/audio'
  }, {
    icon: <PenToolIcon size={16} />,
    title: 'Social',
    href: '/content/social'
  }];
  return <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
      <div className="flex justify-center mb-6">
        {/* Content Type Card Menu */}
        <CardMenu items={[{
        icon: <FileTextIcon size={16} />,
        title: 'Text',
        href: '/content/text'
      }, {
        icon: <ImageIcon size={16} />,
        title: 'Image',
        href: '/content/image'
      }, {
        icon: <VideoIcon size={16} />,
        title: 'Video',
        href: '/content/video'
      }, {
        icon: <MicIcon size={16} />,
        title: 'Audio',
        href: '/content/audio'
      }]} className="shadow-md" />
      </div>
      {children}
    </div>;
};