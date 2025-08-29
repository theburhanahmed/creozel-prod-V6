import React, { useEffect, useState, createElement } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { toast } from 'sonner';
import { ImageIcon, VideoIcon, FileIcon, MusicIcon, FolderIcon, SearchIcon, FilterIcon, GridIcon, ListIcon, UploadIcon, DownloadIcon, ShareIcon, TrashIcon, MoreHorizontalIcon, StarIcon, PlusIcon, CheckIcon, ChevronDownIcon, FileTextIcon, FolderPlusIcon, RefreshCwIcon } from 'lucide-react';
import { mediaService, MediaItem } from '../services/media/mediaService';
export const MediaGallery = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const tabs = [{
    id: 'all',
    label: 'All Files'
  }, {
    id: 'images',
    label: 'Images',
    icon: <ImageIcon size={14} />
  }, {
    id: 'videos',
    label: 'Videos',
    icon: <VideoIcon size={14} />
  }, {
    id: 'audio',
    label: 'Audio',
    icon: <MusicIcon size={14} />
  }, {
    id: 'documents',
    label: 'Documents',
    icon: <FileTextIcon size={14} />
  }];
  const filterOptions = [{
    id: 'recent',
    label: 'Recently Added'
  }, {
    id: 'starred',
    label: 'Starred'
  }, {
    id: 'shared',
    label: 'Shared with me'
  }, {
    id: 'large',
    label: 'Large files (>10MB)'
  }];
  useEffect(() => {
    loadMediaItems();
  }, [activeTab, activeFilters, searchTerm]);
  const loadMediaItems = async () => {
    setIsLoading(true);
    try {
      const data = await mediaService.getMediaLibrary();
      setMediaItems(data.mediaItems);
      setTotalItems(data.mediaItems.length);
    } catch (error) {
      console.error('Failed to load media items:', error);
      toast.error('Failed to load media files', {
        description: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getFileIcon = (type: string, size = 20) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={size} className="text-purple-500" />;
      case 'video':
        return <VideoIcon size={size} className="text-blue-500" />;
      case 'audio':
        return <MusicIcon size={size} className="text-amber-500" />;
      case 'document':
        return <FileTextIcon size={size} className="text-emerald-500" />;
      default:
        return <FileIcon size={size} className="text-gray-500" />;
    }
  };
  const handleFileSelect = (id: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(id)) {
        return prev.filter(fileId => fileId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const handleFilterSelect = (filterId: string) => {
    setActiveFilters(prev => {
      const isAlreadySelected = prev.includes(filterId);
      if (isAlreadySelected) {
        return prev.filter(id => id !== filterId);
      }
      return [...prev, filterId];
    });
  };
  const handleUpload = (type: string) => {
    setShowUploadDropdown(false);
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = type === 'files' ? '*/*' : 'image/*,video/*,audio/*';
    // Handle file selection
    fileInput.onchange = async e => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      // For each selected file, create a mock media item
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split('/')[0]; // e.g., "image/jpeg" -> "image"
        // Show loading toast
        toast.loading(`Uploading ${file.name}...`);
        // Simulate upload delay
        setTimeout(() => {
          // Create a new mock media item
          const newItem: MediaItem = {
            id: `new-${Date.now()}-${i}`,
            name: file.name,
            type: fileType === 'image' || fileType === 'video' || fileType === 'audio' ? fileType : 'document',
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            url: URL.createObjectURL(file),
            modified: 'Just now',
            starred: false,
            shared: false
          };
          // If it's an image, create a thumbnail
          if (fileType === 'image') {
            newItem.thumbnail = URL.createObjectURL(file);
          }
          // Add the new file to the list
          setMediaItems(prev => [newItem, ...prev]);
          setTotalItems(prev => prev + 1);
          // Dismiss loading toast and show success
          toast.dismiss();
          toast.success(`${file.name} uploaded successfully`);
        }, 1500);
      }
    };
    // Trigger file selection dialog
    fileInput.click();
  };
  const handleCreateFolder = () => {
    setShowUploadDropdown(false);
    // Create a new folder (in a real app, this would create a folder in your storage)
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder: MediaItem = {
        id: `folder-${Date.now()}`,
        name: folderName,
        type: 'folder',
        size: '--',
        url: '#',
        modified: 'Just now'
      };
      setMediaItems(prev => [newFolder, ...prev]);
      setTotalItems(prev => prev + 1);
      toast.success('New folder created', {
        description: 'Your new folder has been created.'
      });
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    // Confirm deletion
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} item(s)?`)) {
      // Remove selected files from the list
      setMediaItems(prev => prev.filter(item => !selectedFiles.includes(item.id)));
      setTotalItems(prev => prev - selectedFiles.length);
      toast.success(`${selectedFiles.length} file(s) deleted`, {
        description: 'The selected files have been moved to trash.'
      });
      setSelectedFiles([]);
    }
  };
  const handleStarFile = async (id: string) => {
    // Find the file
    const file = mediaItems.find(item => item.id === id);
    if (!file) return;
    // Toggle star status
    const updatedItems = mediaItems.map(item => item.id === id ? {
      ...item,
      starred: !item.starred
    } : item);
    setMediaItems(updatedItems);
    toast.success(file.starred ? 'File unstarred' : 'File starred', {
      description: file.starred ? 'The file has been removed from your starred items.' : 'The file has been added to your starred items.'
    });
  };
  const handleShareFile = async (id: string) => {
    // Find the file
    const file = mediaItems.find(item => item.id === id);
    if (!file) return;
    // Toggle share status
    const updatedItems = mediaItems.map(item => item.id === id ? {
      ...item,
      shared: !item.shared
    } : item);
    setMediaItems(updatedItems);
    toast.success('Sharing options opened', {
      description: 'You can now share this file with others.'
    });
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Media Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and organize all your media files
          </p>
        </div>
        <div className="flex gap-3">
          {selectedFiles.length > 0 ? <>
              <Button variant="outline" leftIcon={<TrashIcon size={16} />} onClick={handleDeleteSelected}>
                Delete Selected
              </Button>
              <Button variant="outline" leftIcon={<DownloadIcon size={16} />}>
                Download
              </Button>
            </> : <>
              <div className="flex rounded-md shadow-sm">
                <button type="button" className={`px-3 py-2 text-sm font-medium rounded-l-md border ${viewMode === 'grid' ? 'bg-cyan-50 border-cyan-500 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`} onClick={() => setViewMode('grid')}>
                  <GridIcon size={16} />
                </button>
                <button type="button" className={`px-3 py-2 text-sm font-medium rounded-r-md border ${viewMode === 'list' ? 'bg-cyan-50 border-cyan-500 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'}`} onClick={() => setViewMode('list')}>
                  <ListIcon size={16} />
                </button>
              </div>
              <Button variant="outline" leftIcon={<RefreshCwIcon size={16} />} onClick={loadMediaItems}>
                Refresh
              </Button>
              <div className="relative">
                <Button variant="primary" leftIcon={<UploadIcon size={16} />} rightIcon={<ChevronDownIcon size={14} />} onClick={() => {
              setShowUploadDropdown(!showUploadDropdown);
              setShowFilterDropdown(false);
            }}>
                  Upload
                </Button>
                {showUploadDropdown && <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button onClick={() => handleUpload('files')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                      <UploadIcon size={14} className="mr-2 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-200">
                        Upload Files
                      </span>
                    </button>
                    <button onClick={() => handleUpload('folder')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                      <FolderIcon size={14} className="mr-2 text-amber-500" />
                      <span className="text-gray-700 dark:text-gray-200">
                        Upload Folder
                      </span>
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button onClick={handleCreateFolder} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                      <FolderPlusIcon size={14} className="mr-2 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-200">
                        Create Folder
                      </span>
                    </button>
                  </div>}
              </div>
            </>}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search files..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
        </div>
        <div className="relative">
          <Button variant="outline" leftIcon={<FilterIcon size={16} />} rightIcon={<ChevronDownIcon size={14} />} onClick={() => {
          setShowFilterDropdown(!showFilterDropdown);
          setShowUploadDropdown(false);
        }}>
            Filter
            {activeFilters.length > 0 && <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilters.length}
              </span>}
          </Button>
          {showFilterDropdown && <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              {filterOptions.map(option => <button key={option.id} onClick={() => handleFilterSelect(option.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">
                    {option.label}
                  </span>
                  {activeFilters.includes(option.id) && <CheckIcon size={14} className="text-green-500" />}
                </button>)}
            </div>}
        </div>
      </div>
      <Tabs tabs={tabs} onChange={setActiveTab} variant="enclosed" />
      {isLoading ? <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div> : viewMode === 'grid' ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {mediaItems.map(file => <Card key={file.id} className={`hover:shadow-lg transition-all duration-300 ${selectedFiles.includes(file.id) ? 'ring-2 ring-cyan-500 dark:ring-cyan-400' : ''}`}>
              <div className="relative group">
                <div className="absolute top-2 left-2 z-10">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${selectedFiles.includes(file.id) ? 'bg-cyan-500 border-cyan-500' : 'bg-white/80 backdrop-blur-sm border-gray-300 dark:bg-gray-800/80 dark:border-gray-600'}`} onClick={() => handleFileSelect(file.id)}>
                    {selectedFiles.includes(file.id) && <CheckIcon size={12} className="text-white" />}
                  </div>
                </div>
                {file.starred && <div className="absolute top-2 right-2 z-10">
                    <StarIcon size={16} className="text-amber-400 fill-amber-400" />
                  </div>}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center" onClick={() => handleFileSelect(file.id)}>
                  {file.thumbnail ? <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" /> : <div className="w-16 h-16 flex items-center justify-center">
                      {getFileIcon(file.type, 32)}
                    </div>}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="flex gap-2">
                    <Button variant="neon" size="sm" className="!p-2" onClick={() => handleStarFile(file.id)}>
                      <StarIcon size={16} className={file.starred ? 'fill-amber-400' : ''} />
                    </Button>
                    <Button variant="neon" size="sm" className="!p-2" onClick={() => handleShareFile(file.id)}>
                      <ShareIcon size={16} />
                    </Button>
                    <Button variant="neon" size="sm" className="!p-2" onClick={() => {
                setSelectedFiles([file.id]);
                handleDeleteSelected();
              }}>
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="pt-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                    {file.name}
                  </h3>
                  <Button variant="ghost" size="sm" className="!p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <MoreHorizontalIcon size={16} />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    {getFileIcon(file.type, 12)}
                    <span>{file.size}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {file.modified}
                  </span>
                </div>
              </div>
            </Card>)}
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors">
            <div className="h-full flex flex-col items-center justify-center py-6 cursor-pointer" onClick={() => handleUpload('files')}>
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                <PlusIcon size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload Files
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Drag & drop or click to upload
              </p>
            </div>
          </Card>
        </div> : <Card>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="grid grid-cols-12 py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {mediaItems.map(file => <div key={file.id} className={`grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 ${selectedFiles.includes(file.id) ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}>
                <div className="col-span-6 flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${selectedFiles.includes(file.id) ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'}`} onClick={() => handleFileSelect(file.id)}>
                    {selectedFiles.includes(file.id) && <CheckIcon size={12} className="text-white" />}
                  </div>
                  <div className="w-10 h-10 rounded flex items-center justify-center">
                    {file.thumbnail ? <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover rounded" /> : getFileIcon(file.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </h3>
                      {file.starred && <StarIcon size={14} className="ml-2 text-amber-400 fill-amber-400" />}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                  {file.size}
                </div>
                <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                  {file.modified}
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleStarFile(file.id)}>
                    <StarIcon size={14} className={file.starred ? 'text-amber-400 fill-amber-400' : ''} />
                  </Button>
                  <Button variant="outline" size="sm" className="!p-1.5" onClick={() => handleShareFile(file.id)}>
                    <ShareIcon size={14} />
                  </Button>
                  <Button variant="outline" size="sm" className="!p-1.5" onClick={() => {
              setSelectedFiles([file.id]);
              handleDeleteSelected();
            }}>
                    <TrashIcon size={14} />
                  </Button>
                </div>
              </div>)}
          </div>
        </Card>}
      {mediaItems.length === 0 && !isLoading && <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
            <FolderIcon size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No files found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            {searchTerm ? `No files match your search "${searchTerm}"` : activeFilters.length > 0 ? 'No files match your current filters' : 'Upload files to get started'}
          </p>
          <Button variant="primary" className="mt-6" leftIcon={<UploadIcon size={16} />} onClick={() => handleUpload('files')}>
            Upload Files
          </Button>
        </div>}
    </div>;
};
