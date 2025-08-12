import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticExportWrapper from '../components/StaticExportWrapper'

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

  const cmsServiceUrl = process.env.NEXT_PUBLIC_CMS_SERVICE_URL || 'https://startup-news-cms.onrender.com'

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      loadCategories()
    }
  }, [mounted])

  // Prevent static generation
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submission form...</p>
        </div>
      </div>
    )
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'http://localhost:8000'}/categories`)
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error loading categories:', error)
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center px-4">
        <div className="card p-8 sm:p-12 max-w-lg w-full text-center animate-scale-in">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Story Submitted!</h2>
          <p className="text-secondary-600 mb-8 leading-relaxed">
            Thank you for your submission. Our editorial team will review it and publish if approved.
            You'll receive an email notification about the status.
          </p>
          <div className="space-y-4">
            <Link href="/" className="btn-primary block w-full">
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
              className="btn-secondary block w-full"
            >
              Submit Another Story
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <StaticExportWrapper>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <Head>
          <title>Submit Story - Innovations Arena</title>
          <meta name="description" content="Share your startup story with our community of innovators and entrepreneurs" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content="submit startup story, share startup news, startup submission" />
          <meta property="og:title" content="Submit Story - Innovations Arena" />
          <meta property="og:description" content="Share your startup story with our community of innovators and entrepreneurs" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://startup-news-frontend.onrender.com/submit" />
        </Head>

        {/* Header */}
        <header className="glass border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300 transform group-hover:scale-110">
                <span className="text-white font-bold text-lg">IA</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">Innovations Arena</span>
                <p className="text-xs text-secondary-600 -mt-1">Startup News Platform</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Share Your <span className="text-gradient">Startup Story</span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Share your startup's latest news, funding rounds, product launches, and milestones with our community. 
              Stories are reviewed by our editorial team before publishing.
            </p>
          </div>

          <div className="card p-6 sm:p-8 lg:p-12 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
                  <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span>Personal Information</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-3">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.founder_name}
                      onChange={(e) => updateForm('founder_name', e.target.value)}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.founder_email}
                      onChange={(e) => updateForm('founder_email', e.target.value)}
                      className="input-field"
                      placeholder="john@startup.com"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
                  <span className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  <span>Company Information</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-3">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => updateForm('company_name', e.target.value)}
                      className="input-field"
                      placeholder="Your Startup Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-3">
                      Company Website
                    </label>
                    <input
                      type="url"
                      value={formData.company_website}
                      onChange={(e) => updateForm('company_website', e.target.value)}
                      className="input-field"
                      placeholder="https://yourstartup.com"
                    />
                  </div>
                </div>
              </div>

              {/* Story Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
                  <span className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </span>
                  <span>Story Details</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.proposed_title}
                    onChange={(e) => updateForm('proposed_title', e.target.value)}
                    className="input-field"
                    placeholder="Your Startup Raises $1M Seed Round"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3">
                    Story Summary * (aim for 60-80 words)
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.proposed_summary}
                    onChange={(e) => updateForm('proposed_summary', e.target.value)}
                    className="input-field resize-none"
                    placeholder="Write a concise, engaging summary of your news. Include key details like funding amount, investors, product features, or milestone numbers."
                  />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-secondary-500">
                      Word count: <span className={`font-semibold ${wordCount >= 60 && wordCount <= 80 ? 'text-success-600' : 'text-secondary-700'}`}>
                        {wordCount}
                      </span>
                    </p>
                    {wordCount > 0 && (
                      <p className={`text-xs font-medium ${
                        wordCount < 60 ? 'text-warning-600' : 
                        wordCount > 80 ? 'text-error-600' : 
                        'text-success-600'
                      }`}>
                        {wordCount < 60 ? `Add ${60 - wordCount} more words` : 
                         wordCount > 80 ? `Remove ${wordCount - 80} words` : 
                         'Perfect length!'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-3">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.proposed_category}
                      onChange={(e) => updateForm('proposed_category', e.target.value)}
                      className="input-field"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-3">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.proposed_tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      className="input-field"
                      placeholder="ai, funding, saas"
                    />
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
                <h3 className="font-semibold text-primary-900 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submission Guidelines</span>
                </h3>
                <ul className="text-sm text-primary-800 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Stories should be newsworthy and recent (within 30 days)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Include specific details like funding amounts, user numbers, or product features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Avoid overly promotional language</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Ensure you have permission to share the information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Include credible sources when possible</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
    </StaticExportWrapper>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
