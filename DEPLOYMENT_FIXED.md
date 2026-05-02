# Hostinger Deployment Guide - FIXED ✅

## 🔴 WHAT WENT WRONG

**Error:** `Cannot find module 'next/dist/compiled/webpack/webpack-lib'`

**Root Cause:** The `.next` build directory was NEVER created because the `npm run build` command was not executed on the server.

---

## ✅ SOLUTION - 3 FILES TO UPDATE

### **Step 1: Replace These Files on Hostinger**

1. **server.js** → Use `server.PRODUCTION.js` (has better error handling)
2. **next.config.js** → Use `next.config.PRODUCTION.js` (removes turbopack issues)
3. **Run SSH script** → Use `HOSTINGER_DEPLOY.sh` to build and deploy

---

## 📋 HOSTINGER DEPLOYMENT STEPS

### **Via SSH Terminal (FASTEST & RECOMMENDED)**

```bash
# 1. SSH into Hostinger
# Login credentials from Hostinger dashboard

# 2. Run the deployment script
bash /home/u739130981/domains/aiudaanbootcamp.com/nodejs/HOSTINGER_DEPLOY.sh

# That's it! The script handles everything:
# - Installs dependencies
# - Generates Prisma client
# - Builds the Next.js app (.next directory created here ✅)
# - Starts the server
```

---

### **Via File Manager (IF SSH Not Available)**

#### **Part 1: Upload New Files**
1. Log into Hostinger → File Manager
2. Navigate to `/home/u739130981/domains/aiudaanbootcamp.com/nodejs/`
3. Upload/Replace:
   - ✅ `server.PRODUCTION.js` → rename to `server.js`
   - ✅ `next.config.PRODUCTION.js` → rename to `next.config.js`

#### **Part 2: Delete Old Files**
4. Delete these folders (they'll be recreated):
   - ❌ `.next` (old build)
   - ❌ `node_modules` (will reinstall fresh)

#### **Part 3: Run Build Manually**
5. Open Terminal in Hostinger:
   - Go to `/nodejs` directory
   - Run these commands **IN ORDER**:

```bash
npm install
npx prisma generate
npm run build
npm start
```

---

## ✨ WHAT EACH FILE DOES

| File | Purpose | Changes |
|------|---------|---------|
| `server.PRODUCTION.js` | Custom Node server | ✅ Added build check (exits if `.next` missing) |
| `next.config.PRODUCTION.js` | Next.js config | ✅ Removed turbopack (was causing webpack errors) |
| `HOSTINGER_DEPLOY.sh` | Deployment script | ✅ Automated: install→generate→build→start |

---

## 🧪 VERIFY DEPLOYMENT

After running the script/commands:

1. **Check if running:**
   ```bash
   curl http://localhost:3000
   ```

2. **Visit your site:**
   - Open `https://aiudaanbootcamp.com`
   - Open DevTools (F12) → Network tab
   - Reload page
   - Look for `.js` and `.css` files with ✅ **200 status**

3. **If 404 errors appear:**
   - `.next` folder wasn't created
   - Run `npm run build` again
   - Check server logs

---

## 🚨 TROUBLESHOOTING

### **"Cannot find module 'next/dist/compiled/webpack'"**
→ `.next` directory missing
→ Solution: Run `npm run build`

### **"Port 3000 already in use"**
→ Previous process still running
→ Solution: `pkill -f "node server.js"` then restart

### **"Cannot find module 'prisma'"**
→ Dependencies not installed
→ Solution: Run `npm install`

### **"DATABASE_URL is not set"**
→ `.env.local` file missing
→ Solution: Ensure `.env.local` file exists with correct DATABASE_URL

---

## 📁 EXPECTED FINAL STRUCTURE

```
/nodejs/
├── .next/               ← ✅ MUST EXIST after build
├── node_modules/        ← ✅ Created by npm install
├── public/              ← Static files
├── app/                 ← Next.js app folder
├── components/          ← React components
├── lib/                 ← Utilities
├── prisma/              ← Database schema
├── server.js            ← Updated with error handling
├── next.config.js       ← Updated (no turbopack)
├── package.json         ← Unchanged
├── .env.local           ← ⚠️ KEEP THIS (database config)
└── HOSTINGER_DEPLOY.sh  ← The deployment script
```

---

## ⚡ QUICK CHECKLIST

Before considering deployment complete:

- [ ] `.next` folder exists on server
- [ ] `npm start` runs without errors
- [ ] Website loads: `https://aiudaanbootcamp.com`
- [ ] No 404 on JS/CSS files
- [ ] Forms/API endpoints work
- [ ] Database queries return data

---

## 📞 STILL NOT WORKING?

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 18+ for Next.js 16
   ```

2. **Reinstall everything:**
   ```bash
   rm -rf node_modules .next
   npm install
   npm run build
   npm start
   ```

3. **View error logs:**
   - Check Hostinger error logs
   - Run: `npm start 2>&1 | tee app.log`

---

**Created:** April 12, 2026
**Status:** Production Ready ✅
