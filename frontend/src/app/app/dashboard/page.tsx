"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Activity,
  BarChart3,
  ArrowUp,
  Coffee,
  PlayCircle,
  CalendarDays,
  Award,
  Target,
  Zap,
  FileText,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock data for charts
const weeklyData = [
  { day: 'Mon', hours: 8.5 },
  { day: 'Tue', hours: 7.2 },
  { day: 'Wed', hours: 8.8 },
  { day: 'Thu', hours: 7.5 },
  { day: 'Fri', hours: 8.1 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 0 }
];

const activityData = [
  { time: '9:00 AM', action: 'Clocked In' },
  { time: '12:30 PM', action: 'Break Start' },
  { time: '1:00 PM', action: 'Break End' },
  { time: '5:30 PM', action: 'Still Working...' }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10" />
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {getGreeting()}, {user?.name}! 👋
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/app/time-tracker">
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Time Tracker
                    </Button>
                  </Link>
                  <Link href="/app/timesheet">
                    <Button variant="outline" className="bg-white/50 dark:bg-slate-700/50">
                      <FileText className="h-4 w-4 mr-2" />
                      Timesheet
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-100">Hours Today</CardTitle>
                  <Timer className="h-5 w-5 text-blue-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7.5h</div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-4 w-4 text-blue-100" />
                  <span className="text-xs text-blue-100">+1.5h from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-purple-100">This Week</CardTitle>
                  <CalendarDays className="h-5 w-5 text-purple-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">40.1h</div>
                <div className="flex items-center gap-1 mt-2">
                  <Target className="h-4 w-4 text-purple-100" />
                  <span className="text-xs text-purple-100">100% of 40h target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-green-100">Productivity</CardTitle>
                  <Zap className="h-5 w-5 text-green-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">95%</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-100" />
                  <span className="text-xs text-green-100">Above average</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-orange-100">Attendance</CardTitle>
                  <CheckCircle className="h-5 w-5 text-orange-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98%</div>
                <div className="flex items-center gap-1 mt-2">
                  <Award className="h-4 w-4 text-orange-100" />
                  <span className="text-xs text-orange-100">Excellent!</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Hours Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    This Week's Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Today's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-200">{item.action}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Link href="/app/schedule">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">My Schedule</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">View upcoming shifts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/timesheet">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">Timesheet</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Review your hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {user?.role === 'admin' && (
              <Link href="/app/reports">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Reports</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Analytics & insights</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}