#!/usr/bin/env node

/**
 * 🔍 Pre-Deployment Verification Script
 * 
 * This script checks that your ZK Rehab Sphere project is ready for Vercel deployment.
 * Run this before deploying to catch any issues early!
 * 
 * Usage: node verify-deployment.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(condition, successMsg, errorMsg) {
  if (condition) {
    log(`✓ ${successMsg}`, 'green');
    return true;
  } else {
    log(`✗ ${errorMsg}`, 'red');
    return false;
  }
}

const projectRoot = path.resolve(__dirname);
let passCount = 0;
let failCount = 0;

log('\n' + '='.repeat(70), 'blue');
log('🚀 ZK REHAB SPHERE - PRE-DEPLOYMENT VERIFICATION', 'bold');
log('='.repeat(70) + '\n', 'blue');

// 1. Check project structure
log('📂 Checking Project Structure...', 'bold');
const files = [
  'package.json',
  'vercel.json',
  '.env.example',
  'frontend/package.json',
  'backend/package.json',
  'backend/server.js',
  'api/index.js',
  'frontend/src/App.jsx',
  'frontend/vite.config.js',
];

files.forEach(file => {
  const exists = fs.existsSync(path.join(projectRoot, file));
  const result = check(exists, `Found: ${file}`, `Missing: ${file}`);
  if (result) passCount++;
  else failCount++;
});

// 2. Check build output
log('\n📦 Checking Build Output...', 'bold');
const distPath = path.join(projectRoot, 'dist');
const distExists = fs.existsSync(distPath);
const result1 = check(distExists, 'dist/ folder exists (build ready)', 'dist/ folder not found (run: npm run build)');
if (result1) passCount++;
else failCount++;

if (distExists) {
  const indexHtml = fs.existsSync(path.join(distPath, 'index.html'));
  const result2 = check(indexHtml, 'index.html in dist/', 'index.html not found in dist/');
  if (result2) passCount++;
  else failCount++;
}

// 3. Check environment configuration
log('\n🔐 Checking Environment Configuration...', 'bold');
const envExample = fs.readFileSync(path.join(projectRoot, '.env.example'), 'utf-8');
const envChecks = [
  ['MONGODB_URI', 'MongoDB Atlas connection'],
  ['CLOUDINARY_CLOUD_NAME', 'Cloudinary cloud name'],
  ['CLOUDINARY_API_KEY', 'Cloudinary API key'],
  ['CLOUDINARY_API_SECRET', 'Cloudinary secret'],
  ['VITE_API_URL', 'Frontend API URL'],
  ['FRONTEND_URL', 'Backend CORS origin'],
];

envChecks.forEach(([key, desc]) => {
  const exists = envExample.includes(key);
  const result = check(exists, `${key} (${desc})`, `Missing: ${key}`);
  if (result) passCount++;
  else failCount++;
});

// 4. Check Git configuration
log('\n🔗 Checking Git Configuration...', 'bold');
try {
  const gitConfig = fs.readFileSync(path.join(projectRoot, '.git/config'), 'utf-8');
  const hasRemote = gitConfig.includes('origin');
  const result = check(hasRemote, 'Git remote "origin" configured', 'Git remote not configured');
  if (result) passCount++;
  else failCount++;
} catch (e) {
  log('✗ .git directory not found', 'red');
  failCount++;
}

// 5. Check package.json workspaces
log('\n📋 Checking Package Configuration...', 'bold');
try {
  const rootPkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
  const hasWorkspaces = rootPkg.workspaces && rootPkg.workspaces.length > 0;
  const result1 = check(hasWorkspaces, 'Workspaces configured (monorepo)', 'No workspaces found');
  if (result1) passCount++;
  else failCount++;

  const frontendPkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'frontend/package.json'), 'utf-8'));
  const hasVite = frontendPkg.devDependencies && frontendPkg.devDependencies.vite;
  const result2 = check(hasVite, 'Vite build tool configured', 'Vite not found');
  if (result2) passCount++;
  else failCount++;

  const backendPkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'backend/package.json'), 'utf-8'));
  const hasExpress = backendPkg.dependencies && backendPkg.dependencies.express;
  const result3 = check(hasExpress, 'Express server configured', 'Express not found');
  if (result3) passCount++;
  else failCount++;
} catch (e) {
  log(`✗ Error reading package.json: ${e.message}`, 'red');
  failCount++;
}

// 6. Check Vercel configuration
log('\n⚡ Checking Vercel Configuration...', 'bold');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf-8'));
  const hasBuildCmd = vercelConfig.buildCommand === 'npm run build';
  const result1 = check(hasBuildCmd, 'Build command: npm run build', 'Build command not configured');
  if (result1) passCount++;
  else failCount++;

  const hasOutputDir = vercelConfig.outputDirectory === 'dist';
  const result2 = check(hasOutputDir, 'Output directory: dist', 'Output directory not set to dist');
  if (result2) passCount++;
  else failCount++;

  const hasRewrites = vercelConfig.rewrites && vercelConfig.rewrites.length > 0;
  const result3 = check(hasRewrites, 'API rewrites configured', 'API rewrites not found');
  if (result3) passCount++;
  else failCount++;
} catch (e) {
  log(`✗ Error reading vercel.json: ${e.message}`, 'red');
  failCount++;
}

// 7. Check backend setup
log('\n🔧 Checking Backend Setup...', 'bold');
try {
  const serverJs = fs.readFileSync(path.join(projectRoot, 'backend/server.js'), 'utf-8');
  const hasAppExport = serverJs.includes('module.exports = app');
  const result1 = check(hasAppExport, 'Server exports Express app', 'App not exported from server.js');
  if (result1) passCount++;
  else failCount++;

  const apiIndex = fs.readFileSync(path.join(projectRoot, 'api/index.js'), 'utf-8');
  const hasApiHandler = apiIndex.includes('module.exports');
  const result2 = check(hasApiHandler, 'API serverless handler configured', 'API handler not configured');
  if (result2) passCount++;
  else failCount++;

  const hasDbConnection = serverJs.includes('connectDB()');
  const result3 = check(hasDbConnection, 'MongoDB connection setup', 'MongoDB connection not configured');
  if (result3) passCount++;
  else failCount++;
} catch (e) {
  log(`✗ Error checking backend setup: ${e.message}`, 'red');
  failCount++;
}

// Summary
log('\n' + '='.repeat(70), 'blue');
log(`📊 VERIFICATION SUMMARY`, 'bold');
log('='.repeat(70), 'blue');
log(`✓ Passed: ${passCount} checks`, 'green');
log(`✗ Failed: ${failCount} checks`, failCount > 0 ? 'red' : 'green');
log('='.repeat(70) + '\n', 'blue');

if (failCount === 0) {
  log('🎉 All checks passed! Your project is ready for deployment!', 'green');
  log('\nNext steps:', 'bold');
  log('1. Go to https://vercel.com/new/clone?repository-url=...', 'yellow');
  log('2. Connect your GitHub repository', 'yellow');
  log('3. Configure environment variables', 'yellow');
  log('4. Deploy! 🚀', 'yellow');
  process.exit(0);
} else {
  log('⚠️  Please fix the issues above before deploying!', 'red');
  log('\nCommon fixes:', 'bold');
  log('• Run: npm run build', 'yellow');
  log('• Run: git add . && git commit -m "fix: deploy setup"', 'yellow');
  log('• Run: git push origin main', 'yellow');
  log('• Check .env.example has all required variables', 'yellow');
  process.exit(1);
}
