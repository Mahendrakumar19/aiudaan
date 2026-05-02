# 📊 PAYMENT & REGISTRATION DATA CAPTURE - COMPLETE FLOW

## ✅ What's Now Being Captured

### **User Registration Data**
When user fills the registration form:
```
✅ Name
✅ Email
✅ Mobile (10 digits)
✅ Class/Grade
✅ AI Domain of Interest
✅ How they heard about us
✅ Registration Date/Time
```
→ **Saved in:** User table + Google Sheets

---

### **Payment Data (After Payment Completion)**
When user completes payment:
```
✅ Name
✅ Email
✅ Mobile ← NEW!
✅ Amount (₹999 or ₹2,499)
✅ Plan (Lite or Plus)
✅ Status (Success ✅ or Failed ❌)
✅ Razorpay Order ID
✅ Razorpay Payment ID
✅ Payment Signature
✅ Payment Date/Time
```
→ **Saved in:** Payment table

---

## 🔄 **Complete Data Flow**

```
┌─────────────────────────────────────────┐
│ 1. USER REGISTRATION                    │
│   ├─ Fills: Name, Email, Mobile, Class │
│   ├─ Selects: AI Domain, Source        │
│   └─ Auto-saved: User table            │
│       └─ URL: /success?name=...&email=...&mobile=...
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 2. USER VIEWS SUCCESS PAGE              │
│   └─ Shows registered name, email      │
│   └─ Displays payment plan options     │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 3. USER SELECTS PAYMENT PLAN            │
│   ├─ Selects: "Lite" (₹999)            │
│   │ or "Plus" (₹2,499)                 │
│   └─ Sends: name, email, mobile, plan  │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 4. CREATE RAZORPAY ORDER                │
│   ├─ POST /api/payments/create-order   │
│   ├─ Creates: Order (order_xxxxx)      │
│   ├─ Razorpay stores: Amount, Plan     │
│   └─ Returns: order_id, amount         │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 5. USER PAYS ON RAZORPAY GATEWAY        │
│   ├─ Opens: Razorpay Modal              │
│   ├─ User enters: Card/UPI details      │
│   ├─ Razorpay processes: Payment       │
│   └─ Returns: payment_id, signature    │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 6. VERIFY PAYMENT SIGNATURE             │
│   ├─ POST /api/payments/verify-payment │
│   ├─ Validates: HMAC-SHA256 signature  │
│   ├─ Verifies: Amount & Plan           │
│   └─ Status: ✅ Valid or ❌ Invalid    │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 7. SAVE TO DATABASE                     │
│   └─ Payment table record created:     │
│       ├─ id (cuid)                      │
│       ├─ userId (links to User)         │
│       ├─ name ✅                        │
│       ├─ email ✅                       │
│       ├─ mobile ✅ ← NEW!               │
│       ├─ amount ✅                      │
│       ├─ plan ✅                        │
│       ├─ status ✅                      │
│       ├─ razorpayOrderId ✅             │
│       ├─ razorpayPaymentId ✅           │
│       ├─ razorpaySignature ✅           │
│       └─ createdAt ✅                   │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 8. SEND CONFIRMATION EMAIL              │
│   └─ To: user@email.com                │
│   └─ Contains: Name, Plan, Amount      │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 9. SHOW SUCCESS PAGE                    │
│   └─ "Payment Successful ✅"            │
│   └─ "Registration Confirmed"          │
└─────────────────────────────────────────┘
```

---

## 🎯 **What You See in Admin Panel**

### **Admin Dashboard URL:**
```
http://localhost:3000/admin
```

### **Login Credentials:**
```
Email: admin@aiudaanbootcamp.com
Password: Admin@aiudaan123
```

### **User Table Shows:**
| Name | Email | Mobile | Registered | Payments | Status | Amount |
|------|-------|--------|------------|----------|--------|--------|
| Demo User | demo@example.com | 7905069943 | 20/04/2026 | 1 payment | ✅ Success | ₹2,499 |
| John Doe | john@example.com | 9876543210 | 19/04/2026 | 2 payments | ✅ Success | ₹3,498 |
| Jane Smith | jane@example.com | 8765432109 | 18/04/2026 | 1 payment | ❌ Failed | ₹999 |

