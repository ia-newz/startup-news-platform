import { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticExportWrapper from '../../components/StaticExportWrapper'

export default function BulkImport() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
      ]
      
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please select a valid Excel (.xlsx, .xls) or CSV file')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setResults(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/bulk-import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const templateData = [
      {
        title: 'Sample Startup Story',
        summary: 'This is a sample story description',
        category: 'funding',
        published_date: '2024-01-15',
        image_url: 'https://example.com/image.jpg',
        source_url: 'https://example.com/source',
        companies: 'Company A, Company B',
        tags: 'startup, funding, tech'
      }
    ]

    const csvContent = [
      'title,summary,category,published_date,image_url,source_url,companies,tags',
      ...templateData.map(row => 
        Object.values(row).map(value => `"${value}"`).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'startup-stories-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <StaticExportWrapper>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <Head>
          <title>Bulk Import - Admin Dashboard | Innovations Arena</title>
          <meta name="description" content="Admin bulk import tool for startup news platform" />
        </Head>

        {/* Header */}
        <header className="glass sticky top-0 z-50 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IA</span>
                </div>
                <span className="text-xl font-bold text-gradient">Innovations Arena</span>
              </Link>

              <nav className="flex items-center space-x-6">
                <Link href="/admin" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  View Site
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Bulk Import Stories
            </h1>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Upload multiple startup stories at once using our Excel template. 
              This tool helps you efficiently manage large amounts of content.
            </p>
          </div>

                     {/* Template Download */}
           <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6 mb-8">
             <h2 className="text-xl font-semibold text-secondary-900 mb-4">
               📋 Download Template
             </h2>
             <p className="text-secondary-600 mb-4">
               Download our Excel template to ensure your data is formatted correctly. 
               The template includes sample data and column headers.
             </p>
             <button
               onClick={downloadTemplate}
               className="btn-secondary"
             >
               📥 Download CSV Template
             </button>
           </div>

           {/* Temporary Notice */}
           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
             <div className="flex items-center space-x-2 mb-4">
               <span className="text-yellow-600 text-2xl">⚠️</span>
               <h3 className="text-lg font-semibold text-yellow-800">
                 Temporary Notice
               </h3>
             </div>
             <p className="text-yellow-700 mb-4">
               File upload functionality is being updated for better compatibility. 
               For now, please use the single story submission form to add content.
             </p>
             <Link href="/submit" className="btn-primary">
               Add Single Story
             </Link>
           </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              📤 Upload File
            </h2>
            
            <div className="space-y-4">
              {/* File Input */}
              <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {!file ? (
                  <div>
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-secondary-600 mb-2">
                      Drag and drop your Excel file here, or
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary"
                    >
                      Browse Files
                    </button>
                    <p className="text-sm text-secondary-500 mt-2">
                      Supports .xlsx, .xls, and .csv files
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-4">✅</div>
                    <p className="text-secondary-900 font-medium mb-2">
                      {file.name}
                    </p>
                    <p className="text-sm text-secondary-500 mb-4">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => {
                        setFile(null)
                        fileInputRef.current.value = ''
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove File
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              {file && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    'Upload Stories'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-xl">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-green-600 text-2xl">✅</span>
                <h3 className="text-lg font-semibold text-green-800">
                  Upload Successful!
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-green-600 font-semibold">{results.total || 0}</div>
                  <div className="text-green-700">Total Records</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-green-600 font-semibold">{results.successful || 0}</div>
                  <div className="text-green-700">Successfully Imported</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-red-600 font-semibold">{results.failed || 0}</div>
                  <div className="text-red-700">Failed Records</div>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">Errors:</h4>
                  <div className="bg-white rounded-lg p-3 max-h-32 overflow-y-auto">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-red-600 text-sm">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              📝 Instructions
            </h3>
            <div className="space-y-3 text-blue-700">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">1.</span>
                <p>Download the template and fill it with your startup stories data</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">2.</span>
                <p>Ensure all required fields are filled (title, summary, category)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">3.</span>
                <p>Use valid categories: funding, product, acquisition, ipo, partnership, general</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">4.</span>
                <p>Upload the file and review the results</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </StaticExportWrapper>
  )
}
