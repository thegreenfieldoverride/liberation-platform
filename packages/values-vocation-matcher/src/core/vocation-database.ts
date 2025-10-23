/**
 * Vocation Database - Comprehensive catalog of liberation-focused career paths
 * Matches authentic work options with user values and circumstances
 * 
 * LIBERATION LICENSE: This code is designed for individual freedom,
 * not corporate optimization. Corporate use violates human dignity.
 */

import type { VocationOption, CoreValue, WorkArrangement, VocationCategory } from '@greenfieldoverride/types';

/**
 * Comprehensive database of vocation options optimized for freedom and values alignment
 * Each option includes values mapping, reality checks, and liberation potential
 */
export const VOCATION_DATABASE: VocationOption[] = [
  // Technology - Liberation-friendly tech roles
  {
    id: 'software_developer_freelance',
    title: 'Freelance Software Developer',
    category: 'technology',
    description: 'Build software solutions as an independent contractor with full autonomy over projects and schedule.',
    primaryValues: ['autonomy', 'creativity', 'challenge', 'mastery'],
    secondaryValues: ['growth', 'variety', 'balance'],
    conflictingValues: ['security', 'connection'],
    arrangements: ['freelancer', 'contractor', 'digital_nomad', 'remote_employee'],
    skillsRequired: ['Programming languages', 'Software architecture', 'Problem-solving', 'Client communication'],
    pathways: [
      {
        name: 'Skill Building Path',
        description: 'Master programming fundamentals and build portfolio',
        timeframe: '6-12 months',
        difficulty: 'beginner',
        steps: [
          'Learn a high-demand programming language (Python, JavaScript, Go)',
          'Build 3-5 portfolio projects showcasing different skills',
          'Contribute to open source projects',
          'Create professional online presence (GitHub, portfolio site)',
          'Start with small freelance projects to build reputation'
        ]
      },
      {
        name: 'Corporate Escape Path',
        description: 'Transition from employed developer to freelance',
        timeframe: '3-6 months',
        difficulty: 'intermediate',
        steps: [
          'Build freelance client base while employed',
          'Save 6-month emergency fund',
          'Establish business processes and contracts',
          'Make transition when freelance income reaches 75% of salary',
          'Scale to premium pricing and ideal clients'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$60-150/hour ($75k-300k annually)',
      timeToViability: '6-18 months',
      difficultyLevel: 6,
      marketDemand: 'high',
      growthPotential: 'growing'
    },
    liberationPotential: {
      autonomyLevel: 9,
      flexibilityLevel: 10,
      incomeStability: 6,
      growthCeiling: 9,
      timeToFreedom: '1-2 years'
    }
  },

  {
    id: 'ux_designer_consultant',
    title: 'UX Design Consultant',
    category: 'technology',
    description: 'Create user-centered design solutions for apps and websites as an independent consultant.',
    primaryValues: ['creativity', 'impact', 'challenge', 'autonomy'],
    secondaryValues: ['growth', 'variety', 'recognition'],
    conflictingValues: ['security', 'variety'],
    arrangements: ['consultant', 'freelancer', 'contractor', 'remote_employee'],
    skillsRequired: ['User research', 'Design thinking', 'Prototyping tools', 'Visual design', 'Client presentation'],
    pathways: [
      {
        name: 'Design Foundation Path',
        description: 'Build UX skills from scratch',
        timeframe: '9-15 months',
        difficulty: 'beginner',
        steps: [
          'Complete UX design certification or bootcamp',
          'Master design tools (Figma, Adobe Creative Suite)',
          'Create 3-4 case studies for portfolio',
          'Network with local startups and agencies',
          'Start with pro bono work to build experience'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$75-200/hour ($90k-250k annually)',
      timeToViability: '12-24 months',
      difficultyLevel: 7,
      marketDemand: 'high',
      growthPotential: 'growing'
    },
    liberationPotential: {
      autonomyLevel: 8,
      flexibilityLevel: 9,
      incomeStability: 7,
      growthCeiling: 8,
      timeToFreedom: '1-3 years'
    }
  },

  // Creative Arts - Authentic expression paths
  {
    id: 'content_creator',
    title: 'Content Creator & Educator',
    category: 'creative_arts',
    description: 'Build audience and monetize expertise through courses, coaching, and content across multiple platforms.',
    primaryValues: ['creativity', 'autonomy', 'impact', 'authenticity'],
    secondaryValues: ['growth', 'variety', 'recognition'],
    conflictingValues: ['security'],
    arrangements: ['solopreneur', 'digital_nomad', 'portfolio_career'],
    skillsRequired: ['Content creation', 'Video editing', 'Audience building', 'Marketing', 'Teaching'],
    pathways: [
      {
        name: 'Audience Building Path',
        description: 'Build audience while maintaining current income',
        timeframe: '12-24 months',
        difficulty: 'intermediate',
        steps: [
          'Choose content niche based on expertise and passion',
          'Create consistent content schedule (daily/weekly)',
          'Build email list and social media following',
          'Create first digital product or course',
          'Scale to multiple income streams'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$30k-500k+ annually (highly variable)',
      timeToViability: '18-36 months',
      difficultyLevel: 8,
      marketDemand: 'moderate',
      growthPotential: 'exploding'
    },
    liberationPotential: {
      autonomyLevel: 10,
      flexibilityLevel: 10,
      incomeStability: 4,
      growthCeiling: 10,
      timeToFreedom: '2-4 years'
    }
  },

  {
    id: 'freelance_writer',
    title: 'Freelance Writer & Copywriter',
    category: 'creative_arts',
    description: 'Create compelling content, marketing copy, and editorial pieces for businesses and publications.',
    primaryValues: ['creativity', 'autonomy', 'variety', 'balance'],
    secondaryValues: ['mastery', 'impact', 'variety'],
    conflictingValues: ['security', 'security'],
    arrangements: ['freelancer', 'contractor', 'digital_nomad', 'remote_employee'],
    skillsRequired: ['Writing', 'Research', 'Marketing psychology', 'SEO', 'Client management'],
    pathways: [
      {
        name: 'Portfolio Building Path',
        description: 'Build writing portfolio and client base',
        timeframe: '6-12 months',
        difficulty: 'beginner',
        steps: [
          'Identify writing niche (B2B, health, finance, etc.)',
          'Create portfolio with 5-8 strong samples',
          'Join freelance platforms and pitch consistently',
          'Build relationships with content agencies',
          'Transition to direct clients and premium rates'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$25-100/hour ($40k-120k annually)',
      timeToViability: '6-12 months',
      difficultyLevel: 5,
      marketDemand: 'high',
      growthPotential: 'stable'
    },
    liberationPotential: {
      autonomyLevel: 8,
      flexibilityLevel: 9,
      incomeStability: 6,
      growthCeiling: 7,
      timeToFreedom: '1-2 years'
    }
  },

  // Consulting - Expertise monetization
  {
    id: 'business_consultant',
    title: 'Independent Business Consultant',
    category: 'consulting',
    description: 'Provide strategic advice and solutions to businesses based on your industry expertise.',
    primaryValues: ['challenge', 'impact', 'autonomy', 'recognition'],
    secondaryValues: ['mastery', 'variety', 'growth'],
    conflictingValues: ['security', 'variety'],
    arrangements: ['consultant', 'contractor', 'portfolio_career'],
    skillsRequired: ['Industry expertise', 'Problem-solving', 'Presentation skills', 'Business analysis', 'Networking'],
    pathways: [
      {
        name: 'Expertise Monetization Path',
        description: 'Leverage existing corporate experience',
        timeframe: '3-9 months',
        difficulty: 'intermediate',
        steps: [
          'Identify unique expertise and market demand',
          'Create consulting framework and methodologies',
          'Build professional brand and thought leadership',
          'Network with former colleagues and industry contacts',
          'Start with project work while maintaining employment'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$100-500/hour ($150k-400k annually)',
      timeToViability: '6-18 months',
      difficultyLevel: 7,
      marketDemand: 'moderate',
      growthPotential: 'stable'
    },
    liberationPotential: {
      autonomyLevel: 9,
      flexibilityLevel: 8,
      incomeStability: 7,
      growthCeiling: 9,
      timeToFreedom: '1-2 years'
    }
  },

  // Social Impact - Mission-driven work
  {
    id: 'social_entrepreneur',
    title: 'Social Entrepreneur',
    category: 'social_impact',
    description: 'Create businesses or organizations that solve social problems while generating sustainable income.',
    primaryValues: ['impact', 'authenticity', 'service', 'challenge'],
    secondaryValues: ['creativity', 'leadership', 'growth'],
    conflictingValues: ['security', 'security'],
    arrangements: ['entrepreneur', 'co_founder', 'solopreneur'],
    skillsRequired: ['Business development', 'Social impact measurement', 'Fundraising', 'Leadership', 'Partnership building'],
    pathways: [
      {
        name: 'Mission-First Path',
        description: 'Start with social mission and build sustainable model',
        timeframe: '18-36 months',
        difficulty: 'advanced',
        steps: [
          'Identify social problem you\'re passionate about solving',
          'Research existing solutions and gaps',
          'Develop minimal viable solution or pilot program',
          'Build partnerships with relevant organizations',
          'Scale impact while ensuring financial sustainability'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$30k-150k annually (varies widely)',
      timeToViability: '24-48 months',
      difficultyLevel: 9,
      marketDemand: 'moderate',
      growthPotential: 'growing'
    },
    liberationPotential: {
      autonomyLevel: 10,
      flexibilityLevel: 7,
      incomeStability: 4,
      growthCeiling: 8,
      timeToFreedom: '3-5 years'
    }
  },

  // Coaching - Human development
  {
    id: 'life_coach',
    title: 'Life & Career Coach',
    category: 'coaching',
    description: 'Help individuals navigate major life transitions, career changes, and personal development.',
    primaryValues: ['service', 'impact', 'connection', 'authenticity'],
    secondaryValues: ['growth', 'variety', 'balance'],
    conflictingValues: ['challenge', 'mastery'],
    arrangements: ['solopreneur', 'contractor', 'part_time_multi'],
    skillsRequired: ['Active listening', 'Coaching techniques', 'Psychology basics', 'Business development', 'Online presence'],
    pathways: [
      {
        name: 'Certification Path',
        description: 'Get certified and build practice',
        timeframe: '9-18 months',
        difficulty: 'intermediate',
        steps: [
          'Complete accredited coaching certification program',
          'Practice with pro bono clients to build skills',
          'Develop coaching niche and methodology',
          'Build online presence and marketing system',
          'Scale to full practice with premium pricing'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$50-200/hour ($50k-150k annually)',
      timeToViability: '12-24 months',
      difficultyLevel: 6,
      marketDemand: 'moderate',
      growthPotential: 'growing'
    },
    liberationPotential: {
      autonomyLevel: 9,
      flexibilityLevel: 9,
      incomeStability: 6,
      growthCeiling: 7,
      timeToFreedom: '1-3 years'
    }
  },

  // Trades - Practical skills
  {
    id: 'craftsperson',
    title: 'Independent Craftsperson/Artisan',
    category: 'trades',
    description: 'Create handmade products or provide skilled services like woodworking, jewelry, or home renovation.',
    primaryValues: ['mastery', 'creativity', 'authenticity', 'balance'],
    secondaryValues: ['variety', 'challenge', 'autonomy'],
    conflictingValues: ['security', 'growth'],
    arrangements: ['solopreneur', 'contractor', 'seasonal_work'],
    skillsRequired: ['Craft-specific skills', 'Quality control', 'Customer service', 'Basic business', 'Marketing'],
    pathways: [
      {
        name: 'Skill Mastery Path',
        description: 'Develop craft skills and build customer base',
        timeframe: '12-36 months',
        difficulty: 'intermediate',
        steps: [
          'Master fundamental techniques through practice/apprenticeship',
          'Create initial product line or service offerings',
          'Build local customer base through markets/referrals',
          'Develop online presence for broader reach',
          'Scale through teaching, custom work, or premium products'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$30k-80k annually',
      timeToViability: '18-36 months',
      difficultyLevel: 6,
      marketDemand: 'moderate',
      growthPotential: 'stable'
    },
    liberationPotential: {
      autonomyLevel: 8,
      flexibilityLevel: 7,
      incomeStability: 5,
      growthCeiling: 6,
      timeToFreedom: '2-4 years'
    }
  },

  // Healthcare - Service with autonomy
  {
    id: 'health_practitioner',
    title: 'Independent Health Practitioner',
    category: 'healthcare',
    description: 'Provide health and wellness services like massage therapy, nutrition counseling, or alternative healing.',
    primaryValues: ['service', 'impact', 'balance', 'authenticity'],
    secondaryValues: ['connection', 'mastery', 'growth'],
    conflictingValues: ['challenge', 'variety'],
    arrangements: ['solopreneur', 'contractor', 'part_time_multi'],
    skillsRequired: ['Health/wellness certification', 'Client care', 'Business basics', 'Continuing education', 'Professional networking'],
    pathways: [
      {
        name: 'Certification Path',
        description: 'Get licensed and build practice',
        timeframe: '12-24 months',
        difficulty: 'intermediate',
        steps: [
          'Complete required certification/licensing program',
          'Gain supervised practice experience',
          'Set up legal business structure and insurance',
          'Build initial client base through referrals',
          'Develop specialization and premium services'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$40-120/hour ($45k-100k annually)',
      timeToViability: '12-24 months',
      difficultyLevel: 5,
      marketDemand: 'moderate',
      growthPotential: 'growing'
    },
    liberationPotential: {
      autonomyLevel: 7,
      flexibilityLevel: 8,
      incomeStability: 6,
      growthCeiling: 6,
      timeToFreedom: '2-3 years'
    }
  },

  // Real Estate - Relationship-based business
  {
    id: 'real_estate_investor',
    title: 'Real Estate Investor/Wholesaler',
    category: 'real_estate',
    description: 'Buy, renovate, and sell properties or connect buyers with sellers for profit.',
    primaryValues: ['autonomy', 'challenge', 'growth', 'variety'],
    secondaryValues: ['mastery', 'recognition', 'adventure'],
    conflictingValues: ['security', 'service'],
    arrangements: ['entrepreneur', 'solopreneur', 'portfolio_career'],
    skillsRequired: ['Market analysis', 'Negotiation', 'Finance basics', 'Property evaluation', 'Network building'],
    pathways: [
      {
        name: 'Wholesaling Path',
        description: 'Start with low-capital wholesaling',
        timeframe: '6-18 months',
        difficulty: 'intermediate',
        steps: [
          'Learn local real estate market and laws',
          'Build network of investors and contractors',
          'Find first wholesale deal with minimal capital',
          'Reinvest profits into larger deals',
          'Scale to buy-and-hold or fix-and-flip'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$40k-200k+ annually (highly variable)',
      timeToViability: '6-24 months',
      difficultyLevel: 8,
      marketDemand: 'moderate',
      growthPotential: 'stable'
    },
    liberationPotential: {
      autonomyLevel: 9,
      flexibilityLevel: 8,
      incomeStability: 5,
      growthCeiling: 9,
      timeToFreedom: '2-5 years'
    }
  },

  // Digital Marketing - Modern business essential
  {
    id: 'digital_marketing_consultant',
    title: 'Digital Marketing Consultant',
    category: 'business',
    description: 'Help businesses grow through social media, content marketing, SEO, and paid advertising.',
    primaryValues: ['variety', 'challenge', 'growth', 'autonomy'],
    secondaryValues: ['creativity', 'impact', 'recognition'],
    conflictingValues: ['security', 'mastery'],
    arrangements: ['consultant', 'freelancer', 'contractor', 'remote_employee'],
    skillsRequired: ['Digital marketing strategy', 'Analytics', 'Content creation', 'Ad platform management', 'Client communication'],
    pathways: [
      {
        name: 'Specialist Path',
        description: 'Master one channel then expand',
        timeframe: '9-18 months',
        difficulty: 'intermediate',
        steps: [
          'Choose one marketing channel to master (Facebook ads, SEO, etc.)',
          'Get certified and practice on own projects',
          'Offer services to local businesses at low rates',
          'Build case studies and testimonials',
          'Expand to additional channels and premium pricing'
        ]
      }
    ],
    realityCheck: {
      averageIncome: '$50-150/hour ($75k-200k annually)',
      timeToViability: '9-18 months',
      difficultyLevel: 6,
      marketDemand: 'high',
      growthPotential: 'growing'
    },
    liberationPotential: {
      autonomyLevel: 8,
      flexibilityLevel: 9,
      incomeStability: 7,
      growthCeiling: 8,
      timeToFreedom: '1-3 years'
    }
  }
];

/**
 * Get vocations by category
 */
export function getVocationsByCategory(category: VocationCategory): VocationOption[] {
  return VOCATION_DATABASE.filter(vocation => vocation.category === category);
}

/**
 * Get vocations by work arrangement preference
 */
export function getVocationsByArrangement(arrangement: WorkArrangement): VocationOption[] {
  return VOCATION_DATABASE.filter(vocation => 
    vocation.arrangements.includes(arrangement)
  );
}

/**
 * Get all unique categories in the database
 */
export function getAllCategories(): VocationCategory[] {
  const categories = new Set(VOCATION_DATABASE.map(v => v.category));
  return Array.from(categories);
}

/**
 * Get all unique work arrangements in the database
 */
export function getAllWorkArrangements(): WorkArrangement[] {
  const arrangements = new Set(VOCATION_DATABASE.flatMap(v => v.arrangements));
  return Array.from(arrangements);
}