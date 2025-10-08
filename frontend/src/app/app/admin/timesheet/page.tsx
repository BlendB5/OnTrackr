"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Download, 
  Calendar,
  Filter,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  Plus,
  X,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { timesheetApi, TimesheetEntry, TimesheetSummary, TimesheetFilters } from '@/services/timesheetApi';
import { toast } from 'react-hot-toast';
import { SummaryCards } from '@/components/timesheet/SummaryCards';
import { TimesheetTable } from '@/components/timesheet/TimesheetTable';
import { WeeklyChart } from '@/components/timesheet/WeeklyChart';
import { HourAdjustmentModal } from '@/components/timesheet/HourAdjustmentModal';
import { HourAdjustmentHistory } from '@/components/timesheet/HourAdjustmentHistory';

export default function AdminTimesheetPage() {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [summary, setSummary] = useState<TimesheetSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTimesheets, setSelectedTimesheets] = useState<string[]>([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [showHourAdjustmentModal, setShowHourAdjustmentModal] = useState(false);
  const [selectedTimesheetForAdjustment, setSelectedTimesheetForAdjustment] = useState<string[]>([]);
  
  // Filters
  const [filters, setFilters] = useState<TimesheetFilters>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    department: '',
    status: '',
    userId: ''
  });

  useEffect(() => {
    loadTimesheetData();
  }, [filters]);

  const loadTimesheetData = async () => {
    setLoading(true);
    try {
      const [timesheetData, summaryData] = await Promise.all([
        timesheetApi.getTimesheets(filters),
        timesheetApi.getTimesheetSummary(filters.month!, filters.year!)
      ]);
      
      setTimesheets(timesheetData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading timesheet data:', error);
      toast.error('Failed to load timesheet data');
    } finally {
      setLoading(false);
    }
  };

  const generateTimesheets = async () => {
    try {
      setLoading(true);
      const result = await timesheetApi.generateTimesheets(filters.month!, filters.year!);
      toast.success(result.message);
      loadTimesheetData();
    } catch (error) {
      console.error('Error generating timesheets:', error);
      toast.error('Failed to generate timesheets');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (timesheetId: string) => {
    try {
      await timesheetApi.approveTimesheets([timesheetId], notes);
      toast.success('Timesheet approved successfully');
      setNotes('');
      loadTimesheetData();
    } catch (error) {
      console.error('Error approving timesheet:', error);
      toast.error('Failed to approve timesheet');
    }
  };

  const handleReject = async (timesheetId: string) => {
    try {
      await timesheetApi.rejectTimesheets([timesheetId], notes);
      toast.success('Timesheet rejected successfully');
      setNotes('');
      loadTimesheetData();
    } catch (error) {
      console.error('Error rejecting timesheet:', error);
      toast.error('Failed to reject timesheet');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedTimesheets.length === 0) {
      toast.error('Please select timesheets to approve');
      return;
    }

    try {
      await timesheetApi.approveTimesheets(selectedTimesheets, notes);
      toast.success(`${selectedTimesheets.length} timesheets approved successfully`);
      setSelectedTimesheets([]);
      setShowNotesModal(false);
      setNotes('');
      loadTimesheetData();
    } catch (error) {
      console.error('Error approving timesheets:', error);
      toast.error('Failed to approve timesheets');
    }
  };

  const handleBulkReject = async () => {
    if (selectedTimesheets.length === 0) {
      toast.error('Please select timesheets to reject');
      return;
    }

    try {
      await timesheetApi.rejectTimesheets(selectedTimesheets, notes);
      toast.success(`${selectedTimesheets.length} timesheets rejected successfully`);
      setSelectedTimesheets([]);
      setShowNotesModal(false);
      setNotes('');
      loadTimesheetData();
    } catch (error) {
      console.error('Error rejecting timesheets:', error);
      toast.error('Failed to reject timesheets');
    }
  };

  const handleAdjustHours = (timesheetId: string) => {
    setSelectedTimesheetForAdjustment([timesheetId]);
    setShowHourAdjustmentModal(true);
  };

  const handleBulkAdjustHours = () => {
    if (selectedTimesheets.length === 0) {
      toast.error('Please select timesheets to adjust');
      return;
    }
    setSelectedTimesheetForAdjustment(selectedTimesheets);
    setShowHourAdjustmentModal(true);
  };

  const handleConfirmHourAdjustment = async (adjustmentType: 'add' | 'subtract', hours: number, reason: string) => {
    try {
      setLoading(true);
      
      if (selectedTimesheetForAdjustment.length === 1) {
        await timesheetApi.adjustHours(selectedTimesheetForAdjustment[0], adjustmentType, hours, reason);
        toast.success(`Successfully ${adjustmentType === 'add' ? 'added' : 'subtracted'} ${hours} hours`);
      } else {
        const result = await timesheetApi.bulkAdjustHours(selectedTimesheetForAdjustment, adjustmentType, hours, reason);
        toast.success(result.message);
      }
      
      setShowHourAdjustmentModal(false);
      setSelectedTimesheetForAdjustment([]);
      loadTimesheetData();
    } catch (error) {
      console.error('Error adjusting hours:', error);
      toast.error('Failed to adjust hours');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    timesheetApi.exportToCSV(timesheets, `timesheets-${filters.year}-${filters.month}.csv`);
    toast.success('Timesheet data exported successfully');
  };

  // Calculate summary statistics
  const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
  const totalOvertime = timesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0);
  const totalPay = timesheets.reduce((sum, ts) => sum + ts.totalPay, 0);
  const regularHours = totalHours - totalOvertime;

  return (
    <div className="px-4 py-6 bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10" />
            <div className="relative">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Link href="/app/admin">
                    <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80 border-white/20">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Admin
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
                      Timesheet Management
                    </h1>
                    <p className="text-slate-600 mt-2 text-lg">
                      Review, approve, and manage employee timesheets
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={generateTimesheets} 
                    variant="outline"
                    disabled={loading}
                    className="bg-white/50 hover:bg-white/80"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Generate Timesheets
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
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SummaryCards
            totalHours={totalHours}
            regularHours={regularHours}
            overtimeHours={totalOvertime}
            totalPay={totalPay}
            targetHours={160}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <select
                    value={filters.month}
                    onChange={(e) => setFilters(prev => ({ ...prev, month: parseInt(e.target.value) }))}
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
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-24 bg-white/50"
                    min="2020"
                    max="2030"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search employees..."
                    value={filters.userId}
                    onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                    className="w-48 bg-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Bar */}
        {selectedTimesheets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">
                      {selectedTimesheets.length} timesheet{selectedTimesheets.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      onClick={() => {
                        setActionType('approve');
                        setShowNotesModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setActionType('reject');
                        setShowNotesModal(true);
                      }}
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={handleBulkAdjustHours}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Adjust Hours
                    </Button>
                  </div>
                  <Button
                    onClick={() => setSelectedTimesheets([])}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Timesheet Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2"
          >
            <TimesheetTable
              timesheets={timesheets}
              isAdmin={true}
              onApprove={handleApprove}
              onReject={handleReject}
              onAdjustHours={handleAdjustHours}
              loading={loading}
            />
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-1 space-y-6"
          >
            <WeeklyChart timesheets={timesheets} />
            <HourAdjustmentHistory />
          </motion.div>
        </div>

        {/* Notes Modal */}
        <AnimatePresence>
          {showNotesModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {actionType === 'approve' ? 'Approve Timesheets' : 'Reject Timesheets'}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any notes about this action..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => {
                      setShowNotesModal(false);
                      setNotes('');
                      setActionType(null);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={actionType === 'approve' ? handleBulkApprove : handleBulkReject}
                    className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  >
                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hour Adjustment Modal */}
        <HourAdjustmentModal
          isOpen={showHourAdjustmentModal}
          onClose={() => {
            setShowHourAdjustmentModal(false);
            setSelectedTimesheetForAdjustment([]);
          }}
          onConfirm={handleConfirmHourAdjustment}
          timesheetIds={selectedTimesheetForAdjustment}
          loading={loading}
        />
      </div>
    </div>
  );
}