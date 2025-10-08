"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Clock,
  Target,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkSessionService } from '@/lib/work-sessions';

interface WorkingTimeChartProps {
  className?: string;
}

interface DayData {
  day: string;
  hours: number;
  target: number;
}

export function WorkingTimeChart({ className = "" }: WorkingTimeChartProps) {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayProgress, setTodayProgress] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadWeeklyData();
    }
  }, [user?.id]);

  const loadWeeklyData = async () => {
    try {
      setLoading(true);
      
      // Get the current week's data
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      
      const weeklyData: DayData[] = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + i);
        
        // For demo purposes, use mock data
        const sessions: any[] = [];
        
        let totalMinutes = 0;
        for (const session of sessions) {
          if (session.clockOut) {
            totalMinutes += (session.clockOut.getTime() - session.clockIn.getTime()) / (1000 * 60);
          }
        }
        
        const hours = totalMinutes / 60;
        const target = 8; // 8 hours target per day
        
        weeklyData.push({
          day: dayNames[i],
          hours: hours,
          target: target
        });
      }
      
      setWeeklyData(weeklyData);
      
      // Calculate today's progress
      const todayIndex = today.getDay();
      const todayHours = weeklyData[todayIndex]?.hours || 0;
      setTodayProgress(Math.min((todayHours / 8) * 100, 100));
      
    } catch (error) {
      console.error('Error loading weekly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxHours = () => {
    return Math.max(8, ...weeklyData.map(d => Math.max(d.hours, d.target)));
  };

  const getBarHeight = (hours: number) => {
    const maxHours = getMaxHours();
    return Math.max((hours / maxHours) * 100, 5); // Minimum 5% height
  };

  const getBarColor = (hours: number, target: number) => {
    if (hours >= target) return 'bg-green-500';
    if (hours >= target * 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTotalWeekHours = () => {
    return weeklyData.reduce((sum, day) => sum + day.hours, 0);
  };

  const getWeekTarget = () => {
    return weeklyData.reduce((sum, day) => sum + day.target, 0);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={className}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-700">
          <CardContent className="p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-4"></div>
              <div className="h-32 bg-slate-200 dark:bg-slate-600 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Weekly Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Today's Progress */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Today's Progress</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${todayProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {todayProgress.toFixed(0)}% of daily target
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="space-y-4">
            <div className="flex items-end justify-between h-32 px-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    <div 
                      className={`w-8 rounded-t-md transition-all duration-500 ${getBarColor(day.hours, day.target)}`}
                      style={{ height: `${getBarHeight(day.hours)}%` }}
                      title={`${day.hours.toFixed(1)}h / ${day.target}h`}
                    ></div>
                    <div 
                      className="w-8 h-1 bg-slate-300 dark:bg-slate-600 rounded-b"
                      title="Target"
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {day.day}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {day.hours.toFixed(1)}h
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">This Week</span>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {getTotalWeekHours().toFixed(1)}h
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Target</span>
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {getWeekTarget().toFixed(0)}h
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {getTotalWeekHours() >= getWeekTarget() 
                  ? `Great! You're ${(getTotalWeekHours() - getWeekTarget()).toFixed(1)}h ahead` 
                  : `Need ${(getWeekTarget() - getTotalWeekHours()).toFixed(1)}h more this week`
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



