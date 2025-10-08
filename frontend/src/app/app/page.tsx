"use client";

import { useAuth } from '@/components/auth/auth-provider';
import { motion } from 'framer-motion';
import { MainClockCard } from '@/components/dashboard/MainClockCard';
import { WorkingTimeChart } from '@/components/dashboard/WorkingTimeChart';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { UpcomingShifts } from '@/components/dashboard/UpcomingShifts';
import { RemindersCard } from '@/components/dashboard/RemindersCard';
import { CoolHeader } from '@/components/dashboard/CoolHeader';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { FloatingElements } from '@/components/ui/floating-elements';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  Calendar,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

export default function MainDashboard() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Content */}
      <div className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Cool Header */}
          <CoolHeader />

          {/* Main Clock Section - Primary Focus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Clock Card - Takes up more space */}
              <div className="lg:col-span-1">
                <MainClockCard className="w-full" />
              </div>

              {/* Working Time Chart - Side by side with clock */}
              <div className="lg:col-span-1">
                <GlassCard delay={0.3}>
                  <WorkingTimeChart className="w-full" />
                </GlassCard>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              >
                <BarChart3 className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Quick Stats
              </h2>
            </div>
            <GlassCard delay={0.5}>
              <QuickStats className="w-full" />
            </GlassCard>
          </motion.div>

          {/* Secondary Information Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          >
            {/* Upcoming Shifts */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                >
                  <Calendar className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Upcoming Shifts
                </h3>
              </div>
              <GlassCard delay={0.7}>
                <UpcomingShifts className="w-full" />
              </GlassCard>
            </div>

            {/* Reminders */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                >
                  <TrendingUp className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                  Reminders & Tasks
                </h3>
              </div>
              <GlassCard delay={0.8}>
                <RemindersCard className="w-full" />
              </GlassCard>
            </div>
          </motion.div>

          {/* Admin Section - Only visible for admins */}
          {user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                >
                  <Users className="h-6 w-6 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Admin Overview
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { value: "24", label: "Total Employees", color: "from-purple-500 to-pink-500", delay: 1.0 },
                  { value: "18", label: "Active Today", color: "from-green-500 to-emerald-500", delay: 1.1 },
                  { value: "156.5h", label: "Total Hours Today", color: "from-blue-500 to-cyan-500", delay: 1.2 }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: stat.delay }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="relative overflow-hidden bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="relative z-10 text-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: stat.delay + 0.3, type: "spring", stiffness: 200 }}
                        className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-white/70 font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}