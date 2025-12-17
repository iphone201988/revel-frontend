
import { Card } from '../../../../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, BarChart, Bar } from 'recharts';
import { Badge } from '../../../../components/Badge';
import { AlertCircle } from 'lucide-react';

interface ProgressScreenProps {
  clientId?: string | null;
  clientName?: string;
}

// Mock client data - different goals for different clients
const clientGoalsData: Record<string, any[]> = {
  '1': [ // Sarah Johnson
    {
      id: 1,
      category: 'FEDC 3',
      goal: 'Engage in two-way communication with adult',
      baseline: 30,
      target: 75,
      dataKey: 'goal1',
      color: '#395159',
    },
    {
      id: 2,
      category: 'FEDC 4',
      goal: 'Use gestures and words to communicate needs',
      baseline: 40,
      target: 80,
      dataKey: 'goal2',
      color: '#6B8E95',
    },
    {
      id: 3,
      category: 'FEDC 6',
      goal: 'Demonstrate emotional thinking through pretend play',
      baseline: 20,
      target: 70,
      dataKey: 'goal3',
      color: '#9BBBC1',
    },
  ],
  '2': [ // Michael Chen
    {
      id: 1,
      category: 'FEDC 4',
      goal: 'Use gestures and words to communicate needs',
      baseline: 50,
      target: 85,
      dataKey: 'goal1',
      color: '#395159',
    },
    {
      id: 2,
      category: 'FEDC 5',
      goal: 'Create ideas and use words and symbols',
      baseline: 35,
      target: 75,
      dataKey: 'goal2',
      color: '#6B8E95',
    },
  ],
  '3': [ // Emma Williams
    {
      id: 1,
      category: 'FEDC 2',
      goal: 'Maintain engagement for 5+ minutes',
      baseline: 45,
      target: 80,
      dataKey: 'goal1',
      color: '#395159',
    },
    {
      id: 2,
      category: 'FEDC 3',
      goal: 'Engage in two-way communication with adult',
      baseline: 25,
      target: 70,
      dataKey: 'goal2',
      color: '#6B8E95',
    },
    {
      id: 3,
      category: 'FEDC 4',
      goal: 'Use gestures and words to communicate needs',
      baseline: 30,
      target: 75,
      dataKey: 'goal3',
      color: '#9BBBC1',
    },
  ],
};

// Mock client variables for specific sessions
const mockClientVariables = [
  { sessionIndex: 2, variables: 'Client had mild cold symptoms but was alert and engaged. No medication changes.' },
  { sessionIndex: 5, variables: 'Recent sleep disruption due to travel. Client appeared tired initially but warmed up during session.' },
  { sessionIndex: 8, variables: 'New medication started this week. Parent reports improved focus at home. Client presented well-regulated.' },
  { sessionIndex: 11, variables: 'Client experienced meltdown before session arrival. Required extra co-regulation time at start of session.' },
];

// Generate mock data for the last 30 days for a specific client
const generateMockSessionData = (clientId: string) => {
  const data :any= [];
  const today = new Date('2025-10-17');
  
  // Generate data points for sessions over the past 30 days
  // Roughly 2-3 sessions per week
  const sessionDates = [
    -1, -3, -5, -7, -10, -12, -14, -17, -19, -21, -24, -26, -28
  ];
  
  const goals = clientGoalsData[clientId] || clientGoalsData['1'];
  
  sessionDates.forEach((daysAgo, index) => {
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate() + daysAgo);
    
    const dataPoint: any = {
      date: sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: sessionDate,
    };
    
    // Add client variables if they exist for this session
    const clientVarEntry = mockClientVariables.find(cv => cv.sessionIndex === index);
    if (clientVarEntry) {
      dataPoint.clientVariables = clientVarEntry.variables;
    }
    
    // Generate data for each goal with support level breakdown
    goals.forEach((goal, goalIndex) => {
      const baseValue = goal.baseline;
      const progressFactor = (Math.abs(daysAgo) / 30) * (goal.target - goal.baseline) * 0.5;
      
      // Generate support level performance
      // Independent performance typically increases over time
      const independentBase = baseValue * 0.6;
      const independentProgress = progressFactor * 1.2;
      const independentVariation = Math.random() * 20;
      dataPoint[`${goal.dataKey}_independent`] = Math.min(100, Math.round(independentBase + independentProgress + independentVariation));
      
      // Minimal support performance is typically higher than independent
      const minimalBase = baseValue * 0.8;
      const minimalProgress = progressFactor * 1.0;
      const minimalVariation = Math.random() * 15;
      dataPoint[`${goal.dataKey}_minimal`] = Math.min(100, Math.round(minimalBase + minimalProgress + minimalVariation));
      
      // Moderate support performance is typically highest
      const moderateBase = baseValue * 1.0;
      const moderateProgress = progressFactor * 0.8;
      const moderateVariation = Math.random() * 10;
      dataPoint[`${goal.dataKey}_moderate`] = Math.min(100, Math.round(moderateBase + moderateProgress + moderateVariation));
      
      // Keep overall performance for reference
      const randomVariation = Math.random() * 15;
      dataPoint[goal.dataKey] = Math.round(baseValue + progressFactor + randomVariation);
    });
    
    data.push(dataPoint);
  });
  
  return data.reverse(); // Reverse so oldest is first
};

