import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { CalendarIcon, ClockIcon, InstagramIcon, TwitterIcon, LinkedinIcon, XIcon } from 'lucide-react';
interface CalendarEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  event?: any;
}
export const CalendarEventForm: React.FC<CalendarEventFormProps> = ({
  isOpen,
  onClose,
  selectedDate,
  event
}) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: selectedDate || '',
    startTime: '09:00',
    endTime: '10:00',
    platforms: event?.platforms || [],
    description: event?.description || ''
  });
  const platforms = [{
    id: 'instagram',
    name: 'Instagram',
    icon: <InstagramIcon size={16} className="text-pink-500" />
  }, {
    id: 'twitter',
    name: 'Twitter',
    icon: <TwitterIcon size={16} className="text-blue-400" />
  }, {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedinIcon size={16} className="text-blue-700" />
  }];
  const handleSubmit = e => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
  };
  const togglePlatform = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId) ? prev.platforms.filter(id => id !== platformId) : [...prev.platforms, platformId]
    }));
  };
  return <Dialog isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'New Event'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Title
          </label>
          <input type="text" value={formData.title} onChange={e => setFormData(prev => ({
          ...prev,
          title: e.target.value
        }))} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Enter event title" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="date" value={formData.date} onChange={e => setFormData(prev => ({
              ...prev,
              date: e.target.value
            }))} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time
            </label>
            <div className="relative">
              <ClockIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="time" value={formData.startTime} onChange={e => setFormData(prev => ({
              ...prev,
              startTime: e.target.value
            }))} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map(platform => <button key={platform.id} type="button" onClick={() => togglePlatform(platform.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${formData.platforms.includes(platform.id) ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {platform.icon}
                <span className="text-sm font-medium">{platform.name}</span>
              </button>)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea value={formData.description} onChange={e => setFormData(prev => ({
          ...prev,
          description: e.target.value
        }))} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none" rows={4} placeholder="Add event description..." />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Dialog>;
};