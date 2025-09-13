const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Safe model import with fallback
let User;
try {
  User = require('../models/user');
  console.log('✅ User model loaded successfully');
} catch (error) {
  console.log('⚠️  User model not found, using mock implementation');
  
  // Mock User model for development/testing
  const mockUsers = [
    {
      _id: 'mock-user-1',
      email: 'test@aqua.com',
      name: 'Test User',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.UWE/VEJ8K', // password123
      googleId: null,
      createdAt: new Date(),
      isActive: true,
      authProvider: 'email'
    },
    {
      _id: 'google-user-1',
      email: 'googleuser@gmail.com',
      name: 'Google User',
      googleId: 'google-123456789',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      createdAt: new Date(),
      isActive: true,
      authProvider: 'google'
    }
  ];

  User = {
    findOne: async ({ email, googleId, $or }) => {
      if ($or) {
        // Handle complex queries like { $or: [{ email }, { googleId }] }
        for (const condition of $or) {
          if (condition.email) {
            const user = mockUsers.find(user => user.email === condition.email);
            if (user) return user;
          }
          if (condition.googleId) {
            const user = mockUsers.find(user => user.googleId === condition.googleId);
            if (user) return user;
          }
        }
        return null;
      }
      if (email) {
        return mockUsers.find(user => user.email === email) || null;
      }
      if (googleId) {
        return mockUsers.find(user => user.googleId === googleId) || null;
      }
      return null;
    },
    create: async (userData) => {
      const newUser = {
        _id: `mock-${Date.now()}`,
        ...userData,
        createdAt: new Date(),
        isActive: true
      };
      mockUsers.push(newUser);
      return newUser;
    }
  };
  
  // Constructor function for compatibility
  const MockUser = function(data) {
    Object.assign(this, data);
    this._id = `mock-${Date.now()}`;
    this.createdAt = new Date();
    this.isActive = true;
    
    this.save = async function() {
      const index = mockUsers.findIndex(u => u._id === this._id);
      if (index >= 0) {
        mockUsers[index] = this;
      } else {
        mockUsers.push(this);
      }
      return this;
    };
  };
  
  User = MockUser;
  User.findOne = MockUser.findOne;
  User.create = MockUser.create;
}

// Utility functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

const generateToken = (userId, email, provider = 'email') => {
  const secret = process.env.JWT_SECRET || 'project-aqua-default-secret';
  const payload = {
    userId,
    email,
    provider,
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: 'project-aqua'
  });
};

const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * User Registration/Signup
 */
exports.signup = async (req, res) => {
  try {
    console.log('📝 Signup attempt for:', req.body.email);
    
    const { email, password, name, phone } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Email and password are required',
        fields: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        error: 'WEAK_PASSWORD',
        message: 'Password must be at least 8 characters long with uppercase, lowercase, and number'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizeInput(email.toLowerCase()) });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'USER_EXISTS',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user data
    const userData = {
      email: sanitizeInput(email.toLowerCase()),
      password: hashedPassword,
      name: name ? sanitizeInput(name) : '',
      phone: phone ? sanitizeInput(phone) : '',
      authProvider: 'email',
      isEmailVerified: false,
      role: 'user'
    };

    // Create new user
    const user = new User(userData);
    const savedUser = await user.save();

    // Generate token
    const token = generateToken(savedUser._id, savedUser.email, 'email');

    console.log('✅ User created successfully:', savedUser.email);

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: {
        user: {
          id: savedUser._id,
          email: savedUser.email,
          name: savedUser.name,
          role: savedUser.role || 'user',
          provider: 'email',
          createdAt: savedUser.createdAt
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'DUPLICATE_KEY',
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'SIGNUP_FAILED',
      message: 'Failed to create user account',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * User Login
 */
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login attempt for:', req.body.email);
    
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_CREDENTIALS',
        message: 'Email and password are required',
        fields: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'Please provide a valid email address'
      });
    }

    // Find user
    const user = await User.findOne({ email: sanitizeInput(email.toLowerCase()) });
    if (!user) {
      console.log('❌ Login failed: User not found -', email);
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_DISABLED',
        message: 'Your account has been disabled. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password -', email);
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.authProvider || 'email');

    // Update last login
    if (user.save) {
      try {
        user.lastLogin = new Date();
        await user.save();
      } catch (updateError) {
        console.log('⚠️  Failed to update last login:', updateError.message);
      }
    }

    console.log('✅ Login successful:', user.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          provider: user.authProvider || 'email',
          avatar: user.avatar || null
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    
    res.status(500).json({
      success: false,
      error: 'LOGIN_FAILED',
      message: 'Login failed due to server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Google OAuth - Initiate Login
 */
exports.googleLogin = (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(501).json({
        success: false,
        error: 'OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables.'
      });
    }

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      state: JSON.stringify({
        timestamp: Date.now(),
        source: 'project-aqua',
        returnUrl: req.query.returnUrl || '/dashboard'
      }),
    });

    console.log('🚀 Redirecting to Google OAuth');
    res.redirect(authUrl);

  } catch (error) {
    console.error('❌ Google login redirect error:', error);
    res.redirect('/login?error=google_redirect_failed');
  }
};

