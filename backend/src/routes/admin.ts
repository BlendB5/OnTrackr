import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Mock in-memory store for users
const mockUsers = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@ontrackr.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'employee-1',
    name: 'John Doe',
    email: 'john@ontrackr.com',
    role: 'employee',
    createdAt: new Date().toISOString()
  },
  {
    id: 'employee-2',
    name: 'Jane Smith',
    email: 'jane@ontrackr.com',
    role: 'employee',
    createdAt: new Date().toISOString()
  },
  {
    id: 'employee-3',
    name: 'Mike Johnson',
    email: 'mike@ontrackr.com',
    role: 'employee',
    createdAt: new Date().toISOString()
  }
];

// Mock work sessions data
const mockWorkSessions = [
  {
    id: 'session-1',
    userId: 'employee-1',
    clockIn: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    clockOut: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    totalHours: 7.0,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'session-2',
    userId: 'employee-2',
    clockIn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    clockOut: null,
    totalHours: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'session-3',
    userId: 'employee-3',
    clockIn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    clockOut: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    totalHours: 2.0,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Filter out password hash and return users
    const users = mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get timesheet reports (admin only)
router.get('/reports/timesheet', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { startDate, endDate, userId } = req.query;

    // Filter work sessions based on parameters
    let filteredSessions = mockWorkSessions;

    if (userId) {
      filteredSessions = filteredSessions.filter(session => session.userId === userId);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.clockIn);
        return sessionDate >= start && sessionDate <= end;
      });
    }

    // Combine with user data
    const timesheetData = filteredSessions.map(session => {
      const user = mockUsers.find(u => u.id === session.userId);
      return {
        userId: session.userId,
        userName: user?.name || 'Unknown User',
        userEmail: user?.email || 'Unknown Email',
        date: session.clockIn.split('T')[0],
        clockIn: session.clockIn,
        clockOut: session.clockOut,
        totalHours: session.totalHours,
        status: session.clockOut ? 'Completed' : 'Active'
      };
    });

    res.json({ 
      timesheets: timesheetData,
      summary: {
        totalSessions: timesheetData.length,
        totalHours: timesheetData.reduce((sum, t) => sum + (t.totalHours || 0), 0),
        activeSessions: timesheetData.filter(t => t.status === 'Active').length
      }
    });
  } catch (error) {
    console.error('Get timesheet reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Export timesheet as CSV (admin only)
router.get('/reports/timesheet/csv', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { startDate, endDate, userId } = req.query;

    // Filter work sessions based on parameters
    let filteredSessions = mockWorkSessions;

    if (userId) {
      filteredSessions = filteredSessions.filter(session => session.userId === userId);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.clockIn);
        return sessionDate >= start && sessionDate <= end;
      });
    }

    // Generate CSV
    const csvHeader = 'User ID,User Name,User Email,Date,Clock In,Clock Out,Total Hours,Status\n';
    const csvRows = filteredSessions.map(session => {
      const user = mockUsers.find(u => u.id === session.userId);
      const userName = user?.name || 'Unknown User';
      const userEmail = user?.email || 'Unknown Email';
      const date = session.clockIn.split('T')[0];
      const clockIn = new Date(session.clockIn).toLocaleString();
      const clockOut = session.clockOut ? new Date(session.clockOut).toLocaleString() : 'Active';
      const totalHours = session.totalHours || 0;
      const status = session.clockOut ? 'Completed' : 'Active';
      
      return `${session.userId},"${userName}","${userEmail}",${date},"${clockIn}","${clockOut}",${totalHours},${status}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="timesheet-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Export timesheet CSV error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get dashboard statistics (admin only)
router.get('/dashboard/stats', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const today = new Date();
    const todaySessions = mockWorkSessions.filter(session => {
      const sessionDate = new Date(session.clockIn);
      return sessionDate.toDateString() === today.toDateString();
    });

    const activeUsers = todaySessions.filter(session => !session.clockOut).length;
    const totalEmployees = mockUsers.filter(user => user.role === 'employee').length;
    const totalHoursToday = todaySessions.reduce((sum, session) => sum + (session.totalHours || 0), 0);

    res.json({
      stats: {
        totalEmployees,
        activeUsers,
        totalHoursToday,
        completedSessions: todaySessions.filter(s => s.clockOut).length
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;






