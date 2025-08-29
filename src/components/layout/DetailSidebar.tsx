import React from 'react';
import { Card } from '../ui/Card';
interface DetailSidebarProps {
  sections: {
    title: string;
    content: React.ReactNode;
  }[];
}
export const DetailSidebar = ({
  sections
}: DetailSidebarProps) => {
  return <div className="space-y-6">
      {sections.map((section, index) => <Card key={index} title={section.title}>
          {section.content}
        </Card>)}
    </div>;
};
