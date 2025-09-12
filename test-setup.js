const fs = require('fs');
const path = require('path');

console.log('🔍 HydroLens Setup Validation\n');

// Check for required files
const requiredFiles = [
  '.env',
  'package.json',
  'hydrolensBE/requirements.txt',
  'hydrolensBE/client_secret.json',
  'server/acc/script/server.js',
  'hydrolensBE/main.py'
];

console.log('📁 Checking required files...');
let filesOk = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    filesOk = false;
  }
});

// Check environment variables
console.log('\n🔧 Checking environment variables...');
require('dotenv').config();
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
let envOk = true;

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar] && process.env[envVar] !== `your_${envVar.toLowerCase()}_here`) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`❌ ${envVar} - NOT SET OR USING DEFAULT`);
    envOk = false;
  }
});

// Check Node.js dependencies
console.log('\n📦 Checking Node.js dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'cors', 'dotenv', 'bcryptjs', 'jsonwebtoken'];
  let depsOk = true;

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - NOT INSTALLED`);
      depsOk = false;
    }
  });

  if (!depsOk) {
    console.log('\n💡 Run: npm install');
  }
} catch (error) {
  console.log('❌ Error reading package.json');
}

// Check Python dependencies
console.log('\n🐍 Checking Python dependencies...');
try {
  const requirements = fs.readFileSync('hydrolensBE/requirements.txt', 'utf8');
  const requiredPyDeps = ['fastapi', 'uvicorn', 'google-auth', 'google-auth-oauthlib'];
  let pyDepsOk = true;

  requiredPyDeps.forEach(dep => {
    if (requirements.includes(dep)) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - NOT IN REQUIREMENTS`);
      pyDepsOk = false;
    }
  });

  if (!pyDepsOk) {
    console.log('\n💡 Run: cd hydrolensBE && pip install -r requirements.txt');
  }
} catch (error) {
  console.log('❌ Error reading requirements.txt');
}

// Summary
console.log('\n📊 Summary:');
if (filesOk && envOk) {
  console.log('✅ Setup looks good! You can start the servers.');
  console.log('💡 Run: npm run python & npm run dev');
} else {
  console.log('❌ Setup incomplete. Please fix the issues above.');
}

console.log('\n🔗 Useful commands:');
console.log('  npm run setup     - Install all dependencies');
console.log('  npm run python    - Start Python backend');
console.log('  npm run dev       - Start Node.js backend');
console.log('  npm start         - Start production servers');
