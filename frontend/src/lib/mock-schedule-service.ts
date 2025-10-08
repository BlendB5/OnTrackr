import { Schedule } from './schedule-service';

export class MockScheduleService {
  static async getSchedules(userId?: string, date?: string): Promise<{ schedules: Schedule[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - sample schedules
    const mockSchedules: Schedule[] = [
      {
        id: "schedule-1",
        userId: userId || "employee-1",
        date: new Date().toISOString(),
        startTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
        endTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
        isWorkingDay: true,
        notes: "Regular work day",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "schedule-2",
        userId: userId || "employee-1",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        startTime: new Date(new Date(Date.now() + 24 * 60 * 60 * 1000).setHours(8, 30, 0, 0)).toISOString(),
        endTime: new Date(new Date(Date.now() + 24 * 60 * 60 * 1000).setHours(16, 30, 0, 0)).toISOString(),
        isWorkingDay: true,
        notes: "Early start tomorrow",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "schedule-3",
        userId: userId || "employee-1",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        startTime: new Date(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).toISOString(),
        endTime: new Date(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).toISOString(),
        isWorkingDay: false,
        notes: "Day off",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Filter by date if provided
    let filteredSchedules = mockSchedules;
    if (date) {
      const filterDate = new Date(date);
      filteredSchedules = mockSchedules.filter(s => {
        const scheduleDate = new Date(s.date);
        return scheduleDate.toDateString() === filterDate.toDateString();
      });
    }

    return { schedules: filteredSchedules };
  }

  static async createSchedule(scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; schedule: Schedule }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSchedule: Schedule = {
      id: "schedule-" + Date.now(),
      ...scheduleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { 
      message: "Schedule created successfully", 
      schedule: newSchedule 
    };
  }

  static async updateSchedule(id: string, scheduleData: Partial<Omit<Schedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<{ message: string; schedule: Schedule }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedSchedule: Schedule = {
      id,
      userId: "employee-1", // Mock userId
      date: scheduleData.date || new Date().toISOString(),
      startTime: scheduleData.startTime || new Date().toISOString(),
      endTime: scheduleData.endTime || new Date().toISOString(),
      isWorkingDay: scheduleData.isWorkingDay !== undefined ? scheduleData.isWorkingDay : true,
      notes: scheduleData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { 
      message: "Schedule updated successfully", 
      schedule: updatedSchedule 
    };
  }

  static async deleteSchedule(id: string): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { message: "Schedule deleted successfully" };
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






