export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const feedServiceUrl = process.env.NEXT_PUBLIC_FEED_SERVICE_URL || 'https://startup-news-feed.onrender.com'

    // Fetch stories for stats
    const storiesResponse = await fetch(`${feedServiceUrl}/stories`)
    const storiesData = storiesResponse.ok ? await storiesResponse.json() : { stories: [] }

    // Fetch categories for stats
    const categoriesResponse = await fetch(`${feedServiceUrl}/categories`)
    const categoriesData = categoriesResponse.ok ? await categoriesResponse.json() : { categories: [] }

    const stats = {
      totalStories: storiesData.stories?.length || 0,
      totalCategories: categoriesData.categories?.length || 0,
      recentStories: storiesData.stories?.slice(0, 5) || []
    }

    res.status(200).json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({ 
      totalStories: 0,
      totalCategories: 0,
      recentStories: []
    })
  }
}
