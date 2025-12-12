import React, { useState } from 'react';
import { AppHeader } from '../../../components/AppHeader';
import { ArrowLeft, Play, Clock, Users as UsersIcon, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { Textarea } from '../../../components/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/Select';
import { RadioGroup, RadioGroupItem } from '../../../components/Radio-group';
// import { Screen } from '../App';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SessionInitiationScreenProps {
  clientId: string | null;
  currentUser: any;
  sessionInitData?: any; // Pre-populated data from calendar
  onNavigate: (screen: Screen) => void;
  onStartSession: (data: any) => void;
  onLogout: () => void;
}

const mockClients = [
  { id: '1', name: 'Sarah Johnson', age: 4 },
  { id: '2', name: 'Michael Chen', age: 5 },
  { id: '3', name: 'Emma Williams', age: 3 },
  { id: '4', name: 'Lucas Martinez', age: 6 },
];

export function SessionInitiationScreen({ 
  clientId,
  currentUser,
  sessionInitData,
  onNavigate, 
  onStartSession, 
  onLogout 
}: SessionInitiationScreenProps) {

    const navigate = useNavigate()
  // Get today's date in YYYY-MM-DD format for the date input
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Pre-populate from sessionInitData if coming from calendar, otherwise use defaults
  const [selectedClient, setSelectedClient] = useState(sessionInitData?.clientId || clientId || '');
  const [sessionType, setSessionType] = useState('progress-monitoring');
  const [sessionDate, setSessionDate] = useState(sessionInitData?.sessionDate || getTodayDate());
  const [startTime, setStartTime] = useState(sessionInitData?.startTime || '');
  const [endTime, setEndTime] = useState(sessionInitData?.endTime || '');
  const [attendees, setAttendees] = useState('');
  const [clientVariables, setClientVariables] = useState('');

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !sessionDate || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const sessionData = {
      clientId: selectedClient,
      clientName: mockClients.find(c => c.id === selectedClient)?.name,
      sessionType,
      providerId: currentUser?.id,
      providerName: currentUser?.name,
      providerCredential: currentUser?.credential,
      date: sessionDate,
      startTime,
      endTime,
      attendees,
      clientVariables,
    };

    toast.success('Session initiated successfully');
    onStartSession(sessionData);
  };

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader title="Session Initiation" onLogout={onLogout} onNavigate={onNavigate} />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#395159] rounded-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[#303630]">Start New Session</h2>
              <p className="text-[#395159]">Set up session details before data collection</p>
            </div>
          </div>

          {sessionInitData && (
            <div className="mb-6 p-4 bg-[#efefef] rounded-lg border border-[#395159]">
              <p className="text-sm text-[#395159]">
                <strong>Pre-populated from Calendar:</strong> Session details have been auto-filled from your scheduled appointment. You can still edit any field as needed.
              </p>
            </div>
          )}

          <form onSubmit={handleStartSession} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client">Select Client *</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient} required>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} (Age {client.age})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
              <Label>Session Provider</Label>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-[#303630]">{currentUser?.name}</p>
                <p className="text-sm text-[#395159] mt-1">{currentUser?.credential} • {currentUser?.level}</p>
              </div>
              <p className="text-sm text-[#395159]">
                Automatically assigned based on your login
              </p>
            </div>

            <div className="space-y-3 p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
              <Label>Session Type *</Label>
              <RadioGroup value={sessionType} onValueChange={setSessionType}>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[#ccc9c0]">
                  <RadioGroupItem value="progress-monitoring" id="progress" />
                  <label htmlFor="progress" className="flex-1 cursor-pointer">
                    <p className="text-[#303630]">Progress Monitoring</p>
                    <p className="text-sm text-[#395159]">Regular session to track ongoing progress toward ITP goals</p>
                  </label>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[#ccc9c0]">
                  <RadioGroupItem value="baseline" id="baseline" />
                  <label htmlFor="baseline" className="flex-1 cursor-pointer">
                    <p className="text-[#303630]">Baseline Data Collection</p>
                    <p className="text-sm text-[#395159]">Initial assessment to establish baseline performance levels</p>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDate">Date of Session *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                <Input
                  id="sessionDate"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Scheduled End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Who is present in this session?</Label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-3 w-5 h-5 text-[#395159]" />
                <Input
                  id="attendees"
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="h-12 pl-10"
                  placeholder="e.g., Therapist, Parent, Sibling"
                />
              </div>
              <p className="text-sm text-[#395159]">
                List all individuals present during this session
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientVariables">Client Variables</Label>
              <Textarea
                id="clientVariables"
                placeholder="Note any relevant variables: sleep quality, medication changes, recent events, mood observations, etc."
                value={clientVariables}
                onChange={(e) => setClientVariables(e.target.value)}
                className="min-h-32"
              />
              <p className="text-sm text-[#395159]">
                This information helps contextualize today's session data and will be included in the AI-generated note.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                className="flex-1 h-14 bg-[#395159] hover:bg-[#303630] text-white"
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Data Collection
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="h-14 border-[#395159] text-[#395159]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
