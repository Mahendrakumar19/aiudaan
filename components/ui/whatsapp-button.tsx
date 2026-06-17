'use client'

import { usePathname } from 'next/navigation'

interface WhatsAppButtonProps {
  phone?: string
  message?: string
}

export default function WhatsAppButton({
  phone = '918985025794',
  message = ''
}: WhatsAppButtonProps) {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }
  const encodedMessage = encodeURIComponent(message)
  const url = `https://wa.me/${phone}${message ? `?text=${encodedMessage}` : ''}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AI Bootcamp Team on WhatsApp"
      className="fixed bottom-6 right-6 z-50"
      title="Chat with AI Bootcamp Team"
    >
      <button
        type="button"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-2xl ring-2 ring-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300/70 p-2"
      >
        <img
          src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/whatsapp-icon.png"
          alt="WhatsApp"
          className="w-full h-full object-contain filter brightness-0 invert"
        />
      </button>
    </a>
  )
}
