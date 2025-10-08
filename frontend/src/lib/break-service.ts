const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Break {
  id: string;
  workSessionId: string;
  userId: string;
  breakStart: string;
  breakEnd: string | null;
  totalMinutes: number | null;
  breakType: string;
  createdAt: string;
  updatedAt: string;
}

export class BreakService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  static async getCurrentBreak(): Promise<{ break: Break | null }> {
    const response = await fetch(`${API_BASE_URL}/api/breaks/current`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current break');
    }

    return response.json();
  }

  static async getTodayBreaks(): Promise<{ breaks: Break[] }> {
    const response = await fetch(`${API_BASE_URL}/api/breaks/today`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch today breaks');
    }

    return response.json();
  }

  static async startBreak(breakType: 'break' | 'short_break' = 'break'): Promise<{ message: string; break: Break }> {
    const response = await fetch(`${API_BASE_URL}/api/breaks/start`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ breakType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to start break');
    }

    return response.json();
  }

  static async endBreak(): Promise<{ message: string; break: Break }> {
    const response = await fetch(`${API_BASE_URL}/api/breaks/end`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to end break');
    }

    return response.json();
  }

  static formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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
    const response = await fetch(`${API_BASE_URL}/api/breaks/count`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch break count');
    }

    return response.json();
  }

  static async getActiveBreaks(): Promise<{ breaks: (Break & { userName?: string })[] }> {
    const response = await fetch(`${API_BASE_URL}/api/breaks/active`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active breaks');
    }

    return response.json();
  }

  static getBreakTypeLabel(breakType: string): string {
    return breakType === 'short_break' ? 'Short Break' : 'Break';
  }
}
