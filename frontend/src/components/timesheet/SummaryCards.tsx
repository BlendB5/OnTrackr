"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign,
  TrendingUp,
  Target
} from 'lucide-react';

interface SummaryCardsProps {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  totalPay: number;
  targetHours?: number;
  className?: string;
}

export function SummaryCards({ 
  totalHours, 
  regularHours, 
  overtimeHours, 
  totalPay, 
  targetHours = 160, // Default 40 hours/week * 4 weeks
  className = ""
}: SummaryCardsProps) {
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);
  const isOverTarget = totalHours > targetHours;

  const cards = [
    {
      title: "Total Hours",
      value: `${totalHours.toFixed(1)}h`,
      icon: Clock,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-800 dark:text-blue-200",
      progress: progressPercentage,
      showProgress: true
    },
    {
      title: "Regular Hours",
      value: `${regularHours.toFixed(1)}h`,
      icon: CheckCircle2,
      color: "green",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-800 dark:text-green-200",
      showProgress: false
    },
    {
      title: "Overtime Hours",
      value: `${overtimeHours.toFixed(1)}h`,
      icon: AlertCircle,
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-800 dark:text-orange-200",
      showProgress: false
    },
    {
      title: "Total Pay",
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(totalPay),
      icon: DollarSign,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      valueColor: "text-purple-800 dark:text-purple-200",
      showProgress: false
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
                  </div>
                </div>
                
                {card.showProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Progress</span>
                      <span className={isOverTarget ? "text-orange-600 dark:text-orange-400 font-medium" : ""}>
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          isOverTarget 
                            ? 'bg-gradient-to-r from-orange-400 to-orange-600' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>0h</span>
                      <span>{targetHours}h target</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
