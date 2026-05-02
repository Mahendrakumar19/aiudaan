# Environment Variables for Payment System

## Razorpay Configuration

```env
# Your Razorpay Key ID (from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx

# Your Razorpay Key Secret (KEEP THIS SECRET - Never expose in frontend)
RAZORPAY_KEY_SECRET=your_secret_key_here

# This is safe to expose - used in frontend for Razorpay Checkout
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
```

## Email Configuration (Gmail)

For Gmail, you need an "App Password" (NOT your regular password):

```env
# Email service type
EMAIL_SERVICE=gmail

# Your Gmail email
EMAIL_USER=your-email@gmail.com

# Gmail App Password (generate at https://myaccount.google.com/apppasswords)
# This is different from your regular Gmail password
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Email to display as sender
EMAIL_FROM=noreply@aiudaanbootcamp.com
```

## Email Configuration (Generic SMTP)

If using a different email provider:

```env
# SMTP Host (e.g., smtp.office365.com, mail.yourdomain.com)
SMTP_HOST=smtp.your-provider.com

# SMTP Port (typically 587 for TLS, 465 for SSL)
SMTP_PORT=587

# SMTP User
SMTP_USER=your-email@yourdomain.com

# SMTP Password
SMTP_PASS=your-password

# Use TLS/SSL
SMTP_SECURE=true

# Email from address
EMAIL_FROM=noreply@aiudaanbootcamp.com
```

## How to Get Razorpay Keys

1. Sign up at https://razorpay.com
2. Go to Dashboard → Settings → API Keys
3. Copy your Key ID (public) and Key Secret (private)
4. Use Key ID in both RAZORPAY_KEY_ID and NEXT_PUBLIC_RAZORPAY_KEY_ID
5. Use Key Secret only in RAZORPAY_KEY_SECRET (backend only)

## How to Generate Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your app type)
3. Google will generate a 16-character password
4. Use this password in EMAIL_PASS (remove spaces)

## Important Security Notes

⚠️ **NEVER expose these in frontend:**
- RAZORPAY_KEY_SECRET
- EMAIL_PASS
- SMTP_PASS

✅ **Safe to expose in frontend:**
- NEXT_PUBLIC_RAZORPAY_KEY_ID (with NEXT_PUBLIC_ prefix)
- NEXT_PUBLIC_* variables

⚠️ **Never commit .env.local to git**
- Add to .gitignore
- Use .env.example for reference without secrets

## Development vs Production

### Development (.env.local)
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx  # Test key
RAZORPAY_KEY_SECRET=test_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx

EMAIL_SERVICE=gmail
EMAIL_USER=dev-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

### Production (.env.production)
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx  # Live key
RAZORPAY_KEY_SECRET=live_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx

EMAIL_SERVICE=gmail
EMAIL_USER=business-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

## Testing Razorpay Payments

Use these test credentials for development:

- **Test Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)

All test transactions will succeed and can be viewed in your Razorpay dashboard.

## Verify Email Configuration

After setting up email, you can test it by running:

```bash
node -e "
const { verifyEmailTransporter } = require('./lib/email-service.ts');
verifyEmailTransporter().then(result => {
  console.log('Email configured:', result ? 'YES ✅' : 'NO ❌');
  process.exit(result ? 0 : 1);
});
"
```

## Troubleshooting

### "Razorpay payment service not configured"
- Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set
- Restart dev server after adding env vars

### "Email sending failed"
- Check EMAIL_USER and EMAIL_PASS are correct
- For Gmail: Verify you used App Password, not regular password
- For Gmail: Enable "Less Secure App Access" if needed
- Check spam folder for test emails

### "Order creation failed"
- Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct
- Check you're using test credentials in development
- Verify your Razorpay account is activated

## File Locations

- Development env: `.env.local`
- Production env: `.env.production.local`
- Example: `.env.example` (safe to commit)

Never modify or delete .env.local in version control!
