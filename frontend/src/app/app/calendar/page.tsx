"use client";

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  List,
  Grid3X3,
  CalendarDays,
  Bell,
  Filter,
  X,
  Edit,
  MoreVertical,
  BellRing,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { eventsApi, tasksApi, remindersApi, Event, Task, Reminder } from '@/services/calendarApi';

// Setup moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

type ViewMode = 'month' | 'week' | 'day';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    type: 'event' | 'task';
    data: Event | Task;
  };
}

export default function CalendarPage() {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showReminderBell, setShowReminderBell] = useState(false);
  const [filter, setFilter] = useState<'all' | 'events' | 'tasks'>('all');
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    start: '', 
    end: '',
    reminder: ''
  });
  const [newTask, setNewTask] = useState({ 
    title: '', 
    dueDate: '', 
    reminder: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Load data on component mount and date change
  useEffect(() => {
    loadData();
  }, [date]);

  // Check for upcoming reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const upcomingReminders = reminders.filter(reminder => {
        const remindTime = new Date(reminder.remindAt);
        const timeDiff = remindTime.getTime() - now.getTime();
        return timeDiff > 0 && timeDiff <= 300000; // 5 minutes
      });
      
      if (upcomingReminders.length > 0) {
        setShowReminderBell(true);
        upcomingReminders.forEach(reminder => {
          toast.success(`Reminder: ${reminder.message || 'You have a reminder!'}`, {
            duration: 5000,
            icon: '🔔',
          });
        });
      }
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [reminders]);

  const loadData = async () => {
    try {
      const startDate = new Date(date);
      startDate.setDate(1);
      const endDate = new Date(date);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      const [eventsData, tasksData, remindersData] = await Promise.all([
        eventsApi.getByRange(startDate.toISOString(), endDate.toISOString()).catch(() => []),
        tasksApi.getAll().catch(() => []),
        remindersApi.getUpcoming().catch(() => [])
      ]);

      // Add some sample data for testing if no data exists
      const sampleEvents = eventsData.length === 0 ? [
        {
          id: '1',
          title: 'Team Meeting',
          description: 'Weekly team standup',
          date: new Date().toISOString(),
          userId: 'user1'
        },
        {
          id: '2',
          title: 'Project Deadline',
          description: 'Submit final project',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'user1'
        }
      ] : eventsData;

      const sampleTasks = tasksData.length === 0 ? [
        {
          id: '1',
          title: 'Review code',
          status: 'pending' as const,
          dueDate: new Date().toISOString(),
          userId: 'user1'
        },
        {
          id: '2',
          title: 'Update documentation',
          status: 'pending' as const,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'user1'
        }
      ] : tasksData;

      setEvents(sampleEvents);
      setTasks(sampleTasks);
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast.error('Failed to load calendar data');
    }
  };

  // Convert events and tasks to calendar format
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const calendarEvents: CalendarEvent[] = [];
    
    if (filter === 'all' || filter === 'events') {
      events.forEach(event => {
        calendarEvents.push({
          id: event.id,
          title: event.title,
          start: new Date(event.date),
          end: new Date(new Date(event.date).getTime() + 60 * 60 * 1000), // 1 hour default
          resource: {
            type: 'event' as const,
            data: event
          }
        });
      });
    }
    
    if (filter === 'all' || filter === 'tasks') {
      tasks.forEach(task => {
        calendarEvents.push({
          id: task.id,
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(new Date(task.dueDate).getTime() + 30 * 60 * 1000), // 30 minutes default
          resource: {
            type: 'task' as const,
            data: task
          }
        });
      });
    }
    
    return calendarEvents;
  }, [events, tasks, filter]);

  const handleCreateEvent = async () => {
    try {
      await eventsApi.create({
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.start
      });

      // Create reminder if specified
      if (newEvent.reminder) {
        await remindersApi.create({
          remindAt: newEvent.reminder,
          message: `Event: ${newEvent.title}`,
          eventId: newEvent.title // This would be the actual event ID in real implementation
        });
      }

      setNewEvent({ title: '', description: '', start: '', end: '', reminder: '' });
      setShowEventForm(false);
      loadData();
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleCreateTask = async () => {
    try {
      await tasksApi.create({
        title: newTask.title,
        dueDate: newTask.dueDate,
        status: 'pending',
        reminder: newTask.reminder || undefined
      });

      // Create reminder if specified
      if (newTask.reminder) {
        await remindersApi.create({
          remindAt: newTask.reminder,
          message: `Task: ${newTask.title}`,
          taskId: newTask.title // This would be the actual task ID in real implementation
        });
      }

      setNewTask({ title: '', dueDate: '', reminder: '', priority: 'medium' });
      setShowTaskForm(false);
      loadData();
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await tasksApi.toggle(taskId);
      loadData();
      toast.success('Task updated!');
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventsApi.delete(eventId);
      loadData();
      toast.success('Event deleted!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.delete(taskId);
      loadData();
      toast.success('Task deleted!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newDate = result.destination.droppableId;
    
    try {
      await tasksApi.update(taskId, { dueDate: newDate });
      loadData();
      toast.success('Task moved to new date!');
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const isTask = event.resource.type === 'task';
    const task = event.resource.data as Task;
    
    return {
      style: {
        backgroundColor: isTask 
          ? (task.status === 'done' ? '#10b981' : '#f59e0b')
          : '#8b5cf6',
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        padding: '2px 6px'
      }
    };
  };

  const upcomingTasks = tasks
    .filter(task => task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const upcomingReminders = reminders
    .filter(reminder => new Date(reminder.remindAt) > new Date())
    .sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime())
    .slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Content */}
      <div className="relative z-20 px-6 py-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-indigo-500/20" />
            <div className="relative">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Link href="/app" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">
                        OnTrackr
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">
                        Calendar Management
                      </p>
                    </div>
                  </Link>
                  <div className="hidden lg:block ml-6 pl-6 border-l border-slate-200 dark:border-slate-600">
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                      Manage your events, tasks, and reminders in one place
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <Button
                      variant={view === 'month' ? 'default' : 'ghost'}
                  size="sm"
                      onClick={() => setView('month')}
                      className={`rounded-md ${
                        view === 'month' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Month
                </Button>
                <Button
                      variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                      onClick={() => setView('week')}
                      className={`rounded-md ${
                        view === 'week' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Week
                </Button>
                <Button
                      variant={view === 'day' ? 'default' : 'ghost'}
                  size="sm"
                      onClick={() => setView('day')}
                      className={`rounded-md ${
                        view === 'day' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Day
                </Button>
              </div>

                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                      className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
                    >
                      <option value="all">All</option>
                      <option value="events">Events Only</option>
                      <option value="tasks">Tasks Only</option>
                    </select>
        </div>

                  {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowEventForm(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
                <Button
                  onClick={() => setShowTaskForm(true)}
                  variant="outline"
                      className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-3"
          >
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-purple-100/50 dark:border-purple-900/30">
              <CardContent className="p-6">
                <div className="h-[600px] w-full">
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    date={date}
                    onNavigate={setDate}
                    onView={setView}
                    onSelectEvent={setSelectedEvent}
                    eventPropGetter={eventStyleGetter}
                    style={{ height: '100%', width: '100%' }}
                    className="modern-calendar"
                    popup
                    showMultiDayTimes
                    step={30}
                    timeslots={2}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                  />
            </div>
          </CardContent>
        </Card>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-1 space-y-6"
          >
            {/* Upcoming Tasks */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-purple-100/30 dark:border-purple-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <List className="h-5 w-5 text-purple-600" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="upcoming-tasks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {upcomingTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:shadow-md transition-all duration-200 ${
                                  snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleToggleTask(task.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    </Button>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                      {task.title}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="h-6 w-6 p-0 text-slate-400 dark:text-slate-500 hover:text-red-500"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                
                {upcomingTasks.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4 text-sm">
                    No upcoming tasks
                  </p>
                )}
          </CardContent>
        </Card>

            {/* Reminders */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-purple-100/30 dark:border-purple-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    className="p-3 rounded-lg bg-orange-50 border border-orange-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        {reminder.message}
                      </span>
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      {new Date(reminder.remindAt).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
                
                {upcomingReminders.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4 text-sm">
                    No upcoming reminders
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Event Form Modal */}
        <AnimatePresence>
        {showEventForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md"
              >
                <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90">
                  <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add Event</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEventForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
                <Input
                  type="datetime-local"
                      value={newEvent.start}
                      onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                    />
                    <Input
                      type="datetime-local"
                      placeholder="Reminder (optional)"
                      value={newEvent.reminder}
                      onChange={(e) => setNewEvent({ ...newEvent, reminder: e.target.value })}
                />
                <div className="flex gap-2">
                      <Button 
                        onClick={handleCreateEvent} 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                    Create Event
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEventForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
              </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* Task Form Modal */}
        <AnimatePresence>
        {showTaskForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md"
              >
                <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90">
                  <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add Task</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTaskForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <Input
                  type="datetime-local"
                  placeholder="Reminder (optional)"
                  value={newTask.reminder}
                  onChange={(e) => setNewTask({ ...newTask, reminder: e.target.value })}
                />
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                <div className="flex gap-2">
                      <Button 
                        onClick={handleCreateTask} 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                    Create Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTaskForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminder Bell */}
        <AnimatePresence>
          {showReminderBell && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <Button
                onClick={() => setShowReminderBell(false)}
                className="rounded-full h-14 w-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl"
              >
                <BellRing className="h-6 w-6 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .modern-calendar {
          font-family: inherit;
          height: 100% !important;
          width: 100% !important;
        }
        
        .modern-calendar .rbc-calendar {
          height: 100% !important;
          width: 100% !important;
        }
        
        .modern-calendar .rbc-header {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          font-weight: 600;
          padding: 12px 8px;
          border: none;
        }
        
        .modern-calendar .rbc-today {
          background-color: #f3e8ff;
          border: 2px solid #c084fc;
        }
        
        .modern-calendar .rbc-event {
          border-radius: 8px;
          border: none;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
        }
        
        .modern-calendar .rbc-event-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .modern-calendar .rbc-time-view .rbc-header {
          border-bottom: 2px solid #e5e7eb;
        }
        
        .modern-calendar .rbc-time-slot {
          border-top: 1px solid #f3f4f6;
        }
        
        .modern-calendar .rbc-time-content {
          border-left: 1px solid #e5e7eb;
        }
        
        .modern-calendar .rbc-day-bg {
          border: 1px solid #f3f4f6;
        }
        
        .modern-calendar .rbc-day-bg:hover {
          background-color: #f3e8ff;
        }
        
        .modern-calendar .rbc-month-view {
          height: 100% !important;
        }
        
        .modern-calendar .rbc-month-row {
          min-height: 100px;
        }
        
        .modern-calendar .rbc-date-cell {
          padding: 8px;
        }
        
        .modern-calendar .rbc-off-range-bg {
          background-color: #f8fafc;
        }
      `}</style>
      </div>
    </div>
  );
}