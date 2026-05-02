'use client'

import { motion } from 'framer-motion'

export default function TermsAndConditions() {
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
          <h1 className='heading-1 mb-4'>Terms and Conditions</h1>
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
            <h2 className='heading-2 mb-4'>1. Acceptance of Terms</h2>
            <p className='text-black/80 leading-relaxed'>
              By accessing and using the AI Udaan Bootcamp website and services, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service. AI Udaan Bootcamp reserves the right to change these terms without notice.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>2. Use License</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              Permission is granted to temporarily download one copy of the materials (information or software) on AI Udaan Bootcamp's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Violate any applicable laws or regulations related to access to or use of the website</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>3. Bootcamp Registration & Payment</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              When you register for our bootcamp:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>You provide accurate, complete, and current information</li>
              <li>You authorize AI Udaan Bootcamp to charge your payment method for the bootcamp fee</li>
              <li>Payments are processed securely through Razorpay Payment Gateway</li>
              <li>You understand the bootcamp schedule and requirements</li>
              <li>You have read and agreed to the Cancellation & Refund Policy</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>4. Course Content & Intellectual Property</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              All course materials, videos, documents, and content provided are the intellectual property of AI Udaan Bootcamp or its content providers. You agree to:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Use the content for your personal learning only</li>
              <li>Not reproduce, distribute, or sell the content</li>
              <li>Not share access to your account or course materials with others</li>
              <li>Not record or redistribute video content</li>
              <li>Give credit to AI Udaan Bootcamp when using concepts in your work</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>5. Account Responsibility</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              You are responsible for maintaining the confidentiality of your account login credentials and password. 
              You agree to accept responsibility for all activities that occur under your account. 
              You must notify AI Udaan Bootcamp immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>6. Cancellation & Refund Policy</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              Refunds are governed by our Cancellation & Refund Policy:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li><strong>Within 7 days:</strong> Full refund available</li>
              <li><strong>After 7 days:</strong> No refund available (bootcamp has commenced or passed)</li>
              <li>Refunds are processed within 7-10 business days</li>
              <li>Cancellations must be submitted in writing to support@aiudaan.com</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>7. Limitations of Liability</h2>
            <p className='text-black/80 leading-relaxed'>
              The materials on AI Udaan Bootcamp's website are provided on an 'as is' basis. AI Udaan Bootcamp makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties 
              or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>8. Accuracy of Materials</h2>
            <p className='text-black/80 leading-relaxed'>
              While AI Udaan Bootcamp strives to provide accurate and up-to-date course content, the materials on its website are provided 
              "as-is" without any representations or warranties of accuracy. AI Udaan Bootcamp does not warrant that the materials on the website are complete, 
              current, or accurate, and will not be responsible for any errors or omissions in these materials.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>9. Links</h2>
            <p className='text-black/80 leading-relaxed'>
              AI Udaan Bootcamp has not reviewed all of the sites linked to its website and is not responsible for the contents 
              of any such linked site. The inclusion of any link does not imply endorsement by AI Udaan Bootcamp of the site. 
              Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>10. Modifications</h2>
            <p className='text-black/80 leading-relaxed'>
              AI Udaan Bootcamp may revise these terms of service for the website at any time without notice. By using this website, 
              you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>11. Governing Law</h2>
            <p className='text-black/80 leading-relaxed'>
              These terms and conditions are governed by and construed in accordance with the laws of India, 
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>12. Contact Information</h2>
            <p className='text-black/80 leading-relaxed'>
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className='mt-4 space-y-2 text-black/80'>
              <p><strong>Email:</strong> support@aiudaan.com</p>
              <p><strong>WhatsApp:</strong> +91 8985025794</p>
              <p><strong>Address:</strong> Buddha Institute of Technology, Gaya, Bihar, India</p>
            </div>
          </section>

          <section className='bg-blue-50 border-l-4 border-blue-400 p-6 rounded mt-8'>
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