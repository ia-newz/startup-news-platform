# Innovations Arena - Startup News Platform

A modern, responsive platform for startup news, funding announcements, and innovation stories. Built with Next.js, React, and Python FastAPI.

## 🌟 Features

- **Latest News**: Real-time startup news and funding updates
- **Trending Stories**: AI-powered content discovery based on engagement
- **Company Directory**: Comprehensive startup database with industry filtering
- **Story Submission**: User-friendly form for submitting startup stories
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Performance Optimized**: Fast loading times and smooth interactions
- **SEO Ready**: Built-in meta tags and Open Graph support

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR and static generation
- **React 18** - Modern React with hooks and concurrent features
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript development

### Backend Services
- **Python FastAPI** - High-performance web framework
- **Supabase** - Open-source Firebase alternative
- **Docker** - Containerized deployment
- **PostgreSQL** - Reliable database

### Infrastructure
- **Render.com** - Cloud hosting platform
- **GitHub Actions** - CI/CD automation
- **Docker Compose** - Local development environment

## 📁 Project Structure

```
startup-news-platform-main/
├── frontend/                 # Next.js frontend application
│   ├── components/          # Reusable React components
│   ├── pages/              # Next.js pages and routing
│   ├── styles/             # Global CSS and Tailwind config
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── services/               # Backend microservices
│   ├── feed/              # News feed and story management
│   ├── cms/               # Content management system
│   └── timeline/          # Timeline and analytics
└── README.md              # Project documentation
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Python 3.8+
- Docker and Docker Compose
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/startup-news-platform.git
   cd startup-news-platform
   ```

2. **Start backend services:**
   ```bash
   cd services
   docker-compose up -d
   ```

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
# Backend Service URLs
NEXT_PUBLIC_FEED_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_CMS_SERVICE_URL=http://localhost:8002
NEXT_PUBLIC_TIMELINE_SERVICE_URL=http://localhost:8001

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 🚀 Production Deployment

### Render.com Deployment

1. **Connect Repository:**
   - Connect your GitHub repository to Render
   - Set build command: `npm run build`
   - Set start command: `npm start`

2. **Environment Variables:**
   - Add production environment variables
   - Set `NODE_ENV=production`

3. **Auto-Deploy:**
   - Enable auto-deploy on push to main branch

### Docker Deployment

1. **Build Image:**
   ```bash
   docker build -t innovations-arena-frontend .
   ```

2. **Run Container:**
   ```bash
   docker run -p 3000:3000 innovations-arena-frontend
   ```

## 📱 Available Pages

- **Home** (`/`) - Latest startup stories with grid/inshorts view
- **Trending** (`/trending`) - Most engaging stories by timeframe
- **Companies** (`/companies`) - Startup directory with search and filters
- **Submit** (`/submit`) - Story submission form
- **Demo** (`/demo`) - Platform features and technology showcase

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#0ea5e9) - Main brand color
- **Secondary**: Slate (#64748b) - Text and UI elements
- **Accent**: Purple (#d946ef) - Highlights and CTAs
- **Success**: Green (#22c55e) - Positive states
- **Warning**: Yellow (#f59e0b) - Caution states
- **Error**: Red (#ef4444) - Error states

### Components
- **Buttons**: Primary, secondary, and accent variants
- **Cards**: Hover effects and glass morphism
- **Forms**: Consistent input styling and validation
- **Navigation**: Responsive header with mobile menu
- **Loading**: Animated spinners and skeleton states

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Utilities
npm run analyze      # Bundle analysis
npm run clean        # Clean build files
```

## 🧪 Testing

The project includes:
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **TypeScript** - Static type checking

Run tests with:
```bash
npm test
```

## 📊 Performance

### Optimizations
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Route-based code splitting
- **CSS Optimization**: Minified and optimized stylesheets
- **Bundle Analysis**: Built-in bundle analyzer
- **Lazy Loading**: Images and components loaded on demand

### Monitoring
- **Core Web Vitals**: Built-in performance metrics
- **Bundle Size**: Automatic size tracking
- **Error Tracking**: Error boundary implementation

## 🔒 Security

### Security Headers
- XSS Protection
- Content Type Sniffing Prevention
- Frame Options Protection
- Permissions Policy
- Secure Referrer Policy

### Best Practices
- Environment variable validation
- Input sanitization
- CORS configuration
- HTTPS enforcement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
- **Build Failures**: Check Node.js version and dependencies
- **Runtime Errors**: Verify environment variables and backend services
- **Performance Issues**: Run bundle analysis and check Core Web Vitals

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Render.com Documentation](https://render.com/docs)

### Contact
- **Issues**: [GitHub Issues](https://github.com/yourusername/startup-news-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/startup-news-platform/discussions)

## 🎯 Roadmap

### Upcoming Features
- [ ] User authentication and profiles
- [ ] Newsletter subscription
- [ ] Advanced search and filtering
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Multi-language support

### Performance Goals
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimization
- [ ] Bundle size reduction
- [ ] Image optimization improvements

---

**Built with ❤️ by the Innovations Arena Team**
