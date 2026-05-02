# 🔄 DATA FLOW DETAILS - Exact Queries & Integration Points

## 📋 **Overview**

This document shows exactly how user registration data flows to the admin panel and how payment status is tracked.

---

## 🔗 **Complete Integration Points**

```
Step 1: USER REGISTERS
         │
         ▼ (POST /api/auth/register)
   Save to User Table
   • id: "user_123"
   • name: "John Doe"
   • email: "john@example.com"
   • password: "hashed_password"
   • createdAt: "2026-04-20T10:00:00Z"
         │
         ├─────────────┬─────────────┐
         │             │             │
         ▼             ▼             ▼
    Step 2:       Step 3:        Step 4:
    User Enrolls  User Pays    Payment Verified
         │             │             │
         ▼             ▼             ▼
   Bootcamp Form Razorpay      Save Payment
   (Optional)    Create Order   to Payment Table
                                │
                                ├─ id: "pay_456"
                                ├─ userId: "user_123"
                                ├─ email: "john@example.com"
                                ├─ amount: 2499
                                ├─ plan: "standard"
                                ├─ status: "success"
                                └─ createdAt: "2026-04-20T10:30:00Z"
                                │
                                ▼
                       Step 5: ADMIN VIEWS
                       ├─ Logs in
                       ├─ Calls /api/admin/dashboard
                       ├─ Fetches User + Payments
                       └─ Shows complete data
```

---

## 🗄️ **Database Schema**

### **User Table**
```
Table: user
├─ id: String (Primary Key)
├─ name: String
├─ email: String (Unique Index)
├─ password: String (Hashed)
├─ createdAt: DateTime
├─ updatedAt: DateTime
└─ Relation: payments → Payment[]
```

Example Data:
```
id              | name       | email               | createdAt
────────────────┼────────────┼─────────────────────┼──────────────
user_1          | John Doe   | john@example.com    | 2026-04-20
user_2          | Jane Smith | jane@example.com    | 2026-04-21
user_3          | Bob Wilson | bob@example.com     | 2026-04-22
```

### **Payment Table**
```
Table: payment
├─ id: String (Primary Key)
├─ userId: String (Foreign Key → User.id)
├─ email: String
├─ name: String
├─ amount: Float
├─ plan: String ("basic" | "standard")
├─ status: String ("success" | "failed" | "pending")
├─ razorpayOrderId: String
├─ razorpayPaymentId: String
├─ razorpaySignature: String
├─ errorMessage: String
├─ createdAt: DateTime
├─ updatedAt: DateTime
└─ Relation: user → User
```

Example Data:
```
id      | userId  | email              | amount | plan     | status
────────┼─────────┼────────────────────┼────────┼──────────┼────────
pay_1   | user_1  | john@example.com   | 2499   | standard | success
pay_2   | user_2  | jane@example.com   | 999    | basic    | success
pay_3   | user_3  | bob@example.com    | 2499   | standard | failed
```

---

## 🔍 **Exact API Queries**

### **1. User Registration**
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Database Operation:**
```javascript
// Prisma Query
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_password_here",
  },
})

// SQL Equivalent
INSERT INTO user (id, name, email, password, createdAt, updatedAt)
VALUES (
  'cuid_123456',
  'John Doe',
  'john@example.com',
  'hashed_password',
  NOW(),
  NOW()
)
```

**Response:**
```json
{
  "user": {
    "id": "cuid_123456",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  },
  "token": "jwt_token_here"
}
```

---

### **2. Create Payment Order**
**Endpoint:** `POST /api/payments/create-order`

**Request:**
```json
{
  "email": "john@example.com",
  "plan": "standard"
}
```

**Razorpay API Call:**
```javascript
const razorpay = new Razorpay({
  key_id: "rzp_live_Sf2YaOIoVMjH9B",
  key_secret: "G9D4mfP1ncIvtT1F2KJXXoHq"
})

const order = await razorpay.orders.create({
  amount: 249900,        // ₹2499 in paise
  currency: "INR",
  receipt: "receipt_123"
})

// Response includes: order_id, amount, currency, status, created_at
```

---

### **3. Verify Payment**
**Endpoint:** `POST /api/payments/verify-payment`

**Request:**
```json
{
  "razorpay_payment_id": "pay_29QQoUBi66xm2f",
  "razorpay_order_id": "order_9A33XWu170gUtm",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Signature Verification:**
```javascript
// HMAC-SHA256 verification
const crypto = require('crypto')

const body = `${razorpay_order_id}|${razorpay_payment_id}`
const signature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex')

