import express from 'express';
import { Log, Level, BackendPackage } from 'logging-middleware';

const router = express.Router();

// Mock data for demonstration
const mockNotifications = [
  {
    id: 1,
    type: 'Placement',
    title: 'Google Interview Scheduled',
    message: 'Your interview with Google is scheduled for tomorrow at 2 PM',
    timestamp: new Date().toISOString(),
    read: false
  },
  {
    id: 2,
    type: 'Result',
    title: 'Semester Results Published',
    message: 'Your semester 7 results are now available',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    read: true
  }
];

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    await Log('backend', Level.INFO, BackendPackage.CONTROLLER, 
      'Fetching notifications list');

    const { page = 1, limit = 10, type } = req.query;
    
    await Log('backend', Level.DEBUG, BackendPackage.SERVICE, 
      `Query parameters: page=${page}, limit=${limit}, type=${type || 'all'}`);

    // Simulate service layer processing
    let notifications = mockNotifications;
    
    if (type && type !== 'All') {
      notifications = notifications.filter(n => n.type === type);
      await Log('backend', Level.DEBUG, BackendPackage.SERVICE, 
        `Filtered notifications by type: ${type}, found ${notifications.length} items`);
    }

    const startIndex = (page - 1) * limit;
    const paginatedNotifications = notifications.slice(startIndex, startIndex + limit);
    
    const response = {
      notifications: paginatedNotifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: notifications.length,
        totalPages: Math.ceil(notifications.length / limit)
      }
    };

    await Log('backend', Level.INFO, BackendPackage.CONTROLLER, 
      `Successfully returned ${paginatedNotifications.length} notifications`);

    res.json(response);
  } catch (error) {
    await Log('backend', Level.ERROR, BackendPackage.CONTROLLER, 
      `Error fetching notifications: ${error.message}`);
    
    res.status(500).json({ 
      error: 'Failed to fetch notifications',
      message: error.message 
    });
  }
});

// POST /api/notifications/:id/read
router.post('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    await Log('backend', Level.INFO, BackendPackage.CONTROLLER, 
      `Marking notification ${id} as read`);

    const notification = mockNotifications.find(n => n.id === parseInt(id));
    
    if (!notification) {
      await Log('backend', Level.WARN, BackendPackage.SERVICE, 
        `Notification ${id} not found`);
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    
    await Log('backend', Level.INFO, BackendPackage.SERVICE, 
      `Successfully marked notification ${id} as read`);

    res.json({ success: true, notification });
  } catch (error) {
    await Log('backend', Level.ERROR, BackendPackage.CONTROLLER, 
      `Error marking notification as read: ${error.message}`);
    
    res.status(500).json({ 
      error: 'Failed to update notification',
      message: error.message 
    });
  }
});

export default router;