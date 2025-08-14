import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticExportWrapper from '../components/StaticExportWrapper'

export default function Home() {
  const [stories, setStories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const feedServiceUrl = process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'https://startup-feed-service.onrender.com'

  useEffect(() => {
    loadCategories()
    loadStories()
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${feedServiceUrl}/categories`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCategories([{ id: 'all', name: 'All Stories', color: '#0ea5e9', icon: '📰' }, ...data.categories])
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([
        { id: 'all', name: 'All Stories', color: '#0ea5e9', icon: '📰' },
        { id: 'funding', name: 'Funding', color: '#10b981', icon: '💰' },
        { id: 'product', name: 'Product Launch', color: '#3b82f6', icon: '🚀' },
        { id: 'acquisition', name: 'Acquisition', color: '#8b5cf6', icon: '🤝' },
        { id: 'ipo', name: 'IPO', color: '#f59e0b', icon: '📈' },
        { id: 'partnership', name: 'Partnership', color: '#ef4444', icon: '🤝' },
        { id: 'general', name: 'General', color: '#6b7280', icon: '📰' }
      ])
    }
  }

  const loadStories = async () => {
    try {
      setError(null)
      const url = selectedCategory === 'all' 
        ? `${feedServiceUrl}/stories`
        : `${feedServiceUrl}/stories?category=${selectedCategory}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Error loading stories:', error)
      setError('Unable to load stories. Please try again later.')
      setStories([
        {
          id: 1,
          title: "Tech Startup Raises $10M Series A Funding",
          summary: "Innovative AI-powered platform secures major investment to expand operations and accelerate product development across multiple markets.",
          category: "funding",
          published_date: new Date().toISOString(),
          image_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
          likes: 42,
          views: 156,
          source_url: "#",
          companies: [{ name: "TechCorp", slug: "techcorp", logo_url: null }]
        },
        {
          id: 2,
          title: "Revolutionary Mobile App Launches Beta Version",
          summary: "Groundbreaking productivity app introduces AI-driven features that help users manage tasks more efficiently than ever before.",
          category: "product",
          published_date: new Date(Date.now() - 86400000).toISOString(),
          image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
          likes: 28,
          views: 89,
          source_url: "#",
          companies: [{ name: "AppWorks", slug: "appworks", logo_url: null }]
        },
        {
          id: 3,
          title: "Major Acquisition in Fintech Sector",
          summary: "Leading financial technology company acquires innovative startup to strengthen its digital payment solutions portfolio.",
          category: "acquisition",
          published_date: new Date(Date.now() - 172800000).toISOString(),
          image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
          likes: 35,
          views: 123,
          source_url: "#",
          companies: [{ name: "FinTech Solutions", slug: "fintech-solutions", logo_url: null }]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = (storyId) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, likes: (story.likes || 0) + 1 }
        : story
    ))
  }

  const trackView = (storyId) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, views: (story.views || 0) + 1 }
        : story
    ))
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || '📰'
  }

  return (
    <StaticExportWrapper>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <Head>
          <title>Innovations Arena - Latest Startup News & Stories</title>
          <meta name="description" content="Get the latest startup news, funding announcements, and innovation stories in 60 seconds" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content="startup news, funding, innovation, entrepreneurship, tech news" />
          <meta name="author" content="Innovations Arena" />
          <meta property="og:title" content="Innovations Arena - Latest Startup News & Stories" />
          <meta property="og:description" content="Get the latest startup news, funding announcements, and innovation stories in 60 seconds" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://startup-news-frontend.onrender.com" />
          {/* Favicon links removed to prevent 404 errors */}
        </Head>

        {/* Header */}
        <header className="glass sticky top-0 z-50 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-white font-bold text-lg">IA</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-bold text-gradient">Innovations Arena</span>
                  <p className="text-xs text-secondary-600 -mt-1">Startup News Platform</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-primary-600 font-semibold relative group">
                  Latest
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/trending" className="text-secondary-600 hover:text-primary-600 font-medium transition-colors relative group">
                  Trending
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/companies" className="text-secondary-600 hover:text-primary-600 font-medium transition-colors relative group">
                  Companies
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/submit" className="btn-primary">
                  Submit Story
                </Link>
                <Link href="/admin" className="text-secondary-600 hover:text-primary-600 font-medium transition-colors">
                  Admin
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-white/20">
                <div className="flex flex-col space-y-4">
                  <Link href="/" className="text-primary-600 font-semibold">Latest</Link>
                  <Link href="/trending" className="text-secondary-600">Trending</Link>
                  <Link href="/companies" className="text-secondary-600">Companies</Link>
                  <Link href="/submit" className="btn-primary text-center">
                    Submit Story
                  </Link>
                  <Link href="/admin" className="text-secondary-600">
                    Admin
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-4">
              Latest <span className="text-gradient">Startup Stories</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest startup news, funding rounds, and innovation stories from around the world
            </p>
          </div>

          {/* Category Filters */}
          <div className="mb-8 sm:mb-12">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'text-white shadow-large'
                      : 'bg-white text-secondary-700 hover:bg-primary-50 hover:text-primary-600 shadow-soft border border-secondary-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : undefined,
                    boxShadow: selectedCategory === category.id ? '0 10px 40px -10px rgba(14, 165, 233, 0.4)' : undefined
                  }}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700 mb-3">{error}</p>
              <button 
                onClick={loadStories}
                className="text-red-600 hover:text-red-800 underline font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Stories Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {stories.map((story, index) => (
                <article 
                  key={story.id} 
                  className="card-hover group"
                >
                  {/* Story Image */}
                  {story.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={story.image_url} 
                        alt={story.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(story.category)}</span>
                        <span 
                          className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: categories.find(c => c.id === story.category)?.color || '#0ea5e9' }}
                        >
                          {categories.find(c => c.id === story.category)?.name || story.category}
                        </span>
                      </div>
                      <time className="text-secondary-500 text-xs font-medium">
                        {new Date(story.published_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                      {story.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-secondary-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {story.summary}
                    </p>

                    {/* Companies */}
                    {story.companies && story.companies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {story.companies.slice(0, 2).map(company => (
                            <Link
                              key={company.slug}
                              href={`/companies/${company.slug}`}
                              className="flex items-center space-x-2 bg-secondary-50 hover:bg-primary-50 rounded-lg px-3 py-1.5 text-xs transition-colors"
                            >
                              {company.logo_url && (
                                <img src={company.logo_url} alt={company.name} className="w-3 h-3 rounded" />
                              )}
                              <span className="font-medium text-secondary-700">{company.name}</span>
                            </Link>
                          ))}
                          {story.companies.length > 2 && (
                            <span className="text-secondary-500 text-xs px-3 py-1.5">
                              +{story.companies.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <button
                          onClick={() => handleLike(story.id)}
                          className="flex items-center space-x-1 hover:text-red-500 transition-colors group"
                          aria-label="Like story"
                        >
                          <span className="group-hover:scale-110 transition-transform">❤️</span>
                          <span className="font-medium">{story.likes || 0}</span>
                        </button>
                        <span className="flex items-center space-x-1">
                          <span>👁️</span>
                          <span className="font-medium">{story.views || 0}</span>
                        </span>
                      </div>

                      {story.source_url && story.source_url !== '#' && (
                        <a
                          href={story.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackView(story.id)}
                          className="text-primary-600 hover:text-primary-800 text-sm font-semibold transition-colors hover:underline"
                        >
                          Read More →
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && stories.length === 0 && !error && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">📰</div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">No stories yet</h3>
              <p className="text-secondary-600 mb-8 max-w-md mx-auto">
                Be the first to share a startup story and help build our community of innovators!
              </p>
              <Link href="/submit" className="btn-primary">
                Submit Your Story
              </Link>
            </div>
          )}
        </main>
      </div>
    </StaticExportWrapper>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
