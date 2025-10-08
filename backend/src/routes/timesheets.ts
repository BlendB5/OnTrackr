import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/timesheets - Fetch all timesheets with filtering
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { month, year, department, status, userId } = req.query;
    
    // Build filter conditions
    const where: any = {};
    
    if (month && year) {
      const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (department) {
      where.User = {
        department: department
      };
    }

    const timesheets = await prisma.timesheet.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            hourlyRate: true
          }
        }
      },
      orderBy: [
        { User: { name: 'asc' } },
        { date: 'desc' }
      ]
    });

    res.json(timesheets);
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    res.status(500).json({ error: 'Failed to fetch timesheets' });
  }
});

// GET /api/timesheets/summary - Get monthly summary
router.get('/summary', authenticateToken, async (req: any, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);

    const timesheets = await prisma.timesheet.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        User: {
          select: {
            name: true,
            department: true
          }
        }
      }
    });

    // Calculate summary statistics
    const totalHours = timesheets.reduce((sum, ts) => sum + ts.hoursWorked, 0);
    const totalOvertime = timesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0);
    const totalPayroll = timesheets.reduce((sum, ts) => sum + ts.totalPay, 0);
    const totalEmployees = new Set(timesheets.map(ts => ts.userId)).size;
    const pendingCount = timesheets.filter(ts => ts.status === 'pending').length;
    const approvedCount = timesheets.filter(ts => ts.status === 'approved').length;

    res.json({
      totalHours: Math.round(totalHours * 100) / 100,
      totalOvertime: Math.round(totalOvertime * 100) / 100,
      totalPayroll: Math.round(totalPayroll * 100) / 100,
      totalEmployees,
      pendingCount,
      approvedCount,
      timesheets
    });
  } catch (error) {
    console.error('Error fetching timesheet summary:', error);
    res.status(500).json({ error: 'Failed to fetch timesheet summary' });
  }
});

// GET /api/timesheets/:userId - Get detailed timesheet for specific user
router.get('/:userId', authenticateToken, async (req: any, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    // Check if user is admin or viewing their own timesheet
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const where: any = { userId };
    
    if (month && year) {
      const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }

    const timesheets = await prisma.timesheet.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            hourlyRate: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(timesheets);
  } catch (error) {
    console.error('Error fetching user timesheet:', error);
    res.status(500).json({ error: 'Failed to fetch user timesheet' });
  }
});

// POST /api/timesheets/approve - Approve timesheet
router.post('/approve', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { timesheetIds, notes } = req.body;

    if (!timesheetIds || !Array.isArray(timesheetIds)) {
      return res.status(400).json({ error: 'Timesheet IDs are required' });
    }

    const result = await prisma.timesheet.updateMany({
      where: {
        id: {
          in: timesheetIds
        }
      },
      data: {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        notes: notes || null
      }
    });

    res.json({ 
      message: `${result.count} timesheets approved successfully`,
      count: result.count
    });
  } catch (error) {
    console.error('Error approving timesheets:', error);
    res.status(500).json({ error: 'Failed to approve timesheets' });
  }
});

// POST /api/timesheets/reject - Reject timesheet
router.post('/reject', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { timesheetIds, notes } = req.body;

    if (!timesheetIds || !Array.isArray(timesheetIds)) {
      return res.status(400).json({ error: 'Timesheet IDs are required' });
    }

    const result = await prisma.timesheet.updateMany({
      where: {
        id: {
          in: timesheetIds
        }
      },
      data: {
        status: 'rejected',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        notes: notes || null
      }
    });

    res.json({ 
      message: `${result.count} timesheets rejected successfully`,
      count: result.count
    });
  } catch (error) {
    console.error('Error rejecting timesheets:', error);
    res.status(500).json({ error: 'Failed to reject timesheets' });
  }
});