// Compare signatures
if (signature === razorpay_signature) {
  // ✅ Payment verified - save to database
} else {
  // ❌ Invalid signature - reject
}
```

**Save to Database:**
```javascript
// Prisma Query
const payment = await prisma.payment.create({
  data: {
    userId: "cuid_123456",
    email: "john@example.com",
    name: "John Doe",
    amount: 2499,
    plan: "standard",
    status: "success",
    razorpayOrderId: "order_9A33XWu170gUtm",
    razorpayPaymentId: "pay_29QQoUBi66xm2f",
    razorpaySignature: "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
  },
})

// SQL Equivalent
INSERT INTO payment (
  id, userId, email, name, amount, plan, status,
  razorpayOrderId, razorpayPaymentId, razorpaySignature,
  createdAt, updatedAt
) VALUES (
  'cuid_789',
  'cuid_123456',
  'john@example.com',
  'John Doe',
  2499,
  'standard',
  'success',
  'order_9A33XWu170gUtm',
  'pay_29QQoUBi66xm2f',
  '9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d',
  NOW(),
  NOW()
)
```

---

### **4. Admin Login**
**Endpoint:** `POST /api/admin/login`

**Request:**
```json
{
  "email": "admin@aiudaanbootcamp.com",
  "password": "Admin@aiudaan123"
}
```

**Validation:**
```javascript
// Check credentials
if (email === "admin@aiudaanbootcamp.com" && 
    password === "Admin@aiudaan123") {
  
  // Generate token
  const token = Buffer.from(
    `admin@aiudaanbootcamp.com:${Date.now()}`
  ).toString('base64')
  
  // Example token output:
  // YWRtaW5AYWl1ZGFhbmJvb3RjYW1wLmNvbToxNzEzNjU4NTQwNzA1
}
```

**Response:**
```json
{
  "success": true,
  "token": "YWRtaW5AYWl1ZGFhbmJvb3RjYW1wLmNvbToxNzEzNjU4NTQwNzA1",
  "message": "Login successful"
}
```

---

### **5. Fetch Dashboard Data**
**Endpoint:** `GET /api/admin/dashboard`

**Headers:**
```
Authorization: Bearer YWRtaW5AYWl1ZGFhbmJvb3RjYW1wLmNvbToxNzEzNjU4NTQwNzA1
```

**Main Query - Fetch All Users with Payments:**
```javascript
// Prisma Query
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    payments: {
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        plan: true,
        status: true,
        createdAt: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
})

// SQL Equivalent
SELECT
  u.id, u.name, u.email, u.createdAt,
  p.id, p.amount, p.plan, p.status, p.createdAt
FROM user u
LEFT JOIN payment p ON u.id = p.userId
ORDER BY u.createdAt DESC, p.createdAt DESC
```

**Statistics Query - Calculate Totals:**
```javascript
// Prisma Query
const allPayments = await prisma.payment.findMany({
  select: {
    status: true,
    amount: true,
  },
})

const totalPayments = allPayments.length
const successfulPayments = allPayments
  .filter(p => p.status === 'success').length
const failedPayments = allPayments
  .filter(p => p.status === 'failed').length
const totalRevenue = allPayments
  .filter(p => p.status === 'success')
  .reduce((sum, p) => sum + p.amount, 0)

// SQL Equivalent
SELECT
  COUNT(*) as totalPayments,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successfulPayments,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failedPayments,
  SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as totalRevenue
FROM payment
```

**Response:**
```json
{
  "totalUsers": 25,
  "totalPayments": 30,
  "successfulPayments": 28,
  "failedPayments": 2,
  "totalRevenue": 65497,
  "users": [
    {
      "id": "cuid_123456",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-04-20T10:00:00Z",
      "payments": [
        {
          "id": "pay_1",
          "amount": 2499,
          "plan": "standard",
          "status": "success",
          "createdAt": "2026-04-20T10:30:00Z"
        }
      ]
    },
    {
      "id": "cuid_234567",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2026-04-21T09:00:00Z",
      "payments": [
        {
          "id": "pay_2",
          "amount": 999,
          "plan": "basic",
          "status": "success",
          "createdAt": "2026-04-21T10:00:00Z"
        },
        {
          "id": "pay_3",
          "amount": 2499,
          "plan": "standard",
          "status": "success",
          "createdAt": "2026-04-22T11:00:00Z"
        }
      ]
    }
  ]
}
```

---

## 🔗 **How Data Gets to Admin Panel**

### **Flow 1: User Registration Flow**
```
User Registration Form
       ↓