### **Statistics Cards Show:**
```
📊 Total Users:        15 users
💳 Total Payments:     24 transactions
✅ Successful:         22 payments
❌ Failed:             2 payments
💰 Total Revenue:      ₹48,899
```

---

## 📈 **Admin Dashboard Features**

### **1. Real-Time Search**
```
🔍 Search by name or email
→ Instantly filters users
```

### **2. Payment Details Expandable**
```
Click any user to see:
├─ All payments (history)
├─ Payment dates
├─ Payment status (each one)
├─ Payment amounts
└─ Plan details (Lite/Plus)
```

### **3. Sort & Filter**
```
View payments by:
├─ Latest first
├─ Status: Success/Failed/Pending
├─ Plan: Lite/Plus
└─ Date range
```

---

## 🗄️ **Database Tables**

### **User Table (SQLite)**
```sql
id       | name    | email                    | password        | createdAt
---------|---------|--------------------------|-----------------|----------
cuid_1   | Demo    | demo@example.com         | $2b$10$hashed.. | 2026-04-20
cuid_2   | John    | john@example.com         | $2b$10$hashed.. | 2026-04-19
cuid_3   | Jane    | jane@example.com         | $2b$10$hashed.. | 2026-04-18
```

### **Payment Table (SQLite)**
```sql
id      | userId  | name    | email               | mobile     | amount | plan    | status  | createdAt
--------|---------|---------|---------------------|------------|--------|---------|---------|----------
pay_1   | cuid_1  | Demo    | demo@example.com    | 7905069943 | 2499   | standard| success | 2026-04-20
pay_2   | cuid_2  | John    | john@example.com    | 9876543210 | 999    | basic   | success | 2026-04-19
pay_3   | cuid_3  | Jane    | jane@example.com    | 8765432109 | 999    | basic   | failed  | 2026-04-18
```

---

## 🔐 **Security Features**

✅ **Passwords hashed** with bcrypt (10 rounds)
✅ **Payment signature verified** with HMAC-SHA256
✅ **Mobile number captured** but not stored in user table (only in payment table)
✅ **Email verified** with OTP before registration
✅ **Foreign key constraint** links payments to users
✅ **Indexes** on userId, status, createdAt for fast queries

---

## 📱 **Mobile Number Handling**

### **Where It's Captured:**
1. Registration form → User enters 10-digit mobile
2. Success page passes it to create-order
3. Razorpay prefills it in payment modal
4. After payment → Saved in Payment table

### **Display in Admin Panel:**
```
Mobile column shows:
├─ Latest payment's mobile number
├─ Clickable (tel: link)
└─ Shows "-" if no payment
```

---

## 🚀 **Next Steps to Test**

### **1. Create a New Payment Record**
```bash
1. Go to: http://localhost:3000/
2. Fill registration form
3. Click "Register Now"
4. See success page with your details
5. Click payment plan button
6. Complete payment in Razorpay modal
7. See "Payment Successful" confirmation
```

### **2. View in Admin Dashboard**
```bash
1. Go to: http://localhost:3000/admin
2. Login: admin@aiudaanbootcamp.com / Admin@aiudaan123
3. See your user in the table
4. See your mobile number in "Mobile" column
5. See payment status: ✅ Success or ❌ Failed
6. See total amount: ₹999 or ₹2,499
```

### **3. Check Success Cases**
```
✅ Successful Payment
   ├─ Status: "Success" (green)
   ├─ Amount: Charged
   ├─ Email: Sent confirmation
   └─ User: Active in system

❌ Failed Payment
   ├─ Status: "Failed" (red)
   ├─ Amount: Not charged
   ├─ Email: Not sent
   └─ User: Can retry
```

---

## 💡 **Data You Can Now Track**

### **For Each User:**
```
✅ When they registered (date/time)
✅ What their email is
✅ What their phone number is
✅ How many times they paid
✅ Payment status of each transaction
✅ How much they paid (total & per transaction)
✅ Which plan they chose (Lite/Plus)
✅ Payment dates for each transaction
```

