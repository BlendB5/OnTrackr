"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { TimesheetEntry } from '@/services/timesheetApi';

interface WeeklyChartProps {
  timesheets: TimesheetEntry[];
  className?: string;
}

export function WeeklyChart({ timesheets, className = "" }: WeeklyChartProps) {
  // Group timesheets by week
  const weeklyData = timesheets.reduce((acc, timesheet) => {
    const date = new Date(timesheet.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = {
        week: weekStart,
        weekLabel: `Week ${Math.ceil(date.getDate() / 7)}`,
        totalHours: 0,
        regularHours: 0,
        overtimeHours: 0,
        days: 0
      };
    }
    
    acc[weekKey].totalHours += timesheet.hoursWorked;
    acc[weekKey].regularHours += timesheet.regularHours;
    acc[weekKey].overtimeHours += timesheet.overtimeHours;
    acc[weekKey].days += 1;
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(weeklyData)
    .sort((a, b) => a.week.getTime() - b.week.getTime())
    .map((week, index) => ({
      ...week,
      weekLabel: `W${index + 1}`,
      weekStart: week.week.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-800">{data.weekStart}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-600">Total: {data.totalHours.toFixed(1)}h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-600">Regular: {data.regularHours.toFixed(1)}h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm text-slate-600">Overtime: {data.overtimeHours.toFixed(1)}h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded"></div>
              <span className="text-sm text-slate-600">Days: {data.days}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value: number, index: number) => {
    const colors = [
      'hsl(220, 70%, 50%)',
      'hsl(220, 70%, 60%)',
      'hsl(220, 70%, 70%)',
      'hsl(220, 70%, 80%)',
      'hsl(220, 70%, 90%)'
    ];
    return colors[index % colors.length];
  };

  if (chartData.length === 0) {
    return (
      <Card className={`shadow-xl border-0 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Weekly Hours Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-600 dark:text-slate-300">No data available for chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={className}
    >
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Weekly Hours Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="weekLabel" 
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
                  dataKey="totalHours" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.totalHours, index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-600">Total Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-600">Regular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm text-slate-600">Overtime</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
