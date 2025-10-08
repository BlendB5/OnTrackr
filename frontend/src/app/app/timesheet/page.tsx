"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Calendar,
  Filter,
  RefreshCw,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { timesheetApi, TimesheetEntry } from '@/services/timesheetApi';
import { toast } from 'react-hot-toast';
import { SummaryCards } from '@/components/timesheet/SummaryCards';
import { TimesheetTable } from '@/components/timesheet/TimesheetTable';
import { WeeklyChart } from '@/components/timesheet/WeeklyChart';

export default function TimesheetPage() {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadTimesheetData();
    }
  }, [user?.id, selectedMonth, selectedYear]);

  const loadTimesheetData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await timesheetApi.getUserTimesheet(user.id, selectedMonth, selectedYear);
      setTimesheets(data);
    } catch (error) {
      console.error('Error loading timesheet data:', error);
      toast.error('Failed to load timesheet data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    timesheetApi.exportToCSV(timesheets, `my-timesheet-${selectedYear}-${selectedMonth}.csv`);
    toast.success('Timesheet data exported successfully');
  };

  // Calculate summary statistics
  const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
  const totalOvertime = timesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0);
  const totalPay = timesheets.reduce((sum, ts) => sum + ts.totalPay, 0);
  const regularHours = totalHours - totalOvertime;
  const targetHours = 160; // 40 hours/week * 4 weeks

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Content */}
      <div className="relative z-20 px-6 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-full max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-indigo-500/20" />
              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">
                      My Timesheet
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                      Track your work hours, overtime, and salary information
                    </p>
                  </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50"
                    >
                      <option value={1}>January</option>
                      <option value={2}>February</option>
                      <option value={3}>March</option>
                      <option value={4}>April</option>
                      <option value={5}>May</option>
                      <option value={6}>June</option>
                      <option value={7}>July</option>
                      <option value={8}>August</option>
                      <option value={9}>September</option>
                      <option value={10}>October</option>
                      <option value={11}>November</option>
                      <option value={12}>December</option>
                    </select>
                    <Input
                      type="number"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-24 bg-white/50"
                      min="2020"
                      max="2030"
                    />
                  </div>
                  <Button 
                    onClick={loadTimesheetData} 
                    variant="outline"
                    disabled={loading}
                    className="bg-white/50 hover:bg-white/80"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    onClick={exportToCSV} 
                    variant="outline"
                    className="bg-white/50 hover:bg-white/80"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-full max-w-6xl">
            <SummaryCards
              totalHours={totalHours}
              regularHours={regularHours}
              overtimeHours={totalOvertime}
              totalPay={totalPay}
              targetHours={targetHours}
            />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Timesheet Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="xl:col-span-2"
              >
                <TimesheetTable
                  timesheets={timesheets}
                  isAdmin={false}
                  loading={loading}
                />
              </motion.div>

              {/* Weekly Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="xl:col-span-1"
              >
                <WeeklyChart timesheets={timesheets} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        {timesheets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <div className="w-full max-w-6xl">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Monthly Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">
                      {timesheets.length}
                    </div>
                    <div className="text-sm text-blue-600">Days Worked</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {(totalHours / timesheets.length).toFixed(1)}h
                    </div>
                    <div className="text-sm text-green-600">Avg Hours/Day</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">
                      {((totalHours / targetHours) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-purple-600">Target Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </div>
  );
}