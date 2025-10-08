const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface TimesheetEntry {
  id: string;
  userId: string;
  date: string;
  hoursWorked: number;
  overtimeHours: number;
  regularHours: number;
  hourlyRate: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  User: {
    id: string;
    name: string;
    email: string;
    department?: string;
    hourlyRate?: number;
  };
}

export interface TimesheetSummary {
  totalHours: number;
  totalOvertime: number;
  totalPayroll: number;
  totalEmployees: number;
  pendingCount: number;
  approvedCount: number;
  timesheets: TimesheetEntry[];
}

export interface TimesheetFilters {
  month?: number;
  year?: number;
  department?: string;
  status?: string;
  userId?: string;
}

class TimesheetApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Get all timesheets with optional filtering
  async getTimesheets(filters: TimesheetFilters = {}): Promise<TimesheetEntry[]> {
    const params = new URLSearchParams();
    
    if (filters.month !== undefined) params.append('month', filters.month.toString());
    if (filters.year !== undefined) params.append('year', filters.year.toString());
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.userId) params.append('userId', filters.userId);

    const queryString = params.toString();
    const endpoint = queryString ? `/timesheets?${queryString}` : '/timesheets';
    
    return this.request<TimesheetEntry[]>(endpoint);
  }

  // Get timesheet summary for a specific month
  async getTimesheetSummary(month: number, year: number): Promise<TimesheetSummary> {
    return this.request<TimesheetSummary>(`/timesheets/summary?month=${month}&year=${year}`);
  }

  // Get timesheet for a specific user
  async getUserTimesheet(userId: string, month?: number, year?: number): Promise<TimesheetEntry[]> {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/timesheets/${userId}?${queryString}` : `/timesheets/${userId}`;
    
    return this.request<TimesheetEntry[]>(endpoint);
  }

  // Approve timesheets
  async approveTimesheets(timesheetIds: string[], notes?: string): Promise<{ message: string; count: number }> {
    return this.request<{ message: string; count: number }>('/timesheets/approve', {
      method: 'POST',
      body: JSON.stringify({ timesheetIds, notes }),
    });
  }

  // Reject timesheets
  async rejectTimesheets(timesheetIds: string[], notes?: string): Promise<{ message: string; count: number }> {
    return this.request<{ message: string; count: number }>('/timesheets/reject', {
      method: 'POST',
      body: JSON.stringify({ timesheetIds, notes }),
    });
  }

  // Generate timesheets from work sessions
  async generateTimesheets(month: number, year: number): Promise<{ message: string; count: number; timesheets: TimesheetEntry[] }> {
    return this.request<{ message: string; count: number; timesheets: TimesheetEntry[] }>('/timesheets/generate', {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    });
  }

  // Adjust hours for a single timesheet
  async adjustHours(timesheetId: string, adjustmentType: 'add' | 'subtract', hours: number, reason: string): Promise<{ message: string; timesheet: TimesheetEntry }> {
    return this.request<{ message: string; timesheet: TimesheetEntry }>('/timesheets/adjust-hours', {
      method: 'POST',
      body: JSON.stringify({ timesheetId, adjustmentType, hours, reason }),
    });
  }

  // Bulk adjust hours for multiple timesheets
  async bulkAdjustHours(timesheetIds: string[], adjustmentType: 'add' | 'subtract', hours: number, reason: string): Promise<{ message: string; results: any[]; errors: any[] }> {
    return this.request<{ message: string; results: any[]; errors: any[] }>('/timesheets/bulk-adjust-hours', {
      method: 'POST',
      body: JSON.stringify({ timesheetIds, adjustmentType, hours, reason }),
    });
  }

  // Get hour adjustment history
  async getHourAdjustments(timesheetId?: string, userId?: string, limit?: number): Promise<any[]> {
    const params = new URLSearchParams();
    if (timesheetId) params.append('timesheetId', timesheetId);
    if (userId) params.append('userId', userId);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/timesheets/hour-adjustments?${queryString}` : '/timesheets/hour-adjustments';
    
    return this.request<any[]>(endpoint);
  }

  // Export timesheets to CSV
  exportToCSV(timesheets: TimesheetEntry[], filename?: string): void {
    const headers = [
      'Employee',
      'Date',
      'Hours Worked',
      'Regular Hours',
      'Overtime Hours',
      'Hourly Rate',
      'Regular Pay',
      'Overtime Pay',
      'Total Pay',
      'Status',
      'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...timesheets.map(ts => [
        `"${ts.User.name}"`,
        ts.date,
        ts.hoursWorked,
        ts.regularHours,
        ts.overtimeHours,
        ts.hourlyRate,
        ts.regularPay,
        ts.overtimePay,
        ts.totalPay,
        ts.status,
        `"${ts.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `timesheets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export const timesheetApi = new TimesheetApiService();
