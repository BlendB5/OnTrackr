"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkSessionService, WorkSession } from '@/lib/work-sessions';
import { BreakService, Break } from '@/lib/break-service';

interface WeeklyOverviewChartProps {
  className?: string;
}

interface ChartData {
  day: string;
  hours: number;
  date: string;
}

export function WeeklyOverviewChart({ className = "" }: WeeklyOverviewChartProps) {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadWeeklyData();
    }
  }, [user?.id]);

  const loadWeeklyData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const chartData: ChartData[] = [];
      
      // Get last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        // For demo purposes, use mock data
        // In a real app, you'd implement proper date range filtering
        const sessions: any[] = []; // Mock empty sessions for now
        const breaks: any[] = []; // Mock empty breaks for now
        
        // Calculate total hours
        let totalMinutes = 0;
        for (const session of sessions) {
          if (session.clockOut) {
            totalMinutes += (session.clockOut.getTime() - session.clockIn.getTime()) / (1000 * 60);
          }
        }
        
        // Subtract break time
        const breakMinutes = breaks.reduce((sum, breakItem) => {
          if (breakItem.breakEnd) {
            return sum + (breakItem.breakEnd.getTime() - breakItem.breakStart.getTime()) / (1000 * 60);
          }
          return sum;
        }, 0);
        
        const totalHours = Math.max(0, (totalMinutes - breakMinutes) / 60);
        
        chartData.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          hours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
      
      setChartData(chartData);
    } catch (error) {
      console.error('Error loading weekly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-800">{data.date}</p>
          <p className="text-sm text-slate-600">
            <span className="text-purple-600 font-medium">{data.hours}h</span> worked
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value: number, index: number) => {
    const colors = [
      'hsl(262, 83%, 58%)', // Purple
      'hsl(262, 83%, 65%)',
      'hsl(262, 83%, 72%)',
      'hsl(262, 83%, 79%)',
      'hsl(262, 83%, 86%)',
      'hsl(262, 83%, 93%)',
      'hsl(262, 83%, 100%)'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Card className={`shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white ${className}`}>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading weekly data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="hours" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.hours, index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stats */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-4 text-center justify-items-center">
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {chartData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
                </div>
                <div className="text-xs text-slate-600">Total Week</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {(chartData.reduce((sum, day) => sum + day.hours, 0) / 7).toFixed(1)}h
                </div>
                <div className="text-xs text-slate-600">Daily Average</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {Math.max(...chartData.map(day => day.hours)).toFixed(1)}h
                </div>
                <div className="text-xs text-slate-600">Best Day</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
