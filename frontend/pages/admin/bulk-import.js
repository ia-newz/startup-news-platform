import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function BulkImport() {
  const [mounted, setMounted] = useState(false)
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState(null)
  const [template, setTemplate] = useState(null)
  const [result, setResult] = useState(null)

  const cmsServiceUrl = process.env.NEXT_PUBLIC_CMS_SERVICE_URL || 'http://localhost:8002'

  useEffect(() => {
    setMounted(true)
    loadTemplate()
  }, [])

  // Prevent static generation for admin pages
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const loadTemplate = async () => {
    try {
      const response = await fetch(`${cmsServiceUrl}/editor/csv-template`)
      const data = await response.json()
      setTemplate(data)
    } catch (error) {
      console.error('Error loading template:', error)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setPreview(null)
    setResult(null)
  }

  const handlePreview = async () => {
    if (!file) return

    setImporting(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('dry_run', 'true')

    try {
      const response = await fetch(`${cmsServiceUrl}/editor/stories/import-csv`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setPreview(data)
    } catch (error) {
      console.error('Error previewing import:', error)
      alert('Error previewing file. Please check the format.')
    } finally {
      setImporting(false)
    }
  }

  const handleImport = async () => {
    if (!file) return

    if (!confirm('Are you sure you want to import these stories? This action cannot be undone.')) {
      return
    }

    setImporting(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('dry_run', 'false')

    try {
      const response = await fetch(`${cmsServiceUrl}/editor/stories/import-csv`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult(data)
      setFile(null)
      setPreview(null)
    } catch (error) {
      console.error('Error importing stories:', error)
      alert('Error importing stories. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    if (!template) return

    const headers = template.headers
    const example = template.example_row
    
    let csv = headers.join(',') + '\n'
    csv += headers.map(header => {
      const value = example[header] || ''
      return `"${value.toString().replace(/"/g, '""')}"`
    }).join(',')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'startup-stories-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const downloadGoogleSheetsLink = () => {
    if (!template) return null
    
    const headers = template.headers.join(',')
    const example = template.headers.map(header => {
      const value = template.example_row[header] || ''
      return value.toString().replace(/"/g, '""')
    }).join(',')
    
    const csvData = encodeURIComponent(`${headers}\n${example}`)
    return `https://docs.google.com/spreadsheets/d/1BfkJFRz8R7nKQc8i-7C5yJzN9wXqA3tVp2eR6uS4mF8/copy?usp=sharing`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Bulk Import Stories - StartupSnaps Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">StartupSnaps Admin</span>
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Import Stories</h1>
          <p className="text-gray-600 mb-8">Upload a CSV file to import multiple stories at once.</p>

          {/* Step 1: Download Template */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Get the Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">📊 Excel/CSV Template</h3>
                <p className="text-gray-600 text-sm mb-4">Download a CSV template with example data</p>
                <button
                  onClick={downloadTemplate}
                  disabled={!template}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Download CSV Template
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">📝 Google Sheets Template</h3>
                <p className="text-gray-600 text-sm mb-4">Make a copy of our Google Sheets template</p>
                <a
                  href="https://docs.google.com/spreadsheets/d/1BfkJFRz8R7nKQc8i-7C5yJzN9wXqA3tVp2eR6uS4mF8/copy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  Open Google Sheets
                </a>
              </div>
            </div>
          </div>

          {/* Template Fields Guide */}
          {template && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Fields</h3>
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-900">Field</th>
                      <th className="text-left py-2 font-medium text-gray-900">Description</th>
                      <th className="text-left py-2 font-medium text-gray-900">Example</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {Object.entries(template.field_descriptions).map(([field, description]) => (
                      <tr key={field} className="border-b border-gray-100">
                        <td className="py-2 font-mono text-blue-600">{field}</td>
                        <td className="py-2 text-gray-600">{description}</td>
                        <td className="py-2 text-gray-800 text-xs">
                          {field === 'tags' ? '"["ai", "funding"]"' : 
                           field === 'published_date' ? '2024-01-15T10:00:00Z' :
                           template.example_row[field]?.toString().substring(0, 30) + (template.example_row[field]?.length > 30 ? '...' : '') || ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 2: Upload File */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Upload Your File</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-gray-600 mb-2">
                  {file ? file.name : 'Click to select CSV file or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">Only CSV files are supported</p>
              </label>
            </div>
          </div>

          {/* Step 3: Preview & Import */}
          {file && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Preview & Import</h2>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={handlePreview}
                  disabled={importing}
                  className="bg-yellow-600 text-white py-2 px-6 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {importing ? 'Processing...' : 'Preview Import'}
                </button>
                
                {preview && !preview.errors?.length && (
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {importing ? 'Importing...' : `Import ${preview.total_rows} Stories`}
                  </button>
                )}
              </div>

              {/* Preview Results */}
              {preview && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Preview Results</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Total rows:</span>
                      <span className="ml-2 font-medium text-green-600">{preview.total_rows}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Errors:</span>
                      <span className="ml-2 font-medium text-red-600">{preview.errors?.length || 0}</span>
                    </div>
                  </div>

                  {preview.errors?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {preview.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {preview.errors.length > 5 && (
                          <li>• ... and {preview.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {preview.preview?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Sample Stories:</h4>
                      <div className="space-y-2">
                        {preview.preview.slice(0, 3).map((story, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <h5 className="font-medium text-gray-900 text-sm">{story.title}</h5>
                            <p className="text-gray-600 text-xs mt-1">{story.summary.substring(0, 100)}...</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Category: {story.category}</span>
                              <span>Tags: {story.tags?.join(', ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Import Results */}
          {result && (
            <div className="mb-8">
              <div className={`p-4 rounded-lg ${result.error_count > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                <h3 className={`font-medium mb-2 ${result.error_count > 0 ? 'text-yellow-900' : 'text-green-900'}`}>
                  Import Complete!
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Successfully imported:</span>
                    <span className="ml-2 font-medium text-green-600">{result.imported_count} stories</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Errors:</span>
                    <span className="ml-2 font-medium text-red-600">{result.error_count || 0}</span>
                  </div>
                </div>

                {result.errors?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-900 mb-2">Import Errors:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {result.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-4 mt-4">
                  <Link
                    href="/admin"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Stories
                  </Link>
                  <button
                    onClick={() => {
                      setResult(null)
                      setFile(null)
                      setPreview(null)
                    }}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Import More
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use Google Sheets: Fill the template, then download as CSV</li>
              <li>• Keep summaries between 60-80 words for best readability</li>
              <li>• Include company_name to auto-create company profiles</li>
              <li>• Use JSON format for tags: ["ai", "funding", "saas"]</li>
              <li>• Always preview before importing to catch errors</li>
              <li>• Large imports may take a few minutes to process</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
