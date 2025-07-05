import React, { useState } from 'react';
import { DetailView } from '../shared/DetailView';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RangeInput } from '../shared/RangeInput';
import { SelectInput } from '../shared/SelectInput';
import { ActionDialog } from '../shared/ActionDialog';
import { SaveIcon, TrashIcon, ImageIcon, LinkIcon, SmileIcon, CalendarIcon } from 'lucide-react';
export const PostDetail = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [settings, setSettings] = useState({
    format: 'standard',
    visibility: 'public',
    scheduling: 'now'
  });
  const handleDelete = () => {
    // Handle delete action
    setShowDeleteDialog(false);
  };
  const tabs = [{
    id: 'edit',
    label: 'Edit',
    content: <div className="space-y-4">
          <input type="text" placeholder="Post title..." className="w-full text-xl font-medium bg-transparent border-none focus:outline-none dark:text-white" />
          <textarea placeholder="Write your post content..." className="w-full h-64 bg-transparent border-none focus:outline-none resize-none dark:text-white" />
        </div>
  }, {
    id: 'preview',
    label: 'Preview',
    content: <div>Preview content here</div>
  }, {
    id: 'settings',
    label: 'Settings',
    content: <div className="space-y-6">
          <SelectInput label="Post Format" value={settings.format} onChange={value => setSettings({
        ...settings,
        format: value
      })} options={[{
        value: 'standard',
        label: 'Standard Post'
      }, {
        value: 'featured',
        label: 'Featured Post'
      }, {
        value: 'story',
        label: 'Story'
      }]} />
          <SelectInput label="Visibility" value={settings.visibility} onChange={value => setSettings({
        ...settings,
        visibility: value
      })} options={[{
        value: 'public',
        label: 'Public'
      }, {
        value: 'private',
        label: 'Private'
      }, {
        value: 'draft',
        label: 'Draft'
      }]} />
          <SelectInput label="Scheduling" value={settings.scheduling} onChange={value => setSettings({
        ...settings,
        scheduling: value
      })} options={[{
        value: 'now',
        label: 'Publish Now'
      }, {
        value: 'schedule',
        label: 'Schedule'
      }, {
        value: 'draft',
        label: 'Save as Draft'
      }]} />
        </div>
  }];
  const toolbar = <>
      <Button variant="outline" size="sm" leftIcon={<ImageIcon size={16} />}>
        Add Media
      </Button>
      <Button variant="outline" size="sm" leftIcon={<LinkIcon size={16} />}>
        Add Link
      </Button>
      <Button variant="outline" size="sm" leftIcon={<SmileIcon size={16} />}>
        Add Emoji
      </Button>
    </>;
  const sidebar = <>
      <Card title="Publishing">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarIcon size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Ready to publish
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" leftIcon={<SaveIcon size={16} />} fullWidth>
              Publish
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setShowDeleteDialog(true)}>
              <TrashIcon size={16} />
            </Button>
          </div>
        </div>
      </Card>
      <Card title="Statistics">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Word Count
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              0
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Reading Time
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              0 min
            </div>
          </div>
        </div>
      </Card>
    </>;
  return <>
      <DetailView title="Edit Post" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} toolbar={toolbar} sidebar={sidebar} />
      <ActionDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete} title="Delete Post" description="Are you sure you want to delete this post? This action cannot be undone." confirmLabel="Delete" isDanger />
    </>;
};