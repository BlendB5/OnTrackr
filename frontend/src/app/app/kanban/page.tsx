'use client';

import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { FloatingElements } from '@/components/ui/floating-elements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Kanban, CheckSquare, Clock, AlertCircle } from 'lucide-react';

export default function KanbanPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
      <AnimatedBackground />
      <FloatingElements />
      
      {/* Main Content */}
      <div className="relative z-20 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              >
                <Kanban className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Kanban Board
              </h1>
            </div>
            <p className="text-slate-300 text-lg">
              Visual task management and project tracking
            </p>
          </motion.div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-2xl bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5 text-blue-400" />
                    To Do
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Design new dashboard layout</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Review user feedback</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Update documentation</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* In Progress Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-2xl bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Implement dark theme</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Fix responsive issues</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Done Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-2xl bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckSquare className="h-5 w-5 text-green-400" />
                    Done
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Setup authentication</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Create user dashboard</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                    <p className="text-slate-200 text-sm">Add time tracking</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


