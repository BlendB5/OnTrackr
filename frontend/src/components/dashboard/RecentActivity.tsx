"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { WorkSession } from "@/lib/work-sessions";
import { Break } from "@/lib/break-service";

interface Props {
  sessions: WorkSession[];
  breaks: Break[];
}

export default function RecentActivity({ sessions, breaks }: Props) {
  // Build simple activity lines from latest items
  const items: { label: string; at: string }[] = [];
  sessions.slice(-3).reverse().forEach(s => {
    items.push({ label: s.clockOut ? 'Clock Out' : 'Clock In', at: s.clockOut || s.clockIn });
  });
  breaks.slice(-3).reverse().forEach(b => {
    items.push({ label: b.breakEnd ? 'Break End' : 'Break Start', at: b.breakEnd || b.breakStart });
  });
  items.sort((a,b)=> new Date(b.at).getTime() - new Date(a.at).getTime());
  const latest = items.slice(0,5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>Last few actions</CardDescription>
        </CardHeader>
        <CardContent>
          {latest.length === 0 ? (
            <p className="text-slate-500">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {latest.map((it, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-700">{it.label}</span>
                  <span className="text-sm text-slate-500">{new Date(it.at).toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