// POST /api/timesheets/adjust-hours - Adjust hours for a timesheet entry
router.post('/adjust-hours', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { timesheetId, adjustmentType, hours, reason } = req.body;

    if (!timesheetId || !adjustmentType || hours === undefined || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['add', 'subtract'].includes(adjustmentType)) {
      return res.status(400).json({ error: 'Invalid adjustment type' });
    }

    if (hours <= 0) {
      return res.status(400).json({ error: 'Hours must be positive' });
    }

    // Get the current timesheet
    const timesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId },
      include: { User: true }
    });

    if (!timesheet) {
      return res.status(404).json({ error: 'Timesheet not found' });
    }

    // Calculate new hours
    const adjustment = adjustmentType === 'add' ? hours : -hours;
    const newHoursWorked = Math.max(0, timesheet.hoursWorked + adjustment);
    const newRegularHours = Math.min(newHoursWorked, 8);
    const newOvertimeHours = Math.max(0, newHoursWorked - 8);
    
    // Recalculate pay
    const hourlyRate = timesheet.hourlyRate || 0;
    const newRegularPay = newRegularHours * hourlyRate;
    const newOvertimePay = newOvertimeHours * hourlyRate * 1.5;
    const newTotalPay = newRegularPay + newOvertimePay;

    // Update timesheet
    const updatedTimesheet = await prisma.timesheet.update({
      where: { id: timesheetId },
      data: {
        hoursWorked: newHoursWorked,
        regularHours: newRegularHours,
        overtimeHours: newOvertimeHours,
        regularPay: newRegularPay,
        overtimePay: newOvertimePay,
        totalPay: newTotalPay,
        status: 'pending', // Reset to pending when hours are adjusted
        notes: `${timesheet.notes || ''}\n[${new Date().toISOString()}] ${adjustmentType === 'add' ? 'Added' : 'Subtracted'} ${hours}h by admin. Reason: ${reason}`.trim()
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        }
      }
    });

    // Log the adjustment
    await prisma.hourAdjustment.create({
      data: {
        timesheetId: timesheetId,
        adminId: req.user.id,
        adjustmentType: adjustmentType,
        hours: hours,
        reason: reason,
        previousHours: timesheet.hoursWorked,
        newHours: newHoursWorked
      }
    });

    res.json({
      message: `Successfully ${adjustmentType === 'add' ? 'added' : 'subtracted'} ${hours} hours`,
      timesheet: updatedTimesheet
    });
  } catch (error) {
    console.error('Error adjusting hours:', error);
    res.status(500).json({ error: 'Failed to adjust hours' });
  }
});

