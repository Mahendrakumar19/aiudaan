'use client'

import { motion } from 'framer-motion'

export default function Privacy() {
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
          <h1 className='text-4xl md:text-5xl font-black mb-4 text-white'>Privacy Policy</h1>
          <p className='text-slate-400'>Last updated: March 2026</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='p-8 space-y-8 bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl'
        >
          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>1. Introduction</h2>
            <p className='text-slate-300 leading-relaxed'>
              AI Learn NG LMS ("Company", "we", "our", or "us") operates as an online learning platform.
              This Privacy Policy explains how we collect, use, disclose, and otherwise handle personal
              information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>2. Information We Collect</h2>
            <p className='text-slate-300 leading-relaxed mb-4'>We collect information in various ways:</p>
            <ul className='list-disc list-inside space-y-2 text-slate-300'>
              <li>
                <strong className='text-white'>Personal Information:</strong> When you create an account, we collect your name,
                email address, password, and profile information.
              </li>
              <li>
                <strong className='text-white'>Usage Data:</strong> We automatically collect information about how you interact
                with our platform, including courses viewed and progress made.
              </li>
              <li>
                <strong className='text-white'>Device Information:</strong> We collect information about your device, including
                IP address, browser type, and operating system.
              </li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>3. How We Use Your Information</h2>
            <p className='text-slate-300 leading-relaxed mb-4'>We use the information we collect for:</p>
            <ul className='list-disc list-inside space-y-2 text-slate-300'>
              <li>Creating and maintaining your account</li>
              <li>Delivering and improving our services</li>
              <li>Personalizing your learning experience</li>
              <li>Sending you educational content and updates</li>
              <li>Responding to your inquiries</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>4. Data Security</h2>
            <p className='text-slate-300 leading-relaxed'>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>5. Third-Party Sharing</h2>
            <p className='text-slate-300 leading-relaxed'>
              We do not sell, trade, or rent your personal information to third parties. We may share
              information with service providers who assist us in operating our website and conducting
              our business, under strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>6. Cookies</h2>
            <p className='text-slate-300 leading-relaxed'>
              Our website uses cookies to enhance your experience. You can choose to disable cookies
              through your browser settings, though this may limit your ability to use certain features.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>7. Your Rights</h2>
            <p className='text-slate-300 leading-relaxed mb-4'>You have the right to:</p>
            <ul className='list-disc list-inside space-y-2 text-slate-300'>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>8. Changes to This Policy</h2>
            <p className='text-slate-300 leading-relaxed'>
              We reserve the right to modify this Privacy Policy at any time. Changes will be effective
              immediately upon posting to the website. Your continued use of the platform following the
              posting of revised Privacy Policy means you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold mb-4 text-cyan-400'>9. Contact Us</h2>
            <p className='text-slate-300 leading-relaxed'>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              <br />
              <strong className='text-white'>Email:</strong> info@aiudaanbootcamp.com
              <br />
              <strong className='text-white'>Address:</strong> Buddha Institute of Technology, Gaya Ji, Bihar, India
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}