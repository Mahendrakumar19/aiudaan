import { EnquiryForm } from '@/components/forms/EnquiryForm'

export const metadata = {
  title: 'Enquire - AI Udaan Bootcamp 2026',
  description: 'Join the AI Udaan Bootcamp and unlock your potential in AI',
}

export default function EnquirePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        {/* Animated particles effect */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full opacity-30" />
          <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400 rounded-full opacity-20" />
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-25" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <EnquiryForm />
      </div>
    </div>
  )
}
