'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PaymentStats {
  totalPayments: number
  successCount: number
  failedCount: number
  pendingCount: number
  totalRevenue: number
  planBreakdown: {
    basic: {
      total: number
      success: number
      revenue: number
    }
    standard: {
      total: number
      success: number
      revenue: number
    }
  }
  recentPayments: Array<{
    id: string
    name: string
    email: string
    amount: number
    plan: string
    status: string
    createdAt: string
  }>
}

export default function AdminPaymentsPage() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Fetch payment statistics
  const fetchStats = async (key: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/payments', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      })

      if (response.status === 401) {
        setError('Invalid admin key')
        setIsAuthenticated(false)
        return
      }

      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      setStats(data)
      setIsAuthenticated(true)
      localStorage.setItem('adminKey', key)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Load admin key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey')
    if (savedKey) {
      setAdminKey(savedKey)
      fetchStats(savedKey)
    }
  }, [])

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchStats(adminKey)
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full'
        >
          <h1 className='text-2xl font-bold text-slate-900 mb-6'>Admin Dashboard</h1>
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Admin API Key
              </label>
              <input
                type='password'
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder='Enter admin key'
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent'
              />
            </div>
            {error && (
              <div className='bg-red-50 text-red-600 p-3 rounded-lg text-sm'>
                {error}
              </div>
            )}
            <button
              type='submit'
              className='w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-slate-600'>Loading payment statistics...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className='min-h-screen bg-white p-4 sm:p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-red-50 text-red-600 p-6 rounded-lg'>
            {error || 'Failed to load statistics'}
          </div>
        </div>
      </div>
    )
  }

  const successRate = stats.totalPayments > 0
    ? ((stats.successCount / stats.totalPayments) * 100).toFixed(1)
    : '0'

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <div className='bg-white border-b border-slate-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>Payment Dashboard</h1>
            <p className='text-slate-600 mt-1'>Payment statistics and recent transactions</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('adminKey')
              setIsAuthenticated(false)
              setAdminKey('')
            }}
            className='px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
          >
            <p className='text-slate-600 text-sm font-medium'>Total Payments</p>
            <p className='text-3xl font-bold text-slate-900 mt-2'>{stats.totalPayments}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
          >
            <p className='text-slate-600 text-sm font-medium'>Successful ✅</p>
            <p className='text-3xl font-bold text-green-600 mt-2'>{stats.successCount}</p>
            <p className='text-xs text-slate-500 mt-1'>{successRate}% success rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
          >
            <p className='text-slate-600 text-sm font-medium'>Failed ❌</p>
            <p className='text-3xl font-bold text-red-600 mt-2'>{stats.failedCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
          >
            <p className='text-slate-600 text-sm font-medium'>Total Revenue</p>
            <p className='text-3xl font-bold text-blue-600 mt-2'>₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
          </motion.div>
        </div>

        {/* Plan Breakdown */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
          >
            <h2 className='text-lg font-bold text-slate-900 mb-4'>Plan Breakdown</h2>
            <div className='space-y-4'>
              {/* Basic Plan */}
              <div className='p-4 bg-slate-50 rounded-lg'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-semibold text-slate-900'>Basic (Lite - ₹999)</span>
                  <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded'>
                    {stats.planBreakdown.basic.success} / {stats.planBreakdown.basic.total}
                  </span>
                </div>
                <p className='text-sm text-slate-600'>Revenue: ₹{stats.planBreakdown.basic.revenue}</p>
              </div>

              {/* Standard Plan */}
              <div className='p-4 bg-slate-50 rounded-lg'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-semibold text-slate-900'>Standard (Plus - ₹2,499)</span>
                  <span className='text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded'>
                    {stats.planBreakdown.standard.success} / {stats.planBreakdown.standard.total}
                  </span>
                </div>
                <p className='text-sm text-slate-600'>Revenue: ₹{stats.planBreakdown.standard.revenue}</p>
              </div>
            </div>
          </motion.div>

          {/* Payment Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'
          >
            <h2 className='text-lg font-bold text-slate-900 mb-4'>Status Breakdown</h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
                <span className='text-green-700 font-medium'>Success</span>
                <span className='text-lg font-bold text-green-600'>{stats.successCount}</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-red-50 rounded-lg'>
                <span className='text-red-700 font-medium'>Failed</span>
                <span className='text-lg font-bold text-red-600'>{stats.failedCount}</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-yellow-50 rounded-lg'>
                <span className='text-yellow-700 font-medium'>Pending</span>
                <span className='text-lg font-bold text-yellow-600'>{stats.pendingCount}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'
        >
          <div className='p-6 border-b border-slate-200'>
            <h2 className='text-lg font-bold text-slate-900'>Recent Transactions</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50 border-b border-slate-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Name</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Email</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Plan</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Amount</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Status</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-slate-900'>Date</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200'>
                {stats.recentPayments.map((payment) => (
                  <tr key={payment.id} className='hover:bg-slate-50'>
                    <td className='px-6 py-4 text-sm text-slate-900'>{payment.name}</td>
                    <td className='px-6 py-4 text-sm text-slate-600'>{payment.email}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.plan === 'standard'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {payment.plan === 'standard' ? 'Plus ₹2,499' : 'Lite ₹999'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-slate-900'>₹{payment.amount}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payment.status === 'success' ? '✅ Success' : payment.status === 'failed' ? '❌ Failed' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600'>
                      {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-slate-600'>
          <Link href='/' className='text-blue-600 hover:underline'>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
