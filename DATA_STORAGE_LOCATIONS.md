# 📊 DATA STORAGE LOCATIONS - Complete Map

## 🎯 Overview

Here's exactly where user registration and payment data is saved:

---

## 📍 **User Registration Data**

### **Flow**
```
Registration Form (Frontend)
         ↓
POST /api/register (Bootcamp Registration)
├─ Saves to: Google Sheets ✅
├─ Fields: name, mobile, email, class, domain, source
└─ Purpose: Tracking & backup

         ↓

User Email Verification (OTP)
         ↓
POST /api/auth/send-otp → Send OTP to email
         ↓
POST /api/auth/verify-otp → Verify OTP
         ↓

User Creates Account
         ↓
POST /api/auth/register
├─ Saves to: **User Table (Prisma Database)** ✅
├─ Fields: id, name, email, password (hashed), createdAt
└─ User ID generated: "cuid_xxxxx"
```

---

## 💳 **Payment Order Data**

### **Flow**
```
User Initiates Payment
         ↓
POST /api/payments/create-order
├─ Creates: Razorpay Order
├─ Saves to: **Razorpay (External Service)** ✅
├─ Fields: orderId, amount, currency, notes (name, email, phone, plan)
├─ Order ID: "order_xxxxx"
├─ Response: Returns orderId to frontend
└─ Local Storage: Saves orderId temporarily

         ↓

User Completes Payment
         ↓
Razorpay Payment Gateway
├─ User enters payment details
├─ Payment processed by Razorpay
├─ Returns: paymentId, signature
└─ Razorpay Records: All transaction details

         ↓

Payment Verification (After Success)
         ↓
POST /api/payments/verify-payment
├─ Validates: Signature (HMAC-SHA256)
├─ Creates/Links: User if doesn't exist
├─ Saves to: **Payment Table (Prisma Database)** ✅
├─ Fields:
│  ├─ id (cuid)
│  ├─ userId (links to User table)
│  ├─ email
│  ├─ name
│  ├─ amount
│  ├─ plan (basic/standard)
│  ├─ status (success/failed/pending)
│  ├─ razorpayOrderId
│  ├─ razorpayPaymentId
│  ├─ razorpaySignature
│  └─ createdAt
└─ Payment ID: "pay_xxxxx"
```

---

## 🗄️ **Database Storage Locations**

### **User Table** (SQLite: `dev.db`)
```
TABLE: user

Columns:
├─ id: String (Primary Key, CUID)
├─ name: String
├─ email: String (Unique)
├─ password: String (Hashed with bcrypt)
├─ createdAt: DateTime
├─ updatedAt: DateTime
└─ Relation: payments → Payment[]

Example Row:
id           | name        | email               | password              | createdAt
─────────────┼─────────────┼─────────────────────┼──────────────────────┼──────────────
cuid_123456  | Demo User   | demo@example.com    | $2b$10$hashed...     | 2026-04-20

Location: d:\aiudaanbootcamp\dev.db
```

### **Payment Table** (SQLite: `dev.db`)
```
TABLE: payment

Columns:
├─ id: String (Primary Key, CUID)
├─ userId: String (Foreign Key → user.id)
├─ email: String
├─ name: String
├─ amount: Float
├─ plan: String ("basic" | "standard")
├─ status: String ("success" | "failed" | "pending")
├─ currency: String (default: "INR")
├─ razorpayOrderId: String
├─ razorpayPaymentId: String
├─ razorpaySignature: String
├─ errorMessage: String
├─ createdAt: DateTime
├─ updatedAt: DateTime
└─ Relation: user → User

Example Row:
id        | userId      | email           | amount | plan     | status
──────────┼─────────────┼─────────────────┼────────┼──────────┼────────
pay_789   | cuid_123456 | demo@example.com | 2499   | standard | success

Location: d:\aiudaanbootcamp\dev.db
```

---

## 📋 **External Storage Locations**

### **Google Sheets** (Registration Data Backup)
```
URL: https://script.google.com/macros/s/AKfycbxY.../exec

Data Saved:
├─ Name
├─ Mobile
├─ Email
├─ Class
├─ AI Domain
├─ Source (how they heard about us)
├─ Interest
├─ Date
└─ Type: "registration"

Purpose: Business tracking, backup, analytics
Access: Through Google Sheets UI
```

