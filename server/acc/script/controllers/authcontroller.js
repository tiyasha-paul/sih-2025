const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Google OAuth login handlers

exports.googleLogin = (req, res) => {
  // Redirect user to Google OAuth consent screen
  const clientId = process.env.GOOGLE_CLIENT_ID || '1059025625955-5dse176vipirlcms7ifas4g0eafo6btg.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:3000/auth/callback';
  const scope = encodeURIComponent('email profile openid');
  const responseType = 'code';
  const accessType = 'offline';
  const prompt = 'consent';

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&prompt=${prompt}`;
  res.redirect(authUrl);
};

exports.googleCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  // Exchange code for tokens
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '1059025625955-5dse176vipirlcms7ifas4g0eafo6btg.apps.googleusercontent.com', process.env.GOOGLE_CLIENT_SECRET || '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', 'http://localhost:3000/auth/callback');

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID || '1059025625955-5dse176vipirlcms7ifas4g0eafo6btg.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();

    // Here you can create or find user in your DB and create JWT token
    const userId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // For demo, create JWT token with user info
    const jwtToken = jwt.sign({ id: userId, email, name }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });

    // Redirect to frontend with token (could be via cookie or query param)
    res.redirect(`http://localhost:3000/chat.html?token=${jwtToken}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).send('Authentication failed');
  }
};
