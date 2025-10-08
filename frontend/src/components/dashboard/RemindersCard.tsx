"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

interface RemindersCardProps {
  className?: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  type: 'timesheet' | 'clock' | 'meeting' | 'deadline';
}

export function RemindersCard({ className = "" }: RemindersCardProps) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockReminders: Reminder[] = [
        {
          id: '1',
          title: 'Submit Timesheet',
          description: 'Submit your weekly timesheet for approval',
          dueTime: 'Today, 5:00 PM',
          priority: 'high',
          completed: false,
          type: 'timesheet'
        },
        {
          id: '2',
          title: 'Clock Out Reminder',
          description: 'Remember to clock out at 6:00 PM',
          dueTime: 'Today, 6:00 PM',
          priority: 'medium',
          completed: false,
          type: 'clock'
        },
        {
          id: '3',
          title: 'Team Meeting',
          description: 'Weekly team standup meeting',
          dueTime: 'Tomorrow, 10:00 AM',
          priority: 'medium',
          completed: false,
          type: 'meeting'
        },
        {
          id: '4',
          title: 'Project Deadline',
          description: 'Q4 project deliverables due',
          dueTime: 'Dec 15, 5:00 PM',
          priority: 'high',
          completed: false,
          type: 'deadline'
        }
      ];
      
      setReminders(mockReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle2 className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'timesheet': return <Clock className="h-4 w-4" />;
      case 'clock': return <Clock className="h-4 w-4" />;
      case 'meeting': return <Bell className="h-4 w-4" />;
      case 'deadline': return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const completedCount = reminders.filter(r => r.completed).length;
  const totalCount = reminders.length;

  if (loading) {
    return (
      <Card className={`shadow-lg border-0 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 ${className}`}>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
            <p className="mt-2 text-slate-300">Loading reminders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-green-400" />
              Reminders & Tasks
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">
                {completedCount}/{totalCount}
              </span>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <p className="text-slate-300 mb-2">All done!</p>
              <p className="text-sm text-slate-400">No pending reminders or tasks</p>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              {reminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 border rounded-xl transition-all ${
                    reminder.completed 
                      ? 'bg-green-500/10 border-green-500/30 opacity-60' 
                      : 'border-slate-700/50 hover:bg-slate-800/30 bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        reminder.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-400 hover:border-green-400'
                      }`}
                    >
                      {reminder.completed && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-medium text-sm ${
                          reminder.completed ? 'line-through text-slate-500' : 'text-white'
                        }`}>
                          {reminder.title}
                        </h4>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                          {getPriorityIcon(reminder.priority)}
                          {reminder.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className={`text-xs mb-3 ${
                        reminder.completed ? 'text-slate-500' : 'text-slate-300'
                      }`}>
                        {reminder.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1 bg-slate-700/30 px-2 py-1 rounded-md">
                          {getTypeIcon(reminder.type)}
                          {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                        </span>
                        <span>•</span>
                        <span>{reminder.dueTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {reminders.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
                <span>Progress</span>
                <span>{completedCount}/{totalCount} completed</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
