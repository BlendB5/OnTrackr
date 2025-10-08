"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  userName?: string;
  isClockedIn: boolean;
  isOnBreak: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  onStartBreak: (type: 'break' | 'short_break') => void;
  onEndBreak: () => void;
}

export default function HeroSection({ userName, isClockedIn, isOnBreak, onClockIn, onClockOut, onStartBreak, onEndBreak }: HeroSectionProps) {
  return (
    <motion.section
      className="w-full max-w-5xl mx-auto rounded-2xl p-6 mb-8 bg-white/70 backdrop-blur border border-purple-100 shadow-[0_10px_30px_-12px_rgba(124,58,237,0.25)]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Quick Actions</h2>
        <p className="text-sm text-slate-500">Hello {userName || 'there'} — manage your shift here</p>
      </div>

      {/* Table-like layout */}
      <div className="rounded-xl overflow-hidden border border-slate-200">
        <div className="grid grid-cols-3 bg-gradient-to-r from-purple-50 via-white to-purple-50 text-slate-600 text-sm">
          <div className="px-4 py-3">Shift</div>
          <div className="px-4 py-3">Short Break</div>
          <div className="px-4 py-3">Lunch</div>
        </div>
        <div className="grid grid-cols-3 bg-white/80">
          <div className="px-4 py-4 border-t border-slate-200">
            {!isClockedIn ? (
              <Button onClick={onClockIn} className="w-full bg-primary hover:bg-primary/90 text-white">
                Clock In
              </Button>
            ) : (
              <Button onClick={onClockOut} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Clock Out
              </Button>
            )}
          </div>
          <div className="px-4 py-4 border-t border-slate-200">
            {!isOnBreak ? (
              <Button onClick={() => onStartBreak('short_break')} className="w-full bg-accent text-white hover:opacity-90">
                Short Break
              </Button>
            ) : (
              <Button onClick={onEndBreak} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                End Break
              </Button>
            )}
          </div>
          <div className="px-4 py-4 border-t border-slate-200">
            {!isOnBreak ? (
              <Button onClick={() => onStartBreak('break')} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Lunch
              </Button>
            ) : (
              <Button onClick={onEndBreak} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                End Break
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
