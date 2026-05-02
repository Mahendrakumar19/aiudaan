import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About AI Udaan Bootcamp | Buddha Institute of Technology',
  description: 'Learn about AI Udaan Bootcamp and Buddha Institute of Technology. Our mission is to empower students with AI skills to succeed in the digital age.',
  keywords: [
    'about us',
    'AI bootcamp',
    'Buddha Institute',
    'Gaya',
    'bootcamp',
    'education',
  ],
  alternates: {
    canonical: 'https://aiudaanbootcamp.com/about',
  },
  openGraph: {
    title: 'About AI Udaan Bootcamp | Buddha Institute',
    description: 'Learn about our mission and vision to empower AI professionals.',
    url: 'https://aiudaanbootcamp.com/about',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-black text-slate-900">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Udaan</span>
            </h1>

            <p className="text-xl text-slate-700 leading-relaxed">
              AI Udaan Bootcamp is an initiative of <strong>Buddha Institute of Technology</strong>, dedicated to empowering students and professionals with cutting-edge AI skills.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-slate-700">
                To democratize AI education and equip the next generation of professionals with practical skills to succeed in the digital economy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Why Choose Us</h2>
              <ul className="space-y-2">
                <li className="flex gap-3 text-slate-700">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>AICTE Approved & BEU Affiliated</span>
                </li>
                <li className="flex gap-3 text-slate-700">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Hands-on industry-relevant curriculum</span>
                </li>
                <li className="flex gap-3 text-slate-700">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Expert mentors with real-world experience</span>
                </li>
                <li className="flex gap-3 text-slate-700">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Lifetime access to course materials</span>
                </li>
                <li className="flex gap-3 text-slate-700">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Career support and job assistance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - Image/Stats */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-black text-blue-600">5000+</h3>
                <p className="text-slate-700 mt-2">Students Trained</p>
              </div>
              <div className="bg-purple-50 border border-purple-300 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-black text-purple-600">50+</h3>
                <p className="text-slate-700 mt-2">Expert Instructors</p>
              </div>
              <div className="bg-pink-50 border border-pink-300 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-black text-pink-600">30+</h3>
                <p className="text-slate-700 mt-2">Courses Available</p>
              </div>
              <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
                <h3 className="text-3xl font-black text-green-600">95%</h3>
                <p className="text-slate-700 mt-2">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
