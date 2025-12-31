import { Card } from '../../../../components/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import { Badge } from '../../../../components/Badge';
import { AlertCircle } from 'lucide-react';
import { useProgressReportQuery } from '../../../../redux/api/provider';

interface ProgressScreenProps {
  clientId?: string | null;
  clientName?: string;
}

/* --------------------------------------------
   Custom Dot (Red if Client Variables Exist)
--------------------------------------------- */
const CustomDot = (props: any) => {
  const { cx, cy, payload, fill } = props;
  const hasClientVariables =
    payload?.clientVariables && payload.clientVariables.length > 0;

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

/* --------------------------------------------
   Custom Tooltip
--------------------------------------------- */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hasClientVariables =
      data.clientVariables && data.clientVariables.length > 0;

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
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm text-red-600 mb-1">
                  Client Variables:
                </p>
                <p className="text-sm text-[#303630]">
                  {data.clientVariables}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

/* --------------------------------------------
   Progress Screen Component
--------------------------------------------- */
export function ProgressScreen({ clientId }: ProgressScreenProps) {
  const { data: progressResponse, isLoading } =
    useProgressReportQuery(clientId);

  const apiData = progressResponse?.data;

  if (isLoading) {
    return <div className="p-6">Loading progress report...</div>;
  }

  /* --------------------------------------------
     FEDC Observation Data (Bar Chart)
  --------------------------------------------- */
  const fedcObservationData = apiData?.fedcObservations || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[#303630]">
          Progress Tracking – {apiData?.clientInfo?.name}
        </h3>
        <p className="text-[#395159]">
          Goal performance over the last 30 days
        </p>
      </div>

      {/* --------------------------------------------
         FEDC Observation Frequency
      --------------------------------------------- */}
      <Card className="p-6 bg-white">
        <div className="mb-4">
          <h3 className="text-[#303630] mb-2">
            FEDC Observation Frequency
          </h3>
          <p className="text-[#395159]">
            How often each FEDC level was observed across{' '}
            {apiData?.totalSessions} sessions
          </p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={fedcObservationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc9c0" />
            <XAxis dataKey="fedc" stroke="#395159" />
            <YAxis
              stroke="#395159"
              domain={[0, apiData?.totalSessions || 10]}
              label={{
                value: 'Number of Sessions',
                angle: -90,
                position: 'insideLeft',
                fill: '#395159',
              }}
            />
            <Tooltip />
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

      {/* --------------------------------------------
         GOALS PROGRESS
      --------------------------------------------- */}
      {apiData?.goalsProgress?.map((goal: any) => {
        const sessionChartData = goal.sessionData.map(
          (session: any) => ({
            date: session.date,
            fullDate: session.fullDate,
            clientVariables: session.clientVariables,

            [`${goal.dataKey}_independent`]: session.independent,
            [`${goal.dataKey}_minimal`]: session.minimal,
            [`${goal.dataKey}_moderate`]: session.moderate,
          })
        );

        return (
          <Card key={goal.goalId} className="p-6 bg-white">
           
            <div className="mb-4">
              <Badge className="bg-[#395159] text-white mb-2">
                {goal.category}
              </Badge>
              <h3 className="text-[#303630] mb-4">
                {goal.goal}
              </h3>
               <p>Performance by Support Level over last 30 days</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={sessionChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ccc9c0"
                />
                <XAxis dataKey="date" stroke="#395159" />
                <YAxis
                  stroke="#395159"
                  domain={[0, 100]}
                  label={{
                    value: 'Success Rate (%)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#395159',
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <ReferenceLine
                  y={goal.baseline}
                  stroke="#395159"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: 'Baseline',
                    fill: '#395159',
                    position: 'right',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey={`${goal.dataKey}_independent`}
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={<CustomDot fill="#22c55e" />}
                  name="Independent"
                  isAnimationActive={false}
                />

                <Line
                  type="monotone"
                  dataKey={`${goal.dataKey}_minimal`}
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={<CustomDot fill="#3b82f6" />}
                  name="Minimal Support"
                  isAnimationActive={false}
                />

                <Line
                  type="monotone"
                  dataKey={`${goal.dataKey}_moderate`}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={<CustomDot fill="#f59e0b" />}
                  name="Moderate Support"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Averages */}
            <div className="mt-6 grid grid-cols-5 gap-4 p-4 bg-[#efefef] rounded-lg">
              <div className="text-center">
                <p className="text-sm text-[#395159]">Target</p>
                <p>{goal.target}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#395159]">Baseline</p>
                <p>{goal.baseline}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600">
                  Independent Avg
                </p>
                <p>{goal.averages.independent}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-600">
                  Minimal Avg
                </p>
                <p>{goal.averages.minimal}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-amber-600">
                  Moderate Avg
                </p>
                <p>{goal.averages.moderate}%</p>
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
          </Card>
        );
      })}
    </div>
  );
}
