import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Log, Level, BackendPackage, SharedPackage } from 'logging-middleware';
import notificationRoutes from './routes/notifications.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use(async (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  await Log('backend', Level.INFO, SharedPackage.MIDDLEWARE, 
    `${req.method} ${req.path} - Request started`);
  
  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    Log('backend', Level.INFO, SharedPackage.MIDDLEWARE, 
      `${req.method} ${req.path} - Response: ${res.statusCode} (${duration}ms)`);
    return originalJson.call(this, data);
  };
  
  next();
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/health', async (req, res) => {
  await Log('backend', Level.INFO, BackendPackage.ROUTE, 'Health check requested');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(async (err, req, res, next) => {
  await Log('backend', Level.ERROR, SharedPackage.MIDDLEWARE, 
    `Unhandled error in ${req.method} ${req.path}: ${err.message}`);
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, async () => {
  await Log('backend', Level.INFO, SharedPackage.CONFIG, 
    `Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;