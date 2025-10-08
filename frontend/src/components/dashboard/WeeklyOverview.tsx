"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Props {
  last7Days: { day: string; hours: number }[];
}

export default function WeeklyOverview({ last7Days }: Props) {
  const max = Math.max(1, ...last7Days.map(d => d.hours));
  const barWidth = 28;
  const gap = 14;
  const height = 120;
  const width = last7Days.length * (barWidth + gap) + gap;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Weekly Overview</CardTitle>
          <CardDescription>Hours worked in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <svg width={width} height={height} className="mx-auto block">
            {last7Days.map((d, i) => {
              const h = Math.round((d.hours / max) * (height - 30));
              const x = gap + i * (barWidth + gap);
              const y = height - h - 20;
              return (
                <motion.g key={d.day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <rect x={x} y={y} width={barWidth} height={h} rx={6} className="fill-purple-500/80" />
                  <text x={x + barWidth / 2} y={height - 6} textAnchor="middle" className="fill-slate-500 text-[10px]">
                    {d.day}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </CardContent>
      </Card>
    </motion.div>
  );
}
