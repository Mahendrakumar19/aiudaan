/**
 * Razorpay Utility Functions
 * Signature verification and order creation helpers
 */

import crypto from 'crypto'

export const PAYMENT_PLANS = {
  basic: {
    id: 'basic',
    name: 'Udaan Lite (Without Accommodation)',
    price: 999,
    currency: 'INR',
    description: '2-Day Offline Bootcamp Without Accommodation',
    bootcampType: 'offline',
    features: [
      '2-Day Intensive Offline Bootcamp',
      'Complete course materials',
      'Live sessions',
      'Certificate of completion',
      'One year community support',
      'Perfect for offline & online learners',
    ],
  },
  standard: {
    id: 'standard',
    name: 'Udaan Plus (With Accommodation)',
    price: 2499,
    currency: 'INR',
    description: '2-Day Offline Bootcamp With Accommodation',
    bootcampType: 'offline',
    features: [
      '2-Day Intensive Offline Bootcamp',
      'Complete course materials',
      'Live sessions',
      'Certificate of completion',
      'One year community support',
      '1 Night Accommodation',
      'Both day meals & refreshments',
      'In-person mentorship sessions',
      'The complete bootcamp experience',
    ],
  },
  online: {
    id: 'online',
    name: 'Online Bootcamp',
    price: 499,
    currency: 'INR',
    description: '2-Day Online Bootcamp (Self-Paced)',
    bootcampType: 'online',
    features: [
      '2-Day Online Bootcamp',
      'Complete course materials',
      'Live sessions',
      'Certificate of completion',
      'One year community support',
      'Flexible Schedule',
      'Learn at Your Own Pace',
      'Access from anywhere',
    ],
  },
}

/**
 * Verify Razorpay Payment Signature
 * This is critical for security - must be done on backend
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): boolean {
  const shasum = crypto.createHmac('sha256', keySecret)
  shasum.update(`${orderId}|${paymentId}`)
  const digest = shasum.digest('hex')
  return digest === signature
}

/**
 * Generate unique receipt ID for order
 */
export function generateReceiptId(): string {
  return `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format amount for Razorpay (in paise, not rupees)
 */
export function formatAmountForRazorpay(amount: number): number {
  return amount * 100 // Convert rupees to paise
}

/**
 * Generate registration ID
 */
export function generateRegistrationId(): string {
  return `REG_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

/**
 * Mock Database - In production, use a real database
 * This stores registrations in memory (lost on server restart)
 */
let registrations: Map<string, any> = new Map()

export function storeRegistration(data: any): string {
  const registrationId = generateRegistrationId()
  registrations.set(registrationId, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return registrationId
}

export function getRegistration(registrationId: string): any {
  return registrations.get(registrationId)
}

export function updateRegistration(registrationId: string, data: any): void {
  const existing = registrations.get(registrationId)
  if (existing) {
    registrations.set(registrationId, {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    })
  }
}

export function getAllRegistrations(): any[] {
  return Array.from(registrations.values())
}
