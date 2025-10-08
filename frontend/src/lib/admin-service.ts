const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface TimesheetEntry {
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number | null;
  status: string;
}

export interface TimesheetReport {
  timesheets: TimesheetEntry[];
  summary: {
    totalSessions: number;
    totalHours: number;
    activeSessions: number;
  };
}

export interface AdminStats {
  totalEmployees: number;
  activeUsers: number;
  totalHoursToday: number;
  completedSessions: number;
}

export class AdminService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  static async getUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  static async getTimesheetReport(startDate?: string, endDate?: string, userId?: string): Promise<TimesheetReport> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (userId) params.append('userId', userId);

    const response = await fetch(`${API_BASE_URL}/api/admin/reports/timesheet?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch timesheet report');
    }

    return response.json();
  }

  static async exportTimesheetCSV(startDate?: string, endDate?: string, userId?: string): Promise<void> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (userId) params.append('userId', userId);

    const response = await fetch(`${API_BASE_URL}/api/admin/reports/timesheet/csv?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to export timesheet');
    }

    // Download the CSV file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  static async getDashboardStats(): Promise<{ stats: AdminStats }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
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






