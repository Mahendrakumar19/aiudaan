# Admin Payment Dashboard Setup Guide

## Overview
This admin panel allows you to view all payment statistics including:
- Total payments (success/failed/pending)
- Revenue breakdown by plan
- Recent transactions list
- Payment success rates

## Setup Instructions

### 1. Update Environment Variables

Add these to your `.env.local` file:

```env
# Admin Dashboard
ADMIN_API_KEY=your-secure-admin-key-here
```

Replace `your-secure-admin-key-here` with a strong secret key. Example:
```env
ADMIN_API_KEY=admin_sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

### 2. Run Database Migration

The Payment model has been added to your Prisma schema. Run:

```bash
npx prisma migrate dev --name add_payment_model
```

Or if you're using SQLite in development:
```bash
npx prisma db push
```

### 3. Access the Admin Dashboard

**URL:** `https://yourdomain.com/admin/payments`

**Login:** Use the `ADMIN_API_KEY` from your environment variables

### 4. Payment Recording

Payments are automatically recorded in two scenarios:

**Successful Payment:**
- Recorded when payment verification succeeds
- Status: `success`
- Triggered by: `/api/payments/verify-payment`

**Failed Payment:**
- Can be recorded manually via: `POST /api/payments/failure`
- Status: `failed`
- Requires: email, name, plan, error_message

---

## API Endpoints

### Get Payment Statistics
```
GET /api/admin/payments
Headers: Authorization: Bearer YOUR_ADMIN_API_KEY
```

**Response:**
```json
{
  "totalPayments": 25,
  "successCount": 22,
  "failedCount": 2,
  "pendingCount": 1,
  "totalRevenue": 48500,
  "planBreakdown": {
    "basic": {
      "total": 15,
      "success": 14,
      "revenue": 13986
    },
    "standard": {
      "total": 10,
      "success": 8,
      "revenue": 34514
    }
  },
  "recentPayments": [
    {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "amount": 2499,
      "plan": "standard",
      "status": "success",
      "createdAt": "2026-04-20T10:30:00Z"
    }
  ]
}
```

### Record Payment Failure
```
POST /api/payments/failure
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "plan": "standard",
  "razorpay_order_id": "order_123",
  "error_message": "Payment declined"
}
```

---

## Database Schema

### Payment Model
```prisma
model Payment {
  id                  String     @id @default(cuid())
  userId              String
  email               String
  name                String
  amount              Float
  currency            String     @default("INR")
  plan                String     // "basic" or "standard"
  status              String     // "success", "failed", "pending"
  razorpayOrderId     String?
  razorpayPaymentId   String?
  razorpaySignature   String?
  errorMessage        String?
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  
  user                User?      @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

---

## Security Notes

1. **Admin Key Protection:**
   - Never commit `ADMIN_API_KEY` to version control
   - Use strong, random keys (minimum 32 characters)
   - Rotate keys periodically

2. **Payment Data:**
   - All payment data is encrypted/secured in production
   - Never log sensitive data (card numbers, OTPs, etc.)
   - HMAC-SHA256 signature verification is mandatory

3. **Access Control:**
   - Implement additional authentication (2FA, IP whitelist)
   - Audit access logs regularly
   - Consider role-based access control (RBAC)

---

## Troubleshooting

### Dashboard shows "Unauthorized"
- Check that `ADMIN_API_KEY` is set in `.env.local`
- Verify the key matches exactly (case-sensitive)
- Restart the dev server after changing env vars

### No payment records appear
- Ensure database migration ran successfully: `npx prisma migrate status`
- Check that payments are being processed through the verification endpoint
- Verify `/api/payments/verify-payment` is receiving requests

### "Failed to fetch payment statistics"
- Check browser console for CORS errors
- Verify API endpoint is accessible
- Check server logs for errors

---

## Features

✅ Real-time payment statistics
✅ Plan breakdown (Lite vs Plus)
✅ Success/failure/pending status tracking
✅ Total revenue calculation
✅ Recent transactions (last 10)
✅ Beautiful, responsive UI
✅ Secure admin authentication

---

## Next Steps

1. Set `ADMIN_API_KEY` in `.env.local`
2. Run `npx prisma db push` to update database
3. Restart dev server: `npm run dev`
4. Navigate to `/admin/payments` and login
5. Monitor payments in real-time!

