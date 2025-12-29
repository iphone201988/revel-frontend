import React, { useState } from 'react';
import { AlertTriangle, Shield, Clock, Key, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { Textarea } from '../../../components/Textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/Dailog';
import { Alert, AlertDescription } from '../../../components/Alert';
import { showError, showSuccess } from '../../../components/CustomToast';


interface EmergencyAccessModalProps {
  open: boolean;
  onClose: () => void;
  userRole: string;
  onAccessGranted?: (code: string) => void;
}

export function EmergencyAccessModal({ open, onClose, userRole, onAccessGranted }: EmergencyAccessModalProps) {
  const [mode, setMode] = useState<'generate' | 'verify'>('generate');
  const [reason, setReason] = useState('');
  const [code, setCode] = useState('');
  const [clientId, setClientId] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userRole !== 'Super Admin') {
      showError('Only Super Admins can generate emergency access codes');
      return;
    }

    setLoading(true);
    try {
      // In production, call backend API
      // const response = await fetch('/api/emergency-access/generate-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason })
      // });
      // const data = await response.json();
      
      // Mock implementation
      const mockCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const mockExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      setGeneratedCode(mockCode);
      setExpiresAt(mockExpiry);
      
      showSuccess('Emergency access code generated successfully');
    } catch (error) {
      console.error('Error generating code:', error);
      showError('Failed to generate emergency access code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In production, call backend API
      // const response = await fetch('/api/emergency-access/verify-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code, clientId })
      // });
      // const data = await response.json();
      
      // Mock implementation
      showSuccess('Emergency access granted for 4 hours');
      
      if (onAccessGranted) {
        onAccessGranted(code);
      }
      
      onClose();
    } catch (error) {
      console.error('Error verifying code:', error);
      showError('Invalid or expired emergency access code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
     showSuccess('Code copied to clipboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-[#303630]">Emergency ePHI Access</DialogTitle>
              <DialogDescription>
                HIPAA-compliant emergency access to protected health information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Alert className="border-orange-200 bg-orange-50">
          <Shield className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-900">
            <strong>HIPAA Compliance:</strong> All emergency access attempts are logged and audited. 
            Use only in legitimate emergencies when normal access procedures cannot be followed.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'generate' ? 'default' : 'outline'}
            onClick={() => setMode('generate')}
            className={mode === 'generate' ? 'bg-[#395159]' : 'border-[#395159] text-[#395159]'}
            disabled={userRole !== 'Super Admin'}
          >
            <Key className="w-4 h-4 mr-2" />
            Generate Code
          </Button>
          <Button
            variant={mode === 'verify' ? 'default' : 'outline'}
            onClick={() => setMode('verify')}
            className={mode === 'verify' ? 'bg-[#395159]' : 'border-[#395159] text-[#395159]'}
          >
            <Shield className="w-4 h-4 mr-2" />
            Verify Code
          </Button>
        </div>

        {mode === 'generate' && (
          <>
            {userRole !== 'Super Admin' && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-900">
                  Only Super Admins can generate emergency access codes.
                </AlertDescription>
              </Alert>
            )}

            {!generatedCode ? (
              <form onSubmit={handleGenerateCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Emergency Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the emergency situation requiring ePHI access..."
                    value={reason}
                    onChange={(e:any) => setReason(e.target.value)}
                    className="min-h-24"
                    required
                    disabled={userRole !== 'Super Admin'}
                  />
                  <p className="text-sm text-[#395159]">
                    This reason will be included in the audit log
                  </p>
                </div>

                <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#395159] mt-0.5" />
                    <div>
                      <p className="text-[#303630] mb-1">Code Validity</p>
                      <p className="text-sm text-[#395159]">
                        Emergency access codes expire after 24 hours and can only be used once
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading || userRole !== 'Super Admin'}
                >
                  {loading ? 'Generating...' : 'Generate Emergency Access Code'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    Emergency access code generated successfully
                  </AlertDescription>
                </Alert>

                <div className="p-6 bg-[#efefef] rounded-lg border-2 border-[#395159] text-center">
                  <Label className="text-sm text-[#395159] mb-2 block">Emergency Access Code</Label>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <code className="text-3xl tracking-widest text-[#303630] bg-white px-6 py-3 rounded border-2 border-[#ccc9c0]">
                      {generatedCode}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                  >
                    Copy Code
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-[#ccc9c0]">
                    <p className="text-sm text-[#395159] mb-1">Expires</p>
                    <p className="text-[#303630]">
                      {expiresAt ? new Date(expiresAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#ccc9c0]">
                    <p className="text-sm text-[#395159] mb-1">Valid For</p>
                    <p className="text-[#303630]">24 hours</p>
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-orange-900">
                    <strong>Important:</strong> Store this code securely. It cannot be retrieved again 
                    and will be logged in the audit trail.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => {
                    setGeneratedCode(null);
                    setExpiresAt(null);
                    setReason('');
                    onClose();
                  }}
                  className="w-full h-12 bg-[#395159] hover:bg-[#303630] text-white"
                >
                  Close
                </Button>
              </div>
            )}
          </>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Emergency Access Code *</Label>
              <Input
                id="code"
                placeholder="Enter 8-character code"
                value={code}
                onChange={(e:any) => setCode(e.target.value.toUpperCase())}
                className="h-12 uppercase tracking-widest text-center"
                maxLength={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                placeholder="Enter client ID requiring emergency access"
                value={clientId}
                onChange={(e:any) => setClientId(e.target.value)}
                className="h-12"
                required
              />
              <p className="text-sm text-[#395159]">
                Access will be granted for this specific client only
              </p>
            </div>

            <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#395159] mt-0.5" />
                <div>
                  <p className="text-[#303630] mb-1">Session Duration</p>
                  <p className="text-sm text-[#395159]">
                    Emergency access will be valid for 4 hours from verification
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code & Grant Access'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
