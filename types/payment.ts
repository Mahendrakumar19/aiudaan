/**
 * Payment System Types
 * Type definitions for registration, orders, and payments
 */

export interface RegistrationData {
  name: string
  email: string
  phone: string
  plan: 'basic' | 'standard' // basic = 999, standard = 2499
}

export interface PlanType {
  id: string
  name: string
  price: number
  currency: string
  description: string
  features: string[]
}

export interface RazorpayOrderRequest {
  amount: number
  currency: string
  receipt: string
  notes: {
    name: string
    email: string
    phone: string
    plan: string
  }
}

export interface RazorpayOrderResponse {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  offer_id: null
  status: string
  attempts: number
  notes: Record<string, any>
  created_at: number
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  userData: RegistrationData
}

export interface PaymentVerificationResponse {
  success: boolean
  message: string
  orderId?: string
  paymentId?: string
  registrationId?: string
}

export interface StoredRegistration {
  id: string
  name: string
  email: string
  phone: string
  plan: 'basic' | 'standard'
  amount: number
  razorpayOrderId: string
  razorpayPaymentId?: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  emailSent: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailPayload {
  to: string
  name: string
  email: string
  phone: string
  plan: string
  amount: number
  orderId: string
}
