# 🎯 Hostinger Deployment Quick Start

> **Deployment Target**: Hostinger Shared Hosting (cPanel)  
> **Node Version**: 18+ (recommended 20)  
> **Build Time**: ~15 seconds  
> **Recommended Plan**: Premium (2 GB RAM minimum)

---

## 📋 Pre-Deployment Checklist

### Local Verification
```bash
# 1. Verify clean build
npm install
npm run build

# 2. Test locally
npm run dev
# Visit http://localhost:3000 and test registration flow

# 3. Check bundle size
ls -lh .next/static
```

### Environment Variables
Create `.env.production.local` with:
```bash
DATABASE_URL="your-production-db-connection"
RAZORPAY_KEY_ID="rzp_live_YOUR_LIVE_KEY"
RAZORPAY_KEY_SECRET="YOUR_LIVE_SECRET"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_YOUR_LIVE_KEY"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
NODE_ENV="production"
```

---

## 🚀 Deployment Steps

### Step 1: Deploy via Hostinger cPanel (Git)
If your Hostinger supports Git deployment:

```bash
# In cPanel → Terminal:
cd public_html
git clone https://github.com/yourusername/aiudaanbootcamp.git .

# Or if already cloned:
git pull origin main

# Install dependencies
npm install --production

# Build the application
npm run build

# Start the server (use PM2 or cPanel's Node.js app)
npm start
```

### Step 2: Via FTP (Without Git)
```bash
# 1. Build locally
npm run build

# 2. Upload via FTP:
# - .next/ directory
# - public/ directory
# - node_modules/ directory (or npm install on server)
# - package.json & package-lock.json
# - .env.production.local
# - server.js
```

### Step 3: Configure in Hostinger cPanel

**Option A: Using Node.js Application**
1. Go to **cPanel → Node.js Manager**
2. Click **Create Application**
3. Set:
   - **Node Version**: 18 or 20
   - **Application Root**: `/home/yourusername/public_html`
   - **Entry Point**: `server.js` or `npm start`
   - **Application Startup File**: `server.js`
4. Click **Create**
5. Start Application

**Option B: Using PM2 (Recommended)**
```bash
# SSH into Hostinger
ssh username@your-hostinger-server

cd ~/public_html

# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'aiudaan-bootcamp',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Startup on server reboot
pm2 startup
```

### Step 4: Configure Domain/SSL
1. Go to **cPanel → Addon Domains** or **Domains**
2. Point domain to `public_html`
3. Go to **SSL/TLS Manager**
4. Get free SSL certificate (Let's Encrypt)
5. Install on domain

---

## 🔧 Optimize Performance on Hostinger

### Enable Gzip Compression
```bash
# In cPanel → EasyApache (WHM):
# ✅ Ensure mod_deflate is enabled
```

### Configure CloudFlare (Free)
1. Go to [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update nameservers at Hostinger
4. Features:
   - CDN caching
   - DDoS protection
   - Automatic SSL
   - Image optimization

### Database Optimization
```sql
-- If using MySQL/MariaDB on Hostinger:

-- Add indexes for frequently queried fields
CREATE INDEX idx_email ON registrations(email);
CREATE INDEX idx_status ON registrations(paymentStatus);
CREATE INDEX idx_created ON registrations(createdAt);

-- Check query performance
EXPLAIN SELECT * FROM registrations WHERE email = 'user@example.com';
```

---

## 📊 Monitor Performance

### Check CPU Usage
1. cPanel → Resource Usage
2. Keep below 20% average
3. If higher:
   - Increase cache TTLs in `lib/api-cache.ts`
   - Add database indexes
   - Consider upgrading plan

### View Error Logs
```bash
# SSH into Hostinger
tail -f ~/public_html/.next/logs/error.log

# Or in cPanel:
# cPanel → Raw Access Logs
```

### Check Disk Space
```bash
du -sh ~/public_html/
du -sh ~/public_html/node_modules/
du -sh ~/public_html/.next/
```

---

## 🐛 Troubleshooting

### Issue: "Command not found: npm"
**Solution**: 
- SSH in and check Node.js path: `which node`
- Use full path or ensure Hostinger Node.js app is started

### Issue: "ENOENT: no such file or directory"
**Solution**:
- Check `.env.production.local` exists with correct values
- Verify `DATABASE_URL` is correct
- Ensure all files uploaded correctly

### Issue: "Port already in use"
**Solution**:
- Kill existing process: `pm2 kill`
- Restart: `pm2 start ecosystem.config.js`

### Issue: "Slow page loads (>5s)"
**Solution**:
1. Check API cache is enabled: `lib/api-cache.ts`
2. Verify database indexes exist
3. Check CloudFlare caching is enabled
4. Monitor with `/api/performance` endpoint

### Issue: "Out of memory error"
**Solution**:
- Reduce Node.js instances in PM2 config
- Increase server memory or upgrade plan
- Clear old logs: `rm ~/public_html/.next/logs/*`

---

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Page Load | < 3s | - |
| API Response | < 200ms | - |
| Bundle Size | < 1MB | ~0.95MB ✅ |
| Build Time | < 20s | ~15s ✅ |
| CPU Usage | < 20% | - |
| Memory | < 300MB | - |

---

## 🔐 Security Checklist

- [x] RAZORPAY_KEY_SECRET in .env (never in code)
- [x] HTTPS/SSL enabled
- [x] Email credentials in .env
- [x] Database password in .env
- [x] Remove debug logs in production
- [ ] Enable WAF on CloudFlare
- [ ] Set up monitoring/alerts
- [ ] Regular backups enabled

---

## 📞 Support Resources

- **Hostinger Docs**: https://support.hostinger.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment/hostinger
- **Node.js on Hostinger**: https://support.hostinger.com/en/articles/4195491
- **PM2 Docs**: https://pm2.keymetrics.io/docs/usage/quick-start/

---

## 🎓 After Deployment

1. **Monitor first 24 hours** - Watch error logs
2. **Test all flows** - Registration, Payment, Email confirmation
3. **Collect metrics** - Load times, errors, user feedback
4. **Optimize** - If issues found, check docs/OPTIMIZATION_COMPREHENSIVE.md

---

**Last Updated**: April 18, 2026  
**Next Review**: May 2, 2026
