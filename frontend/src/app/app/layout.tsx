"use client";

import Sidebar from '@/components/navigation/Sidebar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GalacticBackground } from '@/components/ui/galactic-background';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-galactic-background relative overflow-hidden">
        {/* Galactic Background */}
        <div className="fixed inset-0 bg-galaxy-gradient" />
        <GalacticBackground />
        <AnimatedBackground />
        
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto ml-64 relative z-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