POST /api/auth/register
       ↓
Create in User table
       ↓
Email stored in database
       ↓
Admin fetches User table
       ↓
User appears in dashboard
```

### **Flow 2: Payment Flow**
```
User initiates payment
       ↓
POST /api/payments/create-order
       ↓
Razorpay order created
       ↓
User completes payment
       ↓
POST /api/payments/verify-payment
       ↓
Signature verified
       ↓
Payment saved to database
       ↓
userId linked to User
       ↓
Admin fetches payments
       ↓
Payments appear in dashboard
```

### **Flow 3: Admin Views Data**
```
Admin logs in
       ↓
POST /api/admin/login
       ↓
Bearer token generated
       ↓
GET /api/admin/dashboard
       ↓
Query User table (all users)
       ↓
Query Payment table (all payments)
       ↓
Link payments to users via userId
       ↓
Calculate statistics
       ↓
Return complete data
       ↓
Admin dashboard displays
```

---

## 📊 **Example: Complete User Journey**

### **Day 1: User Registers**
```javascript
// POST /api/auth/register
Request: { name: "John", email: "john@example.com", password: "pass" }

// Database Insert
INSERT INTO user (...) VALUES (...)
Result: User ID = "user_123" created

// Database State:
User Table:
  id        | name | email               | createdAt
  ──────────┼──────┼─────────────────────┼──────────
  user_123  | John | john@example.com    | Apr 20
```

### **Day 2: User Makes Payment**
```javascript
// POST /api/payments/create-order
Request: { email: "john@example.com", plan: "standard" }
Razorpay creates order: order_ABC123

// User completes payment with Razorpay
Payment ID: pay_XYZ789

// POST /api/payments/verify-payment
Signature verified ✅

// Database Insert
INSERT INTO payment (
  userId: "user_123",
  email: "john@example.com",
  amount: 2499,
  plan: "standard",
  status: "success",
  ...
) VALUES (...)

// Database State:
User Table:
  id        | name | email
  ──────────┼──────┼──────────────────
  user_123  | John | john@example.com

Payment Table:
  id      | userId   | amount | status
  ────────┼──────────┼────────┼────────
  pay_456 | user_123 | 2499   | success
```

### **Day 3: Admin Views Dashboard**
```javascript
// GET /api/admin/dashboard with Bearer token
Query 1: SELECT * FROM user ORDER BY createdAt DESC
Result: Returns all users including John

Query 2: SELECT * FROM payment JOIN user ...
Result: Returns all payments linked to users

Response:
{
  users: [{
    id: "user_123",
    name: "John",
    email: "john@example.com",
    payments: [{
      id: "pay_456",
      amount: 2499,
      plan: "standard",
      status: "success"
    }]
  }]
}

// Admin Dashboard Shows:
User Name: John
User Email: john@example.com
Payment Count: 1
Payment Status: ✅ Success
Amount: ₹2,499
```

---

## ✅ **Verification Queries**

### **Check All Users**
```javascript
const allUsers = await prisma.user.findMany()
// Shows: How many users registered
```

### **Check All Payments**
```javascript
const allPayments = await prisma.payment.findMany({
  include: { user: true }
})
// Shows: Each payment with linked user
```

### **Check User's Payments**
```javascript
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
  include: { payments: true }
})
// Shows: All payments for John
```

### **Check Payment Status Distribution**
```javascript
const stats = await prisma.payment.groupBy({
  by: ['status'],
  _count: true,
  _sum: { amount: true }
})
// Shows: Success count, Failed count, Total revenue
```

---

## 🎯 **Key Integration Points Summary**

| Point | Data Flow | Database | API |
|-------|-----------|----------|-----|
| 1 | User Registration | User table | `/api/auth/register` |
| 2 | Payment Creation | None (Razorpay) | `/api/payments/create-order` |
| 3 | Payment Verification | Payment table | `/api/payments/verify-payment` |
| 4 | Admin Login | None (validation only) | `/api/admin/login` |
| 5 | Dashboard Data | User + Payment tables | `/api/admin/dashboard` |

---

## 🚀 **Production Deployment Notes**

- Use PostgreSQL instead of SQLite for production
- Add database backups for payment records
- Implement transaction logging
- Add audit trail for admin access
- Monitor payment verification success rate
- Set up alerts for failed payments
- Regular reconciliation with Razorpay
- Encrypt sensitive fields (razorpay_signature, etc.)

---

**Status: ✅ COMPLETE INTEGRATION VERIFIED**

All data flows connected and operational!
