'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScheduleService, Schedule } from '@/lib/schedule-service';
import { MockScheduleService } from '@/lib/mock-schedule-service';
import Link from 'next/link';

function ScheduleContent() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    startTime: '',
    endTime: '',
    isWorkingDay: true,
    notes: ''
  });

  const isAdmin = user?.role === 'admin';

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        try {
          const response = await ScheduleService.getSchedules();
          setSchedules(response.schedules);
        } catch (apiError) {
          console.log('Backend not available, using mock data');
          const response = await MockScheduleService.getSchedules();
          setSchedules(response.schedules);
        }
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      try {
        const response = await ScheduleService.createSchedule(formData);
        setSchedules(prev => [...prev, response.schedule]);
        resetForm();
      } catch (apiError) {
        console.log('Backend not available, using mock data');
        const response = await MockScheduleService.createSchedule(formData);
        setSchedules(prev => [...prev, response.schedule]);
        resetForm();
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;

    setLoading(true);

    try {
      try {
        const response = await ScheduleService.updateSchedule(editingSchedule.id, formData);
        setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? response.schedule : s));
        resetForm();
        setEditingSchedule(null);
      } catch (apiError) {
        console.log('Backend not available, using mock data');
        const response = await MockScheduleService.updateSchedule(editingSchedule.id, formData);
        setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? response.schedule : s));
        resetForm();
        setEditingSchedule(null);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    setLoading(true);

    try {
      try {
        await ScheduleService.deleteSchedule(id);
        setSchedules(prev => prev.filter(s => s.id !== id));
      } catch (apiError) {
        console.log('Backend not available, using mock data');
        await MockScheduleService.deleteSchedule(id);
        setSchedules(prev => prev.filter(s => s.id !== id));
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete schedule');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      date: '',
      startTime: '',
      endTime: '',
      isWorkingDay: true,
      notes: ''
    });
    setShowCreateForm(false);
    setEditingSchedule(null);
  };

  const startEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      userId: schedule.userId,
      date: schedule.date.split('T')[0],
      startTime: schedule.startTime.split('T')[1].substring(0, 5),
      endTime: schedule.endTime.split('T')[1].substring(0, 5),
      isWorkingDay: schedule.isWorkingDay,
      notes: schedule.notes || ''
    });
    setShowCreateForm(true);
  };

  const filteredSchedules = selectedDate 
    ? schedules.filter(s => new Date(s.date).toDateString() === new Date(selectedDate).toDateString())
    : schedules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Schedule Management</h1>
              <p className="text-slate-600 mt-1">
                {isAdmin ? 'Manage employee schedules' : 'View your work schedule'}
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          )}
        </div>

        {/* Date Filter */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-slate-600" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="Filter by date"
                className="max-w-xs"
              />
              {selectedDate && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDate('')}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingSchedule ? handleUpdateSchedule : handleCreateSchedule} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
                      <Input
                        value={formData.userId}
                        onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                        placeholder="employee-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <Input
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Optional notes..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isWorkingDay"
                      checked={formData.isWorkingDay}
                      onChange={(e) => setFormData(prev => ({ ...prev, isWorkingDay: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="isWorkingDay" className="text-sm text-slate-700">
                      Working Day
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? 'Saving...' : (editingSchedule ? 'Update' : 'Create')}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Schedules List */}
        <div className="grid gap-6">
          {filteredSchedules.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No Schedules Found</h3>
                <p className="text-slate-600">
                  {selectedDate ? 'No schedules found for the selected date.' : 'No schedules have been created yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSchedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${schedule.isWorkingDay ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-slate-800">
                              {ScheduleService.formatDate(schedule.date)}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              schedule.isWorkingDay 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {schedule.isWorkingDay ? 'Working Day' : 'Day Off'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {ScheduleService.formatTime(schedule.startTime)} - {ScheduleService.formatTime(schedule.endTime)}
                              </span>
                            </div>
                            {schedule.notes && (
                              <span className="italic">"{schedule.notes}"</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startEdit(schedule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default function SchedulesPage() {
  return (
    <ProtectedRoute>
      <ScheduleContent />
    </ProtectedRoute>
  );
}






