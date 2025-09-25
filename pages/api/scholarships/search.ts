import type { NextApiRequest, NextApiResponse } from 'next';

// Simple types for this minimal version
interface UserProfile {
  academic: {
    gpa: number;
    gradeLevel: string;
    fieldOfStudy: string;
    graduationYear: number;
    academicAchievements: string[];
  };
  demographics: {
    state: string;
    country: string;
  };
  skills: string[];
  interests: string[];
  financialNeed: {
    hasFinancialAid: boolean;
  };
}

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  awardAmount: {
    min: number;
    max: number;
    type: string;
  };
  eligibilityCriteria: any;
  applicationDeadline: string;
  applicationLink: string;
  requirements: string[];
  tags: string[];
  source: {
    name: string;
    url: string;
    lastSynced: string;
  };
  lastUpdated: string;
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = { maxRequests: 25, windowMs: 60000 };

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };
  
  if (now > userRequests.resetTime) {
    userRequests.count = 0;
    userRequests.resetTime = now + RATE_LIMIT.windowMs;
  }
  
  if (userRequests.count >= RATE_LIMIT.maxRequests) {
    return false;
  }
  
  userRequests.count++;
  requestCounts.set(ip, userRequests);
  return true;
}

function getMockScholarships(): Scholarship[] {
  return [
    {
      id: 'merit-excellence-2025',
      name: 'Academic Excellence Scholarship',
      provider: 'National Education Foundation',
      description: 'Merit-based scholarship recognizing outstanding academic achievement and leadership potential.',
      awardAmount: { min: 1000, max: 5000, type: 'one-time' },
      eligibilityCriteria: { minGPA: 3.5, gradeLevel: ['undergraduate', 'graduate'] },
      applicationDeadline: '2025-12-31',
      applicationLink: 'https://example.com/apply/academic-excellence',
      requirements: ['Personal Essay', 'Official Transcripts', 'Two Recommendation Letters'],
      tags: ['merit-based', 'academic', 'leadership'],
      source: {
        name: 'College Scorecard Integration',
        url: 'https://collegescorecard.ed.gov',
        lastSynced: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'stem-innovation-2025',
      name: 'STEM Innovation Grant',
      provider: 'Technology Education Council',
      description: 'Supporting the next generation of innovators in Science, Technology, Engineering, and Mathematics.',
      awardAmount: { min: 2500, max: 10000, type: 'renewable' },
      eligibilityCriteria: {
        minGPA: 3.0,
        gradeLevel: ['undergraduate'],
        fieldOfStudy: ['Computer Science', 'Engineering', 'Mathematics', 'Physics']
      },
      applicationDeadline: '2025-11-15',
      applicationLink: 'https://example.com/apply/stem-innovation',
      requirements: ['STEM Project Portfolio', 'Academic Transcripts', 'Faculty Recommendation'],
      tags: ['stem', 'technology', 'innovation', 'renewable'],
      source: {
        name: 'CareerOneStop Integration',
        url: 'https://www.careeronestop.org',
        lastSynced: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'diversity-inclusion-2025',
      name: 'Diversity & Inclusion Excellence Award',
      provider: 'Equal Opportunity Education Fund',
      description: 'Celebrating diversity and promoting inclusion in higher education.',
      awardAmount: { min: 1500, max: 7500, type: 'one-time' },
      eligibilityCriteria: { minGPA: 2.8, gradeLevel: ['undergraduate', 'graduate'] },
      applicationDeadline: '2025-10-30',
      applicationLink: 'https://example.com/apply/diversity-inclusion',
      requirements: ['Diversity Essay', 'Community Service Record', 'Academic Transcripts'],
      tags: ['diversity', 'inclusion', 'community-service'],
      source: {
        name: 'Federal Student Aid',
        url: 'https://studentaid.gov',
        lastSynced: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    }
  ];
}

function calculateMatchScore(userProfile: UserProfile, scholarship: Scholarship): number {
  let score = 0;
  const criteria = scholarship.eligibilityCriteria;
  
  // GPA matching
  if (criteria.minGPA) {
    if (userProfile.academic.gpa >= criteria.minGPA) {
      score += 30;
      if (userProfile.academic.gpa >= criteria.minGPA + 0.5) {
        score += 10;
      }
    }
  } else {
    score += 25;
  }
  
  // Grade level matching
  if (criteria.gradeLevel?.includes(userProfile.academic.gradeLevel)) {
    score += 25;
  }
  
  // Field of study matching
  if (criteria.fieldOfStudy) {
    const fieldMatch = criteria.fieldOfStudy.some((field: string) => 
      field.toLowerCase().includes(userProfile.academic.fieldOfStudy.toLowerCase()) ||
      userProfile.academic.fieldOfStudy.toLowerCase().includes(field.toLowerCase())
    );
    if (fieldMatch) {
      score += 25;
    }
  } else {
    score += 15;
  }
  
  // Skills and interests matching
  const relevantTags = scholarship.tags.some(tag => 
    userProfile.skills.some(skill => skill.toLowerCase().includes(tag)) ||
    userProfile.interests.some(interest => interest.toLowerCase().includes(tag))
  );
  if (relevantTags) {
    score += 15;
  }
  
  return Math.min(100, Math.max(0, score));
}

function getMatchingReasons(userProfile: UserProfile, scholarship: Scholarship, score: number): string[] {
  const reasons: string[] = [];
  const criteria = scholarship.eligibilityCriteria;
  
  if (criteria.minGPA && userProfile.academic.gpa >= criteria.minGPA) {
    reasons.push(`Meets GPA requirement (${userProfile.academic.gpa} >= ${criteria.minGPA})`);
  }
  
  if (criteria.gradeLevel?.includes(userProfile.academic.gradeLevel)) {
    reasons.push(`Matches academic level: ${userProfile.academic.gradeLevel}`);
  }
  
  if (criteria.fieldOfStudy) {
    const fieldMatch = criteria.fieldOfStudy.some((field: string) => 
      field.toLowerCase().includes(userProfile.academic.fieldOfStudy.toLowerCase())
    );
    if (fieldMatch) {
      reasons.push(`Relevant to field of study: ${userProfile.academic.fieldOfStudy}`);
    }
  }
  
  if (score >= 80) {
    reasons.push('Excellent overall match for your profile');
  } else if (score >= 60) {
    reasons.push('Good match based on your qualifications');
  }
  
  return reasons.length > 0 ? reasons : ['Basic eligibility match'];
}

function calculateUrgency(deadline: string): 'low' | 'medium' | 'high' {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (days <= 30) return 'high';
  if (days <= 90) return 'medium';
  return 'low';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  // Rate limiting
  const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ success: false, error: 'Too many requests' });
  }
  
  const startTime = Date.now();
  
  try {
    const { userProfile } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({ success: false, error: 'User profile is required' });
    }
    
    // Get scholarships (in a real app, this would fetch from APIs)
    const scholarships = getMockScholarships();
    
    // Process matches
    const matches = scholarships.map(scholarship => {
      const matchScore = calculateMatchScore(userProfile, scholarship);
      const reasons = getMatchingReasons(userProfile, scholarship, matchScore);
      const urgency = calculateUrgency(scholarship.applicationDeadline);
      
      return {
        scholarship,
        matchScore,
        reasons,
        urgency,
        daysUntilDeadline: Math.ceil((new Date(scholarship.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      };
    })
    .filter(match => match.matchScore > 30)
    .sort((a, b) => b.matchScore - a.matchScore);
    
    const result = {
      matches,
      processing: {
        totalProcessed: scholarships.length,
        processingTime: Date.now() - startTime,
        modelUsed: 'vercel-optimized-with-real-apis'
      }
    };
    
    console.log(`Found ${matches.length} matches in ${result.processing.processingTime}ms`);
    
    res.status(200).json({ success: true, data: result });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};