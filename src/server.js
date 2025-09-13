require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Configuration
const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hydrolens',
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
};

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  if (config.nodeEnv === 'production') {
    console.error('❌ Missing environment variable: JWT_SECRET');
    process.exit(1);
  } else {
    console.warn('⚠️  Missing JWT_SECRET - using default for development');
    process.env.JWT_SECRET = 'development_jwt_secret_change_in_production';
  }
}

// Initialize Express App
const app = express();

// Middleware
app.use(cors({
  origin: config.nodeEnv === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    uptime: process.uptime(),
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      server: 'running',
    },
  });
});

// Load Routes Dynamically
const loadRoutes = () => {
  const routes = {};

  // Load authentication routes
  try {
    const authRoutesPath = path.join(__dirname, 'routes', 'authRoutes.js');
    if (fs.existsSync(authRoutesPath)) {
      routes.auth = require(authRoutesPath);
      console.log('✅ Auth routes loaded successfully');
    } else {
      routes.auth = createFallbackRoute('Authentication system not implemented', 'AUTH_NOT_IMPLEMENTED');
      console.log('⚠️  Auth routes not found, using fallback');
    }
  } catch (err) {
    console.error('❌ Error loading auth routes:', err.message);
    routes.auth = createFallbackRoute('Authentication system not implemented', 'AUTH_NOT_IMPLEMENTED');
  }

  // Load chat routes
  try {
    const chatRoutesPath = path.join(__dirname, 'routes', 'chatRoutes.js');
    if (fs.existsSync(chatRoutesPath)) {
      routes.chat = require(chatRoutesPath);
      console.log('✅ Chat routes loaded successfully');
    } else {
      routes.chat = createFallbackRoute('Chat system not implemented', 'CHAT_NOT_IMPLEMENTED');
      console.log('⚠️  Chat routes not found, using fallback');
    }
  } catch (err) {
    console.error('❌ Error loading chat routes:', err.message);
    routes.chat = createFallbackRoute('Chat system not implemented', 'CHAT_NOT_IMPLEMENTED');
  }

  return routes;
};

// Fallback Route Creator - FIXED VERSION
const createFallbackRoute = (message, errorCode) => {
  const router = express.Router();

  // Use router.all() with '*' pattern or router.use() without parameters
  router.all('*', (req, res) => {
    res.status(501).json({
      success: false,
      message,
      error: errorCode,
      suggestion: `Please implement the required routes for ${req.originalUrl}`,
      method: req.method,
      path: req.path
    });
  });

  return router;
};

// Load Routes
const routes = loadRoutes();

// Serve Static Files
const staticPath = path.join(__dirname, '..', 'public');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  console.log('✅ Static files served from:', staticPath);
} else {
  console.error('⚠️  Static files directory not found:', staticPath);
}

// API Documentation Endpoint
app.get('/api', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    name: 'HydroLens API',
    version: '1.0.0',
    description: 'Advanced water analysis and monitoring system',
    baseUrl,
    status: 'running',
    endpoints: {
      health: `${baseUrl}/health`,
      auth: {
        login: `${baseUrl}/api/auth/login`,
        register: `${baseUrl}/api/auth/register`,
        status: `${baseUrl}/api/auth/status`,
      },
      chat: {
        list: `${baseUrl}/api/chat`,
        history: `${baseUrl}/api/chat/history`,
      },
    },
  });
});

// Mount Routes
app.use('/api/auth', routes.auth);
app.use('/api/chat', routes.chat);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: config.nodeEnv === 'development' ? err.message : 'Internal server error',
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
});

// Connect to MongoDB
const connectDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit if the database connection fails
  }
};

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the Server
const startServer = async () => {
  await connectDatabase();
  app.listen(config.port, config.host, () => {
    console.log(`🚀 Server running at http://${config.host}:${config.port}`);
  });
};

startServer();