### **Razorpay API** (Payment Data)
```
Service: https://api.razorpay.com/v1/

Order Data Saved:
├─ Order ID: order_xxxxx
├─ Amount (in paise)
├─ Currency
├─ Status
├─ User Notes: name, email, phone, plan
├─ Created Timestamp
└─ Payment Details (after completion)

Payment Data Saved:
├─ Payment ID: pay_xxxxx
├─ Signature
├─ Order ID
├─ Status
├─ Date/Time
└─ Transaction Details

Access: Razorpay Dashboard, API calls
Credentials: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET (in .env.local)
```

---

## 🔄 **Complete Data Journey**

```
┌─────────────────────────────────────┐
│ 1. REGISTRATION FORM               │
│    Name, Email, Phone, etc.        │
└─────────────┬───────────────────────┘
              │
              ├────────────────────────┐
              │                        │
              ▼                        ▼
        Google Sheets       POST /api/register
        (Backup)            (Bootcamp enrollment)
        
        ┌──────────────────────────────────┐
        │ 2. USER CREATES ACCOUNT          │
        │    Email Verification (OTP)      │
        │    POST /api/auth/register       │
        └────────────────┬─────────────────┘
                         │
                         ▼
              ┌────────────────────────┐
              │ User Table (Database)  │
              │ ✅ User Saved         │
              └────────────────────────┘
        
        ┌──────────────────────────────────┐
        │ 3. USER MAKES PAYMENT            │
        │    POST /api/payments/create-order
        └────────────────┬─────────────────┘
                         │
                         ▼
              ┌────────────────────────┐
              │ Razorpay API           │
              │ ✅ Order Created       │
              │ Order ID: order_xxxxx  │
              └────────────────────────┘
        
        ┌──────────────────────────────────┐
        │ 4. USER COMPLETES PAYMENT        │
        │    Razorpay Gateway              │
        │    User enters card details      │
        └────────────────┬─────────────────┘
                         │
                         ▼
              ┌────────────────────────┐
              │ Razorpay Processes     │
              │ ✅ Payment Done        │
              │ Payment ID: pay_xxxxx  │
              │ Signature: xxxxx       │
              └────────────────────────┘
        
        ┌──────────────────────────────────┐
        │ 5. PAYMENT VERIFICATION          │
        │    POST /api/payments/verify     │
        │    Signature Validation          │
        └────────────────┬─────────────────┘
                         │
                         ▼
              ┌────────────────────────┐
              │ Payment Table (DB)     │
              │ ✅ Payment Saved       │
              │ Linked to User via ID  │
              └────────────────────────┘
        
        ┌──────────────────────────────────┐
        │ 6. ADMIN VIEWS DASHBOARD         │
        │    GET /api/admin/dashboard      │
        │    Fetches User + Payment        │
        └────────────────┬─────────────────┘
                         │
                         ▼
              ┌────────────────────────┐
              │ Complete User Data:    │
              │ ✅ Name               │
              │ ✅ Email              │
              │ ✅ Registration Date  │
              │ ✅ Payment Status     │
              │ ✅ Amount             │
              └────────────────────────┘
```

---

## 📊 **Data Storage Summary Table**

| Data Type | Endpoint | Storage Location | Fields | Purpose |
|-----------|----------|------------------|--------|---------|
| **Bootcamp Enrollment** | POST /api/register | Google Sheets | name, mobile, email, class, domain | Tracking & backup |
| **User Account** | POST /api/auth/register | User Table (Prisma DB) | id, name, email, password, createdAt | Authentication |
| **Payment Order** | POST /api/payments/create-order | Razorpay API | orderId, amount, notes | Order creation |
| **Payment Verification** | POST /api/payments/verify-payment | Payment Table (Prisma DB) | id, userId, amount, status, razorpayIds | Transaction record |

---

## 🔗 **Database Relationships**

```
User Table
├─ id: cuid_123456
├─ name: "Demo User"
├─ email: "demo@example.com"
└─ payments: [pay_1, pay_2, pay_3]
           ↓
           │ (Foreign Key: userId)
           │
           ▼
Payment Table
├─ id: pay_1, userId: cuid_123456
│  ├─ amount: 2499
│  ├─ status: "success"
│  └─ razorpayPaymentId: "pay_xxx"
│
├─ id: pay_2, userId: cuid_123456
│  ├─ amount: 999
│  ├─ status: "success"
│  └─ razorpayPaymentId: "pay_yyy"
│
└─ id: pay_3, userId: cuid_123456
   ├─ amount: 2499
   ├─ status: "failed"
   └─ razorpayPaymentId: "pay_zzz"
```

