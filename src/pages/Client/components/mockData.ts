import type{ ClientData, Goal, Provider, SessionEntry } from './types';

export const clientDatabase: Record<string, ClientData> = {
  '1': {
    name: 'Sarah Johnson',
    dob: '01/15/2021',
    age: 4,
    diagnosis: 'Autism Spectrum Disorder',
    parentGuardian: 'Jennifer Johnson',
    qsp: 'emily-anderson',
    clinicalSupervisor: 'emily-anderson',
    planReviewDate: '2025-12-20',
    profile: {
      interests: 'Playing with toy cars, drawing, music',
      strengths: 'Strong visual learner, enjoys sensory activities',
      challenges: 'Difficulty with transitions, sensitive to loud noises',
      familyContext: 'Only child, both parents actively involved',
      preferredActivities: 'Art projects, outdoor play, building blocks',
      sensoryProcessing: 'Seeks vestibular input, sensitive to auditory stimuli, prefers deep pressure',
      communication: 'Uses 2-3 word phrases, communicates needs through gestures and some words, emerging receptive language',
      safetyConsiderations: 'Tendency to run toward doors when excited. Requires close supervision near stairs. No known allergies. May become dysregulated with loud sounds.',
    },
    goals: [
      { id: 1, category: 'FEDC 3', goal: 'Engage in two-way communication with adult', status: 'active', targetDate: '2025-11-30', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
      { id: 2, category: 'FEDC 4', goal: 'Use gestures and words to communicate needs', status: 'active', targetDate: '2025-12-15', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'minimal' },
      { id: 3, category: 'FEDC 6', goal: 'Demonstrate emotional thinking through pretend play', status: 'active', targetDate: '2025-12-20', masteryPercentage: '75', masterySessionCount: '6', supportLevel: 'independent' },
    ]
  },
  '2': {
    name: 'Michael Chen',
    dob: '03/22/2020',
    age: 5,
    diagnosis: 'Autism Spectrum Disorder',
    parentGuardian: 'Lisa Chen',
    qsp: 'james-rodriguez',
    clinicalSupervisor: 'emily-anderson',
    planReviewDate: '2025-11-05',
    profile: {
      interests: 'Building with blocks, trains, dinosaurs',
      strengths: 'Good motor skills, loves structure and routines',
      challenges: 'Difficulty with social reciprocity, prefers solitary play',
      familyContext: 'Has one older sibling, supportive family',
      preferredActivities: 'Structured activities, puzzles, sensory bins',
      sensoryProcessing: 'Prefers predictable sensory input, can be overwhelmed by unexpected sounds',
      communication: 'Uses full sentences, good vocabulary, working on pragmatic language',
      safetyConsiderations: 'No known safety concerns. Follows safety rules well when clearly established.',
    },
    goals: [
      { id: 1, category: 'FEDC 4', goal: 'Use gestures and words to communicate needs', status: 'active', targetDate: '2025-11-01', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'minimal' },
      { id: 2, category: 'FEDC 5', goal: 'Create ideas and use words and symbols', status: 'active', targetDate: '2025-11-05', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
    ]
  },
  '3': {
    name: 'Emma Williams',
    dob: '07/10/2022',
    age: 3,
    diagnosis: 'Developmental Delay',
    parentGuardian: 'Robert Williams',
    qsp: 'emily-anderson',
    clinicalSupervisor: 'james-rodriguez',
    planReviewDate: '2026-01-15',
    profile: {
      interests: 'Songs, bubbles, peek-a-boo games',
      strengths: 'Enjoys social interaction, good eye contact',
      challenges: 'Limited verbal communication, difficulty following multi-step directions',
      familyContext: 'Lives with both parents and grandmother',
      preferredActivities: 'Music activities, simple games, water play',
      sensoryProcessing: 'Enjoys tactile exploration, seeks movement activities',
      communication: 'Pre-verbal, uses gestures and vocalizations, emerging sign language',
      safetyConsiderations: 'Puts non-food items in mouth frequently - requires close monitoring with small objects. Enjoys climbing and needs supervision on elevated surfaces.',
    },
    goals: [
      { id: 1, category: 'FEDC 2', goal: 'Maintain engagement for 5+ minutes', status: 'active', targetDate: '2025-12-01', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'minimal' },
      { id: 2, category: 'FEDC 3', goal: 'Engage in two-way communication with adult', status: 'active', targetDate: '2026-01-10', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
      { id: 3, category: 'FEDC 4', goal: 'Use gestures and words to communicate needs', status: 'active', targetDate: '2026-01-15', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'minimal' },
    ]
  },
  '4': {
    name: 'Lucas Martinez',
    dob: '11/05/2019',
    age: 6,
    diagnosis: 'Autism Spectrum Disorder',
    parentGuardian: 'Maria Martinez',
    qsp: 'lisa-chen',
    clinicalSupervisor: 'james-rodriguez',
    planReviewDate: '2025-11-25',
    profile: {
      interests: 'Cars, animals, video content',
      strengths: 'Strong visual memory, excellent pattern recognition',
      challenges: 'Rigidity with routines, difficulty with emotional regulation',
      familyContext: 'Only child, both parents work from home',
      preferredActivities: 'Computer activities, animal videos, cause-and-effect toys',
      sensoryProcessing: 'Sensitive to textures, seeks visual stimulation, avoids loud environments',
      communication: 'Speaks in full sentences, echolalia present, working on conversational skills',
      safetyConsiderations: 'May bolt when frustrated or overwhelmed. Requires quiet space available for regulation. No food allergies.',
    },
    goals: [
      { id: 1, category: 'FEDC 5', goal: 'Create ideas and use words and symbols', status: 'active', targetDate: '2025-11-20', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
      { id: 2, category: 'FEDC 7', goal: 'Build logical bridges between ideas', status: 'active', targetDate: '2025-11-25', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'minimal' },
    ]
  }
};

export const providersList: Provider[] = [
  { id: 'emily-anderson', name: 'Dr. Emily Anderson', credential: 'PhD, DIR® Expert' },
  { id: 'james-rodriguez', name: 'James Rodriguez', credential: 'MSW, LGSW DIR® Advanced' },
  { id: 'lisa-chen', name: 'Lisa Chen', credential: 'BSW DIR® Basic' },
];

export const mockGoalBank: Goal[] = [
  { id: 101, category: 'FEDC 5', goal: 'Create ideas and use words and symbols', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
  { id: 102, category: 'FEDC 7', goal: 'Build logical bridges between ideas', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'minimal' },
  { id: 103, category: 'FEDC 8', goal: 'Demonstrate gray area thinking', masteryPercentage: '75', masterySessionCount: '6', supportLevel: 'independent' },
  { id: 104, category: 'FEDC 1', goal: 'Shared attention and regulation for 3+ minutes', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
  { id: 105, category: 'FEDC 2', goal: 'Maintain engagement for 5+ minutes', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'minimal' },
  { id: 106, category: 'FEDC 9', goal: 'Demonstrate reflective thinking about experiences', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'independent' },
];

export const mockArchivedGoals: Goal[] = [
  { 
    id: 201, 
    category: 'FEDC 3', 
    goal: 'Engage in two-way communication with adult', 
    masteryPercentage: '80', 
    masterySessionCount: '5', 
    supportLevel: 'independent',
    status: 'mastered',
    archivedDate: '09/15/2024',
    finalSuccessRate: '92%'
  },
  { 
    id: 202, 
    category: 'FEDC 4', 
    goal: 'Use gestures and words to communicate needs', 
    masteryPercentage: '85', 
    masterySessionCount: '4', 
    supportLevel: 'minimal',
    status: 'mastered',
    archivedDate: '08/22/2024',
    finalSuccessRate: '88%'
  },
  { 
    id: 203, 
    category: 'FEDC 6', 
    goal: 'Demonstrate emotional thinking through pretend play', 
    masteryPercentage: '75', 
    masterySessionCount: '6', 
    supportLevel: 'independent',
    status: 'discontinued',
    archivedDate: '07/10/2024',
    reason: 'Goal modified and replaced with updated version'
  },
];

export const mockSessions: SessionEntry[] = [
  { 
    date: 'Oct 15, 2025',
    startTime: '10:00 AM',
    endTime: '10:45 AM',
    duration: '45 min', 
    provider: 'Dr. Anderson',
    providerId: '1',
    status: 'Complete',
    goals: 'FEDC 3, FEDC 4, FEDC 6',
    summary: 'Great engagement today with pretend play scenarios...',
    isAIGenerated: true,
    attendees: { parent: true, sibling: false, peer: false, therapist: false },
    clientVariables: 'Client was well-rested and alert. Good appetite noted before session.',
    fedcObserved: ['FEDC 3', 'FEDC 4', 'FEDC 6'],
    activitiesEngaged: ['Pretend Play - Kitchen', 'Building Blocks', 'Story Time'],
    supportsObserved: ['Affect Attunement', 'Following Child\'s Lead', 'Expanding Circles of Communication'],
    sessionNotes: 'Sarah was highly engaged throughout the session and demonstrated excellent capacity for pretend play. She initiated multiple play scenarios including cooking and caring for dolls. Two-way communication circles extended to 8-10 exchanges with good affect sharing.',
    goalStates: {
      1: { 
        name: 'Engage in two-way communication with adult',
        successfulOpportunities: 18, 
        missedOpportunities: 2,
        supportLevelCounts: { independent: 12, minimalSupport: 6, moderateSupport: 2 }
      },
      2: { 
        name: 'Use gestures and words to communicate needs',
        successfulOpportunities: 15, 
        missedOpportunities: 3,
        supportLevelCounts: { independent: 10, minimalSupport: 5, moderateSupport: 3 }
      },
      3: { 
        name: 'Demonstrate emotional thinking through pretend play',
        successfulOpportunities: 12, 
        missedOpportunities: 3,
        supportLevelCounts: { independent: 8, minimalSupport: 4, moderateSupport: 3 }
      }
    },
    treatmentChanges: 'No changes to diagnosis or treatment plan at this time.',
    recommendations: [
      'Continue DIRFloortime approach with emphasis on expanding two-way communication circles',
      'Maintain focus on affect attunement and following child\'s lead to support developmental progression',
      'Monitor progress on current ITP goals; assess for goal advancement if mastery criteria are met'
    ]
  },
  { 
    date: 'Oct 12, 2025',
    startTime: '2:00 PM',
    endTime: '2:50 PM',
    duration: '50 min', 
    provider: 'Dr. Anderson',
    providerId: '1',
    status: 'Complete',
    goals: 'FEDC 3, FEDC 4, FEDC 6',
    summary: 'Continued work on two-way communication...',
    isAIGenerated: true,
    attendees: { parent: true, sibling: true, peer: false, therapist: false },
    clientVariables: 'Mild congestion noted but did not impact engagement.',
    fedcObserved: ['FEDC 3', 'FEDC 4', 'FEDC 5', 'FEDC 6'],
    activitiesEngaged: ['Sensory Play - Sand', 'Music and Movement', 'Interactive Reading'],
    supportsObserved: ['Visual Supports', 'Modeling', 'Positive Reinforcement'],
    sessionNotes: 'Good session with focus on gestural and verbal communication. Sarah demonstrated improved ability to express needs using both gestures and approximations. Sibling participated which provided natural peer interaction opportunities.',
    goalStates: {
      1: { 
        name: 'Engage in two-way communication with adult',
        successfulOpportunities: 20, 
        missedOpportunities: 5,
        supportLevelCounts: { independent: 14, minimalSupport: 6, moderateSupport: 5 }
      },
      2: { 
        name: 'Use gestures and words to communicate needs',
        successfulOpportunities: 16, 
        missedOpportunities: 4,
        supportLevelCounts: { independent: 11, minimalSupport: 5, moderateSupport: 4 }
      },
      3: { 
        name: 'Demonstrate emotional thinking through pretend play',
        successfulOpportunities: 10, 
        missedOpportunities: 5,
        supportLevelCounts: { independent: 6, minimalSupport: 4, moderateSupport: 5 }
      }
    },
    treatmentChanges: 'No changes to diagnosis or treatment plan at this time.',
    recommendations: [
      'Continue current intervention strategies',
      'Encourage parent involvement in home-based activities',
      'Next session scheduled as per treatment plan'
    ]
  },
  { 
    date: 'Oct 10, 2025', 
    duration: '45 min', 
    provider: 'J. Rodriguez',
    providerId: '2',
    status: 'Complete',
    goals: 'FEDC 3, FEDC 4',
    summary: 'Session focused on gestural communication. Sarah showed good progress with using pointing and reaching to indicate preferences. Worked on expanding communication beyond basic needs.',
    isAIGenerated: false
  },
  { 
    date: 'Oct 8, 2025', 
    duration: '45 min', 
    provider: 'Dr. Anderson',
    providerId: '1',
    status: 'Complete',
    goals: 'FEDC 3, FEDC 6',
    summary: 'Building on emotional thinking through play. Sarah engaged in doll play and showed emerging capacity for symbolic representation. Good affect sharing during interactive games.',
    isAIGenerated: false
  },
  { 
    date: 'Oct 5, 2025', 
    duration: '50 min', 
    provider: 'L. Chen',
    providerId: '3',
    status: 'Complete',
    goals: 'FEDC 4, FEDC 6',
    summary: 'Good progress with expressive communication. Sarah used vocalizations paired with gestures to request preferred items. Demonstrated understanding of simple directions with visual cues.',
    isAIGenerated: false
  },
];

