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
  AlertCircle,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Coffee,
  PlayCircle,
  StopCircle,
  CalendarDays,
  DollarSign,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { TodaySummary } from '@/components/dashboard/TodaySummary';
import { WeeklyOverview } from '@/components/dashboard/WeeklyOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { AttendanceSummary } from '@/components/dashboard/AttendanceSummary';
import { PendingApprovals } from '@/components/dashboard/PendingApprovals';
import { AdminStatsCard } from '@/components/dashboard/AdminStatsCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Main Content */}
      <div className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-indigo-500/20" />
              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
                      {currentTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <Link href="/app/time-tracker">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Clock In/Out
                      </Button>
                    </Link>
                    <Link href="/app/timesheet">
                      <Button variant="outline" className="bg-white/50 dark:bg-slate-700/50">
                        <Calendar className="h-4 w-4 mr-2" />
                        Timesheet
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Hours Today */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-100">Hours Today</CardTitle>
                  <Clock className="h-5 w-5 text-blue-200" />
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

            {/* This Week */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-purple-100">This Week</CardTitle>
                  <CalendarDays className="h-5 w-5 text-purple-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">38.2h</div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-purple-100" />
                  <span className="text-xs text-purple-100">95% of target</span>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Completed */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-green-100">Tasks Done</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12/15</div>
                <div className="flex items-center gap-1 mt-2">
                  <Award className="h-4 w-4 text-green-100" />
                  <span className="text-xs text-green-100">80% completion rate</span>
                </div>
              </CardContent>
            </Card>

            {/* Attendance */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-orange-100">Attendance</CardTitle>
                  <Activity className="h-5 w-5 text-orange-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98%</div>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="h-4 w-4 text-orange-100" />
                  <span className="text-xs text-orange-100">Excellent record</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Today's Summary & Weekly Overview */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TodaySummary />
              </motion.div>

              {/* Weekly Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <WeeklyOverview />
              </motion.div>

              {/* Admin Section - Only for Admins */}
              {user?.role === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        Team Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <AdminStatsCard
                          title="Total Employees"
                          value="24"
                          icon={Users}
                          color="blue"
                        />
                        <AdminStatsCard
                          title="Active Today"
                          value="18"
                          icon={CheckCircle}
                          color="green"
                        />
                        <AdminStatsCard
                          title="On Break"
                          value="3"
                          icon={Coffee}
                          color="orange"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Right Column - Activity & Approvals */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RecentActivity />
              </motion.div>

              {/* Attendance Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AttendanceSummary />
              </motion.div>

              {/* Pending Approvals - Admin Only */}
              {user?.role === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <PendingApprovals />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}