interface GoalProgressData {
  id: number;
  category: string;
  goal: string;
  baseline: number;
  target: number;
  current: number;
  dataKey: string;
  color: string;
}

const calculateCurrent = (dataKey: string, sessionData: any[]): number => {
  const values = sessionData.map(session => session[dataKey] as number).filter(val => val !== undefined);
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
};

const calculateSupportLevelAverages = (dataKey: string, sessionData: any[]) => {
  const independent = calculateCurrent(`${dataKey}_independent`, sessionData);
  const minimal = calculateCurrent(`${dataKey}_minimal`, sessionData);
  const moderate = calculateCurrent(`${dataKey}_moderate`, sessionData);
  
  return { independent, minimal, moderate };
};

// Generate FEDC observation frequency data for a client
const generateFEDCObservationData = (clientId: string) => {
  // Define which FEDCs are relevant for each client based on their goals
  const clientFEDCs: Record<string, number[]> = {
    '1': [2, 3, 4, 5, 6], // Sarah Johnson - working on FEDC 2-6
    '2': [3, 4, 5, 6], // Michael Chen - working on FEDC 3-6
    '3': [1, 2, 3, 4], // Emma Williams - working on FEDC 1-4
    '4': [4, 5, 6, 7], // Lucas Martinez - working on FEDC 4-7
  };

  const fedcLevels = clientFEDCs[clientId] || clientFEDCs['1'];
  const totalSessions = 13; // Number of sessions in last 30 days

  return fedcLevels.map(level => {
    // Generate realistic observation frequencies
    // Lower FEDCs are typically observed more frequently
    const baseProbability = Math.max(0.4, 1 - (level * 0.08));
    const observationCount = Math.round(totalSessions * (baseProbability + Math.random() * 0.3));
    
    return {
      fedc: `FEDC ${level}`,
      observations: Math.min(observationCount, totalSessions),
      percentage: Math.round((Math.min(observationCount, totalSessions) / totalSessions) * 100),
    };
  });
};

// Custom dot component that changes color based on client variables
const CustomDot = (props: any) => {
  const { cx, cy, payload, fill } = props;
  const hasClientVariables = payload.clientVariables && payload.clientVariables.length > 0;
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={hasClientVariables ? '#dc2626' : fill}
      stroke={hasClientVariables ? '#991b1b' : 'none'}
      strokeWidth={hasClientVariables ? 1 : 0}
    />
  );
};

