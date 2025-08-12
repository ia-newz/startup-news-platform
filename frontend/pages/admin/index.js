import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Submit() {
  const [formData, setFormData] = useState({
    founder_name: '',
    founder_email: '',
    company_name: '',
    company_website: '',
    proposed_title: '',
    proposed_summary: '',
    proposed_category: 'general',
    proposed_tags: []
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [wordCount, setWordCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const cmsServiceUrl = process.env.NEXT_PUBLIC_CMS_SERVICE_URL || 'http://localhost:8002'

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      loadCategories()
    }
  }, [mounted])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'http://localhost:8000'}/categories`)
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      // Set default categories if API fails
      setCategories([
        { id: 'general', name: 'General', color: '#6b7280' },
        { id: 'funding', name: 'Funding', color: '#10b981' },
        { id: 'product', name: 'Product Launch', color: '#3b82f6' },
        { id: 'acquisition', name: 'Acquisition', color: '#8b5cf6' },
        { id: 'ipo', name: 'IPO', color: '#f59e0b' },
        { id: 'partnership', name: 'Partnership', color: '#ef4444' }
      ])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${cmsServiceUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const error = await response.json()
        alert('Error submitting story: ' + (error.detail || 'Please try again'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'proposed_summary') {
      const words = value.trim() ? value.trim().split(/\s+/).length : 0
      setWordCount(words)
    }
  }

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag)
    updateForm('proposed_tags', tags)
  }

  // Prevent static generation for admin pages
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Story Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your submission. Our editorial team will review it and publish if approved.
            You'll receive an email notification about the status.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Stories
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  founder_name: '',
                  founder_email: '',
                  company_name: '',
                  company_website: '',
                  proposed_title: '',
                  proposed_summary: '',
                  proposed_category: 'general',
                  proposed_tags: []
                })
                setWordCount(0)
              }}
              className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              Submit Another Story
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Submit Your Startup Story - StartupSnaps</title>
        <meta name="description" content="Share your startup's latest news, funding, product launches, and milestones" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">StartupSnaps</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Submit Your Startup Story</h1>
            <p className="text-gray-600 leading-relaxed">
              Share your startup's latest news, funding rounds, product launches, and milestones with our community. 
              Stories are reviewed by our editorial team before publishing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.founder_name}
                  onChange={(e) => updateForm('founder_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.founder_email}
                  onChange={(e) => updateForm('founder_email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="john@startup.com"
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => updateForm('company_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Your Startup Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  value={formData.company_website}
                  onChange={(e) => updateForm('company_website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="https://yourstartup.com"
                />
              </div>
            </div>

            {/* Story Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                required
                value={formData.proposed_title}
                onChange={(e) => updateForm('proposed_title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Your Startup Raises $1M Seed Round"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Summary * (aim for 60-80 words)
              </label>
              <textarea
                required
                rows={5}
                value={formData.proposed_summary}
                onChange={(e) => updateForm('proposed_summary', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Write a concise, engaging summary of your news. Include key details like funding amount, investors, product features, or milestone numbers."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Word count: <span className={`font-medium ${wordCount >= 60 && wordCount <= 80 ? 'text-green-600' : 'text-gray-700'}`}>
                    {wordCount}
                  </span>
                </p>
                {wordCount > 0 && (
                  <p className="text-xs text-gray-500">
                    {wordCount < 60 ? `Add ${60 - wordCount} more words` : wordCount > 80 ? `Remove ${wordCount - 80} words` : 'Perfect length!'}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.proposed_category}
                  onChange={(e) => updateForm('proposed_category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.proposed_tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="ai, funding, saas"
                />
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Submission Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Stories should be newsworthy and recent (within 30 days)</li>
                <li>• Include specific details like funding amounts, user numbers, or product features</li>
                <li>• Avoid overly promotional language</li>
                <li>• Ensure you have permission to share the information</li>
                <li>• Include credible sources when possible</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Story'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
