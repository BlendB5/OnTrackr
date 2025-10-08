"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({ children, className = "", hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={hover ? { 
        scale: 1.02, 
        rotateY: 2,
        transition: { duration: 0.2 }
      } : {}}
      className={`
        relative overflow-hidden rounded-2xl 
        bg-white/10 dark:bg-slate-900/20 
        backdrop-blur-xl border border-white/20 dark:border-slate-700/30
        shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5
        before:absolute before:inset-0 before:bg-gradient-to-br 
        before:from-white/20 before:via-transparent before:to-transparent
        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}




