export const config = {
  api: {
    bodyParser: true,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // For now, return a mock response since we removed the file processing dependencies
    // This can be enhanced later with proper file upload handling
    const mockResults = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [
        {
          row: 1,
          message: 'File upload functionality is being updated. Please use the single story submission form for now.'
        }
      ]
    }

    res.status(200).json(mockResults)
  } catch (error) {
    console.error('Bulk import error:', error)
    res.status(500).json({ error: 'Service temporarily unavailable' })
  }
}


