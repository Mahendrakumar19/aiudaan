/**
 * Email Service
 * Handles sending confirmation emails using nodemailer
 */

import nodemailer from 'nodemailer'
import { EmailPayload } from '@/types/payment'

/**
 * Email transporter configuration
 * Uses Gmail SMTP (can be configured for any SMTP)
 * Environment variables:
 * - EMAIL_SERVICE: gmail or custom SMTP
 * - EMAIL_USER: your-email@gmail.com
 * - EMAIL_PASS: app-specific password (NOT regular password)
 * - EMAIL_FROM: sender email
 */
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  // Gmail configuration
  if (
    process.env.EMAIL_SERVICE === 'gmail' &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  ) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  // Generic SMTP configuration
  else if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // Fallback: TestAccount (for development)
    console.warn(
      'No email service configured. Using test account for development.'
    )
  }

  return transporter
}

/**
 * Generate HTML email template
 */
function generateEmailTemplate(payload: EmailPayload): string {
  let planName = 'With Accommodation'
  if (payload.plan === 'basic') {
    planName = 'Without Accommodation'
  } else if (payload.bootcampType) {
    planName = payload.bootcampType
  } else if (payload.plan && payload.plan !== 'premium') {
    planName = payload.plan
  }
  const amount = payload.amount / 100 // Convert from paise
  const orderDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px 20px;
      border: 1px solid #ddd;
      border-top: none;
    }
    .success-message {
      background: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 15px 20px;
      border-radius: 4px;
      margin: 20px 0;
      color: #065f46;
    }
    .order-details {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #06b6d4;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: bold;
      color: #555;
    }
    .detail-value {
      color: #333;
    }
    .footer {
      background: white;
      padding: 30px 20px;
      border: 1px solid #ddd;
      border-top: none;
      text-align: center;
      font-size: 12px;
      color: #888;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: bold;
    }
    h1 {
      margin: 0;
      font-size: 24px;
    }
    h2 {
      color: #06b6d4;
      margin-top: 20px;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Registration Interest Confirmed!</h1>
  </div>

  <div class="content">
    <p>Dear <strong>${payload.name}</strong>,</p>

    <div class="success-message">
      <strong>🎉 Thank you for your interest!</strong><br>
      We have successfully registered your interest for the <strong>AI Udaan Bootcamp 2026</strong>. Our team will get back to you shortly with complete bootcamp details.
    </div>

    <h2>📋 Your Registration Details</h2>
    <div class="order-details">
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span class="detail-value">${payload.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${payload.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">+91 ${payload.phone}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Plan Selected:</span>
        <span class="detail-value">${planName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Amount Paid:</span>
        <span class="detail-value">₹${amount.toFixed(2)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Payment Date:</span>
        <span class="detail-value">${orderDate}</span>
      </div>
    </div>

    <h2>🚀 What Happens Next?</h2>
    <p>Our team will reach out to you within <strong>24-48 hours</strong> with:</p>
    <ul>
      <li>✓ Bootcamp date and timing details</li>
      <li>✓ Venue information and instructions</li>
      <li>✓ Pre-bootcamp preparation materials</li>
      <li>✓ WhatsApp group link for updates</li>
      <li>✓ Any additional requirements based on your plan</li>
    </ul>

    <h2>💡 In the Meantime</h2>
    <p>
      <strong>1.</strong> Keep this confirmation email for your records<br>
      <strong>2.</strong> Check your spam folder for our upcoming emails<br>
      <strong>3.</strong> Ensure your laptop is ready with a stable internet connection<br>
      <strong>4.</strong> Save our contact details for any quick questions
    </p>

    <p>If you have any questions or need to make changes, feel free to reach out to us at <strong>info@aiudaanbootcamp.com</strong> or <strong>+91 7905069943</strong> on WhatsApp.</p>

    <p style="text-align: center;">
      <a href="https://aiudaanbootcamp.com" class="button">Visit Our Website</a>
    </p>

    <p>
      Looking forward to seeing you at the bootcamp!<br>
      <strong>The AI Udaan Team</strong><br>
      Buddha Institute of Technology, Gaya
    </p>
  </div>

  <div class="footer">
    <p>© 2026 AI Udaan Bootcamp. All rights reserved.</p>
    <p>Buddha Institute of Technology, Gaya, Bihar | info@aiudaanbootcamp.com</p>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Send confirmation email
 */
export async function sendConfirmationEmail(
  payload: EmailPayload
): Promise<boolean> {
  try {
    // For development - log instead of sending
    if (!process.env.EMAIL_USER) {
      console.log(
        '📧 [DEV] Email would be sent to:',
        payload.email,
        'Name:',
        payload.name
      )
      return true
    }

    const transporter = getTransporter()
    if (!transporter) {
      console.warn('Email transporter not configured')
      return false
    }

    // Resolve recipient — prefer explicit 'to', fallback to 'email'
    const recipient = (payload.to && payload.to.includes('@')) ? payload.to
      : (payload.email && payload.email.includes('@')) ? payload.email
      : null

    if (!recipient) {
      console.warn('⚠️ Email skipped: no valid recipient address (to/email missing or not a real email)')
      return false
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@aiudaanbootcamp.com',
      to: recipient,
      subject: `Registration Confirmed - AI Udaan Bootcamp (Order: ${payload.orderId})`,
      html: generateEmailTemplate(payload),
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully to:', recipient)
    return true
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return false
  }
}

/**
 * Verify email transporter connection (for setup/debugging)
 */
export async function verifyEmailTransporter(): Promise<boolean> {
  try {
    const transporter = getTransporter()
    if (!transporter) {
      console.error('No email transporter configured')
      return false
    }
    await transporter.verify()
    console.log('✅ Email transporter verified and ready')
    return true
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error)
    return false
  }
}
