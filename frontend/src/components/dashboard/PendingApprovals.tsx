"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  FileText, 
  Calendar,
  Users,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface PendingApprovalsProps {
  className?: string;
}

interface PendingItem {
  id: string;
  type: 'timesheet' | 'schedule' | 'request';
  title: string;
  description: string;
  employee: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export function PendingApprovals({ className = "" }: PendingApprovalsProps) {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingItems();
  }, []);

  const loadPendingItems = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockItems: PendingItem[] = [
        {
          id: '1',
          type: 'timesheet',
          title: 'Timesheet Approval',
          description: 'John Smith - Week of Dec 1-7',
          employee: 'John Smith',
          date: '2 hours ago',
          priority: 'high'
        },
        {
          id: '2',
          type: 'schedule',
          title: 'Schedule Change Request',
          description: 'Sarah Johnson - Dec 15 shift change',
          employee: 'Sarah Johnson',
          date: '4 hours ago',
          priority: 'medium'
        },
        {
          id: '3',
          type: 'request',
          title: 'Time Off Request',
          description: 'Mike Chen - Dec 20-22 vacation',
          employee: 'Mike Chen',
          date: '1 day ago',
          priority: 'low'
        },
        {
          id: '4',
          type: 'timesheet',
          title: 'Timesheet Approval',
          description: 'Emily Davis - Week of Nov 24-30',
          employee: 'Emily Davis',
          date: '2 days ago',
          priority: 'high'
        }
      ];
      
      setPendingItems(mockItems);
    } catch (error) {
      console.error('Error loading pending items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'timesheet': return <FileText className="h-4 w-4" />;
      case 'schedule': return <Calendar className="h-4 w-4" />;
      case 'request': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'timesheet': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'schedule': return 'bg-green-100 text-green-700 border-green-200';
      case 'request': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle2 className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <Card className={`shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white ${className}`}>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading pending items...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={className}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Pending Approvals
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                {pendingItems.length} items
              </span>
              <Link href="/app/admin">
                <Button variant="outline" size="sm">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          {pendingItems.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-slate-600 mb-2">All caught up!</p>
              <p className="text-sm text-slate-500">No pending approvals at the moment</p>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              {pendingItems.slice(0, 4).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </span>
                      <div>
                        <h4 className="font-medium text-slate-800 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                      {getPriorityIcon(item.priority)}
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.employee}</span>
                    <span>{item.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {pendingItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {pendingItems.filter(item => item.priority === 'high').length}
                  </div>
                  <div className="text-xs text-slate-600">High Priority</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">
                    {pendingItems.filter(item => item.priority === 'medium').length}
                  </div>
                  <div className="text-xs text-slate-600">Medium</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {pendingItems.filter(item => item.priority === 'low').length}
                  </div>
                  <div className="text-xs text-slate-600">Low Priority</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
