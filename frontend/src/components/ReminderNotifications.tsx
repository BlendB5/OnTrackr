"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useReminders } from '@/hooks/useReminders';
import { Reminder } from '@/services/calendarApi';

export default function ReminderNotifications() {
  const { upcomingReminders, loadReminders } = useReminders();
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReminders();
  }, []);

  const visibleReminders = upcomingReminders.filter(
    reminder => !dismissedReminders.has(reminder.id)
  );

  const dismissReminder = (reminderId: string) => {
    setDismissedReminders(prev => new Set(Array.from(prev).concat(reminderId)));
  };

  const formatReminderTime = (remindAt: string) => {
    const date = new Date(remindAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) {
      return 'Overdue';
    } else if (diffHours > 0) {
      return `In ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `In ${diffMinutes}m`;
    } else {
      return 'Now';
    }
  };

  if (visibleReminders.length === 0) {
    return null;
  }

  return (
    <>
      {/* Notification Bell */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 shadow-lg"
        >
          <Bell className="h-6 w-6" />
          {visibleReminders.length > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {visibleReminders.length}
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="fixed top-20 right-4 z-50 w-80 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-xl border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Upcoming Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {visibleReminders.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {reminder.Event ? (
                            <Calendar className="h-4 w-4 text-purple-600" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-orange-600" />
                          )}
                          <span className="font-medium text-sm">
                            {reminder.Event?.title || reminder.Task?.title}
                          </span>
                        </div>
                        {reminder.message && (
                          <p className="text-xs text-gray-600 mb-2">
                            {reminder.message}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatReminderTime(reminder.remindAt)}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissReminder(reminder.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                {visibleReminders.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">
                    No upcoming reminders
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


