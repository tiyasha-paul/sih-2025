// This is the main entry point for the HydroLens application
// It starts both the Node.js and Python servers

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting HydroLens servers...');

// Start Python FastAPI server for Google OAuth
const pythonServer = spawn('python', ['-m', 'uvicorn', 'hydrolensBE.main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'], {
  cwd: __dirname,
  stdio: 'inherit'
});

pythonServer.on('error', (err) => {
  console.error('Failed to start Python server:', err);
});

// Start Node.js Express server for main application
const nodeServer = spawn('node', ['server/acc/script/server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

nodeServer.on('error', (err) => {
  console.error('Failed to start Node.js server:', err);
});

console.log('HydroLens servers started successfully!');
console.log('- Node.js server: http://localhost:3000');
console.log('- Python server: http://localhost:8000');
