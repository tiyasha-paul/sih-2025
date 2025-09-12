require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..', '..', '..')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hydrolens', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.log('MongoDB connection failed, continuing without database:', err.message);
});

// Start server regardless of MongoDB connection status
app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Note: Some features may not work without MongoDB connection');
});
