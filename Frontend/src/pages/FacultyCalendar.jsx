import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const FacultyCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Database Exam',
      date: '2023-11-15',
      time: '10:00 AM - 12:00 PM',
      type: 'exam',
      description: 'Mid-term examination for Database Systems course'
    },
    {
      id: 2,
      title: 'Faculty Meeting',
      date: '2023-11-10',
      time: '2:00 PM - 3:30 PM',
      type: 'meeting',
      description: 'Monthly faculty meeting to discuss department updates'
    },
    {
      id: 3,
      title: 'Project Submission Deadline',
      date: '2023-11-20',
      time: '11:59 PM',
      type: 'deadline',
      description: 'Final deadline for student project submissions'
    },
    {
      id: 4,
      title: 'Guest Lecture',
      date: '2023-11-25',
      time: '3:00 PM - 5:00 PM',
      type: 'event',
      description: 'Guest lecture on Machine Learning by Dr. Smith'
    }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'event',
    description: ''
  });

  // Get days in the current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateString);
      
      days.push({
        day,
        isCurrentMonth: true,
        isToday: new Date().toDateString() === new Date(year, month, day).toDateString(),
        events: dayEvents
      });
    }
    
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'event',
      description: ''
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id ? { ...event, ...newEvent } : event
        )
      );
    } else {
      // Add new event
      setEvents(prevEvents => [
        ...prevEvents,
        {
          id: Date.now(),
          ...newEvent
        }
      ]);
    }
    setShowEventModal(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
      setShowEventModal(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format month name
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="pb-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Academic Calendar</h1>
        <p className="text-gray-600">Manage your academic events and schedule</p>
      </header>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 flex items-center justify-between bg-indigo-50">
          <button 
            onClick={handlePreviousMonth}
            className="p-2 rounded-full hover:bg-indigo-100"
            aria-label="Previous month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4 lg:h-3.5 lg:w-3.5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">{formatMonth(currentDate)}</h2>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-indigo-100"
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4 lg:h-3.5 lg:w-3.5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium border-b bg-gray-50 text-sm">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((dayData, idx) => (
            <div 
              key={idx} 
              className={`min-h-24 border p-1 ${
                dayData.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${dayData.isToday ? 'bg-blue-50' : ''}`}
            >
              {dayData.day && (
                <div className="h-full">
                  <div className={`text-right text-sm mb-1 ${
                    dayData.isToday ? 'font-bold text-blue-600' : ''
                  }`}>
                    {dayData.day}
                  </div>
                  <div className="space-y-1">
                    {dayData.events?.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`text-xs p-1 rounded truncate cursor-pointer ${
                          event.type === 'exam' ? 'bg-red-100 text-red-800' :
                          event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                          event.type === 'deadline' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleAddEvent}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4 lg:h-3.5 lg:w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Upcoming Events Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Events</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .filter(event => new Date(event.date) >= new Date())
                .map(event => (
                <tr key={event.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEventClick(event)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${event.type === 'exam' ? 'bg-red-100 text-red-800' :
                        event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                        event.type === 'deadline' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-indigo-100 text-indigo-800'}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{event.description}</div>
                  </td>
                </tr>
              ))}
              {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    No upcoming events
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={selectedEvent ? newEvent.title || selectedEvent.title : newEvent.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={selectedEvent ? newEvent.date || selectedEvent.date : newEvent.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      placeholder="e.g. 10:00 AM - 12:00 PM"
                      value={selectedEvent ? newEvent.time || selectedEvent.time : newEvent.time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    id="type"
                    name="type"
                    value={selectedEvent ? newEvent.type || selectedEvent.type : newEvent.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="event">Event</option>
                    <option value="exam">Exam</option>
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={selectedEvent ? newEvent.description || selectedEvent.description : newEvent.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex justify-between mt-6">
                  {selectedEvent && (
                    <button
                      type="button"
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                  <div className="ml-auto space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowEventModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEvent}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCalendar;
