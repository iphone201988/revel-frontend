import React, { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { ArrowLeft, User, Target, Plus, FileText, Calendar, TrendingUp, Download, Eye, Shield, UserCheck, Edit, Lock, CheckCircle2, AlertTriangle, Clock, AlertCircle, X, Search, ChevronDown, Users, Archive } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { Textarea } from '../../components/Textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/Dailog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select';
import { Separator } from '../../components/Seprator';
import { Checkbox } from '../../components/CheckBox';
import { ScrollArea } from '../../components/ScrollArea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/Command';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/PopOver';
// import { Screen } from '../App';
import { toast } from 'react-toastify';
import { ProgressScreen } from '../ProgressScreen';

interface ClientScreenProps {
  clientId: string | null;
  currentUser: any;
  onNavigate: (screen: Screen, clientId?: string) => void;
  onLogout: () => void;
}

// Mock client database
const clientDatabase: Record<string, any> = {
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

const providersList = [
  { id: 'emily-anderson', name: 'Dr. Emily Anderson', credential: 'PhD, DIR® Expert' },
  { id: 'james-rodriguez', name: 'James Rodriguez', credential: 'MSW, LGSW DIR® Advanced' },
  { id: 'lisa-chen', name: 'Lisa Chen', credential: 'BSW DIR® Basic' },
];

const mockGoalBank = [
  { id: 101, category: 'FEDC 5', goal: 'Create ideas and use words and symbols', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
  { id: 102, category: 'FEDC 7', goal: 'Build logical bridges between ideas', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'minimal' },
  { id: 103, category: 'FEDC 8', goal: 'Demonstrate gray area thinking', masteryPercentage: '75', masterySessionCount: '6', supportLevel: 'independent' },
  { id: 104, category: 'FEDC 1', goal: 'Shared attention and regulation for 3+ minutes', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'independent' },
  { id: 105, category: 'FEDC 2', goal: 'Maintain engagement for 5+ minutes', masteryPercentage: '80', masterySessionCount: '5', supportLevel: 'minimal' },
  { id: 106, category: 'FEDC 9', goal: 'Demonstrate reflective thinking about experiences', masteryPercentage: '85', masterySessionCount: '4', supportLevel: 'independent' },
];

// Mock archived goals - goals that have been mastered or discontinued
const mockArchivedGoals = [
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

export function ClientScreen({ clientId, currentUser, onNavigate, onLogout }: ClientScreenProps) {
  const effectiveClientId = clientId || '1';
  const clientData = clientDatabase[effectiveClientId] || clientDatabase['1'];
  
  const [isAddingGoalFromBank, setIsAddingGoalFromBank] = useState(false);
  const [isAddingCustomGoal, setIsAddingCustomGoal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  
  // States for adding goal from bank

  
  // States for custom goal
  const [customGoalCategory, setCustomGoalCategory] = useState('');
  const [customGoalText, setCustomGoalText] = useState('');
  const [customGoalTargetDate, setCustomGoalTargetDate] = useState('');
  const [customBaselineData, setCustomBaselineData] = useState('0');
  const [customMasteryPercentage, setCustomMasteryPercentage] = useState('80');
  const [customMasterySessionCount, setCustomMasterySessionCount] = useState('5');
  const [customSupportLevel, setCustomSupportLevel] = useState('independent');
  
  // States for editing existing goal
  const [editGoalText, setEditGoalText] = useState('');
  const [editGoalCategory, setEditGoalCategory] = useState('');
  const [editGoalTargetDate, setEditGoalTargetDate] = useState('');
  const [editGoalBaseline, setEditGoalBaseline] = useState('0');
  
  // States for modifying criteria
  const [isModifyingCriteria, setIsModifyingCriteria] = useState(false);
  const [modifyingGoalId, setModifyingGoalId] = useState<number | null>(null);
  const [criteriaMasteryPercentage, setCriteriaMasteryPercentage] = useState('80');
  const [criteriaMasterySessionCount, setCriteriaMasterySessionCount] = useState('5');
  const [criteriaSupportLevel, setCriteriaSupportLevel] = useState('independent');
  
  // States for editing notes
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  
  // States for editing full note data
  const [editNoteData, setEditNoteData] = useState<any>(null);
  
  const [clientProfile, setClientProfile] = useState(clientData.profile);
  const [qsp, setQsp] = useState(clientData.qsp || '');
  const [clinicalSupervisor, setClinicalSupervisor] = useState(clientData.clinicalSupervisor || '');
  const [planReviewDate, setPlanReviewDate] = useState(clientData.planReviewDate || '');
  const [assignedProviders, setAssignedProviders] = useState<string[]>(['emily-anderson', 'james-rodriguez']);
  const [providerSearchOpen, setProviderSearchOpen] = useState(false);
  
  // Session search state
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);

  // Get user permissions
  const userPermissions = currentUser?.permissions || {};
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin';
  const canViewAllSessions = isAdmin || userPermissions.viewAllSessions;
  const canViewProgress = isAdmin || userPermissions.viewProgressReports;
  const canEditSignedNotes = isAdmin || userPermissions.editSignedNotes;

  const clientInfo = {
    name: clientData.name,
    dob: clientData.dob,
    age: clientData.age,
    diagnosis: clientData.diagnosis,
    parentGuardian: clientData.parentGuardian,
  };
  
  const mockClientGoals = clientData.goals;

  // Mock session history - would come from database in production
  const allSessions = [
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

  // Filter sessions based on permissions
  const permissionFilteredSessions = canViewAllSessions 
    ? allSessions 
    : allSessions.filter(session => session.providerId === currentUser?.id);
  
  // Filter sessions based on search query
  const visibleSessions = sessionSearchQuery.trim() === ''
    ? permissionFilteredSessions
    : permissionFilteredSessions.filter(session => {
        const searchLower = sessionSearchQuery.toLowerCase();
        // Search through all text fields in the session
        const searchableText = [
          session.date,
          session.startTime,
          session.endTime,
          session.duration,
          session.provider,
          session.status,
          session.goals,
          session.summary,
          session.clientVariables,
          session.sessionNotes,
          session.treatmentChanges,
          ...(session.fedcObserved || []),
          ...(session.activitiesEngaged || []),
          ...(session.supportsObserved || []),
          ...(session.recommendations || []),
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });

  const handleAddGoalFromBank = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Goal added to client chart with baseline data');
    setIsAddingGoalFromBank(false);
    setSelectedBankGoal(null);
    setEditedGoalText('');
    setGoalTargetDate('');
    setBaselineData('0');
  };

  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Custom goal added to client chart');
    setIsAddingCustomGoal(false);
    setCustomGoalCategory('');
    setCustomGoalText('');
    setCustomGoalTargetDate('');
    setCustomBaselineData('0');
    setCustomMasteryPercentage('80');
    setCustomMasterySessionCount('5');
    setCustomSupportLevel('independent');
  };

  const handleEditGoal = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Goal updated successfully');
    setIsEditingGoal(false);
    setEditingGoalId(null);
    setEditGoalText('');
    setEditGoalCategory('');
    setEditGoalTargetDate('');
    setEditGoalBaseline('0');
  };

  const openEditGoal = (goal: any) => {
    setEditingGoalId(goal.id);
    setEditGoalText(goal.goal);
    setEditGoalCategory(goal.category);
    setEditGoalTargetDate(goal.targetDate || '');
    setEditGoalBaseline(goal.baseline || '0');
    setIsEditingGoal(true);
  };

  const addProviderToClient = (providerId: string) => {
    if (!assignedProviders.includes(providerId)) {
      setAssignedProviders(prev => [...prev, providerId]);
      const provider = providersList.find(p => p.id === providerId);
      toast.success(`${provider?.name} added to client's provider team`);
    }
    setProviderSearchOpen(false);
  };

  const removeProviderFromClient = (providerId: string) => {
    setAssignedProviders(prev => prev.filter(id => id !== providerId));
    const provider = providersList.find(p => p.id === providerId);
    toast.success(`${provider?.name} removed from client's provider team`);
  };

  const selectBankGoal = (goal: any) => {
    setSelectedBankGoal(goal);
    setEditedGoalText(goal.goal);
  };

  const openModifyCriteria = (goal: any) => {
    setModifyingGoalId(goal.id);
    setCriteriaMasteryPercentage('80');
    setCriteriaMasterySessionCount('5');
    setCriteriaSupportLevel('independent');
    setIsModifyingCriteria(true);
  };

  const handleModifyCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Goal criteria updated successfully');
    setIsModifyingCriteria(false);
    setModifyingGoalId(null);
  };

  const openEditNote = (sessionIndex: number, session: any) => {
    setEditingNoteIndex(sessionIndex);
    setEditNoteContent(session.summary);
    // Create a deep copy of session data for editing
    setEditNoteData({
      ...session,
      attendees: session.attendees ? { ...session.attendees } : null,
      fedcObserved: session.fedcObserved ? [...session.fedcObserved] : [],
      activitiesEngaged: session.activitiesEngaged ? [...session.activitiesEngaged] : [],
      supportsObserved: session.supportsObserved ? [...session.supportsObserved] : [],
      recommendations: session.recommendations ? [...session.recommendations] : [],
      goalStates: session.goalStates ? JSON.parse(JSON.stringify(session.goalStates)) : null
    });
    setIsEditingNote(true);
  };

  const handleEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Session note updated and will require re-signing');
    setIsEditingNote(false);
    setEditingNoteIndex(null);
    setEditNoteContent('');
    setEditNoteData(null);
  };

  const toggleSessionSelection = (index: number) => {
    setSelectedSessions(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const selectAllFilteredSessions = () => {
    const visibleIndices = visibleSessions.map((_, idx) => idx);
    setSelectedSessions(visibleIndices);
  };

  const deselectAllSessions = () => {
    setSelectedSessions([]);
  };

  const handleBatchDownload = () => {
    if (selectedSessions.length === 0) return;
    
    toast.success(`Preparing to download ${selectedSessions.length} session note${selectedSessions.length !== 1 ? 's' : ''}...`);
    // In production, this would trigger batch PDF downloads
    setTimeout(() => {
      toast.success(`${selectedSessions.length} session note${selectedSessions.length !== 1 ? 's' : ''} downloaded successfully`);
      setSelectedSessions([]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader title="Client Chart" onLogout={onLogout} onNavigate={onNavigate} />
      
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <Button
          onClick={() => onNavigate('/')}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-[#395159] rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-[#303630]">{clientInfo.name}</h2>
            <div className="flex gap-4 text-[#395159]">
              <span>DOB: {clientInfo.dob}</span>
              <span>Age: {clientInfo.age}</span>
              <span>Dx: {clientInfo.diagnosis}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="mb-6 bg-white border border-[#ccc9c0]">
            <TabsTrigger value="goals" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              ITP Goals
            </TabsTrigger>
            {canViewProgress && (
              <TabsTrigger value="progress" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </TabsTrigger>
            )}
            <TabsTrigger value="providers" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Client Profile
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Session History
            </TabsTrigger>
            <TabsTrigger value="archived" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <Archive className="w-4 h-4 mr-2" />
              Archived Goals
            </TabsTrigger>
          </TabsList>


{/* itp goals tab  */}
          <TabsContent value="goals">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#303630]">Current ITP Goals</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onNavigate('goal-review', effectiveClientId)}
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Review & Update Goals
                  </Button>
                  <Dialog open={isAddingGoalFromBank} onOpenChange={setIsAddingGoalFromBank}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#395159] hover:bg-[#303630] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add from Goal Bank
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Goal from Bank</DialogTitle>
                        <DialogDescription>
                          Select a goal from the goal bank to add to this client's treatment plan.
                        </DialogDescription>
                      </DialogHeader>
                      {!selectedBankGoal ? (
                        <div className="space-y-3">
                          <p className="text-[#395159]">Select a goal from the bank to add to this client's chart:</p>
                          {mockGoalBank.map((goal) => (
                            <div
                              key={goal.id}
                              className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] hover:border-[#395159] cursor-pointer transition-all"
                              onClick={() => selectBankGoal(goal)}
                            >
                              <Badge className="bg-[#395159] text-white mb-2">{goal.category}</Badge>
                              <p className="text-[#303630]">{goal.goal}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-[#395159]">
                                <span>Mastery: {goal.masteryPercentage}% across {goal.masterySessionCount} sessions</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <form onSubmit={handleAddGoalFromBank} className="space-y-4">
                          <div className="p-4 bg-[#efefef] rounded-lg border border-[#395159]">
                            <Badge className="bg-[#395159] text-white mb-2">{selectedBankGoal.category}</Badge>
                            <p className="text-sm text-[#395159] mb-2">Original goal from bank:</p>
                            <p className="text-[#303630]">{selectedBankGoal.goal}</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="editedGoalText">Edit Goal (Optional)</Label>
                            <Textarea
                              id="editedGoalText"
                              value={editedGoalText}
                              onChange={(e) => setEditedGoalText(e.target.value)}
                              className="min-h-24"
                              placeholder="You can customize the goal text for this specific client..."
                            />
                            <p className="text-sm text-[#395159]">
                              The goal text can be edited to match this client's specific needs
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="goalTargetDate">Target Date</Label>
                            <Input
                              id="goalTargetDate"
                              type="date"
                              value={goalTargetDate}
                              onChange={(e) => setGoalTargetDate(e.target.value)}
                              className="h-12"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="baselineData">Baseline Percentage</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="baselineData"
                                type="number"
                                min="0"
                                max="100"
                                value={baselineData}
                                onChange={(e) => setBaselineData(e.target.value)}
                                className="h-12"
                                placeholder="0"
                                required
                              />
                              <span className="text-[#395159]">%</span>
                            </div>
                            <p className="text-sm text-[#395159]">
                              Enter the client's current performance percentage for this goal (0-100%)
                            </p>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button type="submit" className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white">
                              Add Goal to Client Chart
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedBankGoal(null);
                                setEditedGoalText('');
                                setGoalTargetDate('');
                                setBaselineData('0');
                              }}
                              className="h-12"
                            >
                              Back to Selection
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isAddingCustomGoal} onOpenChange={setIsAddingCustomGoal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-[#395159] text-[#395159]">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Custom Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Custom Goal</DialogTitle>
                        <DialogDescription>
                          Create a custom goal specifically for this client.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddCustomGoal} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="customGoalCategory">FEDC Category</Label>
                          <Select value={customGoalCategory} onValueChange={setCustomGoalCategory} required>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select FEDC category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FEDC 1">FEDC 1 - Shared Attention & Regulation</SelectItem>
                              <SelectItem value="FEDC 2">FEDC 2 - Engagement & Relating</SelectItem>
                              <SelectItem value="FEDC 3">FEDC 3 - Two-Way Communication</SelectItem>
                              <SelectItem value="FEDC 4">FEDC 4 - Complex Communication</SelectItem>
                              <SelectItem value="FEDC 5">FEDC 5 - Emotional Ideas</SelectItem>
                              <SelectItem value="FEDC 6">FEDC 6 - Emotional Thinking</SelectItem>
                              <SelectItem value="FEDC 7">FEDC 7 - Multi-Causal Thinking</SelectItem>
                              <SelectItem value="FEDC 8">FEDC 8 - Gray Area Thinking</SelectItem>
                              <SelectItem value="FEDC 9">FEDC 9 - Reflective Thinking</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customGoalText">Goal Description</Label>
                          <Textarea
                            id="customGoalText"
                            value={customGoalText}
                            onChange={(e) => setCustomGoalText(e.target.value)}
                            className="min-h-24"
                            placeholder="Enter the custom goal for this client..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customGoalTargetDate">Target Date</Label>
                          <Input
                            id="customGoalTargetDate"
                            type="date"
                            value={customGoalTargetDate}
                            onChange={(e) => setCustomGoalTargetDate(e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>

                        <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] space-y-4">
                          <h4 className="text-[#303630]">Criteria for Mastery</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="customMasteryPercentage">Mastery Percentage</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id="customMasteryPercentage"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={customMasteryPercentage}
                                  onChange={(e) => setCustomMasteryPercentage(e.target.value)}
                                  className="h-12"
                                  required
                                />
                                <span className="text-[#395159]">%</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="customMasterySessionCount">Across Sessions</Label>
                              <Input
                                id="customMasterySessionCount"
                                type="number"
                                min="1"
                                value={customMasterySessionCount}
                                onChange={(e) => setCustomMasterySessionCount(e.target.value)}
                                className="h-12"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="customSupportLevel">Support Level Required for Mastery</Label>
                            <Select value={customSupportLevel} onValueChange={setCustomSupportLevel} required>
                              <SelectTrigger className="h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="independent">Independently</SelectItem>
                                <SelectItem value="minimal">Minimal Support</SelectItem>
                                <SelectItem value="moderate">Moderate Support</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customBaselineData">Baseline Percentage</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="customBaselineData"
                              type="number"
                              min="0"
                              max="100"
                              value={customBaselineData}
                              onChange={(e) => setCustomBaselineData(e.target.value)}
                              className="h-12"
                              placeholder="0"
                              required
                            />
                            <span className="text-[#395159]">%</span>
                          </div>
                          <p className="text-sm text-[#395159]">
                            Enter the client's current performance percentage for this goal (0-100%)
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="submit" className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white">
                            Add Custom Goal
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddingCustomGoal(false)}
                            className="h-12"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-3">
                {mockClientGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[#395159] text-white">{goal.category}</Badge>
                          {goal.targetDate && (
                            <Badge variant="outline" className="border-[#395159] text-[#395159]">
                              <Calendar className="w-3 h-3 mr-1" />
                              Target: {new Date(goal.targetDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[#303630] mb-2">{goal.goal}</p>
                        <div className="flex gap-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-[#395159] text-[#395159]"
                            onClick={() => openEditGoal(goal)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Goal
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-[#395159] text-[#395159]"
                            onClick={() => openModifyCriteria(goal)}
                          >
                            <Target className="w-4 h-4 mr-1" />
                            Modify Criteria
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Goal Dialog */}
              <Dialog open={isEditingGoal} onOpenChange={setIsEditingGoal}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                    <DialogDescription>
                      Modify the goal details and settings.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditGoal} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="editGoalCategory">FEDC Category</Label>
                      <Select value={editGoalCategory} onValueChange={setEditGoalCategory} required>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FEDC 1">FEDC 1 - Shared Attention & Regulation</SelectItem>
                          <SelectItem value="FEDC 2">FEDC 2 - Engagement & Relating</SelectItem>
                          <SelectItem value="FEDC 3">FEDC 3 - Two-Way Communication</SelectItem>
                          <SelectItem value="FEDC 4">FEDC 4 - Complex Communication</SelectItem>
                          <SelectItem value="FEDC 5">FEDC 5 - Emotional Ideas</SelectItem>
                          <SelectItem value="FEDC 6">FEDC 6 - Emotional Thinking</SelectItem>
                          <SelectItem value="FEDC 7">FEDC 7 - Multi-Causal Thinking</SelectItem>
                          <SelectItem value="FEDC 8">FEDC 8 - Gray Area Thinking</SelectItem>
                          <SelectItem value="FEDC 9">FEDC 9 - Reflective Thinking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editGoalText">Goal Description</Label>
                      <Textarea
                        id="editGoalText"
                        value={editGoalText}
                        onChange={(e) => setEditGoalText(e.target.value)}
                        className="min-h-24"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editGoalTargetDate">Target Date</Label>
                      <Input
                        id="editGoalTargetDate"
                        type="date"
                        value={editGoalTargetDate}
                        onChange={(e) => setEditGoalTargetDate(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editGoalBaseline">Baseline Percentage</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="editGoalBaseline"
                          type="number"
                          min="0"
                          max="100"
                          value={editGoalBaseline}
                          onChange={(e) => setEditGoalBaseline(e.target.value)}
                          className="h-12"
                          placeholder="0"
                        />
                        <span className="text-[#395159]">%</span>
                      </div>
                      <p className="text-sm text-[#395159]">
                        Enter the client's baseline performance percentage for this goal (0-100%)
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white">
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditingGoal(false)}
                        className="h-12"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Modify Criteria Dialog */}
              <Dialog open={isModifyingCriteria} onOpenChange={setIsModifyingCriteria}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Modify Goal Mastery Criteria</DialogTitle>
                    <DialogDescription>
                      Update the mastery criteria for this goal.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleModifyCriteria} className="space-y-4">
                    <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                      <p className="text-sm text-[#395159] mb-2">Current Goal:</p>
                      {modifyingGoalId && (
                        <>
                          <Badge className="bg-[#395159] text-white mb-2">
                            {mockClientGoals.find(g => g.id === modifyingGoalId)?.category}
                          </Badge>
                          <p className="text-[#303630]">
                            {mockClientGoals.find(g => g.id === modifyingGoalId)?.goal}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-[#303630] mb-4">Mastery Criteria</h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="criteriaMasteryPercentage">Mastery Percentage</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="criteriaMasteryPercentage"
                              type="number"
                              min="0"
                              max="100"
                              value={criteriaMasteryPercentage}
                              onChange={(e) => setCriteriaMasteryPercentage(e.target.value)}
                              className="h-12"
                              required
                            />
                            <span className="text-[#395159]">%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="criteriaMasterySessionCount">Consecutive Sessions</Label>
                          <Input
                            id="criteriaMasterySessionCount"
                            type="number"
                            min="1"
                            value={criteriaMasterySessionCount}
                            onChange={(e) => setCriteriaMasterySessionCount(e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="criteriaSupportLevel">Support Level Required for Mastery</Label>
                        <Select value={criteriaSupportLevel} onValueChange={setCriteriaSupportLevel} required>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="independent">Independently</SelectItem>
                            <SelectItem value="minimal">Minimal Support</SelectItem>
                            <SelectItem value="moderate">Moderate Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                        <p className="text-sm text-[#395159]">
                          <strong>Criteria Summary:</strong> Goal will be considered mastered when the client demonstrates 
                          the skill at {criteriaMasteryPercentage}% accuracy across {criteriaMasterySessionCount} consecutive 
                          sessions with {criteriaSupportLevel} support.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white">
                        Save Criteria
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsModifyingCriteria(false)}
                        className="h-12"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          </TabsContent>
{/* itp goals tab  */}

          {canViewProgress && (
            <TabsContent value="progress">
              <ProgressScreen clientId={clientId} clientName={clientInfo.name} />
            </TabsContent>
          )}
{/* Providers tab  */}
          <TabsContent value="providers">
            <Card className="p-6 bg-white">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-[#395159]" />
                  <h3 className="text-[#303630]">Provider Team</h3>
                </div>
                <p className="text-[#395159]">
                  Manage the providers assigned to work with this client
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Provider</Label>
                  <p className="text-sm text-[#395159] mb-3">
                    Search and select a provider to add to this client's team
                  </p>
                  
                  <Popover open={providerSearchOpen} onOpenChange={setProviderSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={providerSearchOpen}
                        className="w-full h-12 justify-between bg-white"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-[#395159]" />
                          <span className="text-[#395159]">Search providers...</span>
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search providers..." />
                        <CommandList>
                          <CommandEmpty>No provider found.</CommandEmpty>
                          <CommandGroup>
                            {providersList.filter(p => !assignedProviders.includes(p.id)).map((provider) => (
                              <CommandItem
                                key={provider.id}
                                value={provider.name}
                                onSelect={() => addProviderToClient(provider.id)}
                              >
                                <div className="flex flex-col">
                                  <span className="text-[#303630]">{provider.name}</span>
                                  <span className="text-sm text-[#395159]">{provider.credential}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Assigned Providers ({assignedProviders.length})</Label>
                  {assignedProviders.length === 0 ? (
                    <div className="p-8 text-center bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                      <Users className="w-12 h-12 mx-auto mb-3 text-[#395159] opacity-50" />
                      <p className="text-[#395159]">No providers assigned to this client yet</p>
                      <p className="text-sm text-[#395159] mt-1">Use the search above to add providers</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assignedProviders.map((providerId) => {
                        const provider = providersList.find(p => p.id === providerId);
                        return provider ? (
                          <div
                            key={providerId}
                            className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] flex items-center justify-between"
                          >
                            <div>
                              <p className="text-[#303630]">{provider.name}</p>
                              <p className="text-sm text-[#395159]">{provider.credential}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeProviderFromClient(providerId)}
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
{/* Providers tab  */}

{/* profile tab  */}
          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Administrative Information Section */}
              <Card className="p-6 bg-white border-2 border-[#395159]">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-[#395159]" />
                    <h3 className="text-[#303630]">Administrative Information</h3>
                  </div>
                  <p className="text-[#395159]">
                    Required information for treatment plan management and supervision
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="qsp">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-[#395159]" />
                          Qualified Supervising Professional (QSP) *
                        </div>
                      </Label>
                      <Select value={qsp} onValueChange={setQsp}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select QSP" />
                        </SelectTrigger>
                        <SelectContent>
                          {providersList.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name} - {provider.credential}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-[#395159]">
                        Primary professional responsible for treatment plan oversight
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clinicalSupervisor">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#395159]" />
                          Clinical Supervisor *
                        </div>
                      </Label>
                      <Select value={clinicalSupervisor} onValueChange={setClinicalSupervisor}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Clinical Supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {providersList.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name} - {provider.credential}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-[#395159]">
                        Can be the same as QSP or a different provider
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                    <Label htmlFor="planReviewDate">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#395159]" />
                        Individual Treatment Plan Review Date *
                      </div>
                    </Label>
                    <Input
                      id="planReviewDate"
                      type="date"
                      value={planReviewDate}
                      onChange={(e) => setPlanReviewDate(e.target.value)}
                      className="h-12 bg-white"
                    />
                    <p className="text-sm text-[#395159]">
                      Review date for entire treatment plan. Alerts will appear 60 and 30 days before this date.
                    </p>
                  </div>

                  <Button 
                    className="bg-[#395159] hover:bg-[#303630] text-white h-12"
                    onClick={() => toast.success('Administrative information updated successfully')}
                  >
                    Save Administrative Information
                  </Button>
                </div>
              </Card>

              {/* Client Profile Section */}
              <Card className="p-6 bg-white">
                <div className="mb-6">
                  <h3 className="text-[#303630] mb-2">Client Profile for AI Note Generation</h3>
                  <p className="text-[#395159]">
                    This information will be used by the AI to create personalized, context-aware session notes.
                  </p>
                </div>

                <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="interests">Child's Interests & Preferences</Label>
                  <Textarea
                    id="interests"
                    value={clientProfile.interests}
                    onChange={(e) => setClientProfile({ ...clientProfile, interests: e.target.value })}
                    className="min-h-20"
                    placeholder="What does the child enjoy? Favorite toys, activities, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strengths">Strengths & Learning Style</Label>
                  <Textarea
                    id="strengths"
                    value={clientProfile.strengths}
                    onChange={(e) => setClientProfile({ ...clientProfile, strengths: e.target.value })}
                    className="min-h-20"
                    placeholder="What are the child's strengths? How do they learn best?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Areas of Challenge</Label>
                  <Textarea
                    id="challenges"
                    value={clientProfile.challenges}
                    onChange={(e) => setClientProfile({ ...clientProfile, challenges: e.target.value })}
                    className="min-h-20"
                    placeholder="What challenges does the child face? Sensory sensitivities, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyContext">Family Context</Label>
                  <Textarea
                    id="familyContext"
                    value={clientProfile.familyContext}
                    onChange={(e) => setClientProfile({ ...clientProfile, familyContext: e.target.value })}
                    className="min-h-20"
                    placeholder="Relevant family information, siblings, home environment, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredActivities">Preferred Activities for Engagement</Label>
                  <Textarea
                    id="preferredActivities"
                    value={clientProfile.preferredActivities}
                    onChange={(e) => setClientProfile({ ...clientProfile, preferredActivities: e.target.value })}
                    className="min-h-20"
                    placeholder="Activities that help engage this child during sessions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sensoryProcessing">Sensory Processing</Label>
                  <Textarea
                    id="sensoryProcessing"
                    value={clientProfile.sensoryProcessing}
                    onChange={(e) => setClientProfile({ ...clientProfile, sensoryProcessing: e.target.value })}
                    className="min-h-20"
                    placeholder="Sensory preferences, sensitivities, seeking behaviors, regulation strategies"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="communication">Communication</Label>
                  <Textarea
                    id="communication"
                    value={clientProfile.communication}
                    onChange={(e) => setClientProfile({ ...clientProfile, communication: e.target.value })}
                    className="min-h-20"
                    placeholder="Current communication level, expressive/receptive language, AAC use, communication style"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safetyConsiderations" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Safety Considerations
                  </Label>
                  <Textarea
                    id="safetyConsiderations"
                    value={clientProfile.safetyConsiderations || ''}
                    onChange={(e) => setClientProfile({ ...clientProfile, safetyConsiderations: e.target.value })}
                    className="min-h-24 border-amber-200 focus:border-amber-400"
                    placeholder="Document any safety concerns, allergies, elopement risks, medical needs, behavioral safety considerations, environmental modifications needed, etc."
                  />
                  <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                    <strong>Important:</strong> Document any safety-related information that providers should be aware of when working with this client, including allergies, elopement risks, medical conditions, sensory triggers that may lead to unsafe behaviors, or required environmental modifications.
                  </p>
                </div>

                <Button 
                  className="bg-[#395159] hover:bg-[#303630] text-white h-12"
                  onClick={() => toast.success('Client profile updated successfully')}
                >
                  Save Profile
                </Button>
              </div>
            </Card>
            </div>
          </TabsContent>
{/* profile tab  */}

{/* histroy session tab  */}
          <TabsContent value="history">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#303630]">Session History</h3>
                {!canViewAllSessions && (
                  <Badge className="bg-[#395159] text-white">
                    Showing Your Sessions Only
                  </Badge>
                )}
              </div>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#395159]" />
                  <Input
                    type="text"
                    placeholder="Search sessions by keyword (date, provider, goals, notes, activities, etc.)..."
                    value={sessionSearchQuery}
                    onChange={(e) => {
                      setSessionSearchQuery(e.target.value);
                      setSelectedSessions([]);
                    }}
                    className="pl-10 h-12 bg-[#efefef] border-[#ccc9c0] focus:border-[#395159]"
                  />
                  {sessionSearchQuery && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSessionSearchQuery('');
                        setSelectedSessions([]);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2 text-[#395159] hover:bg-[#ccc9c0]"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {sessionSearchQuery && (
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-[#395159]">
                      Found {visibleSessions.length} session{visibleSessions.length !== 1 ? 's' : ''} matching "{sessionSearchQuery}"
                    </p>
                    {visibleSessions.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={selectedSessions.length === visibleSessions.length ? deselectAllSessions : selectAllFilteredSessions}
                          className="border-[#395159] text-[#395159] h-8"
                        >
                          {selectedSessions.length === visibleSessions.length && visibleSessions.length > 0 ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Deselect All
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2 opacity-40" />
                              Select All
                            </>
                          )}
                        </Button>
                        {selectedSessions.length > 0 && (
                          <>
                            <Badge className="bg-[#395159] text-white">
                              {selectedSessions.length} selected
                            </Badge>
                            <Button
                              size="sm"
                              onClick={handleBatchDownload}
                              className="bg-[#395159] hover:bg-[#303630] text-white h-8"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download Selected ({selectedSessions.length})
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {visibleSessions.length === 0 ? (
                  <div className="text-center py-8 text-[#395159]">
                    <p>{sessionSearchQuery ? `No sessions found matching "${sessionSearchQuery}"` : 'No sessions found.'}</p>
                  </div>
                ) : (
                  visibleSessions.map((session, index) => (
                  <div
                    key={index}
                    className={`p-5 bg-[#efefef] rounded-lg border transition-all ${
                      sessionSearchQuery && selectedSessions.includes(index)
                        ? 'border-[#395159] shadow-md'
                        : 'border-[#ccc9c0]'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {sessionSearchQuery && (
                        <div className="pt-1">
                          <Checkbox
                            checked={selectedSessions.includes(index)}
                            onCheckedChange={() => toggleSessionSelection(index)}
                            className="w-5 h-5"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-[#303630]">{session.date}</p>
                          <Badge className="bg-green-500 text-white">{session.status}</Badge>
                        </div>
                        <p className="text-sm text-[#395159] mb-2">
                          {session.duration} • {session.provider}
                        </p>
                        <p className="text-sm text-[#395159] mb-2">
                          Goals: {session.goals}
                        </p>
                        {(session as any).qspSignatureRequired !== false && (
                          <div className="mb-2">
                            {(session as any).qspSignatureStatus === 'signed' ? (
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                QSP Signed
                              </Badge>
                            ) : (session as any).qspSignatureStatus === 'critical' ? (
                              <Badge className="bg-red-600 text-white animate-pulse">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                QSP Signature Overdue (5+ days)
                              </Badge>
                            ) : (session as any).qspSignatureStatus === 'warning' ? (
                              <Badge className="bg-yellow-500 text-white">
                                <Clock className="w-3 h-3 mr-1" />
                                QSP Signature Pending (3+ days)
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-blue-500 text-blue-600">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending QSP Signature
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-[#303630]">
                          {session.summary}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#395159] text-[#395159]"
                        onClick={() => toast.success('Opening session details...')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#395159] hover:bg-[#303630] text-white"
                        onClick={() => toast.success('Downloading PDF note...')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download PDF
                      </Button>
                      {session.providerId === currentUser?.id && canEditSignedNotes && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                          onClick={() => openEditNote(index, session)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Note
                        </Button>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>
            </Card>

            {/* Edit Note Dialog */}
            <Dialog open={isEditingNote} onOpenChange={setIsEditingNote}>
              <DialogContent className="max-w-6xl max-h-[95vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Session Note
                    {editNoteData?.isAIGenerated && (
                      <Badge className="bg-[#395159] text-white ml-2">AI Generated</Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    Review and edit the session note details.
                  </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="h-[calc(95vh-120px)] pr-4">
                  <form onSubmit={handleEditNote} className="space-y-4">
                    {/* Warning Banner */}
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800 mb-1">
                            <strong>Important:</strong> Percentage data from the data collection session cannot be edited. 
                            All other fields can be modified.
                          </p>
                          <p className="text-sm text-yellow-800">
                            This note will require re-signing after editing.
                          </p>
                        </div>
                      </div>
                    </div>

                    {editNoteData ? (
                      <>
                        {/* Document Header */}
                        <Card className="p-4 bg-white">
                          <h4 className="text-[#303630] mb-3">Document Header</h4>
                          <Separator className="mb-4 bg-[#ccc9c0]" />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-[#395159]">Date Service Provided</Label>
                              <Input
                                value={editNoteData.date}
                                onChange={(e) => setEditNoteData({...editNoteData, date: e.target.value})}
                                className="h-10"
                              />
                            </div>
                            {editNoteData.startTime && (
                              <>
                                <div>
                                  <Label className="text-xs text-[#395159]">Session Start Time</Label>
                                  <Input
                                    value={editNoteData.startTime}
                                    onChange={(e) => setEditNoteData({...editNoteData, startTime: e.target.value})}
                                    className="h-10"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-[#395159]">Session End Time</Label>
                                  <Input
                                    value={editNoteData.endTime}
                                    onChange={(e) => setEditNoteData({...editNoteData, endTime: e.target.value})}
                                    className="h-10"
                                  />
                                </div>
                              </>
                            )}
                            <div>
                              <Label className="text-xs text-[#395159]">Duration</Label>
                              <Input
                                value={editNoteData.duration}
                                onChange={(e) => setEditNoteData({...editNoteData, duration: e.target.value})}
                                className="h-10"
                              />
                            </div>
                          </div>
                        </Card>

                        {/* Session Details - AI Generated Notes */}
                        {editNoteData.isAIGenerated && (
                          <>
                            <Card className="p-4 bg-white">
                              <h4 className="text-[#303630] mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#395159]" />
                                Session Details
                              </h4>
                              <Separator className="mb-4 bg-[#ccc9c0]" />
                              
                              <div className="space-y-4">
                                {editNoteData.attendees && (
                                  <div>
                                    <Label className="text-sm text-[#395159] mb-2 block">Attendees Present</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          id="attendee-parent"
                                          checked={editNoteData.attendees.parent}
                                          onCheckedChange={(checked) => setEditNoteData({
                                            ...editNoteData,
                                            attendees: {...editNoteData.attendees, parent: checked}
                                          })}
                                        />
                                        <label htmlFor="attendee-parent" className="text-sm text-[#303630]">
                                          Parent/Guardian
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          id="attendee-sibling"
                                          checked={editNoteData.attendees.sibling}
                                          onCheckedChange={(checked) => setEditNoteData({
                                            ...editNoteData,
                                            attendees: {...editNoteData.attendees, sibling: checked}
                                          })}
                                        />
                                        <label htmlFor="attendee-sibling" className="text-sm text-[#303630]">
                                          Sibling
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          id="attendee-peer"
                                          checked={editNoteData.attendees.peer}
                                          onCheckedChange={(checked) => setEditNoteData({
                                            ...editNoteData,
                                            attendees: {...editNoteData.attendees, peer: checked}
                                          })}
                                        />
                                        <label htmlFor="attendee-peer" className="text-sm text-[#303630]">
                                          Peer
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox 
                                          id="attendee-therapist"
                                          checked={editNoteData.attendees.therapist}
                                          onCheckedChange={(checked) => setEditNoteData({
                                            ...editNoteData,
                                            attendees: {...editNoteData.attendees, therapist: checked}
                                          })}
                                        />
                                        <label htmlFor="attendee-therapist" className="text-sm text-[#303630]">
                                          Additional Therapist
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <Label className="text-sm text-[#395159]">Client Variables and Presentation</Label>
                                  <Textarea
                                    value={editNoteData.clientVariables || ''}
                                    onChange={(e) => setEditNoteData({...editNoteData, clientVariables: e.target.value})}
                                    rows={2}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </Card>

                            {/* FEDC Observed */}
                            <Card className="p-4 bg-white">
                              <h4 className="text-[#303630] mb-3">FEDC Levels Observed</h4>
                              <Separator className="mb-4 bg-[#ccc9c0]" />
                              <div>
                                <Label className="text-sm text-[#395159] mb-2 block">Selected FEDC Levels</Label>
                                <Input
                                  value={editNoteData.fedcObserved?.join(', ') || ''}
                                  onChange={(e) => setEditNoteData({
                                    ...editNoteData, 
                                    fedcObserved: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                  })}
                                  placeholder="e.g., FEDC 3, FEDC 4, FEDC 6"
                                  className="h-10"
                                />
                                <p className="text-xs text-[#395159] mt-1">Enter FEDC levels separated by commas</p>
                              </div>
                            </Card>

                            {/* ITP Goal Progress - Percentage Data Read-Only */}
                            {editNoteData.goalStates && Object.keys(editNoteData.goalStates).length > 0 && (
                              <Card className="p-4 bg-white">
                                <h4 className="text-[#303630] mb-3 flex items-center gap-2">
                                  <Lock className="w-4 h-4 text-orange-600" />
                                  ITP Goal Progress (Percentage Data Locked)
                                </h4>
                                <Separator className="mb-4 bg-[#ccc9c0]" />
                                <div className="space-y-4">
                                  {Object.entries(editNoteData.goalStates).map(([goalId, data]: [string, any], index) => {
                                    const total = (data.successfulOpportunities || 0) + (data.missedOpportunities || 0);
                                    const percentage = total > 0 ? Math.round(((data.successfulOpportunities || 0) / total) * 100) : 0;
                                    
                                    return (
                                      <div key={goalId} className="p-3 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className="text-[#303630]">ITP Goal {index + 1}</h5>
                                          <Badge className={`${percentage >= 80 ? 'bg-green-600' : percentage >= 60 ? 'bg-yellow-600' : 'bg-orange-600'} text-white`}>
                                            {percentage}% Accuracy (Locked)
                                          </Badge>
                                        </div>
                                        <div className="space-y-2">
                                          <div>
                                            <Label className="text-xs text-[#395159]">Goal Description</Label>
                                            <Input
                                              value={data.name || ''}
                                              onChange={(e) => {
                                                const newGoalStates = {...editNoteData.goalStates};
                                                newGoalStates[goalId] = {...data, name: e.target.value};
                                                setEditNoteData({...editNoteData, goalStates: newGoalStates});
                                              }}
                                              className="h-9 mt-1"
                                            />
                                          </div>
                                          <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div className="p-2 bg-gray-100 rounded border">
                                              <Label className="text-xs text-gray-500">Successful</Label>
                                              <p className="text-gray-700">{data.successfulOpportunities} <Lock className="w-3 h-3 inline ml-1" /></p>
                                            </div>
                                            <div className="p-2 bg-gray-100 rounded border">
                                              <Label className="text-xs text-gray-500">Missed</Label>
                                              <p className="text-gray-700">{data.missedOpportunities} <Lock className="w-3 h-3 inline ml-1" /></p>
                                            </div>
                                            <div className="p-2 bg-gray-100 rounded border">
                                              <Label className="text-xs text-gray-500">Total</Label>
                                              <p className="text-gray-700">{total} <Lock className="w-3 h-3 inline ml-1" /></p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <p className="text-xs text-orange-600 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Percentage data cannot be modified after the session is complete
                                  </p>
                                </div>
                              </Card>
                            )}

                            {/* Therapeutic Supports */}
                            <Card className="p-4 bg-white">
                              <h4 className="text-[#303630] mb-3">Therapeutic Supports and Strategies</h4>
                              <Separator className="mb-4 bg-[#ccc9c0]" />
                              <div>
                                <Label className="text-sm text-[#395159] mb-2 block">Supports Observed</Label>
                                <Input
                                  value={editNoteData.supportsObserved?.join(', ') || ''}
                                  onChange={(e) => setEditNoteData({
                                    ...editNoteData, 
                                    supportsObserved: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                  })}
                                  placeholder="e.g., Affect Attunement, Following Child's Lead"
                                  className="h-10"
                                />
                                <p className="text-xs text-[#395159] mt-1">Enter supports separated by commas</p>
                              </div>
                            </Card>

                            {/* Activities */}
                            <Card className="p-4 bg-white">
                              <h4 className="text-[#303630] mb-3">Activities and Play Themes</h4>
                              <Separator className="mb-4 bg-[#ccc9c0]" />
                              <div>
                                <Label className="text-sm text-[#395159] mb-2 block">Activities Engaged</Label>
                                <Input
                                  value={editNoteData.activitiesEngaged?.join(', ') || ''}
                                  onChange={(e) => setEditNoteData({
                                    ...editNoteData, 
                                    activitiesEngaged: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                  })}
                                  placeholder="e.g., Pretend Play - Kitchen, Building Blocks"
                                  className="h-10"
                                />
                                <p className="text-xs text-[#395159] mt-1">Enter activities separated by commas</p>
                              </div>
                            </Card>

                            {/* Clinical Observations */}
                            <Card className="p-4 bg-white">
                              <h4 className="text-[#303630] mb-3">Detailed Clinical Observations</h4>
                              <Separator className="mb-4 bg-[#ccc9c0]" />
                              <Textarea
                                value={editNoteData.sessionNotes || ''}
                                onChange={(e) => setEditNoteData({...editNoteData, sessionNotes: e.target.value})}
                                rows={4}
                                placeholder="Enter clinical observations..."
                              />
                            </Card>

                            {/* Treatment Changes */}
                            <Card className="p-4 bg-white">
                              <h4 className="text-[#303630] mb-3">Changes in Treatment or Diagnosis</h4>
                              <Separator className="mb-4 bg-[#ccc9c0]" />
                              <Textarea
                                value={editNoteData.treatmentChanges || ''}
                                onChange={(e) => setEditNoteData({...editNoteData, treatmentChanges: e.target.value})}
                                rows={2}
                                placeholder="Document any changes..."
                              />
                            </Card>

                            {/* Plan */}
                            <Card className="p-4 bg-white">
                              <h4 className="text-[#303630] mb-3">Plan</h4>
                              <Separator className="mb-4 bg-[#ccc9c0]" />
                              <Textarea
                                value={editNoteData.recommendations?.join('\n') || ''}
                                onChange={(e) => setEditNoteData({
                                  ...editNoteData, 
                                  recommendations: e.target.value.split('\n').filter(s => s.trim())
                                })}
                                rows={4}
                                placeholder="Enter recommendations (one per line)..."
                              />
                              <p className="text-xs text-[#395159] mt-1">Enter each recommendation on a new line</p>
                            </Card>
                          </>
                        )}

                        {/* Simple Note Editor for Non-AI Notes */}
                        {!editNoteData.isAIGenerated && (
                          <Card className="p-4 bg-white">
                            <h4 className="text-[#303630] mb-3">Session Note</h4>
                            <Separator className="mb-4 bg-[#ccc9c0]" />
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm text-[#395159]">Goals Addressed</Label>
                                <Input
                                  value={editNoteData.goals}
                                  onChange={(e) => setEditNoteData({...editNoteData, goals: e.target.value})}
                                  className="h-10 mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-[#395159]">Session Summary</Label>
                                <Textarea
                                  value={editNoteData.summary}
                                  onChange={(e) => setEditNoteData({...editNoteData, summary: e.target.value})}
                                  rows={6}
                                  className="mt-1"
                                  placeholder="Enter session summary..."
                                />
                              </div>
                            </div>
                          </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
                          <Button type="submit" className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Save Changes & Re-sign Note
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditingNote(false);
                              setEditingNoteIndex(null);
                              setEditNoteContent('');
                              setEditNoteData(null);
                            }}
                            className="h-12"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-[#395159]">Loading note data...</p>
                    )}
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </TabsContent>
{/* histroy session tab  */}

{/* archived tab  */}
          <TabsContent value="archived">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[#303630] mb-2">Archived Goals</h3>
                  <p className="text-[#395159]">Goals that have been mastered or discontinued</p>
                </div>
              </div>

              {mockArchivedGoals.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="w-12 h-12 text-[#ccc9c0] mx-auto mb-4" />
                  <p className="text-[#395159]">No archived goals yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockArchivedGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge 
                              className={`${
                                goal.status === 'mastered' 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-amber-600 hover:bg-amber-700'
                              } text-white`}
                            >
                              {goal.status === 'mastered' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Mastered
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Discontinued
                                </>
                              )}
                            </Badge>
                            <span className="text-sm text-[#395159]">
                              Archived: {goal.archivedDate}
                            </span>
                          </div>
                          <div className="mb-2">
                            <Badge variant="outline" className="text-[#395159] border-[#395159] mb-2">
                              {goal.category}
                            </Badge>
                          </div>
                          <p className="text-[#303630] mb-3">{goal.goal}</p>
                        </div>
                      </div>

                      <Separator className="my-3 bg-[#ccc9c0]" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#395159]">Original Mastery Criteria:</span>
                          <p className="text-[#303630]">
                            {goal.masteryPercentage}% across {goal.masterySessionCount} sessions
                          </p>
                        </div>
                        {goal.status === 'mastered' && goal.finalSuccessRate && (
                          <div>
                            <span className="text-[#395159]">Final Success Rate:</span>
                            <p className="text-[#303630]">{goal.finalSuccessRate}</p>
                          </div>
                        )}
                        {goal.status === 'discontinued' && goal.reason && (
                          <div className="col-span-2">
                            <span className="text-[#395159]">Reason:</span>
                            <p className="text-[#303630]">{goal.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          {/* archived tab  */}
        </Tabs>
      </div>
    </div>
  );
}
