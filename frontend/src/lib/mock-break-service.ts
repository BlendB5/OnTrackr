import { Break } from './break-service';

export class MockBreakService {
  static async getCurrentBreak(): Promise<{ break: Break | null }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { break: null }; // No current break
  }

  static async getTodayBreaks(): Promise<{ breaks: Break[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockBreaks: Break[] = [
      {
        id: "break-1",
        workSessionId: "session-1",
        userId: "user1",
        breakStart: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        breakEnd: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 15 min break
        totalMinutes: 15,
        breakType: "break",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
      },
      {
        id: "break-2",
        workSessionId: "session-1",
        userId: "user1",
        breakStart: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        breakEnd: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), // 5 min break
        totalMinutes: 5,
        breakType: "short_break",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
      }
    ];
    
    return { breaks: mockBreaks };
  }

  static async startBreak(breakType: 'break' | 'short_break' = 'break'): Promise<{ message: string; break: Break }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBreak: Break = {
      id: "break-" + Date.now(),
      workSessionId: "session-" + Date.now(),
      userId: "user1",
      breakStart: new Date().toISOString(),
      breakEnd: null,
      totalMinutes: null,
      breakType: breakType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { 
      message: `${breakType === 'short_break' ? 'Short break' : 'Break'} started successfully`, 
      break: newBreak 
    };
  }

  static async endBreak(): Promise<{ message: string; break: Break }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const breakEndTime = new Date();
    const breakStartTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
    const totalMinutes = Math.round((breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60));

    const completedBreak: Break = {
      id: "break-" + Date.now(),
      workSessionId: "session-" + Date.now(),
      userId: "user1",
      breakStart: breakStartTime.toISOString(),
      breakEnd: breakEndTime.toISOString(),
      totalMinutes: totalMinutes,
      breakType: 'break',
      createdAt: breakStartTime.toISOString(),
      updatedAt: breakEndTime.toISOString()
    };
    
    return { message: "Break ended successfully", break: completedBreak };
  }

  static formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  static calculateElapsedTime(breakStart: string): string {
    const startTime = new Date(breakStart);
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  }

  static getTotalBreakTime(breaks: Break[]): number {
    return breaks.reduce((total, breakItem) => {
      return total + (breakItem.totalMinutes || 0);
    }, 0);
  }

  static async getBreakCount(): Promise<{ count: number; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - simulate some people on break
    const count = Math.floor(Math.random() * 8) + 1;
    return {
      count,
      message: `${count} people currently on break`
    };
  }

  static getBreakTypeLabel(breakType: string): string {
    return breakType === 'short_break' ? 'Short Break' : 'Break';
  }
}
