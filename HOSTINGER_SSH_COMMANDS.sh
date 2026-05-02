#!/bin/bash
# Hostinger Deployment Commands
# Run these in Hostinger Terminal/SSH after uploading files

# Get your actual paths:
# SSH path: usually /home/USERNAME/domains/DOMAIN/nodejs/
# or: /home/USERNAME/public_html/app/

# ============================================
# STEPS TO RUN ON HOSTINGER
# ============================================

# 1. Navigate to your app folder
cd /home/u739130981/domains/aiudaanbootcamp.com/nodejs

# 2. Remove any corrupted node_modules
rm -rf node_modules

# 3. Install fresh dependencies
npm install

# 4. Generate Prisma client
npx prisma generate

# 5. Start the app
npm start

# ============================================
# If using PM2 (recommended for background process):
# ============================================

# Install PM2 globally (first time only)
npm install -g pm2

# Start with PM2
pm2 start server.js --name "aiudaan-app"

# Check if running
pm2 list

# View logs
pm2 logs aiudaan-app

# Restart if needed
pm2 restart aiudaan-app

# Stop if needed
pm2 stop aiudaan-app

# Autostart on server reboot (first time only)
pm2 startup
pm2 save

# ============================================
# TROUBLESHOOTING
# ============================================

# Check if Node.js is installed
node --version

# Check if npm works
npm --version

# See what ports are in use
lsof -i -P -n | grep LISTEN

# Kill process on port 3000
pkill -f "node server.js"
# or
fuser -k 3000/tcp

# Clear npm cache if install fails
npm cache clean --force
npm install

# Check logs if app crashes
pm2 logs

# See current directory contents
ls -la

# See if .env.local exists
cat .env.local
