import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticExportWrapper from '../components/StaticExportWrapper'

export default function Trending() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('week')
  const [mounted, setMounted] = useState(false)

  const feedServiceUrl = process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'https://startup-feed-service.onrender.com'

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      loadTrendingStories()
    }
  }, [mounted, timeframe])

  // Prevent static generation
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trending stories...</p>
        </div>
      </div>
    )
  }

  const loadTrendingStories = async () => {
    try {
      setError(null)
      const response = await fetch(`${feedServiceUrl}/stories/trending?timeframe=${timeframe}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Error loading trending stories:', error)
      setError('Unable to load trending stories. Please try again later.')
      // Set sample trending stories for demo purposes
      setStories([
        {
          id: 1,
          title: "AI Startup Secures $50M Series B Funding",
          summary: "Revolutionary artificial intelligence company raises massive funding round to scale their breakthrough technology across global markets.",
          category: "funding",
          published_date: new Date().toISOString(),
          image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
          likes: 156,
          views: 892,
          source_url: "#",
          companies: [{ name: "AI Innovations", slug: "ai-innovations", logo_url: null }],
          engagement_score: 95
        },
        {
          id: 2,
          title: "Blockchain Platform Reaches 1M Users",
          summary: "Decentralized finance platform achieves major milestone with over one million active users worldwide.",
          category: "product",
          published_date: new Date(Date.now() - 86400000).toISOString(),
          image_url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
          likes: 89,
          views: 567,
          source_url: "#",
          companies: [{ name: "DeFi Solutions", slug: "defi-solutions", logo_url: null }],
          engagement_score: 87
        },
        {
          id: 3,
          title: "Major Tech Merger Creates Industry Giant",
          summary: "Two leading technology companies announce historic merger to create the largest player in their sector.",
          category: "acquisition",
          published_date: new Date(Date.now() - 172800000).toISOString(),
          image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
          likes: 234,
          views: 1245,
          source_url: "#",
          companies: [{ name: "TechCorp", slug: "techcorp", logo_url: null }],
          engagement_score: 92
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (storyId) => {
    try {
      await fetch(`${feedServiceUrl}/stories/${storyId}/like`, { method: 'POST' })
      loadTrendingStories()
    } catch (error) {
      console.error('Error liking story:', error)
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, likes: (story.likes || 0) + 1 }
          : story
      ))
    }
  }

  const trackView = async (storyId) => {
    try {
      await fetch(`${feedServiceUrl}/stories/${storyId}/view`, { method: 'POST' })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'funding': '💰',
      'product': '🚀',
      'acquisition': '🤝',
      'ipo': '📈',
      'partnership': '🤝',
      'general': '📰'
    }
    return icons[categoryName.toLowerCase()] || '📰'
  }

  const getCategoryColor = (categoryName) => {
    const colors = {
      'funding': '#10b981',
      'product': '#3b82f6',
      'acquisition': '#8b5cf6',
      'ipo': '#f59e0b',
      'partnership': '#ef4444',
      'general': '#6b7280'
    }
    return colors[categoryName.toLowerCase()] || '#0ea5e9'
  }

  return (
    <StaticExportWrapper>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <Head>
          <title>Trending Stories - Innovations Arena</title>
          <meta name="description" content="Discover the most engaging startup stories that are capturing the community's attention" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content="trending startup news, viral startup stories, popular startup content" />
          <meta property="og:title" content="Trending Stories - Innovations Arena" />
          <meta property="og:description" content="Discover the most engaging startup stories that are capturing the community's attention" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://startup-news-frontend.onrender.com/trending" />
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
              <span className="text-gradient">Trending</span> Stories
            </h1>
            <p className="text-lg sm:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Discover the most engaging startup stories that are capturing the community's attention
            </p>
          </div>

          {/* Timeframe Filter */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-soft border border-secondary-200">
                {['day', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                      timeframe === period
                        ? 'bg-primary-600 text-white shadow-medium'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {period === 'day' ? '24 Hours' : period === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700 mb-3">{error}</p>
              <button 
                onClick={loadTrendingStories}
                className="text-red-600 hover:text-red-800 underline font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Trending Stories */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-500 rounded-full animate-spin animation-delay-200"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {stories.map((story, index) => (
                <article 
                  key={story.id} 
                  className="card-hover animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Story Image */}
                    {story.image_url && (
                      <div className="lg:w-1/3 h-64 lg:h-auto overflow-hidden">
                        <img 
                          src={story.image_url} 
                          alt={story.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    <div className="lg:w-2/3 p-6 lg:p-8">
                      {/* Header with Category and Engagement */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span 
                            className="px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: getCategoryColor(story.category) }}
                          >
                            {story.category}
                          </span>
                          <span className="text-2xl">{getCategoryIcon(story.category)}</span>
                        </div>
                        
                        {/* Engagement Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            {story.engagement_score || Math.floor(Math.random() * 30) + 70}%
                          </div>
                          <div className="text-xs text-secondary-500">Engagement</div>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                        {story.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                        {story.summary}
                      </p>

                      {/* Companies */}
                      {story.companies && story.companies.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-secondary-600 mb-3 uppercase tracking-wide">Companies Involved</h4>
                          <div className="flex flex-wrap gap-3">
                            {story.companies.map(company => (
                              <Link
                                key={company.slug}
                                href={`/companies/${company.slug}`}
                                className="flex items-center space-x-2 bg-secondary-50 hover:bg-primary-50 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 hover:scale-105"
                              >
                                {company.logo_url && (
                                  <img src={company.logo_url} alt={company.name} className="w-5 h-5 rounded" />
                                )}
                                <span className="font-semibold text-secondary-700">{company.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-secondary-100">
                        <div className="flex items-center space-x-6 text-sm">
                          <button
                            onClick={() => handleLike(story.id)}
                            className="flex items-center space-x-2 text-secondary-500 hover:text-red-500 transition-colors group"
                            aria-label="Like story"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform">❤️</span>
                            <span className="font-semibold">{story.likes || 0}</span>
                          </button>
                          <span className="flex items-center space-x-2 text-secondary-500">
                            <span className="text-xl">👁️</span>
                            <span className="font-semibold">{story.views || 0}</span>
                          </span>
                          <time className="text-secondary-500 text-sm font-medium">
                            {new Date(story.published_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        </div>

                        {story.source_url && story.source_url !== '#' && (
                          <a
                            href={story.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackView(story.id)}
                            className="btn-primary text-sm px-6 py-2.5"
                          >
                            Read Full Story →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && stories.length === 0 && !error && (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-8xl mb-6">🔥</div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">No trending stories yet</h3>
              <p className="text-secondary-600 mb-8 max-w-md mx-auto">
                Check back later for the most engaging startup stories!
              </p>
              <Link href="/" className="btn-primary">
                View Latest Stories
              </Link>
            </div>
          )}
        </main>

        {/* Custom Styles */}
        <style jsx>{`
          .animation-delay-200 {
            animation-delay: 200ms;
          }
        `}</style>
      </div>
    </StaticExportWrapper>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
