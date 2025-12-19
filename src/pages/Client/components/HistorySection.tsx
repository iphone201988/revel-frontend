import React, { useMemo, useState } from 'react';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Checkbox } from '../../../components/CheckBox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/Dailog';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { Separator } from '../../../components/Seprator';
import { Textarea } from '../../../components/Textarea';
import { ScrollArea } from '../../../components/ScrollArea';
import { Download, Search, X, CheckCircle2, AlertTriangle, Eye, Edit, Clock, AlertCircle, FileText, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import type { HistorySectionProps, SessionData } from '../../../Types/types';

// Updated interface to match your API response

export function HistorySection({
  sessions: rawSessions = [],
  canEditSignedNotes,
  currentUser,
  canViewAllSessions,
  // Support typo version
}: HistorySectionProps) {

  console.log("current User ::: " , currentUser);

  
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editNoteData, setEditNoteData] = useState<SessionData | null>(null);

  // Handle both prop name variations and extract array from API response if needed
  const canViewAll = canViewAllSessions ?? true;
  
  // Extract sessions array from API response structure if needed
  const sessions = useMemo(() => {
    console.log("Raw sessions received:", rawSessions);
    console.log("Type:", typeof rawSessions);
    console.log("Is Array:", Array.isArray(rawSessions));
    
    // If it's already an array, use it
    if (Array.isArray(rawSessions)) {
      return rawSessions;
    }
    
    // If it has a 'data' property that's an array, use that
    if (rawSessions && typeof rawSessions === 'object' && Array.isArray(rawSessions.data)) {
      console.log("Extracting from data property, length:", rawSessions.data.length);
      return rawSessions.data;
    }
    
    // Otherwise return empty array
    console.warn("Sessions is not in expected format, returning empty array");
    return [];
  }, [rawSessions]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper function to calculate duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Helper function to get goals summary
  const getGoalsSummary = (session: SessionData) => {
    const goalCount = session.goals_dataCollection.length;
    const avgAccuracy = session.goals_dataCollection.reduce((sum, g) => sum + g.accuracy, 0) / goalCount;
    return `${goalCount} goal${goalCount !== 1 ? 's' : ''} (Avg: ${Math.round(avgAccuracy)}% accuracy)`;
  };

  // Filter sessions based on permissions
  const permissionFilteredSessions = useMemo(
    () => {
      // Ensure sessions is an array
      if (!Array.isArray(sessions)) {
        console.error('Sessions is not an array:', sessions);
        return [];
      }
      
      console.log("Filtering sessions. canViewAll:", canViewAll, "sessions count:", sessions.length);
      
      if (canViewAll) return sessions;
      
      return sessions.filter(session => {
        const providerId = session?.sessionId?.provider;
        const userId = currentUser?._id;
        console.log("Comparing provider:", providerId, "with user:", userId);
        return providerId === userId;
      });
    },
    [canViewAll, sessions, currentUser]
  );

  // Filter sessions based on search query
  const visibleSessions = useMemo(() => {
    // Ensure we have an array
    if (!Array.isArray(permissionFilteredSessions)) {
      console.error('permissionFilteredSessions is not an array');
      return [];
    }
    
    if (sessionSearchQuery.trim() === '') return permissionFilteredSessions;
    const searchLower = sessionSearchQuery.toLowerCase();
    
    return permissionFilteredSessions.filter(session => {
      const searchableText = [
        formatDate(session.sessionId.dateOfSession),
        session.sessionId.sessionType,
        session.sessionId.status,
        session.clientId.name,
        session.providerObservation,
        ...session.activityEngaged,
        ...session.supportsObserved,
      ].filter(Boolean).join(' ').toLowerCase();
      
      return searchableText.includes(searchLower);
    });
  }, [permissionFilteredSessions, sessionSearchQuery]);

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
    setTimeout(() => {
      toast.success(`${selectedSessions.length} session note${selectedSessions.length !== 1 ? 's' : ''} downloaded successfully`);
      setSelectedSessions([]);
    }, 1500);
  };

  const openEditNote = (sessionIndex: number, session: SessionData) => {
    setEditingNoteIndex(sessionIndex);
    setEditNoteData(JSON.parse(JSON.stringify(session))); // Deep clone
    setIsEditingNote(true);
  };

  const handleEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Session note updated and will require re-signing');
    setIsEditingNote(false);
    setEditingNoteIndex(null);
    setEditNoteData(null);
  };

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#303630]">Session History</h3>
        {!canViewAll && (
          <Badge className="bg-[#395159] text-white">
            Showing Your Sessions Only
          </Badge>
        )}
      </div>
      
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
              key={session._id}
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
                    <p className="text-[#303630] font-semibold">
                      {formatDate(session.sessionId.dateOfSession)}
                    </p>
                    <Badge className="bg-green-500 text-white">
                      {session.sessionId.status}
                    </Badge>
                    <Badge variant="outline" className="border-blue-500 text-blue-600">
                      {session.sessionId.sessionType}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#395159] mb-2">
                    {formatDuration(session.duration)} • {formatTime(session.sessionId.startTime)} - {formatTime(session.sessionId.endTime)}
                  </p>
                  <p className="text-sm text-[#395159] mb-2">
                    Client: {session.clientId.name}
                  </p>
                  <p className="text-sm text-[#395159] mb-2">
                    Goals: {getGoalsSummary(session)}
                  </p>
                  {session.activityEngaged.length > 0 && (
                    <p className="text-sm text-[#395159] mb-2">
                      Activities: {session.activityEngaged.join(', ')}
                    </p>
                  )}
                  {session.supportsObserved.length > 0 && (
                    <p className="text-sm text-[#395159] mb-2">
                      Supports: {session.supportsObserved.join(', ')}
                    </p>
                  )}
                  {session.providerObservation && (
                    <p className="text-sm text-[#303630] mt-2">
                     Observation:  {session.providerObservation}
                    </p>
                  )}
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
                {/* {session.sessionId.provider === currentUser?._id && canEditSignedNotes && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    onClick={() => openEditNote(index, session)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Note
                  </Button>
                )} */}
              </div>
            </div>
          ))
        )}
      </div>
{/* edit dailog box ---------------- */}
      <Dialog open={isEditingNote} onOpenChange={setIsEditingNote}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Session Note
            </DialogTitle>
            <DialogDescription>
              Review and edit the session note details.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(95vh-120px)] pr-4">
            <form onSubmit={handleEditNote} className="space-y-4">
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
                  <Card className="p-4 bg-white">
                    <h4 className="text-[#303630] mb-3">Session Information</h4>
                    <Separator className="mb-4 bg-[#ccc9c0]" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-[#395159]">Date of Session</Label>
                        <Input
                          type="date"
                          value={editNoteData.sessionId.dateOfSession.split('T')[0]}
                          onChange={(e) => setEditNoteData({
                            ...editNoteData,
                            sessionId: {
                              ...editNoteData.sessionId,
                              dateOfSession: e.target.value + 'T00:00:00.000Z'
                            }
                          })}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-[#395159]">Session Type</Label>
                        <Input
                          value={editNoteData.sessionId.sessionType}
                          onChange={(e) => setEditNoteData({
                            ...editNoteData,
                            sessionId: { ...editNoteData.sessionId, sessionType: e.target.value }
                          })}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-[#395159]">Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={editNoteData.duration}
                          onChange={(e) => setEditNoteData({
                            ...editNoteData,
                            duration: parseInt(e.target.value) || 0
                          })}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-[#395159]">Status</Label>
                        <Input
                          value={editNoteData.sessionId.status}
                          onChange={(e) => setEditNoteData({
                            ...editNoteData,
                            sessionId: { ...editNoteData.sessionId, status: e.target.value }
                          })}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white">
                    <h4 className="text-[#303630] mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-orange-600" />
                      Goal Progress (Data Collection - Locked)
                    </h4>
                    <Separator className="mb-4 bg-[#ccc9c0]" />
                    <div className="space-y-4">
                      {editNoteData.goals_dataCollection.map((goal, idx) => (
                        <div key={goal._id} className="p-3 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-[#303630] font-semibold">Goal {idx + 1}</h5>
                            <Badge className={`${
                              goal.accuracy >= 80 ? 'bg-green-600' : 
                              goal.accuracy >= 60 ? 'bg-yellow-600' : 
                              'bg-orange-600'
                            } text-white`}>
                              {goal.accuracy}% Accuracy (Locked)
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="p-2 bg-gray-100 rounded border">
                              <Label className="text-xs text-gray-500">Total Trials</Label>
                              <p className="text-gray-700 font-semibold">{goal.total}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded border">
                              <Label className="text-xs text-gray-500">Counter</Label>
                              <p className="text-gray-700 font-semibold">{goal.counter}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded border">
                              <Label className="text-xs text-gray-500">Accuracy</Label>
                              <p className="text-gray-700 font-semibold">{goal.accuracy}%</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="p-2 bg-white rounded border">
                              <Label className="text-xs text-gray-500 mb-1 block">Support Levels</Label>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <p className="text-xs text-gray-500">Independent</p>
                                  <p className="text-[#303630]">
                                    {goal.supportLevel.independent.success}/{goal.supportLevel.independent.count}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Minimal</p>
                                  <p className="text-[#303630]">
                                    {goal.supportLevel.minimal.success}/{goal.supportLevel.minimal.count}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Moderate</p>
                                  <p className="text-[#303630]">
                                    {goal.supportLevel.modrate.success}/{goal.supportLevel.modrate.count}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-orange-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Goal data collection metrics cannot be modified after the session
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white">
                    <h4 className="text-[#303630] mb-3">Activities Engaged</h4>
                    <Separator className="mb-4 bg-[#ccc9c0]" />
                    <div>
                      <Label className="text-sm text-[#395159] mb-2 block">Activities</Label>
                      <Input
                        value={editNoteData.activityEngaged.join(', ')}
                        onChange={(e) => setEditNoteData({
                          ...editNoteData, 
                          activityEngaged: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        placeholder="e.g., Building/Construction, Art Activities"
                        className="h-10"
                      />
                      <p className="text-xs text-[#395159] mt-1">Enter activities separated by commas</p>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white">
                    <h4 className="text-[#303630] mb-3">Supports Observed</h4>
                    <Separator className="mb-4 bg-[#ccc9c0]" />
                    <div>
                      <Label className="text-sm text-[#395159] mb-2 block">Therapeutic Supports</Label>
                      <Input
                        value={editNoteData.supportsObserved.join(', ')}
                        onChange={(e) => setEditNoteData({
                          ...editNoteData, 
                          supportsObserved: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        placeholder="e.g., Praxis Support, Wait Watch Wonder"
                        className="h-10"
                      />
                      <p className="text-xs text-[#395159] mt-1">Enter supports separated by commas</p>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white">
                    <h4 className="text-[#303630] mb-3">Provider Observations</h4>
                    <Separator className="mb-4 bg-[#ccc9c0]" />
                    <Textarea
                      value={editNoteData.providerObservation}
                      onChange={(e) => setEditNoteData({
                        ...editNoteData,
                        providerObservation: e.target.value
                      })}
                      rows={6}
                      placeholder="Enter clinical observations and notes..."
                    />
                  </Card>

                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
                    <Button type="submit" className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingNote(false);
                        setEditingNoteIndex(null);
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
    </Card>
  );
}