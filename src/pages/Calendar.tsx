import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusIcon, CalendarIcon, ClockIcon, GridIcon, ListIcon, ChevronLeftIcon, ChevronRightIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEventForm } from '../components/calendar/CalendarEventForm';
export const Calendar = () => {
  const [view, setView] = useState('dayGridMonth');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  // Mock events data
  const events = [{
    id: '1',
    title: 'Product Launch Post',
    start: '2024-01-15T10:00:00',
    end: '2024-01-15T11:00:00',
    backgroundColor: '#818cf8',
    borderColor: '#818cf8',
    platforms: ['instagram', 'twitter']
  }, {
    id: '2',
    title: 'Team Interview',
    start: '2024-01-17T14:00:00',
    end: '2024-01-17T15:00:00',
    backgroundColor: '#34d399',
    borderColor: '#34d399',
    platforms: ['linkedin']
  }, {
    id: '3',
    title: 'Feature Announcement',
    start: '2024-01-20T09:00:00',
    end: '2024-01-20T10:00:00',
    backgroundColor: '#f472b6',
    borderColor: '#f472b6',
    platforms: ['instagram']
  }];
  const handleDateSelect = selectInfo => {
    setSelectedDate(selectInfo.startStr);
    setShowEventForm(true);
  };
  const handleEventClick = clickInfo => {
    // Handle event click - show edit form
    console.log('Event clicked:', clickInfo.event);
  };
  const renderEventContent = eventInfo => {
    return <div className="flex items-center gap-2 p-1">
        <div className="flex -space-x-2">
          {eventInfo.event.extendedProps.platforms.map(platform => <div key={platform} className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              {platform === 'instagram' && <InstagramIcon size={12} />}
              {platform === 'twitter' && <TwitterIcon size={12} />}
              {platform === 'linkedin' && <LinkedinIcon size={12} />}
            </div>)}
        </div>
        <span className="text-xs font-medium truncate">
          {eventInfo.event.title}
        </span>
      </div>;
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Schedule and manage your content
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            <button onClick={() => setView('dayGridMonth')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'dayGridMonth' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
              <GridIcon size={16} />
            </button>
            <button onClick={() => setView('timeGridWeek')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'timeGridWeek' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
              <ListIcon size={16} />
            </button>
          </div>
          <Button variant="primary" leftIcon={<PlusIcon size={16} />}>
            New Event
          </Button>
        </div>
      </div>
      <Card>
        <div className="p-6">
          <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView={view} headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }} events={events} selectable={true} selectMirror={true} dayMaxEvents={true} weekends={true} select={handleDateSelect} eventContent={renderEventContent} eventClick={handleEventClick} height="800px" themeSystem="standard" className="fc-theme-custom" />
        </div>
      </Card>
      {showEventForm && <CalendarEventForm isOpen={showEventForm} onClose={() => setShowEventForm(false)} selectedDate={selectedDate} />}
    </div>;
};