'use client'

import { motion } from 'framer-motion'

export default function CancellationPolicy() {
  return (
    <div className='min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-12'
        >
          <h1 className='heading-1 mb-4'>Cancellation & Refund Policy</h1>
          <p className='text-black/60'>Last updated: April 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='glass-container p-8 space-y-8'
        >
          <section>
            <h2 className='heading-2 mb-4'>1. Refund Eligibility</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              We offer refunds for bootcamp registrations under the following conditions:
            </p>
            <div className='bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4'>
              <p className='text-green-900'>
                <strong>✓ Eligible for Full Refund:</strong> Cancellations made within 7 days of registration
              </p>
            </div>
            <div className='bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-4'>
              <p className='text-orange-900'>
                <strong>✗ Not Eligible for Refund:</strong> Cancellations made after 7 days from registration date
              </p>
            </div>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>2. Refund Timeline</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              The 7-day refund window is calculated from:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>The date of successful payment (when payment is verified)</li>
              <li>NOT from the bootcamp start date</li>
              <li>NOT from the registration form submission date</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>3. Processing Refunds</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              <strong>Refund Process:</strong>
            </p>
            <ol className='list-decimal list-inside space-y-2 text-black/80'>
              <li>Submit refund request in writing to support@aiudaan.com</li>
              <li>Include your name, email, registration ID, and order ID</li>
              <li>We will verify your eligibility within 24 hours</li>
              <li>Approved refunds are processed to the original payment method</li>
              <li>Refund reaches your account within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>4. Refund Processing Time</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              After submitting your refund request:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li><strong>24 hours:</strong> We will verify your cancellation request</li>
              <li><strong>2-3 business days:</strong> Refund is initiated to your bank</li>
              <li><strong>5-10 business days:</strong> Amount appears in your account (varies by bank)</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>5. Cancellation Methods</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              <strong>How to request cancellation:</strong>
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li><strong>Email:</strong> support@aiudaan.com</li>
              <li><strong>WhatsApp:</strong> +91 8985025794</li>
              <li><strong>Phone:</strong> Contact during office hours (9 AM - 6 PM IST)</li>
            </ul>
            <p className='text-black/80 leading-relaxed mt-4'>
              Please provide: Full Name, Email, Registration ID, Payment ID, and Reason for Cancellation
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>6. Payment Gateway & Refund</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              All payments are processed through Razorpay, a secure payment gateway. For refunds:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Refunds are issued to the original payment method</li>
              <li>Credit card refunds appear as credits on your card</li>
              <li>Bank transfers are returned to the same account</li>
              <li>UPI/Wallet payments are refunded to the same UPI ID</li>
              <li>We cannot issue refunds in a different payment method</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>7. Non-Refundable Items</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              Please note: The following are NOT refundable:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Bootcamp registration fees (after 7-day window)</li>
              <li>Fees for missed sessions or incomplete participation</li>
              <li>Premium add-on modules or materials (unless unopened)</li>
              <li>Certificates or credentials already issued</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>8. Special Circumstances</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              <strong>Exceptions to refund policy:</strong>
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>If the bootcamp is cancelled by AI Udaan Bootcamp: Full refund</li>
              <li>If the bootcamp date is postponed with short notice: Full refund or transfer to new batch</li>
              <li>Technical issues preventing bootcamp access: Case-by-case evaluation</li>
              <li>Medical emergencies with valid documentation: Special consideration</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>9. Double Payment Issues</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              If you accidentally made two payments:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Contact us immediately: support@aiudaan.com</li>
              <li>We will verify the duplicate payment</li>
              <li>The duplicate amount will be refunded within 2-3 business days</li>
              <li>No refund window restriction applies to duplicate payments</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>10. International Refunds</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              For international students:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Refunds follow the same 7-day policy</li>
              <li>Processing time may vary (10-15 business days) due to international bank transfers</li>
              <li>International transaction fees may apply (outside our control)</li>
              <li>Currency conversion charges may be deducted</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>11. No Questions Asked Policy</h2>
            <p className='text-black/80 leading-relaxed'>
              If you are within the 7-day refund window, we offer a <strong>no questions asked refund policy</strong>. 
              You don't need to provide a reason for your cancellation. Simply submit your request with your registration details, 
              and we will process the refund immediately.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>12. Contact & Support</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              Have questions about our refund policy? Contact us:
            </p>
            <div className='space-y-2 text-black/80'>
              <p><strong>Email:</strong> support@aiudaan.com</p>
              <p><strong>WhatsApp:</strong> +91 8985025794</p>
              <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </section>

          <section className='bg-red-50 border-l-4 border-red-400 p-6 rounded mt-8'>
            <p className='text-red-900'>
              <strong>Important:</strong> The 7-day refund window starts from the date your payment is successfully processed and verified, 
              not from the registration form submission or bootcamp start date.
            </p>
          </section>

          <section className='bg-blue-50 border-l-4 border-blue-400 p-6 rounded mt-4'>
            <p className='text-blue-900'>
              <strong>Last Updated:</strong> April 19, 2026<br/>
              <strong>Effective Date:</strong> Immediately<br/>
              <strong>Version:</strong> 1.0
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}