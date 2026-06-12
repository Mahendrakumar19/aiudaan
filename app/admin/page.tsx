'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  mobile?: string
  createdAt: string
  payments: {
    id: string
    amount: number
    plan: string
    status: 'success' | 'failed' | 'pending'
    mobile?: string
    createdAt: string
    razorpayPaymentId?: string
    bootcampType?: string
  }[]
}

interface AdminDashboardData {
  totalUsers: number
  totalPayments: number
  successfulPayments: number
  failedPayments: number
  totalRevenue: number
  users: User[]
}

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // CMS States
  const [activeAdminTab, setActiveAdminTab] = useState<'registrations' | 'cms'>('registrations')
  const [cmsConfig, setCmsConfig] = useState<any>({ slides: [], programs: [], faqs: [] })
  const [cmsMessage, setCmsMessage] = useState<string | null>(null)

  // Fetch CMS config
  const fetchCmsConfig = async () => {
    try {
      const res = await fetch('/api/admin/cms')
      const data = await res.json()
      if (data && data.success) {
        setCmsConfig(data.config)
      }
    } catch (err) {
      console.error('Failed to fetch CMS config', err)
    }
  }

  const updateSlide = (idx: number, field: string, value: any) => {
    const newConfig = { ...cmsConfig }
    newConfig.slides[idx][field] = value
    setCmsConfig(newConfig)
  }

  const addSlide = () => {
    const newConfig = { ...cmsConfig }
    if (!newConfig.slides) newConfig.slides = []
    newConfig.slides.push({
      title: 'New Slide Title',
      stats: [{ value: '0', label: 'Metric' }],
      bg: 'https://hacktoskill.com/homePageH2s/assets/banner1.webp',
      cta: 'Learn More'
    })
    setCmsConfig(newConfig)
  }

  const deleteSlide = (idx: number) => {
    const newConfig = { ...cmsConfig }
    newConfig.slides.splice(idx, 1)
    setCmsConfig(newConfig)
  }

  const updateProgram = (idx: number, field: string, value: any) => {
    const newConfig = { ...cmsConfig }
    newConfig.programs[idx][field] = value
    setCmsConfig(newConfig)
  }

  const addProgram = () => {
    const newConfig = { ...cmsConfig }
    if (!newConfig.programs) newConfig.programs = []
    newConfig.programs.push({
      title: 'New Initiative Course',
      tag: 'Tech track',
      icon: '💡',
      description: 'Course details...',
      highlights: ['Feature 1', 'Feature 2']
    })
    setCmsConfig(newConfig)
  }

  const deleteProgram = (idx: number) => {
    const newConfig = { ...cmsConfig }
    newConfig.programs.splice(idx, 1)
    setCmsConfig(newConfig)
  }

  const updateFaq = (idx: number, field: string, value: any) => {
    const newConfig = { ...cmsConfig }
    newConfig.faqs[idx][field] = value
    setCmsConfig(newConfig)
  }

  const addFaq = () => {
    const newConfig = { ...cmsConfig }
    if (!newConfig.faqs) newConfig.faqs = []
    newConfig.faqs.push({ q: 'Question', a: 'Answer' })
    setCmsConfig(newConfig)
  }

  const deleteFaq = (idx: number) => {
    const newConfig = { ...cmsConfig }
    newConfig.faqs.splice(idx, 1)
    setCmsConfig(newConfig)
  }

  const saveCmsSettings = async () => {
    try {
      setCmsMessage('Saving settings...')
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: cmsConfig })
      })
      const data = await res.json()
      if (data && data.success) {
        setCmsMessage('✅ CMS settings saved successfully!')
      } else {
        throw new Error(data.error || 'Failed to save settings')
      }
    } catch (err: any) {
      console.error(err)
      setCmsMessage(`❌ Error: ${err.message}`)
    }
  }

  // Fetch admin data
  const fetchAdminData = async (adminEmail: string, adminPassword: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'x-admin-email': adminEmail,
          'x-admin-password': adminPassword,
        },
      })

      if (response.status === 401) {
        setError('Unauthorized access')
        setIsAuthenticated(false)
        return
      }

      if (!response.ok) throw new Error('Failed to fetch data')

      const dashboardData = await response.json()
      setData(dashboardData)
      setIsAuthenticated(true)
      localStorage.setItem('adminEmail', adminEmail)
      localStorage.setItem('adminPassword', adminPassword)
      fetchCmsConfig()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 401) {
        setError('Invalid email or password')
        return
      }

      if (!response.ok) throw new Error('Login failed')

      const result = await response.json()
      if (result.success) {
        fetchAdminData(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Load credentials from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail')
    const savedPassword = localStorage.getItem('adminPassword')
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      fetchAdminData(savedEmail, savedPassword)
      fetchCmsConfig()
    }
  }, [])

  // Filter users by search
  const filteredUsers = data?.users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Login View
  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl max-w-md w-full'
        >
          <div className='text-center mb-8'>
            <div className="w-14 h-14 bg-[#3462ae]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className='text-2xl font-bold text-slate-900 font-syne'>Organizer Portal</h1>
            <p className='text-slate-500 mt-2 text-sm'>AI Udaan Bootcamp Admin</p>
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@aiudaanbootcamp.com'
                className='w-full px-4 py-3 border border-slate-200 text-black rounded-xl focus:ring-2 focus:ring-[#3462ae] focus:border-transparent transition'
              />
            </div>

            <div>
              <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter password'
                className='w-full px-4 py-3 border text-black border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3462ae] focus:border-transparent transition'
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200'
              >
                ⚠️ {error}
              </motion.div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full px-4 py-3 bg-[#3462ae] hover:bg-[#1548b7] text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md'
            >
              {loading ? '🔄 Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <p className='text-xs text-slate-400 text-center mt-6'>
            💡 Authorized administrators and organizers only
          </p>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#3462ae] mx-auto mb-4'></div>
          <p className='text-slate-500 text-sm font-medium'>Loading organizer portal...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='min-h-screen bg-slate-50 p-4 sm:p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-sm'>
            Failed to load dashboard data
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <div className='bg-white border-b border-slate-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold font-syne text-slate-900'>Organizer Dashboard</h1>
            <p className='text-slate-500 text-xs mt-1'>Real-time Hackathon Submissions & Community Registrations</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('adminEmail')
              localStorage.removeItem('adminPassword')
              setIsAuthenticated(false)
              setEmail('')
              setPassword('')
              setData(null)
            }}
            className='px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition text-xs font-bold shadow-sm'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white border-b border-slate-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6'>
          <button
            onClick={() => setActiveAdminTab('registrations')}
            className={`py-4 border-b-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition ${activeAdminTab === 'registrations' ? 'border-[#3462ae] text-[#3462ae]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            Registrations & Analytics
          </button>
          <button
            onClick={() => setActiveAdminTab('cms')}
            className={`py-4 border-b-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition ${activeAdminTab === 'cms' ? 'border-[#3462ae] text-[#3462ae]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            CMS Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {activeAdminTab === 'registrations' ? (
          <>
            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
              >
                <p className='text-slate-600 text-sm font-medium'>Total Users</p>
                <p className='text-3xl font-bold text-slate-900 mt-2'>{data.totalUsers}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
              >
                <p className='text-slate-600 text-sm font-medium'>Total Payments</p>
                <p className='text-3xl font-bold text-blue-600 mt-2'>{data.totalPayments}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
              >
                <p className='text-slate-600 text-sm font-medium'>✅ Successful</p>
                <p className='text-3xl font-bold text-green-600 mt-2'>{data.successfulPayments}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
              >
                <p className='text-slate-600 text-sm font-medium'>❌ Failed</p>
                <p className='text-3xl font-bold text-red-600 mt-2'>{data.failedPayments}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
              >
                <p className='text-slate-600 text-sm font-medium'>💰 Total Revenue</p>
                <p className='text-3xl font-bold text-purple-600 mt-2'>₹{data.totalRevenue.toLocaleString('en-IN')}</p>
              </motion.div>
            </div>

            {/* Users List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'
            >
              {/* Header */}
              <div className='p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-xl font-bold text-slate-900'>Registered Users & Payments</h2>
                  <span className='text-sm text-slate-600'>Total: {filteredUsers.length} users</span>
                </div>
                <input
                  type='text'
                  placeholder='🔍 Search by name or email...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='text-black w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                />
              </div>

              {/* Users Table */}
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-slate-50 border-b border-slate-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Name</th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Email</th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Mobile</th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Registered</th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Payments</th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Payment Status</th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Amount</th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-200'>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, idx) => {
                        const latestPayment = user.payments[0]
                        const totalAmount = user.payments.reduce((sum, p) => sum + p.amount, 0)

                        return (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className='hover:bg-slate-50 transition-colors'
                          >
                            <td className='px-6 py-4 text-sm font-medium text-slate-900'>{user.name}</td>
                            <td className='px-6 py-4 text-sm text-slate-600'>{user.email}</td>
                            <td className='px-6 py-4 text-sm text-slate-600'>
                              {user.mobile || latestPayment?.mobile ? (
                                <a href={`tel:${user.mobile || latestPayment.mobile}`} className='hover:text-blue-600 cursor-pointer'>
                                  {user.mobile || latestPayment.mobile}
                                </a>
                              ) : (
                                <span className='text-slate-400'>-</span>
                              )}
                            </td>
                            <td className='px-6 py-4 text-sm text-slate-600'>
                              {new Date(user.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className='px-6 py-4 text-sm'>
                              <span className='inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-xs'>
                                {user.payments.length} payment{user.payments.length !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td className='px-6 py-4 text-sm'>
                              {latestPayment ? (
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-xs ${
                                    latestPayment.status === 'success'
                                      ? 'bg-green-100 text-green-700'
                                      : latestPayment.status === 'failed'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {latestPayment.status === 'success'
                                    ? '✅ Success'
                                    : latestPayment.status === 'failed'
                                    ? '❌ Failed'
                                    : '⏳ Pending'}
                                </span>
                              ) : (
                                <span className='text-slate-400 text-xs'>No payment</span>
                              )}
                            </td>
                            <td className='px-6 py-4 text-sm font-bold text-slate-900'>
                              ₹{totalAmount.toLocaleString('en-IN')}
                            </td>
                            <td className='px-6 py-4 text-xs'>
                              {latestPayment?.razorpayPaymentId ? (
                                <code className='bg-slate-100 px-2 py-1 rounded font-mono text-slate-700 break-all'>
                                  {latestPayment.razorpayPaymentId.substring(0, 15)}...
                                </code>
                              ) : (
                                <span className='text-slate-400'>-</span>
                              )}
                            </td>
                          </motion.tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className='px-6 py-8 text-center'>
                          <p className='text-slate-500'>No users found matching "{searchTerm}"</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Payment Details Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'
            >
              <div className='p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100'>
                <h2 className='text-xl font-bold text-slate-900'>Payment Details</h2>
              </div>

              <div className='divide-y divide-slate-200'>
                {filteredUsers.map((user) =>
                  user.payments.map((payment) => (
                    <motion.div
                      key={`${user.id}-${payment.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='p-6 hover:bg-slate-50 transition-colors'
                    >
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='font-bold text-slate-900'>{user.name}</p>
                          <p className='text-sm text-slate-600'>{user.email}</p>
                          <p className='text-sm text-slate-600 mt-1'>
                            Plan: <span className='font-semibold'>{payment.plan === 'standard' ? 'Plus (₹2,499)' : payment.plan === 'online' ? 'Online (₹499)' : 'Lite (₹999)'}</span>
                          </p>
                          {payment.bootcampType && (
                            <p className='text-sm text-slate-600'>
                              Bootcamp: <span className='font-semibold capitalize'>{payment.bootcampType}</span>
                            </p>
                          )}
                          {payment.razorpayPaymentId && (
                            <p className='text-xs text-slate-500 mt-2 font-mono break-all'>
                              TXN: {payment.razorpayPaymentId}
                            </p>
                          )}
                        </div>
                        <div className='text-right'>
                          <p className='text-2xl font-bold text-slate-900'>₹{payment.amount}</p>
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-xs mt-2 ${
                              payment.status === 'success'
                                ? 'bg-green-100 text-green-700'
                                : payment.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {payment.status === 'success'
                              ? '✅ Success'
                              : payment.status === 'failed'
                              ? '❌ Failed'
                              : '⏳ Pending'}
                          </span>
                          <p className='text-xs text-slate-500 mt-2'>
                            {new Date(payment.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {filteredUsers.every(u => u.payments.length === 0) && (
                <div className='p-8 text-center text-slate-500'>
                  No payments found for selected users
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 text-black">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold font-syne text-[#3462ae]">CMS Configuration Dashboard</h2>
                <p className="text-slate-500 text-xs mt-1">Add, remove, or modify any page content dynamically.</p>
              </div>
              <button
                onClick={saveCmsSettings}
                className="px-6 py-2.5 bg-[#3462ae] hover:bg-[#1548b7] text-white rounded-xl font-bold transition text-xs shadow-md"
              >
                Save CMS Settings
              </button>
            </div>

            {cmsMessage && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700">
                {cmsMessage}
              </div>
            )}

            {/* Slides Editor */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">1. Hero Slides</h3>
                <button onClick={addSlide} className="text-xs bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold">
                  + Add Slide
                </button>
              </div>
              <div className="space-y-6">
                {cmsConfig.slides?.map((slide: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-5 space-y-4 relative bg-slate-50/50">
                    <button onClick={() => deleteSlide(idx)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:underline">
                      Delete Slide
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Slide Title</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Button Text (CTA)</label>
                        <input
                          type="text"
                          value={slide.cta}
                          onChange={(e) => updateSlide(idx, 'cta', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Editor */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">2. Upskilling Initiatives & Courses</h3>
                <button onClick={addProgram} className="text-xs bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold">
                  + Add Course
                </button>
              </div>
              <div className="space-y-6">
                {cmsConfig.programs?.map((prog: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-5 space-y-4 relative bg-slate-50/50">
                    <button onClick={() => deleteProgram(idx)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:underline">
                      Delete Course
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Course Title</label>
                        <input
                          type="text"
                          value={prog.title}
                          onChange={(e) => updateProgram(idx, 'title', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Tag (e.g. Coding Track)</label>
                        <input
                          type="text"
                          value={prog.tag}
                          onChange={(e) => updateProgram(idx, 'tag', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Icon Emoji</label>
                        <input
                          type="text"
                          value={prog.icon}
                          onChange={(e) => updateProgram(idx, 'icon', e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black text-center w-16"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Description</label>
                      <textarea
                        value={prog.description}
                        onChange={(e) => updateProgram(idx, 'description', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black h-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Editor */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">3. Frequently Asked Questions</h3>
                <button onClick={addFaq} className="text-xs bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold">
                  + Add FAQ
                </button>
              </div>
              <div className="space-y-6">
                {cmsConfig.faqs?.map((faq: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-5 space-y-4 relative bg-slate-50/50">
                    <button onClick={() => deleteFaq(idx)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:underline">
                      Delete FAQ
                    </button>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Question</label>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Answer</label>
                      <textarea
                        value={faq.a}
                        onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-black h-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className='mt-8 flex justify-between items-center text-sm text-slate-600'>
          <div>Last updated: {new Date().toLocaleTimeString('en-IN')}</div>
          <Link href='/' className='text-blue-600 hover:underline font-medium'>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
