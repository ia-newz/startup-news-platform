import Head from 'next/head'
import Link from 'next/link'

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <Head>
        <title>Design System Demo - Innovations Arena</title>
        <meta name="description" content="Explore the design system components, colors, and UI elements" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300 transform group-hover:scale-110">
                <span className="text-white font-bold text-lg">IA</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">Innovations Arena</span>
                <p className="text-xs text-secondary-600 -mt-1">Design System Demo</p>
              </div>
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-4">
            Design System <span className="text-gradient">Showcase</span>
          </h1>
          <p className="text-lg sm:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Explore the components, colors, and design tokens that power Innovations Arena
          </p>
        </div>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Colors */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Primary Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg border border-primary-200"></div>
                  <div>
                    <p className="font-medium text-secondary-900">Primary 50</p>
                    <p className="text-sm text-secondary-600">#f0f9ff</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg border border-primary-200"></div>
                  <div>
                    <p className="font-medium text-secondary-900">Primary 100</p>
                    <p className="text-sm text-secondary-600">#e0f2fe</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg"></div>
                  <div>
                    <p className="font-medium text-secondary-900">Primary 500</p>
                    <p className="text-sm text-secondary-600">#0ea5e9</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-900 rounded-lg"></div>
                  <div>
                    <p className="font-medium text-white">Primary 900</p>
                    <p className="text-sm text-primary-100">#0c4a6e</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Colors */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Secondary Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-50 rounded-lg border border-secondary-200"></div>
                  <div>
                    <p className="font-medium text-secondary-900">Secondary 50</p>
                    <p className="text-sm text-secondary-600">#f8fafc</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg border border-secondary-200"></div>
                  <div>
                    <p className="font-medium text-secondary-900">Secondary 100</p>
                    <p className="text-sm text-secondary-600">#f1f5f9</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-500 rounded-lg"></div>
                  <div>
                    <p className="font-medium text-white">Secondary 500</p>
                    <p className="text-sm text-secondary-100">#64748b</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-900 rounded-lg"></div>
                  <div>
                    <p className="font-medium text-white">Secondary 900</p>
                    <p className="text-sm text-secondary-100">#0f172a</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Accent Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent-50 rounded-lg border border-accent-200"></div>
                  <div>
                    <p className="font-medium text-secondary-900">Accent 50</p>
                    <p className="text-sm text-secondary-600">#fdf4ff</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg border border-accent-200"></div>
                  <div>
                    <p className="font-medium text-secondary-900">Accent 100</p>
                    <p className="text-sm text-secondary-600">#fae8ff</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent-500 rounded-lg"></div>
                  <div>
                    <p className="font-medium text-white">Accent 500</p>
                    <p className="text-sm text-accent-100">#d946ef</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent-900 rounded-lg"></div>
                  <div>
                    <p className="font-medium text-white">Accent 900</p>
                    <p className="text-sm text-accent-100">#701a75</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Button Components</h2>
          
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Primary Buttons */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Primary Buttons</h3>
                <div className="space-y-4">
                  <button className="btn-primary w-full">Primary Button</button>
                  <button className="btn-primary w-full text-sm py-2.5">Small Primary</button>
                  <button className="btn-primary w-full text-lg py-4">Large Primary</button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Secondary Buttons</h3>
                <div className="space-y-4">
                  <button className="btn-secondary w-full">Secondary Button</button>
                  <button className="btn-secondary w-full text-sm py-2.5">Small Secondary</button>
                  <button className="btn-secondary w-full text-lg py-4">Large Secondary</button>
                </div>
              </div>

              {/* Accent Buttons */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Accent Buttons</h3>
                <div className="space-y-4">
                  <button className="btn-accent w-full">Accent Button</button>
                  <button className="btn-accent w-full text-sm py-2.5">Small Accent</button>
                  <button className="btn-accent w-full text-lg py-4">Large Accent</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Form Elements</h2>
          
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Fields */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Input Fields</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Text Input</label>
                    <input type="text" className="input-field" placeholder="Enter text here..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Email Input</label>
                    <input type="email" className="input-field" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Textarea</label>
                    <textarea rows={4} className="input-field" placeholder="Enter longer text here..."></textarea>
                  </div>
                </div>
              </div>

              {/* Select & Checkbox */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Select & Checkbox</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Select Dropdown</label>
                    <select className="input-field">
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">Checkboxes</label>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                      <span className="text-secondary-700">Checkbox 1</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                      <span className="text-secondary-700">Checkbox 2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Badge Components</h2>
          
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Status Badges */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Status Badges</h3>
                <div className="space-y-3">
                  <span className="badge-success">Success</span>
                  <span className="badge-warning">Warning</span>
                  <span className="badge-error">Error</span>
                  <span className="badge-primary">Info</span>
                </div>
              </div>

              {/* Category Badges */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Category Badges</h3>
                <div className="space-y-3">
                  <span className="badge-secondary">General</span>
                  <span className="badge-accent">Featured</span>
                  <span className="badge-primary">Breaking</span>
                  <span className="badge-success">Trending</span>
                </div>
              </div>

              {/* Custom Badges */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Custom Badges</h3>
                <div className="space-y-3">
                  <span className="badge" style={{ backgroundColor: '#8b5cf6', color: 'white' }}>Custom</span>
                  <span className="badge" style={{ backgroundColor: '#f59e0b', color: 'white' }}>Premium</span>
                  <span className="badge" style={{ backgroundColor: '#10b981', color: 'white' }}>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Card Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Basic Card</h3>
              <p className="text-secondary-600 mb-4">This is a basic card component with standard padding and styling.</p>
              <button className="btn-primary w-full">Action</button>
            </div>

            {/* Hover Card */}
            <div className="card-hover p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Hover Card</h3>
              <p className="text-secondary-600 mb-4">This card has hover effects with shadow and transform animations.</p>
              <button className="btn-secondary w-full">Action</button>
            </div>

            {/* Glass Card */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Glass Card</h3>
              <p className="text-secondary-600 mb-4">This card uses glass morphism with backdrop blur and transparency.</p>
              <button className="btn-accent w-full">Action</button>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Typography</h2>
          
          <div className="card p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-secondary-900">Heading 1 - Large Title</h1>
                <p className="text-secondary-600 mt-2">Used for main page titles and hero sections</p>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-secondary-900">Heading 2 - Section Title</h2>
                <p className="text-secondary-600 mt-2">Used for major section headings</p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-secondary-900">Heading 3 - Subsection</h3>
                <p className="text-secondary-600 mt-2">Used for subsection headings</p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-secondary-900">Heading 4 - Card Title</h4>
                <p className="text-secondary-600 mt-2">Used for card and component titles</p>
              </div>
              
              <div>
                <p className="text-lg text-secondary-700 leading-relaxed">
                  This is a large paragraph with relaxed line height. It's used for important content and descriptions that need to be easily readable.
                </p>
              </div>
              
              <div>
                <p className="text-base text-secondary-600 leading-relaxed">
                  This is standard body text with good readability. It's used for most content throughout the application.
                </p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">
                  This is small text used for captions, metadata, and secondary information.
                </p>
              </div>
              
              <div>
                <p className="text-gradient text-2xl font-bold">
                  Gradient Text Example
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Animations</h2>
          
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-2xl mx-auto mb-4 animate-fade-in">
                  <div className="w-full h-full bg-primary-500 rounded-2xl flex items-center justify-center text-white font-bold">
                    Fade In
                  </div>
                </div>
                <p className="text-secondary-700 font-medium">Fade In Animation</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-accent-100 rounded-2xl mx-auto mb-4 animate-slide-up">
                  <div className="w-full h-full bg-accent-500 rounded-2xl flex items-center justify-center text-white font-bold">
                    Slide Up
                  </div>
                </div>
                <p className="text-secondary-700 font-medium">Slide Up Animation</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-success-100 rounded-2xl mx-auto mb-4 animate-scale-in">
                  <div className="w-full h-full bg-success-500 rounded-2xl flex items-center justify-center text-white font-bold">
                    Scale In
                  </div>
                </div>
                <p className="text-secondary-700 font-medium">Scale In Animation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Gradients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-32 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Primary Gradient</span>
            </div>
            
            <div className="h-32 bg-gradient-secondary rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Secondary Gradient</span>
            </div>
            
            <div className="h-32 bg-gradient-accent rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Accent Gradient</span>
            </div>
            
            <div className="h-32 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Custom Gradient</span>
            </div>
            
            <div className="h-32 bg-gradient-to-br from-secondary-400 via-primary-500 to-accent-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Multi-Color</span>
            </div>
            
            <div className="h-32 bg-gradient-radial from-primary-400 to-transparent rounded-2xl flex items-center justify-center">
              <span className="text-secondary-900 font-bold text-lg">Radial Gradient</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
