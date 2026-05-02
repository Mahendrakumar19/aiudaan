/**
 * Payment Database Helper
 * Functions to save and retrieve payment records
 */

import { prisma } from './prisma'

export interface SavePaymentInput {
  email: string
  name: string
  mobile?: string
  amount: number
  plan: 'basic' | 'standard' | 'online'
  bootcampType?: string
  status: 'success' | 'failed' | 'pending'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  errorMessage?: string
}

export async function savePaymentRecord(input: SavePaymentInput) {
  try {
    // Try to find existing user or create new one
    let user = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: '', // Not required for payment records
          role: 'student',
        },
      })
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        email: input.email,
        name: input.name,
        mobile: input.mobile,
        amount: input.amount,
        plan: input.plan,
        bootcampType: input.bootcampType,
        status: input.status,
        razorpayOrderId: input.razorpayOrderId,
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
        errorMessage: input.errorMessage,
        currency: 'INR',
      },
    })

    return payment
  } catch (error) {
    console.error('Error saving payment record:', error)
    throw error
  }
}

export async function getPaymentByOrderId(orderId: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    return payment
  } catch (error) {
    console.error('Error fetching payment:', error)
    throw error
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: 'success' | 'failed' | 'pending',
  razorpayPaymentId?: string
) {
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        razorpayPaymentId: razorpayPaymentId || undefined,
      },
    })
    return payment
  } catch (error) {
    console.error('Error updating payment status:', error)
    throw error
  }
}
