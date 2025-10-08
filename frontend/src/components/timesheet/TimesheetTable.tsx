"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Save,
  X,
  MoreVertical,
  Plus,
  Minus,
  Settings
} from 'lucide-react';
import { TimesheetEntry } from '@/services/timesheetApi';

interface TimesheetTableProps {
  timesheets: TimesheetEntry[];
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string, field: string, value: any) => void;
  onAdjustHours?: (id: string) => void;
  loading?: boolean;
}

export function TimesheetTable({ 
  timesheets, 
  isAdmin = false, 
  onApprove, 
  onReject, 
  onEdit,
  onAdjustHours,
  loading = false 
}: TimesheetTableProps) {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleEditStart = (id: string, field: string, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(currentValue?.toString() || '');
  };

  const handleEditSave = () => {
    if (editingCell && onEdit) {
      onEdit(editingCell.id, editingCell.field, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getOvertimeColor = (overtimeHours: number) => {
    if (overtimeHours === 0) return 'text-slate-600';
    if (overtimeHours <= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading timesheet data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timesheets.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl">
        <CardContent className="p-12">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <Clock className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No timesheet data found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your timesheet entries will appear here once they're generated</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Daily Timesheet Entries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Date</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Clock In</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Clock Out</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Breaks</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Total Hours</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Overtime</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Status</th>
                {isAdmin && (
                  <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {timesheets.map((timesheet, index) => (
                  <motion.tr
                    key={timesheet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800">
                        {formatDate(timesheet.date)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(timesheet.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </td>

                    {/* Clock In */}
                    <td className="py-4 px-4">
                      {editingCell?.id === timesheet.id && editingCell.field === 'clockIn' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            autoFocus
                          />
                          <Button size="sm" onClick={handleEditSave} className="h-6 w-6 p-0">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleEditCancel} className="h-6 w-6 p-0">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700">
                            {timesheet.date ? formatTime(timesheet.date) : '--:--'}
                          </span>
                          {isAdmin && timesheet.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStart(timesheet.id, 'clockIn', timesheet.date)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Clock Out */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700">
                          {timesheet.date ? formatTime(timesheet.date) : '--:--'}
                        </span>
                        {isAdmin && timesheet.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStart(timesheet.id, 'clockOut', timesheet.date)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>

                    {/* Breaks */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-700">
                          {timesheet.hoursWorked > 0 ? '30m' : '--'}
                        </span>
                      </div>
                    </td>

                    {/* Total Hours */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">
                          {timesheet.hoursWorked.toFixed(1)}h
                        </span>
                        {timesheet.hoursWorked >= 8 && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Full day" />
                        )}
                      </div>
                    </td>

                    {/* Overtime */}
                    <td className="py-4 px-4">
                      <span className={`font-medium ${getOvertimeColor(timesheet.overtimeHours)}`}>
                        {timesheet.overtimeHours > 0 ? `+${timesheet.overtimeHours.toFixed(1)}h` : '--'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(timesheet.status)}`}>
                        {getStatusIcon(timesheet.status)}
                        {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          {timesheet.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => onApprove?.(timesheet.id)}
                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"
                                title="Approve"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onReject?.(timesheet.id)}
                                className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 text-white"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            onClick={() => onAdjustHours?.(timesheet.id)}
                            className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 text-white"
                            title="Adjust Hours"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          {timesheet.status === 'approved' && (
                            <div className="text-xs text-green-600 font-medium ml-2">
                              Locked
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
