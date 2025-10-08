"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Home, Coffee, Calendar, BarChart3, Shield, LogOut, Menu, CalendarDays, Settings, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarProps {
  mobile?: boolean;
}

export default function Sidebar({ mobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(!mobile);

  const NavItem = ({ href, label, Icon }: { href: string; label: string; Icon: any }) => {
    const active = pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 border-l-4 overflow-hidden
          ${active
            ? 'bg-galactic-purple-900/30 text-galactic-neon-purple font-semibold border-galactic-neon-purple/60 shadow-lg shadow-galactic-neon-purple/20 animate-glow-pulse'
            : 'text-slate-300 hover:text-galactic-neon-purple hover:bg-galactic-purple-900/20 dark:hover:bg-galactic-purple-900/20 border-transparent hover:border-galactic-neon-purple/40 hover:shadow-lg hover:shadow-galactic-neon-purple/10'}`}
      >
        {/* Background glow effect for active items */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-galactic-neon-purple/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <motion.span 
          whileHover={{ scale: 1.1, rotate: 5 }} 
          whileTap={{ scale: 0.95 }}
          className="inline-flex relative z-10"
        >
          <Icon className={`h-5 w-5 transition-colors duration-300 ${active ? 'text-galactic-neon-purple' : 'text-slate-400 group-hover:text-galactic-neon-purple'}`} />
        </motion.span>
        <span className="relative z-10">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile trigger */}
      {mobile && (
        <div className="sticky top-0 z-40 bg-galactic-background/90 backdrop-blur-xl border-b border-galactic-purple-800/50 px-4 py-2 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-6 w-6 text-galactic-neon-purple" />
            </motion.div>
            <span className="font-semibold text-white">OnTrackr</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setOpen(v=>!v)}
            className="border-galactic-purple-700 text-galactic-neon-purple hover:bg-galactic-purple-900/50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {(open || !mobile) && (
          <motion.aside
            key="sidebar"
            initial={{ x: mobile ? -300 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-64 bg-galactic-background/95 backdrop-blur-xl border-r border-galactic-purple-800/50 shadow-2xl shadow-galactic-neon-purple/10 z-50 hidden md:flex md:flex-col"
          >
            {/* Branding */}
            <div className="px-4 py-4 border-b border-galactic-purple-800/50 flex items-center gap-2">
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-galactic-neon-purple rounded-full blur-lg opacity-30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-6 w-6 text-galactic-neon-purple relative" />
                </motion.div>
              </div>
              <span className="font-semibold text-white bg-gradient-to-r from-white to-galactic-neon-purple bg-clip-text text-transparent">OnTrackr</span>
            </div>

            {/* Nav */}
            <nav className="p-3 flex-1 space-y-1 overflow-y-auto">
              <NavItem href="/app/dashboard" label="Dashboard" Icon={Home} />
              <NavItem href="/app/time-tracker" label="Time Tracker" Icon={Clock} />
              <NavItem href="/app/timesheet" label="Timesheet" Icon={FileText} />
              <NavItem href="/app/schedule" label="Schedule" Icon={CalendarDays} />
              <NavItem href="/app/calendar" label="Calendar" Icon={Calendar} />
              <NavItem href="/app/reports" label="Reports" Icon={BarChart3} />
              {user?.role === 'admin' && <NavItem href="/app/admin" label="Admin Panel" Icon={Users} />}
              <NavItem href="/app/settings" label="Settings" Icon={Settings} />
            </nav>

            {/* Theme Toggle */}
            <div className="px-3 py-2 border-t border-galactic-purple-800/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-auto p-3 border-t border-galactic-purple-800/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-galactic-neon-purple to-galactic-neon-pink text-white flex items-center justify-center font-semibold text-sm uppercase shadow-lg shadow-galactic-neon-purple/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {(user?.name || 'U').charAt(0)}
                </motion.div>
                <div className="text-sm flex-1">
                  <div className="font-medium text-white truncate">{user?.name || 'User'}</div>
                  <div className="text-slate-400 truncate max-w-[10rem]">{user?.email || ''}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={logout} 
                  title="Logout" 
                  aria-label="Logout"
                  className="border-galactic-purple-700 text-galactic-neon-purple hover:bg-galactic-purple-900/50 hover:border-galactic-neon-purple/50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
