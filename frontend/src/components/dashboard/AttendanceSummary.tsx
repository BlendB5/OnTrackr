"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface AttendanceSummaryProps {
  className?: string;
}

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  total: number;
  attendanceRate: number;
}

export function AttendanceSummary({ className = "" }: AttendanceSummaryProps) {
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendanceStats();
  }, []);

  const loadAttendanceStats = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockStats: AttendanceStats = {
        present: 12,
        absent: 2,
        late: 3,
        total: 17,
        attendanceRate: 88.2
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading attendance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceRateIcon = (rate: number) => {
    if (rate >= 90) return <CheckCircle2 className="h-4 w-4" />;
    if (rate >= 80) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card className={`shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white ${className}`}>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading attendance...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {/* Overall Stats */}
          <div className="text-center mb-6">
            <div className={`text-3xl font-bold ${getAttendanceRateColor(stats.attendanceRate)}`}>
              {stats.attendanceRate.toFixed(1)}%
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
              {getAttendanceRateIcon(stats.attendanceRate)}
              Attendance Rate
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-800">Present</div>
                  <div className="text-sm text-green-600">On time and working</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.present}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-orange-800">Late</div>
                  <div className="text-sm text-orange-600">Arrived after start time</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.late}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-red-800">Absent</div>
                  <div className="text-sm text-red-600">Not present today</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {stats.absent}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total Employees</span>
              <span className="text-lg font-bold text-slate-800">{stats.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
