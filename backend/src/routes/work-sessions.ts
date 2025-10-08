import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get current user's active session
router.get('/current', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find today's active session (clocked in but not clocked out)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Mock data for demo - no active session
    const activeSession = null;

    res.json({ session: activeSession });
  } catch (error) {
    console.error('Get current session error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get today's sessions
router.get('/today', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Mock data for demo - empty sessions
    const sessions: any[] = [];

    res.json({ sessions });
  } catch (error) {
    console.error('Get today sessions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Clock in
router.post('/clockin', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Mock clock in - create a fake session
    const session = {
      id: 'session-' + Date.now(),
      userId: req.user.userId,
      clockIn: new Date().toISOString(),
      clockOut: null,
      totalHours: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Successfully clocked in',
      session
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Clock out
router.post('/clockout', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Mock clock out - simulate a completed session
    const clockOutTime = new Date();
    const clockInTime = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 hours ago
    const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    const updatedSession = {
      id: 'session-' + Date.now(),
      userId: req.user.userId,
      clockIn: clockInTime.toISOString(),
      clockOut: clockOutTime.toISOString(),
      totalHours: Math.round(totalHours * 100) / 100,
      createdAt: clockInTime.toISOString(),
      updatedAt: clockOutTime.toISOString()
    };

    res.json({
      message: 'Successfully clocked out',
      session: updatedSession
    });
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's work sessions (with pagination)
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const sessions = await prisma.workSession.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        clockIn: 'desc'
      },
      skip,
      take: limit
    });

    const total = await prisma.workSession.count({
      where: {
        userId: req.user.userId
      }
    });

    res.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
