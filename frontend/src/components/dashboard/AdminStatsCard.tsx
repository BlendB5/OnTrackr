"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Props {
  employeesClockedIn: number;
  onBreak: number;
  scheduledToday: number;
}

export default function AdminStatsCard({ employeesClockedIn, onBreak, scheduledToday }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Today (Team)</CardTitle>
          <CardDescription>Admin overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Kpi label="Clocked In" value={employeesClockedIn} color="text-green-600" />
            <Kpi label="On Break" value={onBreak} color="text-amber-600" />
            <Kpi label="Scheduled" value={scheduledToday} color="text-primary" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Kpi({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-4 border border-slate-200 rounded-xl text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}


