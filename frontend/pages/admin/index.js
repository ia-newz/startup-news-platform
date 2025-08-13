import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticExportWrapper from '../../components/StaticExportWrapper'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStories: 0,
    totalCategories: 0,
    recentStories: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StaticExportWrapper>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <Head>
          <title>Admin Dashboard | Innovations Arena</title>
          <meta name="description" content="Admin dashboard for startup news platform" />
        </Head>

        {/* Header */}
        <header className="glass sticky top-0 z-50 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IA</span>
                </div>
                <span className="text-xl font-bold text-gradient">Innovations Arena</span>
              </Link>

              <nav className="flex items-center space-x-6">
                <Link href="/" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  View Site
                </Link>
                <span className="text-primary-600 font-medium">Admin Dashboard</span>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-secondary-600">
              Manage your startup news platform content and analytics
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Total Stories</p>
                  <p className="text-3xl font-bold text-secondary-900">
                    {loading ? '...' : stats.totalStories}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Categories</p>
                  <p className="text-3xl font-bold text-secondary-900">
                    {loading ? '...' : stats.totalCategories}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏷️</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Platform Status</p>
                  <p className="text-3xl font-bold text-green-600">Active</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                🚀 Quick Actions
              </h2>
              <div className="space-y-3">
                <Link 
                  href="/admin/bulk-import"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <span className="text-primary-600 text-lg">📤</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Bulk Import Stories</p>
                    <p className="text-sm text-secondary-600">Upload multiple stories via Excel</p>
                  </div>
                </Link>

                <Link 
                  href="/submit"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                    <span className="text-accent-600 text-lg">✏️</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Add Single Story</p>
                    <p className="text-sm text-secondary-600">Create a new story manually</p>
                  </div>
                </Link>

                <Link 
                  href="/companies"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                    <span className="text-secondary-600 text-lg">🏢</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Manage Companies</p>
                    <p className="text-sm text-secondary-600">View and edit company data</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                📊 Recent Activity
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentStories && stats.recentStories.length > 0 ? (
                    stats.recentStories.slice(0, 5).map((story, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors">
                        <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                          <span className="text-secondary-600 text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-secondary-900 truncate">
                            {story.title}
                          </p>
                          <p className="text-sm text-secondary-600">
                            {new Date(story.published_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: story.category === 'funding' ? '#10b981' : '#3b82f6' }}
                        >
                          {story.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      <span className="text-4xl mb-4 block">📰</span>
                      <p>No recent stories</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Admin Tools */}
          <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              🛠️ Admin Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-secondary-200 rounded-xl">
                <h3 className="font-medium text-secondary-900 mb-2">Content Management</h3>
                <p className="text-sm text-secondary-600 mb-3">
                  Manage stories, categories, and company data
                </p>
                <Link href="/admin/bulk-import" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  Manage Content →
                </Link>
              </div>

              <div className="p-4 border border-secondary-200 rounded-xl">
                <h3 className="font-medium text-secondary-900 mb-2">Analytics</h3>
                <p className="text-sm text-secondary-600 mb-3">
                  View platform usage and engagement metrics
                </p>
                <span className="text-secondary-400 text-sm font-medium">
                  Coming Soon
                </span>
              </div>

              <div className="p-4 border border-secondary-200 rounded-xl">
                <h3 className="font-medium text-secondary-900 mb-2">Settings</h3>
                <p className="text-sm text-secondary-600 mb-3">
                  Configure platform settings and preferences
                </p>
                <span className="text-secondary-400 text-sm font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StaticExportWrapper>
  )
}