---

## 🔍 **Where to Access Data**

### **View User Data**
```bash
# Open Prisma Studio
npx prisma studio

Navigate to: user table
See: All registered users with accounts
```

### **View Payment Data**
```bash
# In Prisma Studio
Navigate to: payment table
See: All payments with status and amounts
```

### **View Admin Dashboard**
```bash
http://localhost:3000/admin
Email: admin@aiudaanbootcamp.com
Password: Admin@aiudaan123

See: All users + payments combined with statistics
```

### **View Google Sheets**
```bash
GOOGLE_SCRIPT_URL from .env.local
See: Bootcamp enrollment data (backup)
```

### **View Razorpay Dashboard**
```bash
https://dashboard.razorpay.com/
Login with: Razorpay account
See: All orders and payments processed
```

---

## 📈 **Data Flow Timeline**

### **Example: User Registers and Pays**

**Time: 2026-04-20 02:30 PM**

1. **02:30:00** - User fills bootcamp registration form
   - Data sent to Google Sheets
   - Google Sheets updated ✅

2. **02:30:15** - User clicks "Register Now" button
   - Email verification OTP sent

3. **02:30:45** - User verifies email with OTP
   - Email verified ✅

4. **02:31:00** - User account created
   - User table updated with: name, email, password (hashed)
   - User ID generated: `cuid_abc123` ✅

5. **02:31:30** - User initiates payment
   - Razorpay order created
   - Order ID: `order_xyz789` ✅

6. **02:32:15** - User completes payment on Razorpay
   - Razorpay processes payment
   - Payment ID: `pay_lmn456`
   - Signature: `abcd1234...` ✅

7. **02:32:16** - System verifies payment signature
   - Signature validated ✅
   - Payment saved to database
   - Payment table updated with userId, status: "success"
   - Payment ID: `pay_lmn456` ✅

8. **02:32:20** - Admin views dashboard
   - API queries User table → finds `cuid_abc123`
   - API queries Payment table → finds `pay_lmn456`
   - Links payment to user via userId
   - Dashboard shows:
     - User: Demo User (demo@example.com)
     - Payment: ✅ Success - ₹2,499

---

## 📝 **API Endpoints & Data Storage**

### **User Registration Endpoints**

| Endpoint | Method | Data Saved | Storage |
|----------|--------|-----------|---------|
| `/api/register` | POST | Bootcamp enrollment | Google Sheets |
| `/api/auth/send-otp` | POST | OTP (temp) | Memory/Session |
| `/api/auth/verify-otp` | POST | OTP verification | Memory/Session |
| `/api/auth/register` | POST | User account | User Table |

### **Payment Endpoints**

| Endpoint | Method | Data Saved | Storage |
|----------|--------|-----------|---------|
| `/api/payments/create-order` | POST | Razorpay order | Razorpay API |
| `/api/payments/verify-payment` | POST | Payment record | Payment Table |
| `/api/payments/failure` | POST | Failed payment | Payment Table |

### **Admin Endpoints**

| Endpoint | Method | Data Fetched | Source |
|----------|--------|-------------|--------|
| `/api/admin/login` | POST | Credentials validated | Memory |
| `/api/admin/dashboard` | GET | Users + Payments | User + Payment Tables |
| `/api/admin/payments` | GET | Payment stats | Payment Table |

---

## 🎯 **Key Takeaways**

✅ **User data** → Saved in **User Table** (Prisma Database)
✅ **Payment data** → Saved in **Payment Table** (Prisma Database)
✅ **Bootcamp data** → Saved in **Google Sheets** (Backup)
✅ **Order data** → Saved in **Razorpay** (External)
✅ **All linked** → Via userId foreign key in Payment table

---

## 🔐 **Data Security**

✅ Passwords hashed with bcrypt
✅ Payment signatures verified with HMAC-SHA256
✅ Foreign keys maintain data integrity
✅ Indexes on critical fields for performance
✅ SQLite for dev, PostgreSQL ready for production

---

## 📊 **Database Location**

```
Project: d:\aiudaanbootcamp
Database File: dev.db (SQLite)
Location: d:\aiudaanbootcamp\dev.db

To inspect:
1. npx prisma studio
2. View User table
3. View Payment table
4. See relationships
```

---

**Status: ✅ All data properly organized and saved!**

Every user registration and payment is tracked across multiple systems for redundancy and analytics. 🎉
