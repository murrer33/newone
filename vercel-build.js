// Custom build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log current directory structure
console.log('Current working directory:', process.cwd());
console.log('Files in the current directory:');
const files = fs.readdirSync('.');
console.log(files);

// Log package.json contents
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('Package.json dependencies:');
console.log(packageJson.dependencies);

// Check if firebase is installed
console.log('Checking for firebase installation:');
try {
  const firebasePath = require.resolve('firebase');
  console.log('Firebase is installed at:', firebasePath);
} catch (error) {
  console.error('Error resolving firebase module:', error.message);
  
  // Install firebase if it's not found
  console.log('Installing firebase...');
  execSync('npm install firebase', { stdio: 'inherit' });
}

// Run the build
console.log('Running build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 