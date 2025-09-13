const express = require('express');
const router = express.Router();

// Import auth controller functions
let authController;
try {
  authController = require('../controllers/authController');
  console.log('✅ Auth controller loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth controller:', error.message);
  // Create fallback functions (with consistent signatures)
  authController = {
    signup: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Signup not implemented' }),
    login: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Login not implemented' }),
    googleLogin: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Google login not implemented' }),
    googleCallback: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Google callback not implemented' }),
    getGoogleAuthUrl: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Google auth URL not implemented' }),
    verifyToken: (req, res, next) => next(), // pass-through
    getProfile: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Get profile not implemented' }),
    updateProfile: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Update profile not implemented' }),
    logout: (req, res, next) => res.status(501).json({ success: false, error: 'AUTH_NOT_IMPLEMENTED', message: 'Logout not implemented' }),
    status: (req, res, next) => res.json({ success: true, message: 'Auth service status', status: 'fallback_mode' })
  };
}

const {
  signup,
  login,
  googleLogin,
  googleCallback,
  getGoogleAuthUrl,
  verifyToken,
  getProfile,
  updateProfile,
  logout,
  status
} = authController;

// Rate limiting middleware (optional)
let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch (error) {
  console.log('⚠️  express-rate-limit not installed, using no-op middleware');
  rateLimit = () => (req, res, next) => next();
}

// Create rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => ['/status', '/google/callback'].includes(req.path)
});

// Apply rate limiting globally (no need for duplicate check)
router.use(authLimiter);

// ===========================================
// PUBLIC ROUTES
// ===========================================
router.get('/status', status);
router.post('/signup', signup);
router.post('/login', login);

// ===========================================
// GOOGLE OAUTH ROUTES
// ===========================================
router.get('/google/callback', googleCallback);
router.get('/google/url', getGoogleAuthUrl);
router.get('/google', googleLogin);

// ===========================================
// PROTECTED ROUTES
// ===========================================
const protectedRoutes = express.Router();
protectedRoutes.use(verifyToken);
protectedRoutes.get('/profile', getProfile);
protectedRoutes.put('/profile', updateProfile);
protectedRoutes.post('/logout', logout);
router.use(protectedRoutes);

// ===========================================
// DEV TEST ROUTES
// ===========================================
if (process.env.NODE_ENV === 'development') {
  router.get('/test', (req, res) => {
    res.json({
      success: true,
      message: 'Authentication system test endpoint',
      environment: 'development',
      testUsers: [{ email: 'test@aqua.com', password: 'password123' }],
      testEndpoints: [
        'POST /api/auth/signup',
        'POST /api/auth/login',
        'GET /api/auth/google',
        'GET /api/auth/google/url',
        'GET /api/auth/google/callback',
        'GET /api/auth/profile',
        'PUT /api/auth/profile'
      ]
    });
  });

  router.post('/test-token', (req, res) => {
    try {
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'project-aqua-default-secret';
      const testPayload = { userId: 'test-user-id', email: 'test@aqua.com', provider: 'email', iat: Math.floor(Date.now() / 1000) };
      const token = jwt.sign(testPayload, secret, { expiresIn: '1h', issuer: 'project-aqua' });
      res.json({ success: true, message: 'Test token generated', token, usage: 'Authorization: Bearer ' + token });
    } catch (error) {
      res.status(500).json({ success: false, error: 'TOKEN_GENERATION_FAILED', message: error.message });
    }
  });
}

module.exports = router;