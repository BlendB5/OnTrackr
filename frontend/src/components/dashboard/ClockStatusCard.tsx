"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Play, 
  Square, 
  Coffee, 
  CheckCircle2,
  AlertCircle,
  Timer
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkSessionService, WorkSession } from '@/lib/work-sessions';
import { BreakService, Break } from '@/lib/break-service';
import { toast } from 'react-hot-toast';

interface ClockStatusCardProps {
  className?: string;
}

export function ClockStatusCard({ className = "" }: ClockStatusCardProps) {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [currentBreak, setCurrentBreak] = useState<Break | null>(null);
  const [todayHours, setTodayHours] = useState(0);
  const [loading, setLoading] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load current session and today's hours
  useEffect(() => {
    if (user?.id) {
      loadCurrentStatus();
    }
  }, [user?.id]);

  const loadCurrentStatus = async () => {
    try {
      const [session, breaks] = await Promise.all([
        WorkSessionService.getCurrentSession(),
        BreakService.getTodayBreaks()
      ]);
      
      setCurrentSession(session.session);
      
      // Calculate today's total hours
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = await WorkSessionService.getTodaySessions();
      
      let totalMinutes = 0;
      for (const s of todaySessions.sessions) {
        if (s.clockOut) {
          totalMinutes += (new Date(s.clockOut).getTime() - new Date(s.clockIn).getTime()) / (1000 * 60);
        }
      }
      
      // Subtract break time
      const breakMinutes = breaks.breaks.reduce((sum, b) => {
        if (b.breakEnd) {
          return sum + (new Date(b.breakEnd).getTime() - new Date(b.breakStart).getTime()) / (1000 * 60);
        }
        return sum;
      }, 0);
      
      setTodayHours((totalMinutes - breakMinutes) / 60);
    } catch (error) {
      console.error('Error loading current status:', error);
    }
  };

  const handleClockIn = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await WorkSessionService.clockIn();
      toast.success('Clocked in successfully!');
      loadCurrentStatus();
    } catch (error) {
      console.error('Error clocking in:', error);
      toast.error('Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user?.id || !currentSession) return;
    
    setLoading(true);
    try {
      await WorkSessionService.clockOut();
      toast.success('Clocked out successfully!');
      loadCurrentStatus();
    } catch (error) {
      console.error('Error clocking out:', error);
      toast.error('Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBreak = async () => {
    if (!user?.id || !currentSession) return;
    
    setLoading(true);
    try {
      await BreakService.startBreak();
      toast.success('Break started!');
      loadCurrentStatus();
    } catch (error) {
      console.error('Error starting break:', error);
      toast.error('Failed to start break');
    } finally {
      setLoading(false);
    }
  };

  const handleEndBreak = async () => {
    if (!currentBreak) return;
    
    setLoading(true);
    try {
      await BreakService.endBreak();
      toast.success('Break ended!');
      loadCurrentStatus();
    } catch (error) {
      console.error('Error ending break:', error);
      toast.error('Failed to end break');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = () => {
    if (currentBreak) return 'text-orange-600';
    if (currentSession) return 'text-green-600';
    return 'text-slate-600';
  };

  const getStatusText = () => {
    if (currentBreak) return 'On Break';
    if (currentSession) return 'Clocked In';
    return 'Clocked Out';
  };

  const getStatusIcon = () => {
    if (currentBreak) return <Coffee className="h-5 w-5" />;
    if (currentSession) return <CheckCircle2 className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Clock Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {/* Current Time */}
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-600 rounded-lg">
            <div className={`flex items-center gap-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
          </div>

          {/* Today's Hours */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {todayHours.toFixed(1)}h
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Today's Hours</div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 justify-center">
            {!currentSession ? (
              <Button
                onClick={handleClockIn}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Clock In
              </Button>
            ) : (
              <Button
                onClick={handleClockOut}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Square className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            )}

            {currentSession && !currentBreak ? (
              <Button
                onClick={handleStartBreak}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Coffee className="h-4 w-4 mr-2" />
                Start Break
              </Button>
            ) : currentBreak ? (
              <Button
                onClick={handleEndBreak}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Timer className="h-4 w-4 mr-2" />
                End Break
              </Button>
            ) : (
              <Button disabled className="bg-slate-300 text-slate-500">
                <Coffee className="h-4 w-4 mr-2" />
                Start Break
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
