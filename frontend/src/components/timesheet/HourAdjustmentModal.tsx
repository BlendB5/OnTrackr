"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Minus, 
  Clock, 
  AlertCircle,
  X,
  Save,
  Users
} from 'lucide-react';

interface HourAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adjustmentType: 'add' | 'subtract', hours: number, reason: string) => void;
  timesheetIds: string[];
  loading?: boolean;
}

export function HourAdjustmentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  timesheetIds, 
  loading = false 
}: HourAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [hours, setHours] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || !reason || parseFloat(hours) <= 0) return;
    
    onConfirm(adjustmentType, parseFloat(hours), reason);
  };

  const handleClose = () => {
    setHours('');
    setReason('');
    setAdjustmentType('add');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-md shadow-2xl"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Adjust Hours
                </CardTitle>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-600">
                {timesheetIds.length === 1 
                  ? 'Adjust hours for this timesheet entry'
                  : `Adjust hours for ${timesheetIds.length} timesheet entries`
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Adjustment Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adjustment Type
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setAdjustmentType('add')}
                      variant={adjustmentType === 'add' ? 'default' : 'outline'}
                      className={`flex-1 ${
                        adjustmentType === 'add' 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'border-green-200 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Hours
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setAdjustmentType('subtract')}
                      variant={adjustmentType === 'subtract' ? 'default' : 'outline'}
                      className={`flex-1 ${
                        adjustmentType === 'subtract' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'border-red-200 text-red-700 hover:bg-red-50'
                      }`}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Subtract Hours
                    </Button>
                  </div>
                </div>

                {/* Hours Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hours to {adjustmentType === 'add' ? 'Add' : 'Subtract'}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="0.0"
                      className="pr-8"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                      hrs
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter hours in decimal format (e.g., 1.5 for 1 hour 30 minutes)
                  </p>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason for Adjustment
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you're adjusting these hours..."
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                    required
                  />
                </div>

                {/* Warning */}
                {adjustmentType === 'subtract' && parseFloat(hours) > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Warning:</p>
                      <p>Subtracting hours will reduce the total worked hours and may affect overtime calculations and pay.</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !hours || !reason || parseFloat(hours) <= 0}
                    className={`flex-1 ${
                      adjustmentType === 'add' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {adjustmentType === 'add' ? 'Add Hours' : 'Subtract Hours'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}





