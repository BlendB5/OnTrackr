import { useEffect, useState } from 'react';
import { remindersApi, Reminder } from '@/services/calendarApi';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);

  const loadReminders = async () => {
    try {
      const [allReminders, upcoming] = await Promise.all([
        remindersApi.getAll(),
        remindersApi.getUpcoming()
      ]);
      setReminders(allReminders);
      setUpcomingReminders(upcoming);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const checkForDueReminders = () => {
    const now = new Date();
    const dueReminders = reminders.filter(reminder => {
      const remindTime = new Date(reminder.remindAt);
      return remindTime <= now && remindTime > new Date(now.getTime() - 60000); // Within last minute
    });

    dueReminders.forEach(reminder => {
      showNotification(reminder);
    });
  };

  const showNotification = (reminder: Reminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = reminder.Event?.title || reminder.Task?.title || 'Reminder';
      const body = reminder.message || `Don't forget: ${title}`;
      
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: reminder.id
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    loadReminders();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(checkForDueReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [reminders]);

  return {
    reminders,
    upcomingReminders,
    loadReminders,
    showNotification
  };
};


