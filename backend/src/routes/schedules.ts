import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Mock in-memory store for schedules
let mockSchedules: any[] = [];

// Get schedules for a user (employees see their own, admins see all)
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { userId, date } = req.query;
    let targetUserId = req.user.userId;

    // Admins can view any user's schedule
    if (req.user.role === 'admin' && userId) {
      targetUserId = userId;
    }

    // Mock data - sample schedules
    const userSchedules = mockSchedules.filter(s => s.userId === targetUserId);

    // Filter by date if provided
    let filteredSchedules = userSchedules;
    if (date) {
      const filterDate = new Date(date);
      filteredSchedules = userSchedules.filter(s => {
        const scheduleDate = new Date(s.date);
        return scheduleDate.toDateString() === filterDate.toDateString();
      });
    }

    res.json({ schedules: filteredSchedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new schedule (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { userId, date, startTime, endTime, isWorkingDay = true, notes } = req.body;

    // Validate required fields
    if (!userId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Mock: Create new schedule
    const newSchedule = {
      id: 'schedule-' + Date.now(),
      userId,
      date: new Date(date).toISOString(),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      isWorkingDay,
      notes: notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockSchedules.push(newSchedule);

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule: newSchedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a schedule (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { id } = req.params;
    const { date, startTime, endTime, isWorkingDay, notes } = req.body;

    // Mock: Find and update schedule
    const scheduleIndex = mockSchedules.findIndex(s => s.id === id);
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const updatedSchedule = {
      ...mockSchedules[scheduleIndex],
      date: date ? new Date(date).toISOString() : mockSchedules[scheduleIndex].date,
      startTime: startTime ? new Date(startTime).toISOString() : mockSchedules[scheduleIndex].startTime,
      endTime: endTime ? new Date(endTime).toISOString() : mockSchedules[scheduleIndex].endTime,
      isWorkingDay: isWorkingDay !== undefined ? isWorkingDay : mockSchedules[scheduleIndex].isWorkingDay,
      notes: notes !== undefined ? notes : mockSchedules[scheduleIndex].notes,
      updatedAt: new Date().toISOString()
    };

    mockSchedules[scheduleIndex] = updatedSchedule;

    res.json({
      message: 'Schedule updated successfully',
      schedule: updatedSchedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a schedule (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { id } = req.params;

    // Mock: Find and delete schedule
    const scheduleIndex = mockSchedules.findIndex(s => s.id === id);
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    mockSchedules.splice(scheduleIndex, 1);

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;






