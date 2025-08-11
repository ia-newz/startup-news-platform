import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [stories, setStories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const feedServiceUrl = process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'http://localhost:8000'

  useEffect(() => {
    loadCategories()
    loadStories()
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${feedServiceUrl}/categories`)
      const data = await response.json()
      setCategories([{ id: 'all', name: 'All Stories', color: '#6B7280' }, ...data.categories])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadStories = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? `${feedServiceUrl}/stories`
        : `${feedServiceUrl}/stories?category=${selectedCategory}`
      
      const response = await fetch(url)
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Error loading stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (storyId) => {
    try {
      await fetch(`${feedServiceUrl}/stories/${storyId}/like`, { method: 'POST' })
      // Reload stories to get updated like count
      loadStories()
    } catch (error) {
      console.error('Error liking story:', error)
    }
  }

  const trackView = async (storyId) => {
    try {
      await fetch(`${feedServiceUrl}/stories/${storyId}/view`, { method: 'POST' })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>StartupSnaps - Latest Startup News & Stories</title>
        <meta name="description" content="Get the latest startup news, funding announcements, and innovation stories in 60 seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">StartupSnaps</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-blue-600 font-medium">Latest</Link>
              <Link href="/trending" className="text-gray-600 hover:text-blue-600 transition-colors">Trending</Link>
              <Link href="/companies" className="text-gray-600 hover:text-blue-600 transition-colors">Companies</Link>
              <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Submit Story
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="text-blue-600 font-medium">Latest</Link>
                <Link href="/trending" className="text-gray-600">Trending</Link>
                <Link href="/companies" className="text-gray-600">Companies</Link>
                <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                  Submit Story
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Latest Startup Stories</h1>
          <p className="text-gray-600 text-sm sm:text-base">Stay updated with the latest startup news, funding rounds, and innovation stories</p>
        </div>

        {/* Category Filters - Horizontal Scroll on Mobile */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid - Responsive */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stories.map(story => (
              <article 
                key={story.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Story Image */}
                {story.image_url && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img 
                      src={story.image_url} 
                      alt={story.title} 
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: categories.find(c => c.id === story.category)?.color || '#6B7280' }}
                    >
                      {categories.find(c => c.id === story.category)?.name || story.category}
                    </span>
                    <time className="text-gray-500 text-sm">
                      {new Date(story.published_date).toLocaleDateString()}
                    </time>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {story.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
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
                            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 text-sm transition-colors"
                          >
                            {company.logo_url && (
                              <img src={company.logo_url} alt={company.name} className="w-4 h-4 rounded" />
                            )}
                            <span className="font-medium text-gray-700">{company.name}</span>
                          </Link>
                        ))}
                        {story.companies.length > 2 && (
                          <span className="text-gray-500 text-sm px-3 py-1.5">
                            +{story.companies.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleLike(story.id)}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <span>❤️</span>
                        <span>{story.likes || 0}</span>
                      </button>
                      <span className="flex items-center space-x-1">
                        <span>👁️</span>
                        <span>{story.views || 0}</span>
                      </span>
                    </div>

                    {story.source_url && (
                      <a
                        href={story.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackView(story.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
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
        {!loading && stories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share a startup story!</p>
            <Link
              href="/submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Your Story
            </Link>
          </div>
        )}
      </main>

      {/* Custom Styles for Mobile */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
