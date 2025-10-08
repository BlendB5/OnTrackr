"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Props {
  isClockedIn: boolean;
  hoursWorked: number; // in hours
  breakMinutes: number; // in minutes
}

export default function TodaySummary({ isClockedIn, hoursWorked, breakMinutes }: Props) {
  const workedPct = Math.min(100, Math.round((hoursWorked / 8) * 100));
  const breakPct = Math.min(100, Math.round((breakMinutes / 60) * 100));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="max-w-5xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Today's Summary</CardTitle>
          <CardDescription>Quick glance at your day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <StatusPill isClockedIn={isClockedIn} />
            <ProgressBlock label="Hours Worked" value={`${hoursWorked.toFixed(1)}h`} pct={workedPct} colorClass="bg-primary" />
            <ProgressBlock label="Break Time" value={`${breakMinutes}m`} pct={breakPct} colorClass="bg-amber-500" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusPill({ isClockedIn }: { isClockedIn: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
      <span className="text-slate-600">Status</span>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${isClockedIn ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
        {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
      </span>
    </div>
  );
}

function ProgressBlock({ label, value, pct, colorClass }: { label: string; value: string; pct: number; colorClass: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-right text-xs text-slate-500 mt-1">{pct}% of goal</div>
    </div>
  );
}
