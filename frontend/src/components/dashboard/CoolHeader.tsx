"use client";

import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/auth-provider';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

export function CoolHeader() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="relative mb-12"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-galactic-neon-purple via-galactic-neon-pink to-galactic-neon-blue rounded-3xl opacity-90 blur-xl scale-110"></div>
      
      {/* Main Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-galactic-purple-800/50 bg-galactic-surface/80 backdrop-blur-2xl shadow-2xl shadow-galactic-neon-purple/25">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-galactic-neon-purple/30 via-galactic-neon-pink/30 to-galactic-neon-blue/30 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(155,107,255,0.3),transparent_50%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left Side - Welcome Message */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 bg-gradient-to-r from-galactic-neon-purple to-galactic-neon-pink rounded-full shadow-lg shadow-galactic-neon-purple/50"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-galactic-neon-purple to-galactic-neon-lavender bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'User'}!
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl"
              >
                Track your time, manage your productivity, and stay on top of your schedule with our advanced dashboard
              </motion.p>

              {/* Animated Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap gap-6 mt-6"
              >
                <div className="flex items-center gap-2 bg-galactic-purple-900/30 backdrop-blur-sm rounded-full px-4 py-2 border border-galactic-neon-purple/20">
                  <Zap className="h-4 w-4 text-galactic-neon-purple" />
                  <span className="text-slate-300 text-sm font-medium">Real-time Tracking</span>
                </div>
                <div className="flex items-center gap-2 bg-galactic-purple-900/30 backdrop-blur-sm rounded-full px-4 py-2 border border-galactic-neon-purple/20">
                  <TrendingUp className="h-4 w-4 text-galactic-neon-teal" />
                  <span className="text-slate-300 text-sm font-medium">Productivity Analytics</span>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Animated Visual Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {/* Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-2 border-white/20 rounded-full"
                />
                
                {/* Middle Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 w-24 h-24 border-2 border-galactic-neon-purple/40 rounded-full"
                />
                
                {/* Inner Circle */}
                <div className="absolute inset-8 w-16 h-16 bg-gradient-to-r from-galactic-neon-purple to-galactic-neon-pink rounded-full flex items-center justify-center shadow-lg shadow-galactic-neon-purple/50">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white text-2xl"
                  >
                    ⏱️
                  </motion.div>
                </div>

                {/* Floating Dots */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/60 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: '0 0'
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </motion.div>
  );
}



