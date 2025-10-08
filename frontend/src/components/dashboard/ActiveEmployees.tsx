"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Clock, 
  Coffee,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';

interface ActiveEmployeesProps {
  className?: string;
}

interface ActiveEmployee {
  id: string;
  name: string;
  department: string;
  status: 'working' | 'break' | 'overtime';
  clockInTime: string;
  avatar?: string;
}

export function ActiveEmployees({ className = "" }: ActiveEmployeesProps) {
  const [employees, setEmployees] = useState<ActiveEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveEmployees();
  }, []);

  const loadActiveEmployees = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockEmployees: ActiveEmployee[] = [
        {
          id: '1',
          name: 'John Smith',
          department: 'Engineering',
          status: 'working',
          clockInTime: '09:00',
          avatar: 'JS'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          department: 'Marketing',
          status: 'break',
          clockInTime: '08:30',
          avatar: 'SJ'
        },
        {
          id: '3',
          name: 'Mike Chen',
          department: 'Engineering',
          status: 'overtime',
          clockInTime: '08:00',
          avatar: 'MC'
        },
        {
          id: '4',
          name: 'Emily Davis',
          department: 'Design',
          status: 'working',
          clockInTime: '09:15',
          avatar: 'ED'
        },
        {
          id: '5',
          name: 'Alex Wilson',
          department: 'Sales',
          status: 'working',
          clockInTime: '08:45',
          avatar: 'AW'
        }
      ];
      
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error loading active employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-700 border-green-200';
      case 'break': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'overtime': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <CheckCircle2 className="h-3 w-3" />;
      case 'break': return <Coffee className="h-3 w-3" />;
      case 'overtime': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working': return 'Working';
      case 'break': return 'On Break';
      case 'overtime': return 'Overtime';
      default: return 'Unknown';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Card className={`shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white ${className}`}>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading active employees...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Active Employees
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {employees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600">No active employees</p>
              <p className="text-sm text-slate-500">Employees will appear here when they clock in</p>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              {employees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
                      {employee.avatar || getInitials(employee.name)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${getStatusColor(employee.status)}`}>
                      {getStatusIcon(employee.status)}
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 truncate">
                      {employee.name}
                    </div>
                    <div className="text-sm text-slate-600 truncate">
                      {employee.department}
                    </div>
                    <div className="text-xs text-slate-500">
                      Clocked in at {employee.clockInTime}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                    {getStatusText(employee.status)}
                  </div>

                  {/* More Button */}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary */}
          {employees.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {employees.filter(e => e.status === 'working').length}
                  </div>
                  <div className="text-xs text-slate-600">Working</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {employees.filter(e => e.status === 'break').length}
                  </div>
                  <div className="text-xs text-slate-600">On Break</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {employees.filter(e => e.status === 'overtime').length}
                  </div>
                  <div className="text-xs text-slate-600">Overtime</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
