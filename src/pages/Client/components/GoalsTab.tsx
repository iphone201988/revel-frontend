import React, { useState } from 'react'
import { TabsContent } from '../../../components/Tabs';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Calendar, Edit, Plus, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/Dailog';
import { Badge } from '../../../components/Badge';
import { Label } from '../../../components/Label';
import { Textarea } from '../../../components/Textarea';
import { Input } from '../../../components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/Select';


const ItpGoalsTab = () => {
    const [selectedBankGoal, setSelectedBankGoal] = useState<any>(null);
    const [editedGoalText, setEditedGoalText] = useState('');
    const [goalTargetDate, setGoalTargetDate] = useState('');
    const [baselineData, setBaselineData] = useState('0');
     const selectBankGoal = (goal: any) => {
    setSelectedBankGoal(goal);
    setEditedGoalText(goal.goal);
  };
  
  const [isModifyingCriteria, setIsModifyingCriteria] = useState(false);
  const [modifyingGoalId, setModifyingGoalId] = useState<number | null>(null);
  const [criteriaMasteryPercentage, setCriteriaMasteryPercentage] = useState('80');
  const [criteriaMasterySessionCount, setCriteriaMasterySessionCount] = useState('5');
  const [criteriaSupportLevel, setCriteriaSupportLevel] = useState('independent');
    const openModifyCriteria = (goal: any) => {
    setModifyingGoalId(goal.id);
    setCriteriaMasteryPercentage('80');
    setCriteriaMasterySessionCount('5');
    setCriteriaSupportLevel('independent');
    setIsModifyingCriteria(true);
  };
  return (
    <div>
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
    </div>
  )
}

export default ItpGoalsTab
