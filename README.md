# Scholarship Scraper

A comprehensive scholarship matching platform that connects students with relevant opportunities based on their academic profile and personal information.

## 🎯 Project Overview

This platform uses AI-powered filtering to match students with scholarships from multiple data sources, providing personalized recommendations based on academic achievements, demographics, skills, and financial need.

## 🏗️ Technical Architecture

```
Frontend (Next.js) → API Layer → Data Scrapers → Ollama Processing → Filtered Results
```

## 🚀 Features

### Frontend (Next.js + TypeScript)
- Clean, responsive user interface
- Multi-step form collecting:
  - Academic information (GPA, grade level, field of study)
  - Demographics (optional but helps with targeted scholarships)
  - Skills and interests
  - Financial need indicators
- No authentication required (anonymous usage)
- Real-time validation and user feedback
- Mobile-responsive design

### Backend API
- RESTful API endpoints for data retrieval
- Robust error handling and rate limiting
- Data caching for improved performance
- Input sanitization and validation

### Data Sources Integration
1. **College Scorecard API**: Institutional data and costs
2. **Federal Student Aid**: Government scholarship and grant programs
3. **CareerOneStop Scholarship Finder**: Industry and career-specific opportunities
4. **Additional sources**: Fastweb API, Scholarships.com, state-specific databases

### AI Processing (Ollama + Llama 3.1/3.2)
- Data normalization from multiple sources
- Relevance scoring using AI matching
- Ranking algorithm by relevance and deadlines
- Response filtering for top 10-20 opportunities

## 📦 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes / Node.js + Express
- **AI Processing**: Ollama with Llama 3.1/3.2
- **Database**: PostgreSQL / SQLite for caching
- **Deployment**: Vercel
- **Containerization**: Docker

## 🚦 Development Phases

### Phase 1: Foundation
- [x] Repository setup
- [ ] Basic Next.js frontend with form
- [ ] Single API integration (College Scorecard)
- [ ] Basic data display

### Phase 2: Data Integration
- [ ] Multiple data source integration
- [ ] Ollama setup and basic AI filtering
- [ ] Database setup for caching

### Phase 3: AI Enhancement
- [ ] Advanced AI matching algorithms
- [ ] UI/UX improvements
- [ ] Relevance scoring system

### Phase 4: Optimization
- [ ] Performance optimization
- [ ] Additional features (bookmarks, notifications)
- [ ] Analytics and reporting

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Docker (for Ollama)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/PranavAchar01/scholarship_scraper.git
   cd scholarship_scraper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys and configuration

4. **Set up Ollama (AI Processing)**
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull Llama model
   ollama pull llama3.1
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
scholarship_scraper/
├── src/
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   ├── api/               # API routes
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript definitions
│   └── styles/            # CSS/Tailwind styles
├── public/                # Static assets
├── docs/                  # Documentation
├── docker/                # Docker configurations
└── tests/                 # Test files
```

## 🔑 Environment Variables

```env
# API Keys
COLLEGE_SCORECARD_API_KEY=your_key_here
FEDERAL_AID_API_KEY=your_key_here
CAREERONESTOP_API_KEY=your_key_here

# Database
DATABASE_URL=your_database_url

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all scholarship organizations for making education accessible
- College Scorecard API for institutional data
- Federal Student Aid for government program information
- CareerOneStop for career-specific opportunities

---

**Made with ❤️ to help students find educational opportunities**