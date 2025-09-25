#!/bin/bash
set -e

echo "🚀 Setting up Scholarship Scraper development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    echo "📋 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your API keys and configuration"
else
    echo "✅ Environment file already exists"
fi

# Check if Docker is available for optional services
if command -v docker &> /dev/null; then
    echo "🐳 Docker detected - you can use docker-compose for full setup"
    
    # Check if user wants to start services
    read -p "Would you like to start PostgreSQL and Ollama with Docker? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🐳 Starting database and AI services..."
        docker-compose up -d postgres redis
        
        # Wait for postgres to be ready
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 10
        
        # Run database migrations
        echo "🗄️  Setting up database..."
        docker-compose exec postgres psql -U postgres -d scholarship_scraper -f /docker-entrypoint-initdb.d/init.sql 2>/dev/null || echo "Database already initialized"
        
        echo "🤖 Starting Ollama (this may take a few minutes)..."
        docker-compose up -d ollama
        
        echo "⏳ Waiting for Ollama to be ready..."
        sleep 30
        
        echo "📥 Pulling Llama 3.1 model (this will take several minutes)..."
        docker-compose exec ollama ollama pull llama3.1
    fi
else
    echo "⚠️  Docker not found - you'll need to set up PostgreSQL and Ollama manually"
fi

# Create logs directory
mkdir -p logs

# Create sample test data
echo "📄 Creating sample data..."
mkdir -p test/fixtures
cat > test/fixtures/sample-profile.json << 'EOF'
{
  "userProfile": {
    "academic": {
      "gpa": 3.7,
      "gradeLevel": "undergraduate",
      "fieldOfStudy": "Computer Science",
      "graduationYear": 2026,
      "academicAchievements": ["Dean's List", "Programming Competition Winner"]
    },
    "demographics": {
      "age": 20,
      "state": "California",
      "country": "United States"
    },
    "skills": ["JavaScript", "Python", "React", "Machine Learning"],
    "interests": ["Artificial Intelligence", "Web Development", "Startups"],
    "financialNeed": {
      "householdIncome": "60k-100k",
      "hasFinancialAid": true
    }
  }
}
EOF

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see the application"
echo ""
echo "Useful commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run test         - Run tests"
echo "  npm run lint         - Run linter"
echo ""
if command -v docker &> /dev/null; then
    echo "Docker commands:"
    echo "  docker-compose up -d     - Start all services"
    echo "  docker-compose down      - Stop all services"
    echo "  docker-compose logs -f   - View logs"
fi
echo ""
echo "📚 Check out the documentation in the docs/ folder for more information!"