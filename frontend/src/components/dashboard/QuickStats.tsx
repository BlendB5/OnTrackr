"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown,
  Clock,
  Coffee,
  Target,
  Award,
  Zap,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkSessionService } from '@/lib/work-sessions';
import { BreakService } from '@/lib/break-service';

interface QuickStatsProps {
  className?: string;
}

interface StatsData {
  todayHours: number;
  weeklyHours: number;
  monthlyHours: number;
  averageSessionLength: number;
  totalBreaks: number;
  productivity: number;
  streak: number;
  efficiency: number;
}

export function QuickStats({ className = "" }: QuickStatsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    todayHours: 0,
    weeklyHours: 0,
    monthlyHours: 0,
    averageSessionLength: 0,
    totalBreaks: 0,
    productivity: 0,
    streak: 0,
    efficiency: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user?.id]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Get today's sessions
      const todaySessionsResponse = await WorkSessionService.getTodaySessions();
      const todaySessions = todaySessionsResponse.sessions;
      let todayMinutes = 0;
      for (const session of todaySessions) {
        if (session.clockOut) {
          todayMinutes += (new Date(session.clockOut).getTime() - new Date(session.clockIn).getTime()) / (1000 * 60);
        }
      }
      
      // For demo purposes, use today's data for weekly and monthly
      // In a real app, you'd implement proper date filtering
      const weeklyMinutes = todayMinutes * 5; // Assume 5 working days
      const monthlyMinutes = todayMinutes * 22; // Assume 22 working days
      
      // Get breaks for today
      const todayBreaks = await BreakService.getTodayBreaks();
      
      // Calculate average session length
      const completedSessions = todaySessions.filter(s => s.clockOut);
      const avgSessionLength = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (new Date(s.clockOut!).getTime() - new Date(s.clockIn).getTime()) / (1000 * 60), 0) / completedSessions.length
        : 0;
      
      // Calculate productivity (hours worked vs target)
      const productivity = Math.min((todayMinutes / 60) / 8 * 100, 100);
      
      // Calculate efficiency (working time vs total time)
      const efficiency = todayMinutes > 0 ? Math.min((todayMinutes / (todayMinutes + (todayBreaks.breaks.length * 15))) * 100, 100) : 0;
      
      setStats({
        todayHours: todayMinutes / 60,
        weeklyHours: weeklyMinutes / 60,
        monthlyHours: monthlyMinutes / 60,
        averageSessionLength: avgSessionLength / 60,
        totalBreaks: todayBreaks.breaks.length,
        productivity,
        streak: 5, // This would need to be calculated based on consecutive work days
        efficiency
      });
      
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Today's Hours",
      value: `${stats.todayHours.toFixed(1)}h`,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      trend: stats.todayHours >= 8 ? "up" : "down"
    },
    {
      title: "Weekly Total",
      value: `${stats.weeklyHours.toFixed(1)}h`,
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      trend: stats.weeklyHours >= 40 ? "up" : "down"
    },
    {
      title: "Avg Session",
      value: `${stats.averageSessionLength.toFixed(1)}h`,
      icon: Target,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      trend: stats.averageSessionLength >= 2 ? "up" : "down"
    },
    {
      title: "Breaks Today",
      value: stats.totalBreaks.toString(),
      icon: Coffee,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      trend: stats.totalBreaks <= 3 ? "up" : "down"
    },
    {
      title: "Productivity",
      value: `${stats.productivity.toFixed(0)}%`,
      icon: Zap,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      trend: stats.productivity >= 80 ? "up" : "down"
    },
    {
      title: "Efficiency",
      value: `${stats.efficiency.toFixed(0)}%`,
      icon: Award,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      trend: stats.efficiency >= 85 ? "up" : "down"
    }
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={className}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-lg border-0">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={className}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {stat.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}



