'use client'

import { motion } from 'framer-motion'

export default function ShippingPolicy() {
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
          <h1 className='heading-1 mb-4'>Shipping Policy</h1>
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
            <h2 className='heading-2 mb-4'>1. Overview</h2>
            <p className='text-black/80 leading-relaxed'>
              AI Udaan Bootcamp is an online learning platform. Our courses and bootcamp materials are delivered digitally 
              through our website and application. This policy outlines how we deliver our services to ensure a smooth learning experience.
            </p>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>2. Digital Delivery</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              All bootcamp materials, courses, and resources are delivered electronically through:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Online dashboard access after registration and payment</li>
              <li>Email delivery of course materials and updates</li>
              <li>Live session links via video conferencing platforms</li>
              <li>Resource downloads from our learning management system</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>3. Access Timeline</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              After successful payment verification, you will receive:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li><strong>Immediate (Within 5 minutes):</strong> Confirmation email with login credentials</li>
              <li><strong>Within 1 hour:</strong> Full access to dashboard and course materials</li>
              <li><strong>Within 24 hours:</strong> Additional resources and welcome package</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>4. Physical Materials</h2>
            <p className='text-black/80 leading-relaxed'>
              If you have opted for packages that include physical materials (certificates, course kits, etc.):
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80 mt-4'>
              <li>Certificates are issued digitally after bootcamp completion</li>
              <li>Physical certificates are shipped within 10-15 business days to the address provided</li>
              <li>Shipping is via standard courier services (domestic)</li>
              <li>Tracking information will be provided via email</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>5. System Requirements</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              To access our bootcamp, ensure you have:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Stable internet connection (minimum 5 Mbps recommended)</li>
              <li>Compatible device: Computer, tablet, or smartphone</li>
              <li>Updated web browser (Chrome, Firefox, Safari, or Edge)</li>
              <li>Audio and video capabilities for live sessions</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>6. Access Duration</h2>
            <p className='text-black/80 leading-relaxed'>
              Your course access is valid for the duration specified in your bootcamp package. After the bootcamp ends:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80 mt-4'>
              <li>Lifetime access to recorded sessions and materials (unless otherwise stated)</li>
              <li>Access to community forums and resources</li>
              <li>Certificate remains downloadable from your account</li>
              <li>Limited access to future updated materials</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>7. Technical Issues</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              If you experience technical issues accessing your course materials:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Contact support via: support@aiudaan.com</li>
              <li>Response time: Within 24 hours</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try a different browser or device</li>
              <li>Check your internet connection</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>8. International Access</h2>
            <p className='text-black/80 leading-relaxed'>
              Our digital platform is accessible from most countries worldwide. However, please note that:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80 mt-4'>
              <li>Live sessions are conducted in Indian Standard Time (IST)</li>
              <li>Recorded sessions are available 24/7 for your timezone</li>
              <li>Physical materials shipping is available within India</li>
              <li>International participants may face video conferencing restrictions in certain regions</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>9. Bandwidth & Data Usage</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              Please note:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Video content requires significant bandwidth (~500MB per hour for standard quality)</li>
              <li>4K options available for users with high-speed connections</li>
              <li>Download bandwidth estimation provided before watching</li>
              <li>Mobile users recommended to use WiFi for large file downloads</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>10. Backup & Download</h2>
            <p className='text-black/80 leading-relaxed mb-4'>
              You can:
            </p>
            <ul className='list-disc list-inside space-y-2 text-black/80'>
              <li>Download course materials for offline viewing (where permitted)</li>
              <li>Save videos in your account for later viewing</li>
              <li>Export your notes and progress reports</li>
              <li>Access materials even with limited internet connectivity</li>
            </ul>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>11. Contact Information</h2>
            <p className='text-black/80 leading-relaxed'>
              For questions or concerns about our shipping policy or service delivery:
            </p>
            <div className='mt-4 space-y-2 text-black/80'>
              <p><strong>Email:</strong> support@aiudaan.com</p>
              <p><strong>WhatsApp:</strong> +91 8985025794</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
              <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </section>

          <section>
            <h2 className='heading-2 mb-4'>12. Policy Changes</h2>
            <p className='text-black/80 leading-relaxed'>
              We reserve the right to update this policy at any time. Changes will be communicated via email to all enrolled students.
              Continued use of our platform indicates acceptance of updated policies.
            </p>
          </section>

          <section className='bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded mt-8'>
            <p className='text-yellow-900'>
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
