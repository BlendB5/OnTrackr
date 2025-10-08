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
  Timer,
  Utensils,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkSessionService, WorkSession } from '@/lib/work-sessions';
import { BreakService, Break } from '@/lib/break-service';
import { toast } from 'react-hot-toast';

interface MainClockCardProps {
  className?: string;
}

export function MainClockCard({ className = "" }: MainClockCardProps) {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [currentBreak, setCurrentBreak] = useState<Break | null>(null);
  const [todayHours, setTodayHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [breakDuration, setBreakDuration] = useState(0);

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

  // Update session duration when clocked in
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentSession && currentSession.clockIn && !currentBreak) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = (now.getTime() - new Date(currentSession.clockIn).getTime()) / (1000 * 60); // minutes
        setSessionDuration(duration);
      }, 1000);
    } else if (currentBreak && currentBreak.breakStart) {
      interval = setInterval(() => {
        const now = new Date();
        const breakStart = new Date(currentBreak.breakStart);
        const duration = (now.getTime() - breakStart.getTime()) / (1000 * 60); // minutes
        setBreakDuration(duration);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession, currentBreak]);

  const loadCurrentStatus = async () => {
    try {
      const [session, breaksResponse, currentBreakResponse] = await Promise.all([
        WorkSessionService.getCurrentSession(),
        BreakService.getTodayBreaks(),
        BreakService.getCurrentBreak()
      ]);
      
      setCurrentSession(session.session);
      
      // Set current break from the current break response
      setCurrentBreak(currentBreakResponse.break);
      
      // Calculate today's total hours
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sessionsResponse = await WorkSessionService.getTodaySessions();
      const sessions = sessionsResponse.sessions;
      
      let totalMinutes = 0;
      for (const s of sessions) {
        if (s.clockOut && s.clockIn) {
          totalMinutes += (new Date(s.clockOut).getTime() - new Date(s.clockIn).getTime()) / (1000 * 60);
        }
      }
      
      // Subtract break time
      const breaks = breaksResponse.breaks;
      const breakMinutes = breaks.reduce((sum, b) => {
        if (b.breakEnd) {
          const startTime = new Date(b.breakStart);
          const endTime = new Date(b.breakEnd);
          return sum + (endTime.getTime() - startTime.getTime()) / (1000 * 60);
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

  const handleStartBreak = async (breakType: 'short' | 'lunch') => {
    if (!user?.id || !currentSession) return;
    
    setLoading(true);
    try {
      const breakTypeValue = breakType === 'lunch' ? 'break' : 'short_break';
      await BreakService.startBreak(breakTypeValue);
      toast.success(`${breakType === 'lunch' ? 'Lunch' : 'Short'} break started!`);
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = () => {
    if (currentBreak) return 'text-galactic-neon-purple';
    if (currentSession) return 'text-galactic-neon-teal';
    return 'text-slate-400';
  };

  const getStatusText = () => {
    if (currentBreak) {
      return currentBreak.breakType === 'short_break' ? 'On Short Break' : 'On Lunch Break';
    }
    if (currentSession) return 'Clocked In';
    return 'Clocked Out';
  };

  const getStatusIcon = () => {
    if (currentBreak) {
      return currentBreak.breakType === 'short_break' ? <Coffee className="h-5 w-5" /> : <Utensils className="h-5 w-5" />;
    }
    if (currentSession) return <CheckCircle2 className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        delay: 0.1, 
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        transition: { duration: 0.3 }
      }}
      className={className}
    >
      <Card className="relative overflow-hidden shadow-2xl border-0 bg-galactic-surface/90 backdrop-blur-xl border border-galactic-purple-800/50 shadow-galactic-neon-purple/10">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-galactic-neon-purple/10 via-galactic-neon-pink/10 to-galactic-neon-blue/10 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-galactic-neon-purple/20 to-galactic-neon-pink/20 rounded-full blur-2xl"></div>
        
        <CardHeader className="relative z-10 pb-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-r from-galactic-neon-purple to-galactic-neon-pink rounded-full shadow-lg shadow-galactic-neon-purple/50"
            >
              <Clock className="h-5 w-5 text-white" />
            </motion.div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-galactic-neon-purple to-galactic-neon-lavender bg-clip-text text-transparent">
              Time Tracker
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          {/* Current Time Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ textShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                  "0 0 30px rgba(139, 92, 246, 0.8)",
                  "0 0 20px rgba(139, 92, 246, 0.5)"
                ]}}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl font-bold bg-gradient-to-r from-galactic-neon-purple via-galactic-neon-pink to-galactic-neon-blue bg-clip-text text-transparent mb-2 font-mono"
              >
                {formatTime(currentTime)}
              </motion.div>
              <div className="absolute inset-0 text-4xl font-bold text-galactic-neon-purple/20 mb-2 font-mono blur-sm">
                {formatTime(currentTime)}
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-slate-300 font-medium"
            >
              {formatDate(currentTime)}
            </motion.div>
          </motion.div>

          {/* Status Display */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 p-3 bg-galactic-purple-900/30 rounded-xl backdrop-blur-sm border border-galactic-purple-800/50"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`flex items-center gap-2 ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="font-semibold text-sm">{getStatusText()}</span>
            </motion.div>
          </motion.div>

          {/* Duration Display */}
          {(currentSession || currentBreak) && (
            <div className="text-center">
              <div className="text-2xl font-bold text-galactic-neon-purple mb-1">
                {currentBreak ? formatDuration(breakDuration) : formatDuration(sessionDuration)}
              </div>
              <div className="text-xs text-slate-300">
                {currentBreak ? 'Break Duration' : 'Session Duration'}
              </div>
            </div>
          )}

          {/* Today's Hours Summary */}
          <div className="text-center p-3 bg-galactic-purple-900/20 rounded-lg border border-galactic-purple-800/30">
            <div className="text-xl font-bold text-galactic-neon-purple mb-1">
              {todayHours.toFixed(1)}h
            </div>
            <div className="text-xs text-slate-300">Today's Total Hours</div>
          </div>

          {/* Main Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-3"
          >
            {!currentSession ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleClockIn}
                  disabled={loading}
                  size="sm"
                  className="relative overflow-hidden bg-gradient-to-r from-galactic-neon-teal to-galactic-neon-blue hover:from-galactic-neon-teal/80 hover:to-galactic-neon-blue/80 text-white py-3 rounded-xl shadow-lg border-0 font-semibold shadow-galactic-neon-teal/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                  <Play className="h-4 w-4 mr-1" />
                  Clock In
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleClockOut}
                  disabled={loading}
                  size="sm"
                  className="relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 rounded-xl shadow-lg border-0 font-semibold"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                  <Square className="h-4 w-4 mr-1" />
                  Clock Out
                </Button>
              </motion.div>
            )}

            {currentBreak ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleEndBreak}
                  disabled={loading}
                  size="sm"
                  className="relative overflow-hidden bg-gradient-to-r from-galactic-neon-blue to-galactic-neon-teal hover:from-galactic-neon-blue/80 hover:to-galactic-neon-teal/80 text-white py-3 rounded-xl shadow-lg border-0 font-semibold shadow-galactic-neon-blue/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  End Break
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: currentSession ? 1.05 : 1 }}
                whileTap={{ scale: currentSession ? 0.95 : 1 }}
              >
                <Button
                  onClick={() => handleStartBreak('short')}
                  disabled={loading || !currentSession}
                  size="sm"
                  className={`relative overflow-hidden py-3 rounded-xl shadow-lg border-0 font-semibold ${
                    currentSession 
                      ? 'bg-gradient-to-r from-galactic-neon-purple to-galactic-neon-pink hover:from-galactic-neon-purple/80 hover:to-galactic-neon-pink/80 text-white shadow-galactic-neon-purple/30' 
                      : 'bg-galactic-purple-900/50 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {currentSession && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                  )}
                  <Coffee className="h-4 w-4 mr-1" />
                  Short Break
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Secondary Break Button */}
          {currentSession && !currentBreak && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleStartBreak('lunch')}
                disabled={loading}
                size="sm"
                className="relative overflow-hidden w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg border-0 font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                <Utensils className="h-4 w-4 mr-1" />
                Lunch Break
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
