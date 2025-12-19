import { useState } from 'react';
import { AppHeader } from '../../components/AppHeader';
import { ArrowLeft, BookOpen, Lock, Users, FileText, Calendar, CheckCircle2, Bot, HelpCircle, BarChart, Send, Paperclip, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Separator } from '../../components/Seprator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Label } from '../../components/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/Accordition';
// import { Screen } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export function HelpScreen({ currentUser }:any) {

    const navigate = useNavigate()
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketPriority, setTicketPriority] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketCategory || !ticketPriority || !ticketDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Support ticket submitted successfully! We will respond within 24-48 hours.');
    
    // Reset form
    setTicketSubject('');
    setTicketCategory('');
    setTicketPriority('');
    setTicketDescription('');
  };

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader  />
      
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Tabs defaultValue="guide" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 bg-white border border-[#ccc9c0]">
            <TabsTrigger value="guide" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="ticket" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              <Send className="w-4 h-4 mr-2" />
              Submit a Ticket
            </TabsTrigger>
          </TabsList>

          {/* Getting Started Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <Card className="p-8 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-[#303630] text-3xl mb-3">Getting Started with DIR DataFlow</h2>
                  <p className="text-[#395159]">
                    A comprehensive guide to help you navigate the system and deliver high-quality EIDBI services
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#395159] text-white rounded-full flex items-center justify-center">
                        <span>1</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#303630] mb-3 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#395159]" />
                        Login & Security
                      </h3>
                      <Separator className="mb-3 bg-[#ccc9c0]" />
                      <div className="space-y-2 text-[#303630]">
                        <p className="leading-relaxed">
                          <strong>Login:</strong> Enter your username and password on the login screen.
                        </p>
                        <p className="leading-relaxed">
                          <strong>Two-Factor Authentication:</strong> Enter the 6-digit code sent to your registered device.
                        </p>
                        <p className="leading-relaxed">
                          <strong>Security Features:</strong> The system has a 5-minute idle timeout. Always log out when finished to protect client privacy.
                        </p>
                        <Badge variant="outline" className="border-[#395159] text-[#395159] mt-2">
                          Check for the encrypted connection indicator (lock icon) in the header
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#ccc9c0]" />

                  {/* Step 2 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#395159] text-white rounded-full flex items-center justify-center">
                        <span>2</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#303630] mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#395159]" />
                        Dashboard & Client Selection
                      </h3>
                      <Separator className="mb-3 bg-[#ccc9c0]" />
                      <div className="space-y-2 text-[#303630]">
                        <p className="leading-relaxed">
                          The Dashboard displays all clients assigned to you. Each client card shows:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Client name and basic information</li>
                          <li>Current ITP goals (up to 3 displayed)</li>
                          <li>Plan review alerts (yellow at 60 days, red flashing at 30 days)</li>
                          <li>Quick action buttons for sessions and client chart</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          <strong>Tip:</strong> Click on a client card or "View Client Chart" to see full client details, goals, and history.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#ccc9c0]" />

                  {/* Step 3 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#395159] text-white rounded-full flex items-center justify-center">
                        <span>3</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#303630] mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#395159]" />
                        Managing Goals
                      </h3>
                      <Separator className="mb-3 bg-[#ccc9c0]" />
                      <div className="space-y-2 text-[#303630]">
                        <p className="leading-relaxed">
                          <strong>Goal Bank:</strong> Access pre-loaded goals organized by FEDC levels (1-9). Navigate to Admin → Goal Bank.
                        </p>
                        <p className="leading-relaxed">
                          <strong>Adding Goals to Clients:</strong> In the Client Screen, use the "Manage Goals" section to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Add goals from the Goal Bank (with optional editing)</li>
                          <li>Create custom goals with full FEDC categorization</li>
                          <li>Set baseline data and mastery criteria</li>
                          <li>Edit existing goals directly in the client chart</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          <strong>Goal Structure:</strong> Each goal includes description, FEDC category, target behaviors, mastery criteria, and baseline data.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#ccc9c0]" />

                  {/* Step 4 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#395159] text-white rounded-full flex items-center justify-center">
                        <span>4</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#303630] mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#395159]" />
                        Data Collection Sessions
                      </h3>
                      <Separator className="mb-3 bg-[#ccc9c0]" />
                      <div className="space-y-2 text-[#303630]">
                        <p className="leading-relaxed">
                          <strong>Session Initiation:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Click "Start Session" from dashboard or client chart</li>
                          <li>Record session start time (auto-populated, editable)</li>
                          <li>Select attendees (parent, sibling, peer, therapist)</li>
                          <li>Note any client variables or concerns</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          <strong>During Data Collection:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Track goal progress with +/- buttons for each opportunity</li>
                          <li>Record support level for each trial (independent, minimal, moderate)</li>
                          <li>Select observed FEDC levels (if you have permission)</li>
                          <li>Document therapeutic supports and strategies used</li>
                          <li>Note activities and play themes engaged in</li>
                          <li>Add provider observations throughout the session</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          <strong>Completing Session:</strong> Click "Complete Session" to review data and proceed to AI note generation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#ccc9c0]" />

                  {/* Step 5 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#395159] text-white rounded-full flex items-center justify-center">
                        <span>5</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#303630] mb-3 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-[#395159]" />
                        AI-Generated Clinical Notes
                      </h3>
                      <Separator className="mb-3 bg-[#ccc9c0]" />
                      <div className="space-y-2 text-[#303630]">
                        <p className="leading-relaxed">
                          After completing data collection, the AI generates comprehensive HIPAA-compliant clinical documentation including:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Client and provider information</li>
                          <li>Session details and duration</li>
                          <li>Goal performance with percentages and support levels</li>
                          <li>FEDC observations and therapeutic strategies</li>
                          <li>Clinical observations and recommendations</li>
                          <li>Treatment changes (if any)</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          <strong>Review & Edit:</strong> Carefully review the generated note. Click "Edit Note" to modify any section. Changes are tracked.
                        </p>
                        <p className="leading-relaxed">
                          <strong>Sign & Finalize:</strong> Enter your full name as electronic signature. Once signed, the note is added to the client record.
                        </p>
                        <Badge variant="outline" className="border-green-600 text-green-700 mt-2">
                          Notes can be edited and re-signed from Session History if needed
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#ccc9c0]" />

                  {/* Step 6 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#395159] text-white rounded-full flex items-center justify-center">
                        <span>6</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#303630] mb-3 flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-[#395159]" />
                        Progress Monitoring & Reports
                      </h3>
                      <Separator className="mb-3 bg-[#ccc9c0]" />
                      <div className="space-y-2 text-[#303630]">
                        <p className="leading-relaxed">
                          <strong>Goal Review:</strong> Available through Admin menu (requires appropriate permissions)
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>View comprehensive progress graphs for each goal</li>
                          <li>Compare current performance to baseline</li>
                          <li>Track toward mastery criteria</li>
                          <li>Generate PDF reports for treatment team</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          <strong>Reports & Analytics:</strong> Access detailed analytics including client progress, FEDC observations over time, and provider metrics.
                        </p>
                        <p className="leading-relaxed">
                          <strong>Session History:</strong> View all past sessions with ability to review and edit/re-sign notes as needed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#ccc9c0]" />

                  {/* Additional Features */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#395159] text-white rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#303630] mb-3">Additional Features</h3>
                      <Separator className="mb-3 bg-[#ccc9c0]" />
                      <div className="space-y-3 text-[#303630]">
                        <div>
                          <strong>Calendar:</strong> View and manage all scheduled sessions, color-coded by client.
                        </div>
                        <div>
                          <strong>Task Management:</strong> Create, assign, and track tasks with priority levels and completion status.
                        </div>
                        <div>
                          <strong>Admin Functions:</strong> Manage providers, configure permissions, and oversee system settings (admin/super admin only).
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="p-8 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-[#303630] text-3xl mb-3">Frequently Asked Questions</h2>
                  <p className="text-[#395159]">
                    Quick answers to common questions about using DIR DataFlow
                  </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {/* Account & Login */}
                  <AccordionItem value="faq-1" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      How do I reset my password?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Contact your system administrator or clinical supervisor to reset your password. For security reasons, password resets must be done by authorized personnel. You will receive a temporary password that you'll be prompted to change on your next login.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Why does my session keep timing out?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      DIR DataFlow has a 5-minute idle timeout for HIPAA compliance and security. If you're inactive for 5 minutes, you'll be automatically logged out. To prevent this, make sure to interact with the system regularly. Any unsaved data will be preserved and can be recovered when you log back in.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-3" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      What should I do if I don't receive my 2FA code?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      First, check your spam/junk folder. If the code still doesn't arrive within 2-3 minutes, click "Resend Code" on the 2FA screen. If you continue to have issues, contact your system administrator to verify your registered phone number or email address.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Data Collection */}
                  <AccordionItem value="faq-4" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Can I edit session data after completing a session?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Session data (goal tracking, FEDC observations, etc.) cannot be edited after the session is completed and the note is signed. However, you can edit the clinical note text and re-sign it if you have the "Edit Signed Notes" permission. This ensures data integrity while allowing for documentation corrections.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-5" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Why can't I see the FEDC section during data collection?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Only providers with the "Collect FEDC Data" permission can access FEDC observation tracking. This ensures that only qualified providers trained in DIRFloortime assessment are recording FEDC levels. Contact your administrator if you need this permission.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-6" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      What happens if I accidentally close the browser during data collection?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Your session data is automatically saved as you enter it. When you log back in, you'll be able to continue where you left off. However, it's best practice to complete sessions in one sitting when possible to maintain accuracy.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Goals & ITPs */}
                  <AccordionItem value="faq-7" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      How do I add a custom goal that's not in the Goal Bank?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      In the Client Screen, go to the "Manage Goals" section and click "Add Custom Goal." You'll be able to create a fully customized goal with your own description, FEDC categorization, target behaviors, and mastery criteria. Custom goals function exactly the same as Goal Bank goals for tracking purposes.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-8" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Can I edit a goal after it's been added to a client's ITP?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Yes, you can edit goal descriptions, mastery criteria, and other details directly in the Client Screen. However, changing the core goal structure after data collection has begun may affect historical tracking. It's best to discontinue an old goal and add a new one if making significant changes.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Clinical Notes */}
                  <AccordionItem value="faq-9" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Can I write my own clinical note instead of using AI generation?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Yes! After completing data collection, you have the option to either "Generate AI Note" or "Complete Note Manually." The manual option provides a blank template that you can fill in yourself while still maintaining the structured format required for EIDBI documentation.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-10" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      What does it mean when a note is marked as "Edited"?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      An "Edited" badge appears when you've made changes to an AI-generated note before signing. This provides transparency and audit tracking, showing that the final signed note differs from the original AI output. This is a normal part of the clinical review process.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Reports & Progress */}
                  <AccordionItem value="faq-11" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Why can't I see other providers' sessions for my clients?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      By default, providers can only see their own session history. This protects clinical independence and documentation integrity. If you need to view sessions from other providers (e.g., for supervision or coordination), your administrator can grant you the "View All Sessions" permission.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-12" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      How do I export a progress report or goal review?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      In the Goal Review screen, after viewing a client's progress data, click the "Download PDF" button at the bottom of the review. This generates a comprehensive PDF report including all graphs, data tables, and clinical recommendations that can be shared with the treatment team or attached to client records.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Permissions & Security */}
                  <AccordionItem value="faq-13" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      What's the difference between Admin and Super Admin roles?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Admins can manage clients, providers, and most system settings. Super Admins have additional privileges including account management, subscription settings, and the ability to manage other admin accounts. Super Admin is typically reserved for practice owners or clinical directors.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-14" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Is my data secure and HIPAA compliant?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Yes. DIR DataFlow uses encrypted connections (SSL/TLS), two-factor authentication, role-based access controls, automatic session timeouts, and secure electronic signatures. All features are designed with HIPAA compliance in mind. However, DIR DataFlow is not intended for collecting PII beyond what's necessary for clinical documentation.
                    </AccordionContent>
                  </AccordionItem>

                  {/* QSP & Signatures */}
                  <AccordionItem value="faq-15" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      What is QSP review and signature, and when do I need it?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      QSP (Qualified Supervising Professional) review is required for EIDBI services when providers at Level 1 or Level 2 need supervision. If you're a Level 1 or Level 2 provider, your sessions will require co-signature from a QSP-certified provider. The QSP Review screen allows supervisors to review and sign multiple sessions efficiently.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Billing & Account */}
                  <AccordionItem value="faq-16" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      How does the $22/client pricing work?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      DIR DataFlow charges $22 per active client per month. Active clients are those with at least one goal in their ITP. You can add or remove clients at any time, and billing adjusts automatically. The Account Management screen shows your current client count and next billing date.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-17" className="border border-[#ccc9c0] rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-[#303630] hover:text-[#395159]">
                      Can I update my payment method?
                    </AccordionTrigger>
                    <AccordionContent className="text-[#303630]">
                      Yes. Super Admins can update payment methods in the Account Management screen under "Payment Method." Click "Update Payment Method" to enter new card details. The change takes effect immediately and will be used for your next billing cycle.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-8 p-6 bg-[#efefef] rounded-lg border-2 border-[#395159]">
                  <h4 className="text-[#303630] mb-3 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#395159]" />
                    Can't Find Your Answer?
                  </h4>
                  <p className="text-[#303630]">
                    If your question isn't answered here, please submit a support ticket and we'll get back to you within 24-48 hours.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Submit a Ticket Tab */}
          <TabsContent value="ticket" className="space-y-6">
            <Card className="p-8 bg-white">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-[#303630] text-3xl mb-3">Submit a Support Ticket</h2>
                  <p className="text-[#395159]">
                    Need help? Submit a ticket and our support team will respond within 24-48 hours
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Before submitting:</strong> Check the FAQs tab for quick answers to common questions. For urgent technical issues during business hours, contact your system administrator directly.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject" className="text-[#303630]">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="Brief summary of your issue"
                        className="mt-1 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-[#303630]">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={ticketCategory} onValueChange={setTicketCategory}>
                        <SelectTrigger className="mt-1 h-12">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account & Login Issues</SelectItem>
                          <SelectItem value="data-collection">Data Collection & Sessions</SelectItem>
                          <SelectItem value="goals">Goals & ITP Management</SelectItem>
                          <SelectItem value="notes">Clinical Notes & Documentation</SelectItem>
                          <SelectItem value="reports">Reports & Analytics</SelectItem>
                          <SelectItem value="permissions">Permissions & Access</SelectItem>
                          <SelectItem value="billing">Billing & Subscription</SelectItem>
                          <SelectItem value="technical">Technical Issues</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority" className="text-[#303630]">
                        Priority <span className="text-red-500">*</span>
                      </Label>
                      <Select value={ticketPriority} onValueChange={setTicketPriority}>
                        <SelectTrigger className="mt-1 h-12">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Low - General question or minor issue
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              Medium - Issue affecting workflow
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              High - Critical issue blocking work
                            </div>
                          </SelectItem>
                          <SelectItem value="urgent">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Urgent - System down or data loss
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-[#303630]">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        placeholder="Please provide as much detail as possible:&#10;&#10;• What were you trying to do?&#10;• What happened instead?&#10;• What error messages did you see?&#10;• What steps can we take to reproduce the issue?"
                        className="mt-1 min-h-[200px]"
                      />
                      <p className="text-sm text-[#395159] mt-2">
                        Include specific details like client names (use initials), screen names, and exact error messages if applicable.
                      </p>
                    </div>

                    <div>
                      <Label className="text-[#303630]">
                        Attachments (Optional)
                      </Label>
                      <div className="mt-2 border-2 border-dashed border-[#ccc9c0] rounded-lg p-8 text-center hover:border-[#395159] transition-colors cursor-pointer">
                        <Paperclip className="w-8 h-8 text-[#395159] mx-auto mb-2" />
                        <p className="text-sm text-[#303630]">
                          Click to upload screenshots or files
                        </p>
                        <p className="text-xs text-[#395159] mt-1">
                          Max file size: 10MB. Supported: PNG, JPG, PDF
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-[#ccc9c0]" />

                    <div className="bg-[#efefef] p-4 rounded-lg">
                      <h4 className="text-[#303630] mb-2">Your Contact Information</h4>
                      <div className="space-y-2 text-sm text-[#303630]">
                        <div className="flex gap-2">
                          <strong>Name:</strong> <span>{currentUser?.name || 'Dr. Emily Anderson'}</span>
                        </div>
                        <div className="flex gap-2">
                          <strong>Email:</strong> <span>{currentUser?.email || 'emily.anderson@infinitytherapy.com'}</span>
                        </div>
                        <div className="flex gap-2">
                          <strong>Role:</strong> <span>{currentUser?.role || 'Admin'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#395159] mt-3">
                        We'll send updates about your ticket to the email address above.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSubmitTicket}
                        className="flex-1 h-14 bg-[#395159] hover:bg-[#303630] text-white"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Submit Ticket
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTicketSubject('');
                          setTicketCategory('');
                          setTicketPriority('');
                          setTicketDescription('');
                        }}
                        className="h-14 border-[#395159] text-[#395159]"
                      >
                        Clear Form
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
