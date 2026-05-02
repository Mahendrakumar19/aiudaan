/**
 * Test script to verify MySQL database connection
 * This will create a test user in the database
 */

import fs from 'fs'
import path from 'path'

// Read and parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const lines = envContent.split('\n')

for (const line of lines) {
  if (line.startsWith('DATABASE_URL=')) {
    const value = line.replace('DATABASE_URL=', '').replace(/"/g, '')
    process.env.DATABASE_URL = value
    console.log(`✓ DATABASE_URL loaded: ${value.substring(0, 50)}...`)
    break
  }
}

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing MySQL database connection...\n')

    // Test 1: Create a test user
    console.log('📝 Test 1: Creating test user...')
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `testuser-${Date.now()}@aiudaanbootcamp.com`,
        password: await bcrypt.hash('TestPassword123', 10),
      },
    })
    console.log('✅ User created successfully!')
    console.log(`   ID: ${testUser.id}`)
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Name: ${testUser.name}\n`)

    // Test 2: Create a test payment record
    console.log('📝 Test 2: Creating test payment...')
    const testPayment = await prisma.payment.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        mobile: '9876543210',
        amount: 999,
        plan: 'basic',
        status: 'success',
        razorpayOrderId: `order_test_${Date.now()}`,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        razorpaySignature: 'test_signature_123',
      },
    })
    console.log('✅ Payment created successfully!')
    console.log(`   Payment ID: ${testPayment.id}`)
    console.log(`   Amount: ₹${testPayment.amount}`)
    console.log(`   Status: ${testPayment.status}`)
    console.log(`   Mobile: ${testPayment.mobile}\n`)

    // Test 3: Fetch all users
    console.log('📝 Test 3: Fetching all users...')
    const allUsers = await prisma.user.findMany({
      include: { payments: true },
    })
    console.log(`✅ Found ${allUsers.length} users in database`)
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.payments.length} payments`)
    })
    console.log()

    // Test 4: Fetch all payments
    console.log('📝 Test 4: Fetching all payments...')
    const allPayments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    console.log(`✅ Found ${allPayments.length} recent payments`)
    allPayments.forEach((payment, index) => {
      console.log(`   ${index + 1}. ${payment.email} - ₹${payment.amount} (${payment.status})`)
    })
    console.log()

    console.log('🎉 All tests passed! MySQL connection is working correctly!\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection test failed!')
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the test
testDatabaseConnection()