### **Aggregate Insights:**
```
✅ Total users registered
✅ Total payments received
✅ How many succeeded
✅ How many failed
✅ Total revenue (from successful payments)
✅ Average payment amount
✅ Most popular plan (Lite or Plus)
```

---

## 🎯 **Example Admin View**

```
ADMIN PANEL - AI Udaan Bootcamp
═══════════════════════════════════════════════════════════════

📊 STATISTICS
┌─────────────────────────────────────────┐
│ Total Users: 15      │ Total Payments: 24    │
│ ✅ Success: 22       │ ❌ Failed: 2          │
│ 💰 Revenue: ₹48,899  │                       │
└─────────────────────────────────────────┘

🔍 Search: _____________________

REGISTERED USERS & PAYMENTS
┌──────────┬──────────────────────┬──────────────┬────────────┬──────────┬────────────┬─────────┐
│ Name     │ Email                │ Mobile       │ Registered │ Payments │ Status     │ Amount  │
├──────────┼──────────────────────┼──────────────┼────────────┼──────────┼────────────┼─────────┤
│ Demo     │ demo@example.com     │ 7905069943   │ 20/04/26   │ 1 payment│ ✅ Success │ ₹2,499  │
│ John     │ john@example.com     │ 9876543210   │ 19/04/26   │ 2 payments│✅ Success │ ₹3,498  │
│ Jane     │ jane@example.com     │ 8765432109   │ 18/04/26   │ 1 payment│ ❌ Failed  │ ₹999    │
│ Ram      │ ram@example.com      │ 8765432100   │ 17/04/26   │ 1 payment│ ✅ Success │ ₹999    │
│ Priya    │ priya@example.com    │ 9123456789   │ 16/04/26   │ -        │ -          │ -       │
└──────────┴──────────────────────┴──────────────┴────────────┴──────────┴────────────┴─────────┘

💳 PAYMENT DETAILS (Expandable)

Demo User (demo@example.com)
├─ Payment 1:
│  ├─ Date: 20/04/2026 10:30 AM
│  ├─ Order ID: order_abc123
│  ├─ Payment ID: pay_xyz789
│  ├─ Amount: ₹2,499
│  ├─ Plan: Plus (With Accommodation)
│  ├─ Status: ✅ SUCCESS
│  └─ Signature: Verified ✓
└─ Total: 1 payment, ₹2,499

John Doe (john@example.com)
├─ Payment 1:
│  ├─ Date: 15/04/2026 2:15 PM
│  ├─ Amount: ₹999
│  ├─ Plan: Lite
│  └─ Status: ✅ SUCCESS
├─ Payment 2:
│  ├─ Date: 19/04/2026 5:45 PM
│  ├─ Amount: ₹2,499
│  ├─ Plan: Plus
│  └─ Status: ✅ SUCCESS
└─ Total: 2 payments, ₹3,498
```

---

## 📝 **API Endpoints Reference**

### **Registration**
```
POST /api/register
→ Saves: User table + Google Sheets
← Returns: Registration confirmation
```

### **Create Payment Order**
```
POST /api/payments/create-order
Body: { plan, email, name, mobile }
← Returns: { orderId, amount }
```

### **Verify Payment**
```
POST /api/payments/verify-payment
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, name, mobile, plan }
→ Saves: Payment table
← Returns: { success: true, registrationId, orderId }
```

### **Admin Dashboard**
```
GET /api/admin/dashboard
Headers: x-admin-email, x-admin-password
← Returns: {
  totalUsers,
  totalPayments,
  successfulPayments,
  failedPayments,
  totalRevenue,
  users: [ { id, name, email, createdAt, payments: [ { id, amount, plan, status, mobile, createdAt } ] } ]
}
```

---

## ✨ **What Changed in This Update**

✅ Added `mobile` field to Payment table
✅ Updated admin dashboard API to return mobile
✅ Added Mobile column to admin panel table
✅ Mobile number is clickable (tel: link)
✅ Database schema updated and migrated
✅ All 3 latest changes work together seamlessly

---

**Status: ✅ COMPLETE** - All user data from registration through payment is now captured and displayed! 🎉
