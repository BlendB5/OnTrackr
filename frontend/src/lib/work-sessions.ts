const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface WorkSession {
  id: string;
  userId: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClockInResponse {
  message: string;
  session: WorkSession;
}

export interface ClockOutResponse {
  message: string;
  session: WorkSession;
}

export interface SessionsResponse {
  sessions: WorkSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class WorkSessionService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getCurrentSession(): Promise<{ session: WorkSession | null }> {
    const response = await fetch(`${API_URL}/api/sessions/current`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get current session');
    }

    return response.json();
  }

  static async getTodaySessions(): Promise<{ sessions: WorkSession[] }> {
    const response = await fetch(`${API_URL}/api/sessions/today`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get today sessions');
    }

    return response.json();
  }

  static async clockIn(): Promise<ClockInResponse> {
    const response = await fetch(`${API_URL}/api/sessions/clockin`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Clock in failed');
    }

    return response.json();
  }

  static async clockOut(): Promise<ClockOutResponse> {
    const response = await fetch(`${API_URL}/api/sessions/clockout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Clock out failed');
    }

    return response.json();
  }

  static async getSessions(page: number = 1, limit: number = 10): Promise<SessionsResponse> {
    const response = await fetch(`${API_URL}/api/sessions?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get sessions');
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







