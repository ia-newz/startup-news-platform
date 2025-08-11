import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('submissions')
  const [categories, setCategories] = useState([])
  
  const cmsServiceUrl = process.env.NEXT_PUBLIC_CMS_SERVICE_URL || 'http://localhost:8002'

  useEffect(() => {
    loadData()
    loadCategories()
  }, [activeTab])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FEED_SERVICE_URL}/categories`)
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'submissions') {
        const response = await fetch(`${cmsServiceUrl}/submissions?status=pending`)
        const data = await response.json()
        setSubmissions(data.submissions || [])
      } else if (activeTab === 'stories') {
        const response = await fetch(`${cmsServiceUrl}/editor/stories?limit=50`)
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveSubmission = async (submissionId, approvalData) => {
    try {
      const response = await fetch(`${cmsServiceUrl}/submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(approvalData)
      })
      
      if (response.ok) {
        alert('Story approved and published!')
        loadData()
      } else {
        alert('Error approving story')
      }
    } catch (error) {
      console.error('Error approving submission:', error)
      alert('Error approving story')
    }
  }

  const rejectSubmission = async (submissionId, reason) => {
    try {
      const response = await fetch(`${cmsServiceUrl}/submissions/${submissionId}/reject?reason=${encodeURIComponent(reason)}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        alert('Submission rejected')
        loadData()
      } else {
        alert('Error rejecting submission')
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      alert('Error rejecting submission')
    }
  }

  const deleteStory = async (storyId) => {
    if (!confirm('Are you sure you want to delete this story?')) return

    try {
      const response = await fetch(`${cmsServiceUrl}/editor/stories/${storyId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Story deleted')
        loadData()
      } else {
        alert('Error deleting story')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      alert('Error deleting story')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard - StartupSnaps</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">StartupSnaps Admin</span>
            </Link>
            <div className="flex space-x-4">
              <Link href="/admin/add-story" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Story
              </Link>
              <Link href="/admin/bulk-import" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Bulk Import
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'submissions', name: 'Pending Submissions', count: submissions.length },
                { id: 'stories', name: 'Published Stories', count: stories.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="space-y-6">
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending submissions</h3>
                    <p className="text-gray-600">All caught up! New submissions will appear here.</p>
                  </div>
                ) : (
                  submissions.map(submission => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      categories={categories}
                      onApprove={approveSubmission}
                      onReject={rejectSubmission}
                    />
                  ))
                )}
              </div>
            )}

            {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div className="space-y-6">
                {stories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📰</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories yet</h3>
                    <p className="text-gray-600">Start by adding your first story or approving submissions.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map(story => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        categories={categories}
                        onDelete={deleteStory}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// Submission Card Component
function SubmissionCard({ submission, categories, onApprove, onReject }) {
  const [editing, setEditing] = useState(false)
  const [approvalData, setApprovalData] = useState({
    title: submission.proposed_title,
    summary: submission.proposed_summary,
    category: submission.proposed_category,
    tags: submission.proposed_tags || [],
    company_slugs: [],
    source_url: '',
    image_url: ''
  })

  const handleApprove = () => {
    onApprove(submission.id, approvalData)
    setEditing(false)
  }

  const handleReject = () => {
    const reason = prompt('Reason for rejection (optional):')
    onReject(submission.id, reason || 'Does not meet guidelines')
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {submission.proposed_title}
          </h3>
          <p className="text-sm text-gray-600">
            By {submission.founder_name} from {submission.company_name}
          </p>
        </div>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded">
          Pending
        </span>
      </div>

      {!editing ? (
        <>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {submission.proposed_summary}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>Category: {submission.proposed_category}</span>
            <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Review & Approve
            </button>
            <button
              onClick={handleReject}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={approvalData.title}
              onChange={(e) => setApprovalData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              value={approvalData.summary}
              onChange={(e) => setApprovalData(prev => ({ ...prev, summary: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={approvalData.category}
                onChange={(e) => setApprovalData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
              <input
                type="url"
                value={approvalData.source_url}
                onChange={(e) => setApprovalData(prev => ({ ...prev, source_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleApprove}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve & Publish
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Story Card Component
function StoryCard({ story, categories, onDelete }) {
  const category = categories.find(c => c.id === story.category) || { name: story.category, color: '#6B7280' }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {story.image_url && (
        <img src={story.image_url} alt={story.title} className="w-full h-32 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(story.published_date).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {story.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {story.summary}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>❤️ {story.likes || 0}</span>
          <span>👁️ {story.views || 0}</span>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/admin/edit-story/${story.id}`}
            className="flex-1 text-center bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(story.id)}
            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
