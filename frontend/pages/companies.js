import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticExportWrapper from '../components/StaticExportWrapper'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [industries, setIndustries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState(null)

  const feedServiceUrl = process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'https://startup-news-feed.onrender.com'

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      loadCompanies()
      loadIndustries()
    }
  }, [mounted])

  // Prevent static generation
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  const loadCompanies = async () => {
    try {
      setError(null)
      const url = selectedIndustry === 'all' 
        ? `${feedServiceUrl}/companies`
        : `${feedServiceUrl}/companies?industry=${selectedIndustry}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setCompanies(data.companies || [])
    } catch (error) {
      console.error('Error loading companies:', error)
      setError('Unable to load companies. Please try again later.')
      // Set sample companies for demo purposes
      setCompanies([
        {
          id: 1,
          name: "TechCorp",
          slug: "techcorp",
          industry: "Technology",
          logo_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop",
          description: "Leading technology company specializing in AI and machine learning solutions.",
          founded_year: 2018,
          headquarters: "San Francisco, CA",
          website: "https://techcorp.com",
          story_count: 15,
          total_funding: "$50M"
        },
        {
          id: 2,
          name: "AI Innovations",
          slug: "ai-innovations",
          industry: "Artificial Intelligence",
          logo_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
          description: "Revolutionary AI company developing breakthrough machine learning algorithms.",
          founded_year: 2020,
          headquarters: "New York, NY",
          website: "https://aiinnovations.ai",
          story_count: 8,
          total_funding: "$25M"
        },
        {
          id: 3,
          name: "DeFi Solutions",
          slug: "defi-solutions",
          industry: "Fintech",
          logo_url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop",
          description: "Decentralized finance platform revolutionizing traditional banking services.",
          founded_year: 2019,
          headquarters: "Austin, TX",
          website: "https://defisolutions.com",
          story_count: 12,
          total_funding: "$30M"
        },
        {
          id: 4,
          name: "AppWorks",
          slug: "appworks",
          industry: "Mobile Apps",
          logo_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&h=100&fit=crop",
          description: "Mobile app development company creating innovative productivity solutions.",
          founded_year: 2021,
          headquarters: "Seattle, WA",
          website: "https://appworks.com",
          story_count: 6,
          total_funding: "$15M"
        },
        {
          id: 5,
          name: "FinTech Solutions",
          slug: "fintech-solutions",
          industry: "Fintech",
          logo_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop",
          description: "Financial technology company providing digital payment and banking solutions.",
          founded_year: 2017,
          headquarters: "Boston, MA",
          website: "https://fintechsolutions.com",
          story_count: 20,
          total_funding: "$75M"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadIndustries = async () => {
    try {
      const response = await fetch(`${feedServiceUrl}/industries`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setIndustries(data.industries || [])
    } catch (error) {
      console.error('Error loading industries:', error)
      // Set default industries if API fails
      setIndustries([
        { id: 'all', name: 'All Industries' },
        { id: 'technology', name: 'Technology' },
        { id: 'fintech', name: 'Fintech' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'ecommerce', name: 'E-commerce' },
        { id: 'ai', name: 'Artificial Intelligence' },
        { id: 'mobile', name: 'Mobile Apps' },
        { id: 'saas', name: 'SaaS' }
      ])
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || 
                           company.industry.toLowerCase() === selectedIndustry.toLowerCase()
    return matchesSearch && matchesIndustry
  })

  const getIndustryIcon = (industry) => {
    const icons = {
      'technology': '💻',
      'fintech': '💰',
      'healthcare': '🏥',
      'ecommerce': '🛒',
      'ai': '🤖',
      'mobile': '📱',
      'saas': '☁️'
    }
    return icons[industry.toLowerCase()] || '🏢'
  }

  const getIndustryColor = (industry) => {
    const colors = {
      'technology': '#3b82f6',
      'fintech': '#10b981',
      'healthcare': '#ef4444',
      'ecommerce': '#f59e0b',
      'ai': '#8b5cf6',
      'mobile': '#06b6d4',
      'saas': '#84cc16'
    }
    return colors[industry.toLowerCase()] || '#6b7280'
  }

  return (
    <StaticExportWrapper>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <Head>
          <title>Companies - Innovations Arena</title>
          <meta name="description" content="Explore innovative startups and companies across various industries" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content="startup companies, tech companies, fintech, AI companies, startup directory" />
          <meta property="og:title" content="Companies - Innovations Arena" />
          <meta property="og:description" content="Explore innovative startups and companies across various industries" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://startup-news-frontend.onrender.com/companies" />
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-4">
              <span className="text-gradient">Companies</span> Directory
            </h1>
            <p className="text-lg sm:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Discover innovative startups and companies across various industries
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-white border border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-soft"
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Industry Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-6 py-4 bg-white border border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-soft appearance-none cursor-pointer"
                >
                  {industries.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700 mb-3">{error}</p>
              <button 
                onClick={loadCompanies}
                className="text-red-600 hover:text-red-800 underline font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Companies Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-500 rounded-full animate-spin animation-delay-200"></div>
              </div>
            </div>
          ) : (
            <>
              {filteredCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredCompanies.map((company, index) => (
                    <div 
                      key={company.id} 
                      className="card-hover animate-fade-in group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Company Header */}
                      <div className="p-6">
                        <div className="flex items-start space-x-4 mb-4">
                          {/* Company Logo */}
                          <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            {company.logo_url ? (
                              <img 
                                src={company.logo_url} 
                                alt={company.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div className="hidden w-full h-full bg-gradient-primary rounded-2xl items-center justify-center text-white font-bold text-lg">
                              {company.name.charAt(0)}
                            </div>
                          </div>

                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                              {company.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <span 
                                className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: getIndustryColor(company.industry) }}
                              >
                                {company.industry}
                              </span>
                              <span className="text-lg">{getIndustryIcon(company.industry)}</span>
                            </div>
                            {company.founded_year && (
                              <p className="text-sm text-secondary-500">
                                Founded {company.founded_year}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-secondary-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {company.description}
                        </p>

                        {/* Company Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-secondary-50 rounded-xl">
                            <div className="text-lg font-bold text-secondary-900">{company.story_count || 0}</div>
                            <div className="text-xs text-secondary-500">Stories</div>
                          </div>
                          <div className="text-center p-3 bg-primary-50 rounded-xl">
                            <div className="text-lg font-bold text-primary-600">{company.total_funding || 'N/A'}</div>
                            <div className="text-xs text-primary-500">Total Funding</div>
                          </div>
                        </div>

                        {/* Company Details */}
                        {company.headquarters && (
                          <div className="flex items-center space-x-2 text-sm text-secondary-500 mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{company.headquarters}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                          <Link
                            href={`/companies/${company.slug}`}
                            className="text-primary-600 hover:text-primary-800 text-sm font-semibold transition-colors hover:underline"
                          >
                            View Details →
                          </Link>
                          {company.website && company.website !== '#' && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary-500 hover:text-primary-600 text-sm font-medium transition-colors"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 animate-fade-in">
                  <div className="text-8xl mb-6">🏢</div>
                  <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                    {searchTerm || selectedIndustry !== 'all' ? 'No companies found' : 'No companies yet'}
                  </h3>
                  <p className="text-secondary-600 mb-8 max-w-md mx-auto">
                    {searchTerm || selectedIndustry !== 'all' 
                      ? 'Try adjusting your search terms or industry filter.'
                      : 'Companies will appear here as they are added to our platform.'
                    }
                  </p>
                  {(searchTerm || selectedIndustry !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedIndustry('all')
                      }}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </main>

        {/* Custom Styles */}
        <style jsx>{`
          .animation-delay-200 {
            animation-delay: 200ms;
          }
          
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </StaticExportWrapper>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
