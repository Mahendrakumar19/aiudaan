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
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full'
        >
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-black text-slate-900'>Admin Panel</h1>
            <p className='text-slate-600 mt-2'>User & Payment Management</p>
          </div>

          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@aiudaanbootcamp.com'
                className='w-full px-4 py-3 border border-slate-300 text-black rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter password'
                className='w-full px-4 py-3 border text-black border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition'
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200'
              >
                ⚠️ {error}
              </motion.div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? '🔄 Logging in...' : '🔐 Login'}
            </button>
          </form>

          <p className='text-xs text-slate-500 text-center mt-6'>
            💡 Contact administrator for access credentials
          </p>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4'></div>
          <p className='text-slate-600 text-lg font-medium'>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='min-h-screen bg-slate-50 p-4 sm:p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-red-50 text-red-600 p-6 rounded-lg border border-red-200'>
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
            <h1 className='text-3xl font-black text-slate-900'>Admin Panel</h1>
            <p className='text-slate-600 mt-1'>User & Payment Management Dashboard</p>
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
            className='px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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
                  <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Amount</th>                  <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900'>Transaction ID</th>                </tr>
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
                    <td colSpan={6} className='px-6 py-8 text-center'>
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
