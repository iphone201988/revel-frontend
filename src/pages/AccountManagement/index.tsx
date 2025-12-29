import { useState } from 'react';
import { 
  CreditCard, 
  Users, 
  Calendar, 
  DollarSign, 
  Download,
  Tag,
  CheckCircle,
  AlertCircle,
  Lock,
  Edit,
  ArrowLeft,
  FileText,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { Badge } from '../../components/Badge';
import { Separator } from '../../components/Seprator';
import { Alert, AlertDescription } from '../../components/Alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/Dailog';
import { ScrollArea } from '../../components/ScrollArea';
import { toast } from 'react-toastify';
import { EmergencyAccessModal } from './components/EmergancyAccessModel';
import { useNavigate } from 'react-router-dom';
import { useGetUserProfileQuery } from '../../redux/api/provider';
import { SystemRoles } from '../../utils/enums/enum';
import { showError, showSuccess } from '../../components/CustomToast';


interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  clientCount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}

export function AccountManagementScreen() {
//   const isAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin';
//   const isAccountOwner = currentUser?.isAccountOwner || isAdmin;

  // Mock subscription data
  const [activeClients] = useState(12);
  const pricePerClient = 22.00;
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  // HIPAA BAA state
  const [baaSignature, setBaaSignature] = useState('');
  const [baaSignedDate, setBaaSignedDate] = useState<string | null>('2025-09-15'); // Mock signed date
  const [baaIsSigned, setBaaIsSigned] = useState(true); // Mock - already signed
  const [showBaaSignDialog, setShowBaaSignDialog] = useState(false);
  
  // Emergency Access state
  const [emergencyAccessOpen, setEmergencyAccessOpen] = useState(false);
  
  // Mock coupon data - available coupons in the system
  const coupons: Coupon[] = [
    {
      code: 'WELCOME2025',
      discountType: 'percentage',
      discountValue: 20,
      isActive: true
    },
    {
      code: 'SPECIAL50',
      discountType: 'fixed',
      discountValue: 50,
      isActive: true
    }
  ];

  // Mock billing history
  const billingHistory: BillingHistory[] = [
    {
      id: '1',
      date: '2025-10-01',
      amount: 264.00,
      clientCount: 12,
      status: 'paid',
      invoiceUrl: '#'
    },
    {
      id: '2',
      date: '2025-09-01',
      amount: 242.00,
      clientCount: 11,
      status: 'paid',
      invoiceUrl: '#'
    },
    {
      id: '3',
      date: '2025-08-01',
      amount: 220.00,
      clientCount: 10,
      status: 'paid',
      invoiceUrl: '#'
    }
  ];

  // Mock payment method
  const [paymentMethod] = useState({
    type: 'Visa',
    last4: '4242',
    expiry: '12/2026'
  });

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const coupon = coupons.find(c => c.code === appliedCoupon);
    if (!coupon) return 0;
    
    const subtotal = activeClients * pricePerClient;
    if (coupon.discountType === 'percentage') {
      return subtotal * (coupon.discountValue / 100);
    }
    return coupon.discountValue;
  };

  const subtotal = activeClients * pricePerClient;
  const discount = calculateDiscount();
  const total = subtotal - discount;
  const nextBillingDate = '2025-11-01';

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive);
    if (coupon) {
      setAppliedCoupon(coupon.code);
      showSuccess(`Coupon "${coupon.code}" applied successfully!`);
      setCouponCode('');
    } else {
      showError('Invalid or expired coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
   showSuccess('Coupon removed');
  };

  const handleSignBAA = () => {
    if (!baaSignature.trim()) {
      showError('Please enter your signature');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    setBaaSignedDate(today);
    setBaaIsSigned(true);
    setShowBaaSignDialog(false);
    setBaaSignature('');
   showSuccess('HIPAA BAA signed successfully');
  };

  const handleDownloadBAA = () => {
    // In production, this would generate and download the actual signed BAA PDF
   showSuccess('Downloading HIPAA BAA...');
    
    // Create a simple text representation for download
    const baaContent = `
HIPAA BUSINESS ASSOCIATE AGREEMENT

Organization: Infinity Therapy LLC
Application: DIR DataFlow

This Business Associate Agreement ("Agreement") is entered into between:
- Covered Entity (your organization)
- Business Associate: Infinity Therapy LLC

RECITALS:
The parties agree to the terms of HIPAA compliance as required by 45 CFR Parts 160 and 164.

[Full BAA text would be included here in production]

Signed By: ${currentUser?.name || 'Account Owner'}
Date: ${baaSignedDate}
Digital Signature: [Electronically Signed]
    `.trim();
    
    const blob = new Blob([baaContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HIPAA_BAA_InfinityTherapy_' + baaSignedDate + '.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // if (!isAccountOwner) {
  //   return (
  //     <div className="min-h-screen bg-[#efefef]">
  //       <AppHeader 
  //         onNavigate={onNavigate}
  //         onLogout={onLogout}
  //         currentUser={currentUser}
  //       />
  //       <div className="max-w-4xl mx-auto p-8">
  //         <Alert className="border-yellow-500 bg-yellow-50">
  //           <AlertCircle className="h-5 w-5 text-yellow-600" />
  //           <AlertDescription className="text-yellow-800">
  //             You do not have permission to access account management. Please contact your account owner.
  //           </AlertDescription>
  //         </Alert>
  //       </div>
  //     </div>
  //   );
  // }
const navigate =useNavigate()

const {data} = useGetUserProfileQuery()
const currentUser = data?.data
  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader 
      />
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-[#395159] hover:text-[#303630] hover:bg-[#ccc9c0]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-[#303630] mb-2">Account Management</h1>
          <p className="text-[#395159]">Manage your subscription, billing, and payment information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current Subscription Card */}
          <Card className="p-6 border-[#ccc9c0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#395159] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#395159]">Active Clients</div>
                <div className="text-2xl text-[#303630]">{activeClients}</div>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="text-sm text-[#395159]">
              ${pricePerClient.toFixed(2)} per client/month
            </div>
          </Card>

          {/* Next Billing Card */}
          <Card className="p-6 border-[#ccc9c0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#395159] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#395159]">Next Billing Date</div>
                <div className="text-[#303630]">{nextBillingDate}</div>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="text-sm text-[#395159]">
              Monthly billing cycle
            </div>
          </Card>

          {/* Amount Due Card */}
          <Card className="p-6 border-[#ccc9c0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#395159] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#395159]">Amount Due</div>
                <div className="text-2xl text-[#303630]">${total.toFixed(2)}</div>
              </div>
            </div>
            <Separator className="my-3" />
            {appliedCoupon && (
              <div className="text-sm text-green-600">
                Coupon applied: {appliedCoupon}
              </div>
            )}
          </Card>
        </div>

        {/* Billing Summary */}
        <Card className="p-6 mb-6 border-[#ccc9c0]">
          <h2 className="text-[#303630] mb-4">Billing Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[#395159]">Subscription ({activeClients} clients × ${pricePerClient.toFixed(2)})</span>
              <span className="text-[#303630]">${subtotal.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between items-center text-green-600">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Discount ({appliedCoupon})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-[#303630]">Total Due</span>
              <span className="text-2xl text-[#303630]">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Apply Coupon Section */}
          <div className="bg-[#efefef] p-4 rounded-lg">
            <Label className="text-[#303630] mb-2">Have a coupon code?</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button
                onClick={handleApplyCoupon}
                className="bg-[#395159] hover:bg-[#303630] text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-6 mb-6 border-[#ccc9c0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#303630]">Payment Method</h2>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(true)}
              className="border-[#395159] text-[#395159] hover:bg-[#395159] hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-[#efefef] rounded-lg">
            <div className="w-12 h-12 rounded bg-[#395159] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[#303630]">{paymentMethod.type} ending in {paymentMethod.last4}</div>
              <div className="text-sm text-[#395159]">Expires {paymentMethod.expiry}</div>
            </div>
            <Lock className="w-5 h-5 text-[#395159]" />
          </div>

          <Alert className="mt-4 border-[#395159] bg-blue-50">
            <CheckCircle className="h-4 w-4 text-[#395159]" />
            <AlertDescription className="text-[#395159]">
              All payments are processed securely and encrypted. We never store your full card details.
            </AlertDescription>
          </Alert>
        </Card>

        {/* Billing History */}
        <Card className="p-6 mb-6 border-[#ccc9c0]">
          <h2 className="text-[#303630] mb-4">Billing History</h2>
          
          <div className="space-y-3">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-[#efefef] rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[#303630]">{invoice.date}</div>
                    <div className="text-sm text-[#395159]">{invoice.clientCount} clients</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[#303630]">${invoice.amount.toFixed(2)}</div>
                    <Badge 
                      className={
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success('Invoice downloaded')}
                    className="border-[#395159] text-[#395159] hover:bg-[#395159] hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* HIPAA Business Associate Agreement */}
        <Card className="p-6 border-[#ccc9c0] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#395159] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[#303630]">HIPAA Business Associate Agreement</h2>
                <p className="text-sm text-[#395159]">Required for HIPAA compliance</p>
              </div>
            </div>
            {baaIsSigned && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Signed
              </Badge>
            )}
          </div>

          {baaIsSigned ? (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your HIPAA BAA was signed on {baaSignedDate}. You can download a copy below.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadBAA}
                  className="bg-[#395159] hover:bg-[#303630] text-white flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Signed BAA
                </Button>
                <Button
                  onClick={() => setShowBaaSignDialog(true)}
                  variant="outline"
                  className="border-[#395159] text-[#395159] hover:bg-[#395159] hover:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Review Agreement
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="border-yellow-500 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Please review and sign the HIPAA Business Associate Agreement to ensure compliance.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => setShowBaaSignDialog(true)}
                className="bg-[#395159] hover:bg-[#303630] text-white w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Review & Sign Agreement
              </Button>
            </div>
          )}
        </Card>

        {/* Emergency ePHI Access - Admin Only */}
        {currentUser?.systemRole === SystemRoles[1] &&currentUser?.systemRole === SystemRoles[2]  && (
          <Card className="p-6 border-red-400/50 bg-red-50/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[#303630]">Emergency ePHI Access</h2>
                  <p className="text-sm text-[#395159]">For emergency situations only</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Restricted
              </Badge>
            </div>

            <Alert className="border-orange-500 bg-orange-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900">
                <strong>HIPAA Compliance:</strong> Emergency access is for legitimate emergencies only when normal access procedures cannot be followed. All emergency access attempts are logged and audited.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setEmergencyAccessOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {currentUser?.role === 'Super Admin' ? 'Generate Emergency Access Code' : 'Request Emergency Access'}
            </Button>
          </Card>
        )}
      </div>

      {/* Update Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Update your credit card information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div>
              <Label htmlFor="name">Cardholder Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Payment method updated successfully');
                setShowPaymentDialog(false);
              }}
              className="bg-[#395159] hover:bg-[#303630] text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Update Securely
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HIPAA BAA Review & Sign Dialog */}
      <Dialog open={showBaaSignDialog} onOpenChange={setShowBaaSignDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#395159]" />
              HIPAA Business Associate Agreement
            </DialogTitle>
            <DialogDescription>
              Please review the agreement carefully before signing
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-96 w-full rounded border border-[#ccc9c0] p-6 bg-[#efefef]">
            <div className="space-y-4 text-sm text-[#303630]">
              <div>
                <h3 className="mb-2">BUSINESS ASSOCIATE AGREEMENT</h3>
                <p className="text-[#395159]">
                  This Business Associate Agreement ("Agreement") is entered into as of the date of signature below, 
                  between the Covered Entity (your organization) and Infinity Therapy LLC ("Business Associate").
                </p>
              </div>

              <div>
                <h4 className="mb-2">RECITALS:</h4>
                <p className="text-[#395159] mb-2">
                  WHEREAS, Business Associate provides the DIR DataFlow application to assist with EIDBI services 
                  and clinical documentation;
                </p>
                <p className="text-[#395159]">
                  WHEREAS, in connection with these services, Business Associate may create, receive, maintain, 
                  or transmit Protected Health Information (PHI) on behalf of Covered Entity;
                </p>
              </div>

              <div>
                <h4 className="mb-2">1. DEFINITIONS</h4>
                <p className="text-[#395159] mb-2">
                  Terms used but not otherwise defined in this Agreement shall have the same meaning as those 
                  terms in the HIPAA Rules, which include the Privacy, Security, Breach Notification, and 
                  Enforcement Rules at 45 CFR Part 160 and Part 164.
                </p>
              </div>

              <div>
                <h4 className="mb-2">2. OBLIGATIONS OF BUSINESS ASSOCIATE</h4>
                <p className="text-[#395159] mb-2">
                  Business Associate agrees to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-[#395159]">
                  <li>Not use or disclose PHI other than as permitted by this Agreement or as required by law</li>
                  <li>Use appropriate safeguards to prevent use or disclosure of PHI</li>
                  <li>Implement administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of electronic PHI</li>
                  <li>Report to Covered Entity any use or disclosure of PHI not provided for by this Agreement</li>
                  <li>Report to Covered Entity any Security Incident of which it becomes aware</li>
                  <li>Ensure that any subcontractors that create, receive, maintain, or transmit PHI agree to the same restrictions</li>
                  <li>Make available PHI in accordance with individuals' rights</li>
                  <li>Make PHI available to the Secretary of HHS for purposes of determining compliance with HIPAA</li>
                  <li>Return or destroy all PHI upon termination of the Agreement, if feasible</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">3. PERMITTED USES AND DISCLOSURES</h4>
                <p className="text-[#395159] mb-2">
                  Business Associate may use or disclose PHI to perform functions, activities, or services 
                  as specified in the service agreement, provided such use or disclosure would not violate 
                  the Privacy Rule if done by Covered Entity.
                </p>
              </div>

              <div>
                <h4 className="mb-2">4. OBLIGATIONS OF COVERED ENTITY</h4>
                <p className="text-[#395159] mb-2">
                  Covered Entity agrees to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-[#395159]">
                  <li>Provide Business Associate with the Notice of Privacy Practices</li>
                  <li>Notify Business Associate of any limitation in its Notice of Privacy Practices</li>
                  <li>Notify Business Associate of any changes in permissions by individuals</li>
                  <li>Not request Business Associate to use or disclose PHI in any manner that would not be permissible under the Privacy Rule</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">5. TERM AND TERMINATION</h4>
                <p className="text-[#395159] mb-2">
                  This Agreement shall be effective as of the date signed and shall terminate when all PHI 
                  provided by Covered Entity to Business Associate is destroyed or returned to Covered Entity, 
                  or if infeasible, protections are extended to such information.
                </p>
              </div>

              <div>
                <h4 className="mb-2">6. BREACH NOTIFICATION</h4>
                <p className="text-[#395159] mb-2">
                  Business Associate shall notify Covered Entity within 24 hours of discovery of a breach 
                  of unsecured PHI. The notification shall include available information regarding the breach.
                </p>
              </div>

              <div>
                <h4 className="mb-2">7. MISCELLANEOUS</h4>
                <p className="text-[#395159] mb-2">
                  This Agreement shall be governed by applicable federal and state law. Any ambiguity in 
                  this Agreement shall be resolved in favor of a meaning that permits Covered Entity to 
                  comply with the HIPAA Rules.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#ccc9c0]">
                <p className="text-[#395159]">
                  <strong>Business Associate:</strong> Infinity Therapy LLC<br />
                  <strong>Application:</strong> DIR DataFlow<br />
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </ScrollArea>

          {!baaIsSigned && (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="baa-signature">Your Signature *</Label>
                <p className="text-sm text-[#395159] mb-2">
                  Type your full name to electronically sign this agreement
                </p>
                <Input
                  id="baa-signature"
                  placeholder="Type your full name"
                  value={baaSignature}
                  onChange={(e) => setBaaSignature(e.target.value)}
                  className="h-12"
                />
              </div>

              <Alert className="border-[#395159] bg-blue-50">
                <Shield className="h-4 w-4 text-[#395159]" />
                <AlertDescription className="text-[#395159]">
                  By signing this agreement, you acknowledge that you have read, understood, and agree 
                  to be bound by the terms of this HIPAA Business Associate Agreement.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBaaSignDialog(false);
                setBaaSignature('');
              }}
            >
              {baaIsSigned ? 'Close' : 'Cancel'}
            </Button>
            {baaIsSigned ? (
              <Button
                onClick={handleDownloadBAA}
                className="bg-[#395159] hover:bg-[#303630] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download BAA
              </Button>
            ) : (
              <Button
                onClick={handleSignBAA}
                className="bg-[#395159] hover:bg-[#303630] text-white"
                disabled={!baaSignature.trim()}
              >
                <Shield className="w-4 h-4 mr-2" />
                Sign Agreement
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Access Modal */}
      <EmergencyAccessModal
        open={emergencyAccessOpen}
        onClose={() => setEmergencyAccessOpen(false)}
        userRole={currentUser?.role || 'User'}
      />
    </div>
  );
}