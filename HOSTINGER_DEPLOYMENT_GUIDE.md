## Hostinger Deployment Checklist

### Pre-Deployment (Local Machine)
- [ ] Make sure all code changes are final
- [ ] `.env.local` file exists with production database connection
- [ ] Run `deploy.bat` script in project root
- [ ] Wait for build to complete (builds `.next` folder)
- [ ] Check `deploy_bundle` folder was created

### On Hostinger - File Manager
1. **Access:** Log into Hostinger → cPanel → File Manager
2. **Navigate:** Go to your Node.js app folder
3. **Backup (optional):**
   - Create a `backup_[date]` folder
   - Copy current folder contents into it
4. **Important:** DO NOT DELETE `.env.local` or `.env` files yet
5. **Delete old files:**
   - Remove `.next`
   - Remove `node_modules`
   - Remove `public` (if uploading new)
   - Keep `.env.local` and any `.env` files
6. **Upload:** Entire contents of `deploy_bundle` folder
   - This may take 5-10 minutes depending on size

### On Hostinger - Terminal/SSH
```bash
# Connect via SSH or use Hostinger's Terminal

# Navigate to your app folder
cd /path/to/your/node-app

# Option 1: Use npm start (from your server.js)
npm start

# Option 2: Use pm2 (if installed)
pm2 restart app-name

# Check logs (if using pm2)
pm2 logs
```

### Verify Deployment ✅
1. Open `https://yourdomain.com` in browser
2. Check DevTools (F12) → Network tab
3. Look for JS/CSS files - they should load with **200 status**
4. File types should show:
   - `*.js` → `application/javascript`
   - `*.css` → `text/css`
5. If you see 404 or `text/plain` MIME errors → re-check your upload

### Troubleshooting

**Issue: Still getting 404 errors**
- Make sure `.next` folder was uploaded completely
- Check that `server.js` was updated (has MIME type fixes)
- Verify Node.js process is running (`npm start`)

**Issue: "Cannot find module"**
- `node_modules` wasn't uploaded completely
- Solution: Delete and re-upload `node_modules` folder

**Issue: Port already in use**
- App crashed and didn't restart properly
- Kill process: `pkill -f "node server.js"`
- Then run `npm start` again

**Issue: Database connection errors**
- Check `.env.local` file exists on Hostinger
- Verify DATABASE_URL points to your Hostinger database
- Make sure Prisma migrations ran: `npx prisma migrate deploy`

### File Structure After Upload
```
your-app-folder/
├── .next/          ← Built app (newly uploaded)
├── node_modules/   ← Dependencies (newly uploaded)
├── public/         ← Static files (newly uploaded)
├── app/            ← Source code
├── components/     ← Components
├── lib/            ← Utilities
├── types/          ← TypeScript types
├── prisma/         ← Database schema
├── server.js       ← Custom server (newly uploaded)
├── next.config.js
├── package.json
├── .env.local      ← KEEP THIS (don't overwrite)
└── node_modules    ← Large folder, takes time to upload
```

### Performance Tips
- Use SFTP over FTP (faster)
- Upload during off-peak hours if possible
- Consider compressing `node_modules` before upload if very slow
- After each deploy, test thoroughly before marking as complete

### Next Time Deployment is Faster
- You'll only need to re-upload: `.next/`, `app/`, `lib/`, `components/`, `types/`, modified configs
- Skip uploading `node_modules` if no dependencies changed
- This can cut deployment time from 10 min to 2-3 min
