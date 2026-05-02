'use client'

import { RegistrationForm } from '@/components/forms/RegistrationForm'

export default function RegisterPage() {
  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: 'url("https://assets.codepen.io/344846/photo-1697899001862-59699946ea29.jpeg")' }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Toast Container (will be placed here for toast notifications) */}
      <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm" />

      {/* Content */}
      <div className="relative z-10">
        <RegistrationForm />
      </div>
    </div>
  )
}