// Custom tooltip component that shows client variables and support level data
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hasClientVariables = data.clientVariables && data.clientVariables.length > 0;
    
    return (
      <div className="bg-white p-4 border border-[#ccc9c0] rounded-lg shadow-lg max-w-sm">
        <p className="text-[#303630] mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}%</strong>
            </p>
          ))}
        </div>
        {hasClientVariables && (
          <div className="mt-3 pt-3 border-t border-[#ccc9c0]">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-600 mb-1">Client Variables:</p>
                <p className="text-sm text-[#303630]">{data.clientVariables}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

export function ProgressScreen({ clientId = '1', clientName = 'Sarah Johnson' }: ProgressScreenProps) {
  const effectiveClientId = clientId || '1';
  const mockSessionData = generateMockSessionData(effectiveClientId);
  const clientGoals = clientGoalsData[effectiveClientId] || clientGoalsData['1'];
  const fedcObservationData = generateFEDCObservationData(effectiveClientId);
  
  const goalsProgressData: GoalProgressData[] = clientGoals.map(goal => ({
    ...goal,
    current: calculateCurrent(goal.dataKey, mockSessionData),
  }));
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-[#303630]">Progress Tracking - {clientName}</h3>
        <p className="text-[#395159]">Goal performance over the last 30 days</p>
      </div>

      {/* FEDC Observation Frequency Bar Chart */}
      <Card className="p-6 bg-white">
        <div className="mb-4">
          <h3 className="text-[#303630] mb-2">FEDC Observation Frequency</h3>
          <p className="text-[#395159]">How often each FEDC level was observed across 13 sessions in the last 30 days</p>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={fedcObservationData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc9c0" />
            <XAxis 
              dataKey="fedc" 
              stroke="#395159"
              tick={{ fill: '#395159' }}
            />
            <YAxis 
              stroke="#395159"
              tick={{ fill: '#395159' }}
              label={{ value: 'Number of Sessions', angle: -90, position: 'insideLeft', fill: '#395159' }}
              domain={[0, 13]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #ccc9c0',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'observations') {
                  const item = fedcObservationData.find(d => d.observations === value);
                  return [`${value} sessions (${item?.percentage}%)`, 'Observed'];
                }
                return [value, name];
              }}
              cursor={false}
            />
            <Legend />
            <Bar 
              dataKey="observations" 
              fill="#395159" 
              name="Sessions Observed"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-[#efefef] rounded-lg">
          <p className="text-sm text-[#395159]">
            <strong>Note:</strong> This chart shows how frequently each Functional Emotional Developmental Capacity (FEDC) level was observed during therapy sessions. Higher observation frequency indicates the child is consistently demonstrating skills at that developmental level.
          </p>
        </div>
      </Card>

      {goalsProgressData.map((goalData) => (
        <Card key={goalData.id} className="p-6 bg-white">
          <div className="mb-4">
            <Badge className="bg-[#395159] text-white mb-2">{goalData.category}</Badge>
            <h3 className="text-[#303630] mb-4">{goalData.goal}</h3>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={mockSessionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc9c0" />
              <XAxis 
                dataKey="date" 
                stroke="#395159"
                tick={{ fill: '#395159' }}
              />
              <YAxis 
                stroke="#395159"
                tick={{ fill: '#395159' }}
                domain={[0, 100]}
                label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft', fill: '#395159' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend />
              <ReferenceLine 
                y={goalData.baseline} 
                stroke="#395159" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ 
                  value: 'Baseline', 
                  fill: '#395159',
                  position: 'right'
                }}
                // isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey={`${goalData.dataKey}_independent`} 
                stroke="#22c55e" 
                strokeWidth={2.5}
                dot={<CustomDot fill="#22c55e" />}
                activeDot={{ r: 6 }}
                name="Independent"
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey={`${goalData.dataKey}_minimal`} 
                stroke="#3b82f6" 
                strokeWidth={2.5}
                dot={<CustomDot fill="#3b82f6" />}
                activeDot={{ r: 6 }}
                name="Minimal Support"
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey={`${goalData.dataKey}_moderate`} 
                stroke="#f59e0b" 
                strokeWidth={2.5}
                dot={<CustomDot fill="#f59e0b" />}
                activeDot={{ r: 6 }}
                name="Moderate Support"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-5 gap-4 p-4 bg-[#efefef] rounded-lg">
              <div className="text-center">
                <p className="text-sm text-[#395159] mb-1">Target</p>
                <p className="text-[#303630]">{goalData.target}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#395159] mb-1">Baseline</p>
                <p className="text-[#303630]">{goalData.baseline}%</p>
              </div>
              <div className="text-center border-l border-[#ccc9c0] pl-4">
                <p className="text-sm text-green-600 mb-1">Independent Avg</p>
                <p className="text-[#303630]">{calculateSupportLevelAverages(goalData.dataKey, mockSessionData).independent}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-1">Minimal Avg</p>
                <p className="text-[#303630]">{calculateSupportLevelAverages(goalData.dataKey, mockSessionData).minimal}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-amber-600 mb-1">Moderate Avg</p>
                <p className="text-[#303630]">{calculateSupportLevelAverages(goalData.dataKey, mockSessionData).moderate}%</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                <strong>Support Level Performance:</strong> The graph shows success rates at three support levels. <span className="text-green-600">Green (Independent)</span> shows performance without support, <span className="text-blue-600">Blue (Minimal Support)</span> shows performance with minimal prompting, and <span className="text-amber-600">Amber (Moderate Support)</span> shows performance with moderate prompting.
              </p>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-900">
                <strong>Red dots</strong> indicate sessions where client variables were documented (e.g., illness, medication changes, sleep disruption, etc.). Hover over red dots to view the specific variables noted for that session.
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
