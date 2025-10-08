"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';

interface UpcomingShiftsProps {
  className?: string;
}

interface Shift {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  department?: string;
  type: 'scheduled' | 'overtime' | 'meeting';
}

export function UpcomingShifts({ className = "" }: UpcomingShiftsProps) {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingShifts();
  }, []);

  const loadUpcomingShifts = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockShifts: Shift[] = [
        {
          id: '1',
          title: 'Regular Work Shift',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '17:00',
          location: 'Office',
          department: 'Engineering',
          type: 'scheduled'
        },
        {
          id: '2',
          title: 'Team Meeting',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '11:00',
          location: 'Conference Room A',
          department: 'Engineering',
          type: 'meeting'
        },
        {
          id: '3',
          title: 'Overtime Shift',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '18:00',
          endTime: '22:00',
          location: 'Office',
          department: 'Engineering',
          type: 'overtime'
        }
      ];
      
      setShifts(mockShifts.slice(0, 3)); // Show only next 3 shifts
    } catch (error) {
      console.error('Error loading upcoming shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'overtime': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'meeting': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getShiftTypeIcon = (type: string) => {
    switch (type) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'overtime': return <Clock className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={`shadow-lg border-0 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 ${className}`}>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-2 text-slate-300">Loading shifts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-blue-400" />
              Upcoming Shifts
            </CardTitle>
            <Link href="/app/schedule">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                <ArrowRight className="h-4 w-4 mr-1" />
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          {shifts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-300 mb-2">No upcoming shifts</p>
              <p className="text-sm text-slate-400 mb-4">
                Your next shifts will appear here
              </p>
              <Link href="/app/schedule">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Shift
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              {shifts.map((shift, index) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 border border-slate-700/50 rounded-xl hover:bg-slate-800/30 transition-colors bg-slate-800/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{shift.title}</h4>
                      <p className="text-sm text-slate-300">{formatDate(shift.date)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getShiftTypeColor(shift.type)}`}>
                      {getShiftTypeIcon(shift.type)}
                      {shift.type.charAt(0).toUpperCase() + shift.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {shift.startTime} - {shift.endTime}
                    </div>
                    {shift.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {shift.location}
                      </div>
                    )}
                  </div>
                  
                  {shift.department && (
                    <div className="mt-3 text-xs text-slate-500 bg-slate-700/30 px-2 py-1 rounded-md inline-block">
                      {shift.department}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}