// POST /api/timesheets/bulk-adjust-hours - Bulk adjust hours for multiple timesheets
router.post('/bulk-adjust-hours', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { timesheetIds, adjustmentType, hours, reason } = req.body;

    if (!timesheetIds || !Array.isArray(timesheetIds) || timesheetIds.length === 0) {
      return res.status(400).json({ error: 'Timesheet IDs are required' });
    }

    if (!['add', 'subtract'].includes(adjustmentType)) {
      return res.status(400).json({ error: 'Invalid adjustment type' });
    }

    if (hours <= 0) {
      return res.status(400).json({ error: 'Hours must be positive' });
    }

    const results = [];
    const errors = [];

    for (const timesheetId of timesheetIds) {
      try {
        const timesheet = await prisma.timesheet.findUnique({
          where: { id: timesheetId }
        });

        if (!timesheet) {
          errors.push({ timesheetId, error: 'Timesheet not found' });
          continue;
        }

        const adjustment = adjustmentType === 'add' ? hours : -hours;
        const newHoursWorked = Math.max(0, timesheet.hoursWorked + adjustment);
        const newRegularHours = Math.min(newHoursWorked, 8);
        const newOvertimeHours = Math.max(0, newHoursWorked - 8);
        
        const hourlyRate = timesheet.hourlyRate || 0;
        const newRegularPay = newRegularHours * hourlyRate;
        const newOvertimePay = newOvertimeHours * hourlyRate * 1.5;
        const newTotalPay = newRegularPay + newOvertimePay;

        await prisma.timesheet.update({
          where: { id: timesheetId },
          data: {
            hoursWorked: newHoursWorked,
            regularHours: newRegularHours,
            overtimeHours: newOvertimeHours,
            regularPay: newRegularPay,
            overtimePay: newOvertimePay,
            totalPay: newTotalPay,
            status: 'pending',
            notes: `${timesheet.notes || ''}\n[${new Date().toISOString()}] ${adjustmentType === 'add' ? 'Added' : 'Subtracted'} ${hours}h by admin. Reason: ${reason}`.trim()
          }
        });

        await prisma.hourAdjustment.create({
          data: {
            timesheetId: timesheetId,
            adminId: req.user.id,
            adjustmentType: adjustmentType,
            hours: hours,
            reason: reason,
            previousHours: timesheet.hoursWorked,
            newHours: newHoursWorked
          }
        });

        results.push({ timesheetId, success: true });
      } catch (error) {
        errors.push({ timesheetId, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    res.json({
      message: `Bulk adjustment completed. ${results.length} successful, ${errors.length} failed`,
      results,
      errors
    });
  } catch (error) {
    console.error('Error in bulk hour adjustment:', error);
    res.status(500).json({ error: 'Failed to adjust hours' });
  }
});

// GET /api/timesheets/hour-adjustments - Get hour adjustment history
router.get('/hour-adjustments', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { timesheetId, userId, limit = 50 } = req.query;

    const where: any = {};
    if (timesheetId) where.timesheetId = timesheetId;
    if (userId) {
      where.Timesheet = { userId: userId };
    }

    const adjustments = await prisma.hourAdjustment.findMany({
      where,
      include: {
        Timesheet: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        Admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json(adjustments);
  } catch (error) {
    console.error('Error fetching hour adjustments:', error);
    res.status(500).json({ error: 'Failed to fetch hour adjustments' });
  }
});

// POST /api/timesheets/generate - Generate timesheets from work sessions
router.post('/generate', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    // Get all work sessions for the month
    const workSessions = await prisma.workSession.findMany({
      where: {
        clockIn: {
          gte: startDate,
          lte: endDate
        },
        clockOut: {
          not: null
        }
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            hourlyRate: true
          }
        },
        breaks: true
      }
    });

    // Group by user and date
    const userDateMap = new Map();
    
    workSessions.forEach(session => {
      const dateKey = session.clockIn.toISOString().split('T')[0];
      const userKey = session.userId;
      const key = `${userKey}-${dateKey}`;
      
      if (!userDateMap.has(key)) {
        userDateMap.set(key, {
          userId: session.userId,
          user: session.User,
          date: new Date(dateKey),
          sessions: [],
          totalBreakMinutes: 0
        });
      }
      
      userDateMap.get(key).sessions.push(session);
      
      // Calculate break time
      const breakMinutes = session.breaks.reduce((sum, breakItem) => {
        if (breakItem.breakEnd) {
          return sum + (breakItem.breakEnd.getTime() - breakItem.breakStart.getTime()) / (1000 * 60);
        }
        return sum;
      }, 0);
      
      userDateMap.get(key).totalBreakMinutes += breakMinutes;
    });

    // Generate timesheet entries
    const timesheetEntries = [];
    
    for (const [key, data] of userDateMap) {
      const totalWorkMinutes = data.sessions.reduce((sum: number, session: any) => {
        if (session.clockOut) {
          return sum + (session.clockOut.getTime() - session.clockIn.getTime()) / (1000 * 60);
        }
        return sum;
      }, 0);
      
      const totalWorkHours = (totalWorkMinutes - data.totalBreakMinutes) / 60;
      const regularHours = Math.min(totalWorkHours, 8);
      const overtimeHours = Math.max(0, totalWorkHours - 8);
      const hourlyRate = data.user.hourlyRate || 0;
      const regularPay = regularHours * hourlyRate;
      const overtimePay = overtimeHours * hourlyRate * 1.5; // 1.5x rate for overtime
      const totalPay = regularPay + overtimePay;

      // Check if timesheet already exists
      const existingTimesheet = await prisma.timesheet.findUnique({
        where: {
          userId_date: {
            userId: data.userId,
            date: data.date
          }
        }
      });

      if (!existingTimesheet) {
        const timesheet = await prisma.timesheet.create({
          data: {
            userId: data.userId,
            date: data.date,
            hoursWorked: Math.round(totalWorkHours * 100) / 100,
            overtimeHours: Math.round(overtimeHours * 100) / 100,
            regularHours: Math.round(regularHours * 100) / 100,
            hourlyRate,
            regularPay: Math.round(regularPay * 100) / 100,
            overtimePay: Math.round(overtimePay * 100) / 100,
            totalPay: Math.round(totalPay * 100) / 100,
            status: 'pending'
          }
        });
        
        timesheetEntries.push(timesheet);
      }
    }

    res.json({
      message: `Generated ${timesheetEntries.length} timesheet entries`,
      count: timesheetEntries.length,
      timesheets: timesheetEntries
    });
  } catch (error) {
    console.error('Error generating timesheets:', error);
    res.status(500).json({ error: 'Failed to generate timesheets' });
  }
});

export default router;
