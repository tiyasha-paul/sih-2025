// This is the main entry point for the HydroLens application
// It starts the Node.js server

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting HydroLens server...');

// Start Node.js Express server for main application
const nodeServer = spawn('node', ['server/acc/script/server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

nodeServer.on('error', (err) => {
  console.error('Failed to start Node.js server:', err);
});

console.log('HydroLens server started successfully!');
console.log('- Node.js server: http://localhost:3000');
