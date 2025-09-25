import { useState } from 'react';
import Head from 'next/head';

export default function HomePage() {
  const [formData, setFormData] = useState({
    gpa: '',
    gradeLevel: 'undergraduate',
    fieldOfStudy: '',
    state: ''
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/scholarships/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            academic: {
              gpa: parseFloat(formData.gpa) || 3.5,
              gradeLevel: formData.gradeLevel,
              fieldOfStudy: formData.fieldOfStudy || 'Computer Science',
              graduationYear: 2026,
              academicAchievements: []
            },
            demographics: {
              state: formData.state || 'California',
              country: 'United States'
            },
            skills: ['JavaScript', 'Python'],
            interests: ['Technology', 'AI'],
            financialNeed: { hasFinancialAid: true }
          }
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>Scholarship Scraper - AI-Powered Scholarship Matching</title>
        <meta name="description" content="Find scholarships that match your profile using AI technology" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Scholarship Scraper
              </h1>
              <p className="text-gray-600">AI-powered scholarship matching with real API data</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!results && !loading && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Perfect Scholarship Match
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Using College Scorecard & CareerOneStop APIs + AI matching
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.1"
                    value={formData.gpa}
                    onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3.5"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level *
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="high-school">High School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Computer Science"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="California"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find Scholarships'}
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Finding Your Perfect Matches
            </h2>
            <p className="text-gray-600">
              Analyzing your profile against scholarships from College Scorecard, CareerOneStop, and other sources...
            </p>
          </div>
        )}

        {results && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Found {results.matches?.length || 0} Scholarship Matches
              </h2>
              <button
                onClick={() => {setResults(null); setError(''); setFormData({gpa: '', gradeLevel: 'undergraduate', fieldOfStudy: '', state: ''})}}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Search
              </button>
            </div>
            
            {results.matches && results.matches.length > 0 ? (
              <div className="space-y-6">
                {results.matches.map((match: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {match.scholarship.name}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {match.matchScore}% Match
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{match.scholarship.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Provider:</span>
                        <p className="text-gray-900">{match.scholarship.provider}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Award Amount:</span>
                        <p className="text-gray-900">
                          ${match.scholarship.awardAmount.min.toLocaleString()} - ${match.scholarship.awardAmount.max.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Deadline:</span>
                        <p className="text-gray-900">{new Date(match.scholarship.applicationDeadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {match.reasons && match.reasons.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500">Why this matches:</span>
                        <ul className="list-disc list-inside text-gray-700 mt-1">
                          {match.reasons.map((reason: string, i: number) => (
                            <li key={i} className="text-sm">{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <a
                      href={match.scholarship.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">
                No scholarships found. Please try adjusting your search criteria.
              </p>
            )}
            
            <div className="mt-8 text-center text-sm text-gray-500">
              Processing Time: {results.processing?.processingTime}ms • 
              Model: {results.processing?.modelUsed} • 
              Sources: College Scorecard + CareerOneStop + Mock Data
            </div>
          </div>
        )}
      </main>
    </div>
  );
}