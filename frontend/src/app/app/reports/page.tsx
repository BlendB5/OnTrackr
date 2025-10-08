'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Download,
  Calendar,
  Users,
  Clock,
  DollarSign,
  Award,
  AlertCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RePieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useAuth } from '@/components/auth/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { timesheetApi, TimesheetEntry } from '@/services/timesheetApi';

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

interface DepartmentStats {
  name: string;
  totalHours: number;
  employees: number;
  avgHoursPerEmployee: number;
  totalPay: number;
}

interface MonthlyTrend {
  month: string;
  hours: number;
  overtime: number;
  employees: number;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadReportsData();
  }, [selectedYear, selectedMonth, dateRange]);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      // For now, load current month data
      const data = await timesheetApi.getTimesheets({ 
        month: selectedMonth, 
        year: selectedYear 
      });
      setTimesheets(data);
    } catch (error) {
      console.error('Error loading reports data:', error);
      // Use mock data for demo
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockData: TimesheetEntry[] = Array.from({ length: 60 }, (_, i) => ({
      id: `ts-${i}`,
      userId: `user-${Math.floor(i / 20)}`,
      date: new Date(selectedYear, selectedMonth - 1, (i % 20) + 1).toISOString().split('T')[0],
      hoursWorked: 7 + Math.random() * 3,
      overtimeHours: Math.random() > 0.7 ? Math.random() * 2 : 0,
      regularHours: 8,
      hourlyRate: 25 + Math.random() * 25,
      regularPay: 200 + Math.random() * 200,
      overtimePay: Math.random() > 0.7 ? Math.random() * 50 : 0,
      totalPay: 200 + Math.random() * 250,
      status: ['approved', 'approved', 'approved', 'pending'][Math.floor(Math.random() * 4)] as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      User: {
        id: `user-${Math.floor(i / 20)}`,
        name: ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(i / 20)],
        email: `user${Math.floor(i / 20)}@example.com`,
        department: ['Engineering', 'Marketing', 'Sales'][Math.floor(i / 20) % 3],
        hourlyRate: 25 + Math.random() * 25
      }
    }));
    setTimesheets(mockData);
  };

  // Calculate statistics
  const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
  const totalOvertime = timesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0);
  const totalPay = timesheets.reduce((sum, ts) => sum + ts.totalPay, 0);
  const uniqueEmployees = new Set(timesheets.map(ts => ts.userId)).size;
  const avgHoursPerEmployee = uniqueEmployees > 0 ? totalHours / uniqueEmployees : 0;
  const approvedCount = timesheets.filter(ts => ts.status === 'approved').length;
  const pendingCount = timesheets.filter(ts => ts.status === 'pending').length;

  // Department breakdown
  const departmentStats: DepartmentStats[] = Array.from(
    timesheets.reduce((acc, ts) => {
      const dept = ts.User.department || 'Unknown';
      if (!acc.has(dept)) {
        acc.set(dept, {
          name: dept,
          totalHours: 0,
          employees: new Set(),
          avgHoursPerEmployee: 0,
          totalPay: 0
        });
      }
      const stats = acc.get(dept)!;
      stats.totalHours += ts.hoursWorked;
      stats.employees.add(ts.userId);
      stats.totalPay += ts.totalPay;
      return acc;
    }, new Map()).values()
  ).map(dept => ({
    ...dept,
    employees: dept.employees.size,
    avgHoursPerEmployee: dept.totalHours / dept.employees.size
  }));

  // Daily hours trend (last 30 days or current month)
  const dailyTrend = Array.from(
    timesheets.reduce((acc, ts) => {
      const date = new Date(ts.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc.has(date)) {
        acc.set(date, { date, hours: 0, overtime: 0, count: 0 });
      }
      const data = acc.get(date)!;
      data.hours += ts.hoursWorked;
      data.overtime += ts.overtimeHours;
      data.count += 1;
      return acc;
    }, new Map()).values()
  ).slice(0, 30);

  // Top performers
  const topPerformers = Array.from(
    timesheets.reduce((acc, ts) => {
      if (!acc.has(ts.userId)) {
        acc.set(ts.userId, {
          name: ts.User.name,
          hours: 0,
          pay: 0
        });
      }
      const data = acc.get(ts.userId)!;
      data.hours += ts.hoursWorked;
      data.pay += ts.totalPay;
      return acc;
    }, new Map()).values()
  ).sort((a, b) => b.hours - a.hours).slice(0, 5);

  // Status distribution
  const statusData = [
    { name: 'Approved', value: approvedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Rejected', value: timesheets.filter(ts => ts.status === 'rejected').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const exportReport = () => {
    timesheetApi.exportToCSV(timesheets, `ontrackr-report-${selectedYear}-${selectedMonth}.csv`);
  };

  return (
    <ProtectedRoute requireAdmin={true}>
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Content */}
      <div className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">
                        Analytics & Reports
                      </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                      Comprehensive insights into productivity and performance
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-slate-700/50"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-24 bg-white/50 dark:bg-slate-700/50"
                        min="2020"
                        max="2030"
                      />
                    </div>
                    <Button 
                      onClick={loadReportsData} 
                      variant="outline"
                      disabled={loading}
                      className="bg-white/50 dark:bg-slate-700/50 hover:bg-white/80"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button 
                      onClick={exportReport}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
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
                  <CardTitle className="text-sm font-medium text-blue-100">Total Hours</CardTitle>
                  <Clock className="h-5 w-5 text-blue-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalHours.toFixed(1)}h</div>
                <p className="text-xs text-blue-100 mt-1">
                  {avgHoursPerEmployee.toFixed(1)}h avg per employee
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-purple-100">Total Employees</CardTitle>
                  <Users className="h-5 w-5 text-purple-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{uniqueEmployees}</div>
                <p className="text-xs text-purple-100 mt-1">
                  Active this period
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-green-100">Total Payroll</CardTitle>
                  <DollarSign className="h-5 w-5 text-green-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalPay.toFixed(0)}</div>
                <p className="text-xs text-green-100 mt-1">
                  ${(totalPay / (uniqueEmployees || 1)).toFixed(0)} avg per employee
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-orange-100">Overtime Hours</CardTitle>
                  <Activity className="h-5 w-5 text-orange-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalOvertime.toFixed(1)}h</div>
                <p className="text-xs text-orange-100 mt-1">
                  {((totalOvertime / totalHours) * 100).toFixed(1)}% of total hours
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Hours Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Daily Hours Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyTrend}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOvertime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#colorHours)"
                        name="Regular Hours"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="overtime" 
                        stroke="#ec4899" 
                        fillOpacity={1} 
                        fill="url(#colorOvertime)"
                        name="Overtime"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Department Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Department Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalHours" fill="#8b5cf6" name="Total Hours" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="employees" fill="#ec4899" name="Employees" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Approved
                      </span>
                      <span className="font-semibold">{approvedCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        Pending
                      </span>
                      <span className="font-semibold">{pendingCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{performer.name}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {performer.hours.toFixed(1)} hours
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">${performer.pay.toFixed(0)}</div>
                          <div className="text-xs text-slate-500">Total pay</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Department Statistics Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Department Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold">Department</th>
                        <th className="text-right py-3 px-4 font-semibold">Employees</th>
                        <th className="text-right py-3 px-4 font-semibold">Total Hours</th>
                        <th className="text-right py-3 px-4 font-semibold">Avg Hours/Employee</th>
                        <th className="text-right py-3 px-4 font-semibold">Total Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentStats.map((dept, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="py-3 px-4 font-medium">{dept.name}</td>
                          <td className="text-right py-3 px-4">{dept.employees}</td>
                          <td className="text-right py-3 px-4">{dept.totalHours.toFixed(1)}h</td>
                          <td className="text-right py-3 px-4">{dept.avgHoursPerEmployee.toFixed(1)}h</td>
                          <td className="text-right py-3 px-4 font-semibold text-green-600">
                            ${dept.totalPay.toFixed(0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}


