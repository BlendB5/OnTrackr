import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Start break
router.post('/start', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { breakType = 'break' } = req.body; // Default to 'break' if not specified

    // Mock break start - create a fake break
    const breakSession = {
      id: 'break-' + Date.now(),
      workSessionId: 'session-' + Date.now(),
      userId: req.user.userId,
      breakStart: new Date().toISOString(),
      breakEnd: null,
      totalMinutes: null,
      breakType: breakType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      message: `${breakType === 'short_break' ? 'Short break' : 'Break'} started successfully`,
      break: breakSession
    });
  } catch (error) {
    console.error('Start break error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// End break
router.post('/end', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Mock break end - simulate a completed break
    const breakEndTime = new Date();
    const breakStartTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
    const totalMinutes = Math.round((breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60));

    const completedBreak = {
      id: 'break-' + Date.now(),
      workSessionId: 'session-' + Date.now(),
      userId: req.user.userId,
      breakStart: breakStartTime.toISOString(),
      breakEnd: breakEndTime.toISOString(),
      totalMinutes: totalMinutes,
      createdAt: breakStartTime.toISOString(),
      updatedAt: breakEndTime.toISOString()
    };

    res.json({
      message: 'Break ended successfully',
      break: completedBreak
    });
  } catch (error) {
    console.error('End break error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current break
router.get('/current', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Mock data - no current break
    const currentBreak = null;

    res.json({ break: currentBreak });
  } catch (error) {
    console.error('Get current break error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get today's breaks
router.get('/today', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Mock data - sample breaks with break types
    const todayBreaks = [
      {
        id: 'break-1',
        workSessionId: 'session-1',
        userId: req.user.userId,
        breakStart: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        breakEnd: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 15 min break
        totalMinutes: 15,
        breakType: 'break',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
      },
      {
        id: 'break-2',
        workSessionId: 'session-1',
        userId: req.user.userId,
        breakStart: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        breakEnd: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), // 5 min break
        totalMinutes: 5,
        breakType: 'short_break',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString()
      }
    ];

    res.json({ breaks: todayBreaks });
  } catch (error) {
    console.error('Get today breaks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get count of people currently on break
router.get('/count', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Mock data - simulate some people on break
    const activeBreaksCount = Math.floor(Math.random() * 8) + 1; // Random between 1-8
    
    res.json({ 
      count: activeBreaksCount,
      message: `${activeBreaksCount} people currently on break`
    });
  } catch (error) {
    console.error('Get break count error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get active breaks (for admin monitoring or employee view)
router.get('/active', authenticateToken, async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Mock active breaks data
    const now = new Date();
    const sampleUsers = [
      { id: 'u1', name: 'Alice Johnson' },
      { id: 'u2', name: 'Bob Smith' },
      { id: 'u3', name: 'Carol Lee' },
      { id: 'u4', name: 'David Kim' }
    ];

    const activeBreaks = sampleUsers.slice(0, Math.floor(Math.random() * sampleUsers.length) + 1).map((u, idx) => ({
      id: `break-active-${Date.now()}-${idx}`,
      workSessionId: `session-${Date.now()}-${idx}`,
      userId: u.id,
      userName: u.name,
      breakStart: new Date(now.getTime() - (idx + 1) * 5 * 60 * 1000).toISOString(),
      breakEnd: null,
      totalMinutes: null,
      breakType: idx % 2 === 0 ? 'break' : 'short_break',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }));

    res.json({ breaks: activeBreaks });
  } catch (error) {
    console.error('Get active breaks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
