import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { LayoutIcon, ChevronLeftIcon, PlusIcon, EditIcon, TrashIcon, CopyIcon, GridIcon, ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export const CustomTemplates = () => {
  const [viewMode, setViewMode] = useState('grid');
  const templates = [{
    id: '1',
    name: 'Modern Minimalist',
    description: 'Clean design with minimal elements, perfect for tech content',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMG1pbmltYWx8ZW58MHx8MHx8fDA%3D',
    colors: ['#ffffff', '#000000', '#3b82f6'],
    font: 'Sans Serif',
    lastUsed: '2 days ago'
  }, {
    id: '2',
    name: 'Vibrant Gradient',
    description: 'Colorful gradients with bold typography for eye-catching content',
    thumbnail: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D',
    colors: ['#8b5cf6', '#ec4899', '#3b82f6'],
    font: 'Display',
    lastUsed: '1 week ago'
  }, {
    id: '3',
    name: 'Corporate Professional',
    description: 'Business-focused design with professional color scheme',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ycG9yYXRlfGVufDB8fDB8fHww',
    colors: ['#1e3a8a', '#ffffff', '#94a3b8'],
    font: 'Serif',
    lastUsed: '3 days ago'
  }];
  const handleDeleteTemplate = (id: string) => {
    toast.success('Template deleted', {
      description: 'The template has been removed from your library.'
    });
  };
  const handleDuplicateTemplate = (id: string) => {
    toast.success('Template duplicated', {
      description: 'A copy of the template has been created.'
    });
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/autopilot" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ChevronLeftIcon size={16} />
            <span>Back to Pipelines</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Custom Templates
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage your video templates
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-md shadow-sm">
            <button type="button" className={`px-3 py-2 text-sm font-medium rounded-l-md border ${viewMode === 'grid' ? 'bg-cyan-50 border-cyan-500 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`} onClick={() => setViewMode('grid')}>
              <GridIcon size={16} />
            </button>
            <button type="button" className={`px-3 py-2 text-sm font-medium rounded-r-md border ${viewMode === 'list' ? 'bg-cyan-50 border-cyan-500 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`} onClick={() => setViewMode('list')}>
              <ListIcon size={16} />
            </button>
          </div>
          <Button variant="primary" leftIcon={<PlusIcon size={16} />}>
            New Template
          </Button>
        </div>
      </div>
      {viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors">
            <div className="h-full flex flex-col items-center justify-center py-6 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                <PlusIcon size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Create New Template
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Design a custom template with your brand colors and style
              </p>
            </div>
          </Card>
          {templates.map(template => <Card key={template.id} className="hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-2">
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Colors:
                  </span>
                  {template.colors.map((color, index) => <div key={index} className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700" style={{
              backgroundColor: color
            }}></div>)}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last used {template.lastUsed}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDuplicateTemplate(template.id)}>
                      <CopyIcon size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="!p-1.5">
                      <EditIcon size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDeleteTemplate(template.id)}>
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>)}
        </div> : <Card>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {templates.map(template => <div key={template.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Colors:
                      </span>
                      {template.colors.map((color, index) => <div key={index} className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700" style={{
                  backgroundColor: color
                }}></div>)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-4">
                    Last used {template.lastUsed}
                  </span>
                  <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDuplicateTemplate(template.id)}>
                    <CopyIcon size={14} />
                  </Button>
                  <Button variant="outline" size="sm" className="!p-1.5">
                    <EditIcon size={14} />
                  </Button>
                  <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDeleteTemplate(template.id)}>
                    <TrashIcon size={14} />
                  </Button>
                </div>
              </div>)}
          </div>
        </Card>}
    </div>;
};