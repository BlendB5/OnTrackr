// Mock data for frontend testing without backend
export interface WorkSession {
  id: string;
  userId: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number | null;
  createdAt: string;
  updatedAt: string;
}

export const mockCurrentSession: WorkSession | null = null; // Change to mock data to test clocked-in state

export const mockTodaySessions: WorkSession[] = [
  {
    id: "1",
    userId: "user1",
    clockIn: "2024-01-15T09:00:00Z",
    clockOut: "2024-01-15T17:00:00Z",
    totalHours: 8.0,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T17:00:00Z"
  },
  {
    id: "2",
    userId: "user1",
    clockIn: "2024-01-15T13:00:00Z",
    clockOut: null,
    totalHours: null,
    createdAt: "2024-01-15T13:00:00Z",
    updatedAt: "2024-01-15T13:00:00Z"
  }
];

export class MockWorkSessionService {
  static async getCurrentSession(): Promise<{ session: WorkSession | null }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { session: mockCurrentSession };
  }

  static async getTodaySessions(): Promise<{ sessions: WorkSession[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { sessions: mockTodaySessions };
  }

  static async clockIn(): Promise<{ message: string; session: WorkSession }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newSession: WorkSession = {
      id: "new-session",
      userId: "user1",
      clockIn: new Date().toISOString(),
      clockOut: null,
      totalHours: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { message: "Successfully clocked in", session: newSession };
  }

  static async clockOut(): Promise<{ message: string; session: WorkSession }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedSession: WorkSession = {
      id: "current-session",
      userId: "user1",
      clockIn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      clockOut: new Date().toISOString(),
      totalHours: 4.0,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { message: "Successfully clocked out", session: updatedSession };
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

  static calculateElapsedTime(clockIn: string): string {
    const startTime = new Date(clockIn);
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
}