/**
 * Google OAuth Callback Handler
 */
exports.googleCallback = async (req, res) => {
  try {
    const { code, state, error: oauthError } = req.query;

    // Check for OAuth errors
    if (oauthError) {
      console.log('❌ Google OAuth error:', oauthError);
      return res.redirect(`/login?error=${oauthError}`);
    }

    if (!code) {
      console.log('❌ No authorization code received');
      return res.redirect('/login?error=no_authorization_code');
    }

    // Parse state parameter
    let stateData = {};
    try {
      stateData = state ? JSON.parse(state) : {};
    } catch (e) {
      console.log('⚠️  Invalid state parameter, continuing...');
    }

    console.log('🔐 Processing Google OAuth callback...');

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Verify and get user info from ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('✅ Google user authenticated:', {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      verified: payload.email_verified
    });

    // Find existing user or create new one
    let user = await User.findOne({ 
      $or: [
        { email: payload.email },
        { googleId: payload.sub }
      ]
    });

    if (user) {
      // Update existing user with Google info
      user.googleId = payload.sub;
      user.avatar = payload.picture;
      user.isEmailVerified = payload.email_verified;
      user.lastLogin = new Date();
      
      if (user.save) {
        await user.save();
      }
      
      console.log('✅ Existing user logged in via Google:', user.email);
    } else {
      // Create new user
      const userData = {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        avatar: payload.picture,
        authProvider: 'google',
        isEmailVerified: payload.email_verified,
        role: 'user'
      };

      user = new User(userData);
      if (user.save) {
        await user.save();
      }
      
      console.log('✅ New Google user created:', user.email);
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, 'google');

    // Determine redirect URL
    const returnUrl = stateData.returnUrl || '/dashboard';
    const frontendUrl = `http://localhost:3000${returnUrl}?token=${token}&provider=google&name=${encodeURIComponent(user.name)}`;

    console.log('🎯 Redirecting to:', frontendUrl);
    res.redirect(frontendUrl);

  } catch (error) {
    console.error('❌ Google OAuth callback error:', error);
    
    let errorMessage = 'google_auth_failed';
    if (error.message.includes('invalid_grant')) {
      errorMessage = 'authorization_expired';
    } else if (error.message.includes('redirect_uri_mismatch')) {
      errorMessage = 'redirect_uri_mismatch';
    }
    
    res.redirect(`/login?error=${errorMessage}&details=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Get Google Auth URL (API endpoint)
 */
exports.getGoogleAuthUrl = (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(501).json({
        success: false,
        error: 'OAUTH_NOT_CONFIGURED',
        message: 'Google OAuth is not configured'
      });
    }

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      state: JSON.stringify({
        timestamp: Date.now(),
        source: 'project-aqua-api',
        returnUrl: req.query.returnUrl || '/dashboard'
      }),
    });

    res.json({
      success: true,
      authUrl,
      message: 'Use this URL to initiate Google OAuth flow'
    });

  } catch (error) {
    console.error('❌ Google Auth URL generation error:', error);
    res.status(500).json({
      success: false,
      error: 'GOOGLE_AUTH_URL_FAILED',
      message: 'Failed to generate Google authentication URL'
    });
  }
};

/**
 * Verify Token Middleware
 */
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'NO_TOKEN',
        message: 'Access token is required. Please include Authorization: Bearer <token> header.'
      });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'project-aqua-default-secret';

    const decoded = jwt.verify(token, secret);
    
    // Find user
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User associated with this token no longer exists'
      });
    }

    // Check if user is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_DISABLED',
        message: 'Your account has been disabled'
      });
    }

    // Add user info to request
    req.user = user;
    req.userId = user._id;
    req.tokenData = decoded;
    
    next();

  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid access token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'TOKEN_EXPIRED',
        message: 'Access token has expired'
      });
    }

    res.status(500).json({
      success: false,
      error: 'TOKEN_VERIFICATION_FAILED',
      message: 'Failed to verify access token'
    });
  }
};

/**
 * Get Current User Profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone || null,
          role: user.role || 'user',
          provider: user.authProvider || 'email',
          avatar: user.avatar || null,
          isEmailVerified: user.isEmailVerified || false,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || null
        }
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    
    res.status(500).json({
      success: false,
      error: 'PROFILE_FETCH_FAILED',
      message: 'Failed to fetch user profile'
    });
  }
};

/**
 * Update User Profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = req.user;

    const updates = {};
    if (name !== undefined) updates.name = sanitizeInput(name);
    if (phone !== undefined) updates.phone = sanitizeInput(phone);

    // Update user
    Object.assign(user, updates);
    if (user.save) {
      await user.save();
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role || 'user',
          provider: user.authProvider || 'email',
          avatar: user.avatar
        }
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    
    res.status(500).json({
      success: false,
      error: 'PROFILE_UPDATE_FAILED',
      message: 'Failed to update user profile'
    });
  }
};

/**
 * Logout (token invalidation on client side)
 */
exports.logout = async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success since JWT tokens are stateless
    
    res.json({
      success: true,
      message: 'Logged out successfully. Please clear the token from client storage.'
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'LOGOUT_FAILED',
      message: 'Failed to logout'
    });
  }
};

/**
 * Auth Service Status
 */
exports.status = async (req, res) => {
  try {
    const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    
    res.json({
      success: true,
      message: 'Authentication service is running',
      status: 'active',
      timestamp: new Date().toISOString(),
      features: {
        emailAuth: 'available',
        googleOAuth: googleConfigured ? 'configured' : 'not_configured',
        tokenVerification: 'available',
        userProfile: 'available',
        passwordReset: 'planned'
      },
      security: {
        passwordHashing: 'bcrypt',
        tokenType: 'JWT',
        tokenExpiry: process.env.JWT_EXPIRES_IN || '24h',
        saltRounds: process.env.BCRYPT_SALT_ROUNDS || '12'
      },
      oauth: {
        google: {
          configured: googleConfigured,
          clientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 12)}...` : 'not_set',
          redirectUri: process.env.GOOGLE_REDIRECT_URI || 'not_set'
        }
      },
      endpoints: {
        login: 'POST /api/auth/login',
        signup: 'POST /api/auth/signup',
        googleLogin: 'GET /api/auth/google',
        googleCallback: 'GET /api/auth/google/callback',
        profile: 'GET /api/auth/profile (requires auth)',
        updateProfile: 'PUT /api/auth/profile (requires auth)',
        logout: 'POST /api/auth/logout'
      }
    });
  } catch (error) {
    console.error('❌ Auth status error:', error);
    res.status(500).json({
      success: false,
      error: 'STATUS_CHECK_FAILED',
      message: 'Failed to get authentication status'
    });
  }
};