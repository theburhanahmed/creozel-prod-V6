import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { toast } from 'sonner';
import { ImageIcon, VideoIcon, MicIcon, ChevronLeftIcon, PlusIcon, UploadIcon, FilterIcon, GridIcon, ListIcon, DownloadIcon, ShareIcon, EditIcon, TrashIcon, PlayIcon, PauseIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export const MediaLibrary = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [viewMode, setViewMode] = useState('grid');
  const [isPlaying, setIsPlaying] = useState(false);
  const tabs = [{
    id: 'videos',
    label: 'Videos',
    icon: <VideoIcon size={14} />
  }, {
    id: 'images',
    label: 'Images',
    icon: <ImageIcon size={14} />
  }, {
    id: 'audio',
    label: 'Audio',
    icon: <MicIcon size={14} />
  }];
  const videos = [{
    id: '1',
    title: 'Tech Keyboard Shortcuts',
    thumbnail: 'https://images.unsplash.com/photo-1555532538-dcdbd01d373d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D',
    duration: '0:45',
    size: '12.4 MB',
    created: 'Today',
    published: true
  }, {
    id: '2',
    title: 'Productivity Apps Review',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdGl2aXR5fGVufDB8fDB8fHww',
    duration: '1:20',
    size: '24.8 MB',
    created: 'Yesterday',
    published: true
  }, {
    id: '3',
    title: 'Email Management Strategies',
    thumbnail: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZW1haWx8ZW58MHx8MHx8fDA%3D',
    duration: '0:58',
    size: '18.2 MB',
    created: '3 days ago',
    published: false
  }, {
    id: '4',
    title: 'Time Management Tips',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGltZSUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D',
    duration: '1:05',
    size: '20.6 MB',
    created: '1 week ago',
    published: true
  }];
  const images = [{
    id: '1',
    title: 'Workspace Setup',
    thumbnail: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29ya3NwYWNlfGVufDB8fDB8fHww',
    size: '2.4 MB',
    dimensions: '1920 x 1080',
    created: '2 days ago',
    published: true
  }, {
    id: '2',
    title: 'Tech Gadgets',
    thumbnail: 'https://images.unsplash.com/photo-1552831388-6a0b3575b32a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaCUyMGdhZGdldHN8ZW58MHx8MHx8fDA%3D',
    size: '1.8 MB',
    dimensions: '1920 x 1080',
    created: '1 week ago',
    published: false
  }];
  const audio = [{
    id: '1',
    title: 'Productivity Podcast Intro',
    duration: '0:30',
    size: '4.2 MB',
    created: '3 days ago',
    published: true
  }, {
    id: '2',
    title: 'Tech Tips Voiceover',
    duration: '1:15',
    size: '8.6 MB',
    created: '1 week ago',
    published: true
  }];
  const getActiveMedia = () => {
    switch (activeTab) {
      case 'videos':
        return videos;
      case 'images':
        return images;
      case 'audio':
        return audio;
      default:
        return [];
    }
  };
  const handleDeleteMedia = (id: string) => {
    toast.success('Media deleted', {
      description: 'The selected media has been removed from your library.'
    });
  };
  const handleDownloadMedia = (id: string) => {
    toast.success('Download started', {
      description: 'Your file will be downloaded shortly.'
    });
  };
  const handleUploadMedia = () => {
    toast.success('Upload completed', {
      description: 'Your media has been uploaded to your library.'
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
              Media Library
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your videos, images and audio files
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
          <Button variant="outline" leftIcon={<FilterIcon size={16} />}>
            Filter
          </Button>
          <Button variant="primary" leftIcon={<UploadIcon size={16} />} onClick={handleUploadMedia}>
            Upload
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        <Tabs tabs={tabs} onChange={setActiveTab} variant="enclosed" />
        {viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getActiveMedia().map(media => <Card key={media.id} className="hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  {activeTab !== 'audio' ? <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                      <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover" />
                      {activeTab === 'videos' && <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Button variant="neon" size="sm" className="rounded-full w-10 h-10 p-0" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                          </Button>
                        </div>}
                    </div> : <div className="aspect-video rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <MicIcon size={32} className="text-white" />
                    </div>}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {media.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {media.duration && <span>{media.duration}</span>}
                      {media.dimensions && <span>{media.dimensions}</span>}
                      <span>{media.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created {media.created}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDownloadMedia(media.id)}>
                        <DownloadIcon size={14} />
                      </Button>
                      <Button variant="outline" size="sm" className="!p-1.5">
                        <ShareIcon size={14} />
                      </Button>
                      <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDeleteMedia(media.id)}>
                        <TrashIcon size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>)}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors">
              <div className="h-full flex flex-col items-center justify-center py-6 cursor-pointer" onClick={handleUploadMedia}>
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                  <UploadIcon size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Upload Media
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Upload new {activeTab} to your library
                </p>
              </div>
            </Card>
          </div> : <Card>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="grid grid-cols-12 py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {getActiveMedia().map(media => <div key={media.id} className="grid grid-cols-12 py-3 px-4 items-center">
                  <div className="col-span-6 flex items-center gap-3">
                    {activeTab === 'videos' && <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <VideoIcon size={18} className="text-gray-500" />
                      </div>}
                    {activeTab === 'images' && <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <ImageIcon size={18} className="text-gray-500" />
                      </div>}
                    {activeTab === 'audio' && <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <MicIcon size={18} className="text-white" />
                      </div>}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {media.title}
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {media.duration && <span>{media.duration}</span>}
                        {media.dimensions && <span> • {media.dimensions}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                    {media.size}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                    {media.created}
                  </div>
                  <div className="col-span-2 flex justify-end gap-1">
                    <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDownloadMedia(media.id)}>
                      <DownloadIcon size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="!p-1.5">
                      <ShareIcon size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleDeleteMedia(media.id)}>
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>)}
            </div>
          </Card>}
      </div>
    </div>;
};