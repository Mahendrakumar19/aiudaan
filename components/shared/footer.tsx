'use client'

import Link from 'next/link'
import Image from 'next/image';

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-bg py-20 relative overflow-hidden bg-[#0a0f1d] text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm shrink-0 flex items-center justify-center font-bold text-lg text-[#3462ae]">
              <Image src='/images/logo.png' alt="BIT logo" width={65} height={100} />
            </div>
            <Image src='/images/ailogo.jpeg' alt="AI Udaan logo" width={200} height={100} />
          </Link>
          <p className="text-slate-400 max-w-sm mb-8 leading-relaxed text-xs">
            Buddha Institute of Technology (BIT) Gaya is a center of excellence in technical education in Bihar. Established in 2008, approved by AICTE, and located at Gaya-Dobhi Road.
          </p>
          <div className="flex gap-4">
            {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map(s => (
              <span key={s} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer hover:-translate-y-1 shadow-sm text-xs font-semibold">
                {s[0]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-300 uppercase tracking-widest text-[10px]">INITIATIVES</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link href="/#flagshipevents" className="hover:text-white transition-colors">Flagship Challenges</Link></li>
            <li><Link href="/#programs" className="hover:text-white transition-colors">Upskilling Camps</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-300 uppercase tracking-widest text-[10px]">LEGAL</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest relative z-10">
        <p>© {currentYear} AI Udaan Bootcamp. All rights reserved.</p>
        <p>Powered by Buddha Institute of Technology</p>
        <p> <a href='https://nighwantech.com'>Nighwan Technology Pvt. Ltd. </a></p>
      </div>

      <style jsx>{`
        .footer-bg {
          background-image: linear-gradient(rgba(10, 15, 29, 0.94), rgba(10, 15, 29, 0.98)), url('https://hacktoskill.com/homePageH2s/assets/Footer.png');
          background-size: cover;
          background-position: center;
        }
      `}</style>
    </footer>
  )
}