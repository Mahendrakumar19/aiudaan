#!/bin/bash
# Hostinger Deployment Fix - RUN THIS ON SERVER VIA SSH

echo "======================================"
echo "AI Udaan Bootcamp - Server Deployment"
echo "======================================"
echo ""

# Variables
APP_PATH="/home/u739130981/domains/aiudaanbootcamp.com/nodejs"
BACKUP_PATH="/home/u739130981/domains/aiudaanbootcamp.com/nodejs_backup_$(date +%Y%m%d_%H%M%S)"

# Step 1: Navigate to app directory
echo "[1/8] Navigating to app directory..."
cd $APP_PATH || { echo "ERROR: Could not navigate to $APP_PATH"; exit 1; }
echo "✅ Current directory: $(pwd)"
echo ""

# Step 2: Backup old .next directory
if [ -d ".next" ]; then
    echo "[2/8] Backing up old .next directory..."
    mv .next .next.backup.$(date +%s)
    echo "✅ Backed up .next"
else
    echo "[2/8] No existing .next directory (first build)"
fi
echo ""

# Step 3: Kill any running node processes
echo "[3/8] Stopping any running Node processes..."
pkill -f "node server.js" || echo "No running processes"
sleep 2
echo "✅ Node processes stopped"
echo ""

# Step 4: Clean node_modules if corrupted
echo "[4/8] Checking node_modules health..."
if [ ! -d "node_modules" ]; then
    echo "node_modules missing - will reinstall"
else
    echo "node_modules exists - skipping reinstall"
fi
echo ""

# Step 5: Install dependencies
echo "[5/8] Installing/updating dependencies..."
npm install --production
if [ $? -ne 0 ]; then
    echo "❌ ERROR: npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 6: Generate Prisma client
echo "[6/8] Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Prisma generation failed"
    exit 1
fi
echo "✅ Prisma client generated"
echo ""

# Step 7: Build Next.js application
echo "[7/8] Building Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Build failed"
    echo "Restoring from backup..."
    if [ -d ".next.backup" ]; then
        rm -rf .next
        ls -1d .next.backup* | tail -1 | xargs -I {} mv {} .next
    fi
    exit 1
fi
echo "✅ Build completed successfully"
echo ""

# Step 8: Start the application with proper error handling
echo "[8/8] Starting application..."
NODE_ENV=production npm start &
sleep 3

# Verify the process is running
if pgrep -f "node server.js" > /dev/null; then
    echo "✅ Application started successfully"
    echo ""
    echo "======================================"
    echo "✅ DEPLOYMENT COMPLETE!"
    echo "======================================"
    echo ""
    echo "Verify deployment:"
    echo "  1. Visit: https://aiudaanbootcamp.com"
    echo "  2. Check browser console for errors (F12)"
    echo "  3. If issues, check logs: npm run logs"
    echo ""
    echo "To stop the app: pkill -f 'node server.js'"
    echo "To view logs: tail -f /tmp/app.log"
else
    echo "❌ ERROR: Application failed to start"
    echo "Check logs for details"
    exit 1
fi
