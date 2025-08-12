import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticExportWrapper from '../components/StaticExportWrapper'

export default function Demo() {
  const [activeTab, setActiveTab] = useState('features')
  const [mounted, setMounted] = useState(false)

  // Prevent static generation
  if (typeof window !== 'undefined' && !mounted) {
    setMounted(true)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading demo...</p>
        </div>
      </div>
    )
  }

  const [demoStories] = useState([
    {
      id: 1,
      title: "AI Startup Raises $25M Series A",
      summary: "Revolutionary artificial intelligence company secures major funding to accelerate product development and expand into new markets.",
      category: "funding",
      published_date: new Date().toISOString(),
      image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      likes: 89,
      views: 456,
      companies: [{ name: "AI Innovations", slug: "ai-innovations" }]
    },
    {
      id: 2,
      title: "Fintech Platform Launches Mobile App",
      summary: "Leading financial technology company introduces new mobile application with advanced security features and seamless user experience.",
      category: "product",
      published_date: new Date(Date.now() - 86400000).toISOString(),
      image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
      likes: 67,
      views: 234,
      companies: [{ name: "FinTech Solutions", slug: "fintech-solutions" }]
    }
  ])

  const features = [
    {
      icon: "📰",
      title: "Latest News",
      description: "Stay updated with real-time startup news and funding announcements"
    },
    {
      icon: "🔥",
      title: "Trending Stories",
      description: "Discover the most engaging content based on community engagement"
    },
    {
      icon: "🏢",
      title: "Company Directory",
      description: "Explore innovative startups across various industries"
    },
    {
      icon: "📝",
      title: "Story Submission",
      description: "Share your startup's news and milestones with our community"
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Perfect experience across all devices and screen sizes"
    },
    {
      icon: "⚡",
      title: "Fast & Responsive",
      description: "Lightning-fast loading times and smooth interactions"
    }
  ]

  const stats = [
    { number: "500+", label: "Startup Stories" },
    { number: "100+", label: "Companies" },
    { number: "50K+", label: "Monthly Readers" },
    { number: "95%", label: "User Satisfaction" }
  ]

  return (
    <StaticExportWrapper>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <Head>
          <title>Platform Demo - Innovations Arena</title>
          <meta name="description" content="Explore the features and technology behind Innovations Arena startup news platform" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content="startup news platform demo, features, technology stack, innovations arena" />
          <meta property="og:title" content="Platform Demo - Innovations Arena" />
          <meta property="og:description" content="Explore the features and technology behind Innovations Arena startup news platform" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://startup-news-frontend.onrender.com/demo" />
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
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
              Platform <span className="text-gradient">Demo</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore the features and capabilities that make Innovations Arena the go-to platform for startup news
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="btn-primary">
                View Live Platform
              </Link>
              <Link href="/submit" className="btn-secondary">
                Submit Your Story
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-6 bg-white rounded-2xl shadow-soft border border-secondary-100 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-secondary-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-soft border border-secondary-200">
                {['features', 'demo', 'technology'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                      activeTab === tab
                        ? 'bg-primary-600 text-white shadow-medium'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {tab === 'features' ? 'Platform Features' : tab === 'demo' ? 'Live Demo' : 'Technology Stack'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'features' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="card-hover p-6 text-center group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-secondary-900 mb-6 text-center">
                  Live Story Examples
                </h2>
                <p className="text-secondary-600 text-center max-w-2xl mx-auto">
                  Here are some sample stories that demonstrate how content appears on our platform
                </p>
              </div>

              <div className="space-y-8">
                {demoStories.map((story, index) => (
                  <div 
                    key={story.id}
                    className="card-hover animate-fade-in group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {story.image_url && (
                        <div className="lg:w-1/3 h-64 lg:h-auto overflow-hidden">
                          <img 
                            src={story.image_url} 
                            alt={story.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="lg:w-2/3 p-6 lg:p-8">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-primary-600">
                            {story.category}
                          </span>
                          <time className="text-secondary-500 text-sm font-medium">
                            {new Date(story.published_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        </div>

                        <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                          {story.title}
                        </h3>

                        <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                          {story.summary}
                        </p>

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
                                  <span className="font-semibold text-secondary-700">{company.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-secondary-100">
                          <div className="flex items-center space-x-6 text-sm text-secondary-500">
                            <span className="flex items-center space-x-2">
                              <span className="text-xl">❤️</span>
                              <span className="font-semibold">{story.likes}</span>
                            </span>
                            <span className="flex items-center space-x-2">
                              <span className="text-xl">👁️</span>
                              <span className="font-semibold">{story.views}</span>
                            </span>
                          </div>

                          <span className="text-primary-600 text-sm font-semibold">
                            Demo Content
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-secondary-600 mb-6">
                  Ready to explore the full platform?
                </p>
                <Link href="/" className="btn-primary">
                  View All Stories
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'technology' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Frontend */}
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center space-x-3">
                    <span className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span>Frontend Technology</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">R</span>
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">React 18</div>
                        <div className="text-sm text-secondary-500">Modern UI library with hooks</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">N</span>
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">Next.js 14</div>
                        <div className="text-sm text-secondary-500">Full-stack React framework</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <span className="text-cyan-600 font-bold text-sm">T</span>
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">Tailwind CSS</div>
                        <div className="text-sm text-secondary-500">Utility-first CSS framework</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Backend */}
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center space-x-3">
                    <span className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                    </span>
                    <span>Backend Services</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">P</span>
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">Python FastAPI</div>
                        <div className="text-sm text-secondary-500">High-performance web framework</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">S</span>
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">Supabase</div>
                        <div className="text-sm text-secondary-500">Open-source Firebase alternative</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-soft border border-secondary-100">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">D</span>
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">Docker</div>
                        <div className="text-sm text-secondary-500">Containerized deployment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <div className="bg-white rounded-2xl p-8 shadow-soft border border-secondary-100">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
                    Join thousands of entrepreneurs, investors, and tech enthusiasts who rely on Innovations Arena for the latest startup news and insights.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/" className="btn-primary">
                      Explore Platform
                    </Link>
                    <Link href="/submit" className="btn-secondary">
                      Submit Story
                    </Link>
                  </div>
                </div>
              </div>
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
