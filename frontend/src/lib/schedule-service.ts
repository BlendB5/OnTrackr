const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Schedule {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class ScheduleService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  static async getSchedules(userId?: string, date?: string): Promise<{ schedules: Schedule[] }> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (date) params.append('date', date);

    const response = await fetch(`${API_BASE_URL}/api/schedules?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch schedules');
    }

    return response.json();
  }

  static async createSchedule(scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; schedule: Schedule }> {
    const response = await fetch(`${API_BASE_URL}/api/schedules`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create schedule');
    }

    return response.json();
  }

  static async updateSchedule(id: string, scheduleData: Partial<Omit<Schedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<{ message: string; schedule: Schedule }> {
    const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update schedule');
    }

    return response.json();
  }

  static async deleteSchedule(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete schedule');
    }

    return response.json();
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}






