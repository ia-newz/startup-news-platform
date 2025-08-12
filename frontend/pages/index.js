import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [stories, setStories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'inshorts'

  const feedServiceUrl = process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'http://localhost:8000'

  useEffect(() => {
    loadCategories()
    loadStories()
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${feedServiceUrl}/categories`)
      const data = await response.json()
      setCategories([{ id: 'all', name: 'All Stories', color: '#0ea5e9', icon: '📰' }, ...data.categories])
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

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1)
    }
  }

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <Head>
        <title>Innovations Arena - Latest Startup News & Stories</title>
        <meta name="description" content="Get the latest startup news, funding announcements, and innovation stories in 60 seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Modern Header */}
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
            </nav>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('inshorts')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'inshorts' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <Link href="/demo" className="p-2 rounded-lg text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20 animate-slide-up">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="text-primary-600 font-semibold">Latest</Link>
                <Link href="/trending" className="text-secondary-600">Trending</Link>
                <Link href="/companies" className="text-secondary-600">Companies</Link>
                <Link href="/submit" className="btn-primary text-center">
                  Submit Story
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
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

        {/* Stories Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-500 rounded-full animate-spin animation-delay-200"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Inshorts View */}
            {viewMode === 'inshorts' && stories.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  {/* Navigation Arrows */}
                  {currentStoryIndex > 0 && (
                    <button
                      onClick={prevStory}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-large flex items-center justify-center text-secondary-600 hover:text-primary-600 transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {currentStoryIndex < stories.length - 1 && (
                    <button
                      onClick={nextStory}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-large flex items-center justify-center text-secondary-600 hover:text-primary-600 transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Story Card */}
                  <div className="card-hover animate-scale-in">
                    {stories[currentStoryIndex].image_url && (
                      <div className="relative h-64 sm:h-80">
                        <img 
                          src={stories[currentStoryIndex].image_url} 
                          alt={stories[currentStoryIndex].title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>
                    )}

                    <div className="p-6 sm:p-8">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getCategoryIcon(stories[currentStoryIndex].category)}</span>
                          <span 
                            className="px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: categories.find(c => c.id === stories[currentStoryIndex].category)?.color || '#0ea5e9' }}
                          >
                            {categories.find(c => c.id === stories[currentStoryIndex].category)?.name || stories[currentStoryIndex].category}
                          </span>
                        </div>
                        <time className="text-secondary-500 text-sm font-medium">
                          {new Date(stories[currentStoryIndex].published_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4 leading-tight">
                        {stories[currentStoryIndex].title}
                      </h2>

                      {/* Summary */}
                      <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                        {stories[currentStoryIndex].summary}
                      </p>

                      {/* Companies */}
                      {stories[currentStoryIndex].companies && stories[currentStoryIndex].companies.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-secondary-600 mb-3 uppercase tracking-wide">Companies Involved</h4>
                          <div className="flex flex-wrap gap-3">
                            {stories[currentStoryIndex].companies.slice(0, 3).map(company => (
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
                            {stories[currentStoryIndex].companies.length > 3 && (
                              <span className="text-secondary-500 text-sm px-4 py-2.5">
                                +{stories[currentStoryIndex].companies.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-6 border-t border-secondary-100">
                        <div className="flex items-center space-x-6 text-sm">
                          <button
                            onClick={() => handleLike(stories[currentStoryIndex].id)}
                            className="flex items-center space-x-2 text-secondary-500 hover:text-red-500 transition-colors group"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform">❤️</span>
                            <span className="font-semibold">{stories[currentStoryIndex].likes || 0}</span>
                          </button>
                          <span className="flex items-center space-x-2 text-secondary-500">
                            <span className="text-xl">👁️</span>
                            <span className="font-semibold">{stories[currentStoryIndex].views || 0}</span>
                          </span>
                        </div>

                        {stories[currentStoryIndex].source_url && (
                          <a
                            href={stories[currentStoryIndex].source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackView(stories[currentStoryIndex].id)}
                            className="btn-primary text-sm px-6 py-2.5"
                          >
                            Read Full Story →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Story Counter */}
                  <div className="text-center mt-6">
                    <span className="text-sm text-secondary-500 font-medium">
                      {currentStoryIndex + 1} of {stories.length} stories
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {stories.map((story, index) => (
                  <article 
                    key={story.id} 
                    className="card-hover animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
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
                          >
                            <span className="group-hover:scale-110 transition-transform">❤️</span>
                            <span className="font-medium">{story.likes || 0}</span>
                          </button>
                          <span className="flex items-center space-x-1">
                            <span>👁️</span>
                            <span className="font-medium">{story.views || 0}</span>
                          </span>
                        </div>

                        {story.source_url && (
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
          </>
        )}

        {/* Empty State */}
        {!loading && stories.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
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

      {/* Custom Styles */}
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  )
}
