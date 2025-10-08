"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Plus, 
  Minus, 
  User, 
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { timesheetApi } from '@/services/timesheetApi';

interface HourAdjustment {
  id: string;
  timesheetId: string;
  adminId: string;
  adjustmentType: 'add' | 'subtract';
  hours: number;
  reason: string;
  previousHours: number;
  newHours: number;
  createdAt: string;
  Timesheet: {
    User: {
      id: string;
      name: string;
      email: string;
    };
  };
  Admin: {
    id: string;
    name: string;
    email: string;
  };
}

interface HourAdjustmentHistoryProps {
  timesheetId?: string;
  userId?: string;
  className?: string;
}

export function HourAdjustmentHistory({ 
  timesheetId, 
  userId, 
  className = "" 
}: HourAdjustmentHistoryProps) {
  const [adjustments, setAdjustments] = useState<HourAdjustment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdjustments();
  }, [timesheetId, userId]);

  const loadAdjustments = async () => {
    setLoading(true);
    try {
      const data = await timesheetApi.getHourAdjustments(timesheetId, userId, 20);
      setAdjustments(data);
    } catch (error) {
      console.error('Error loading hour adjustments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAdjustmentIcon = (type: string) => {
    return type === 'add' ? (
      <Plus className="h-4 w-4 text-green-600" />
    ) : (
      <Minus className="h-4 w-4 text-red-600" />
    );
  };

  const getAdjustmentColor = (type: string) => {
    return type === 'add' 
      ? 'bg-green-50 text-green-800 border-green-200' 
      : 'bg-red-50 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <Card className={`shadow-lg border-0 bg-white/80 backdrop-blur-xl ${className}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading adjustment history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg border-0 bg-white/80 backdrop-blur-xl ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Hour Adjustment History
          </CardTitle>
          <Button
            onClick={loadAdjustments}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {adjustments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No hour adjustments found</p>
            <p className="text-sm">Adjustments will appear here when made</p>
          </div>
        ) : (
          <div className="space-y-3">
            {adjustments.map((adjustment, index) => (
              <motion.div
                key={adjustment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getAdjustmentColor(adjustment.adjustmentType)}`}>
                      {getAdjustmentIcon(adjustment.adjustmentType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800">
                          {adjustment.adjustmentType === 'add' ? 'Added' : 'Subtracted'} {adjustment.hours}h
                        </span>
                        <span className="text-sm text-slate-500">
                          by {adjustment.Admin.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {adjustment.reason}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {adjustment.Timesheet.User.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(adjustment.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {adjustment.previousHours}h → {adjustment.newHours}h
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      adjustment.adjustmentType === 'add' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {adjustment.adjustmentType === 'add' ? '+' : '-'}{adjustment.hours}h
                    </div>
                    <div className="text-xs text-slate-500">
                      {adjustment.newHours - adjustment.previousHours > 0 ? '+' : ''}
                      {(adjustment.newHours - adjustment.previousHours).toFixed(1)}h
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}





