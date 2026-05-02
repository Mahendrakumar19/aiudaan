# MySQL Database Setup Guide

## Database Created on Hostinger ✅

**Credentials:**
- Database Name: `u739130981_aiudaanbootcamp`
- Username: `u739130981_user`
- Password: `Aludaan2026`

## Setup Instructions

### Step 1: Find Your Hostinger MySQL Host

Go to your Hostinger control panel and find the MySQL host information. It will be one of these:

1. **Same Server (Recommended)**: `localhost` or `127.0.0.1`
2. **Specific Host**: Check under "Databases" → "MySQL" → connection details (looks like `mysql.yourhost.com` or an IP)
3. **Ask Hostinger Support**: If unclear, contact Hostinger for the exact hostname/IP

### Step 2: Update Production Environment

Replace `HOSTINGER_MYSQL_HOST` in `.env.production` with the actual host:

```
DATABASE_URL="mysql://u739130981_user:Aludaan2026@YOUR_MYSQL_HOST:3306/u739130981_aiudaanbootcamp"
```

### Step 3: Local Testing

For local development, keep using SQLite:
- `.env.local` uses `DATABASE_URL="file:./dev.db"`
- When you `npm run dev`, it uses SQLite locally

### Step 4: Build for Production

```bash
npm run build
```

This will generate the .next folder ready for deployment.

### Step 5: Deploy to Hostinger

1. Update `.env` on Hostinger with production MySQL connection
2. Upload the `.next` folder and necessary files
3. Restart the application

## Current Status

✅ Prisma schema updated to MySQL  
✅ All data models ready for MySQL  
✅ Local environment configured with SQLite  
✅ Production environment file created  

**Next:** Provide the Hostinger MySQL host so we can finalize the production configuration!
