import formidable from 'formidable'
import fs from 'fs'
import csv from 'csv-parser'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    const file = files.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const results = await parseFile(file.filepath, file.mimetype)
    
    // Clean up uploaded file
    fs.unlinkSync(file.filepath)

    // Process the parsed data
    const processedResults = await processStories(results)

    res.status(200).json(processedResults)
  } catch (error) {
    console.error('Bulk import error:', error)
    res.status(500).json({ error: 'Failed to process file' })
  }
}

async function parseFile(filepath, mimetype) {
  return new Promise((resolve, reject) => {
    const results = []
    
    if (mimetype === 'text/csv' || filepath.endsWith('.csv')) {
      fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject)
    } else {
      // For Excel files, you would need a library like xlsx
      // For now, we'll handle CSV files
      reject(new Error('Only CSV files are supported at the moment'))
    }
  })
}

async function processStories(stories) {
  const results = {
    total: stories.length,
    successful: 0,
    failed: 0,
    errors: []
  }

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i]
    const rowNumber = i + 2 // +2 because of header row and 0-based index

    try {
      // Validate required fields
      if (!story.title || !story.summary || !story.category) {
        results.errors.push({
          row: rowNumber,
          message: 'Missing required fields (title, summary, category)'
        })
        results.failed++
        continue
      }

      // Validate category
      const validCategories = ['funding', 'product', 'acquisition', 'ipo', 'partnership', 'general']
      if (!validCategories.includes(story.category.toLowerCase())) {
        results.errors.push({
          row: rowNumber,
          message: `Invalid category: ${story.category}. Must be one of: ${validCategories.join(', ')}`
        })
        results.failed++
        continue
      }

      // Prepare story data
      const storyData = {
        title: story.title.trim(),
        summary: story.summary.trim(),
        category: story.category.toLowerCase(),
        published_date: story.published_date || new Date().toISOString(),
        image_url: story.image_url || null,
        source_url: story.source_url || null,
        companies: story.companies ? story.companies.split(',').map(c => c.trim()) : [],
        tags: story.tags ? story.tags.split(',').map(t => t.trim()) : []
      }

      // Send to backend service
      const response = await fetch(`${process.env.NEXT_PUBLIC_FEED_SERVICE_URL}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      })

      if (response.ok) {
        results.successful++
      } else {
        const errorData = await response.json()
        results.errors.push({
          row: rowNumber,
          message: errorData.error || 'Failed to create story'
        })
        results.failed++
      }
    } catch (error) {
      results.errors.push({
        row: rowNumber,
        message: error.message || 'Unknown error'
      })
      results.failed++
    }
  }

  return results
}
