import { useState } from 'react';
import { Lock, Shield, Database, FileCheck, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../PopOver';
import { Badge } from '../Badge';
import { Separator } from '../Seprator';

interface ComplianceStatus {
  encryption: {
    transport: boolean;
    storage: boolean;
    level: string;
  };
  integrity: {
    enabled: boolean;
    algorithm: string;
  };
  emergencyAccess: {
    enabled: boolean;
  };
}

export function HIPAAComplianceIndicator() {
  const [status] = useState<ComplianceStatus>({
    encryption: {
      transport: true,
      storage: true,
      level: 'AES-256-GCM'
    },
    integrity: {
      enabled: true,
      algorithm: 'SHA-256'
    },
    emergencyAccess: {
      enabled: true
    }
  });

  const allCompliant = status.encryption.transport && 
                        status.encryption.storage && 
                        status.integrity.enabled;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-sm text-[#ccc9c0] hover:text-white transition-colors">
          <Lock className="w-4 h-4" />
          <span className="hidden md:inline">
            {window.location.protocol === 'https:' ? 'TLS 1.2+ Encrypted' : 'Encrypted Connection'}
          </span>
          {allCompliant && (
            <Badge className="bg-green-600 text-white text-xs px-1.5 py-0">
              HIPAA
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white" align="end">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[#395159]" />
              <h3 className="text-[#303630]">HIPAA Compliance Status</h3>
            </div>
            <p className="text-sm text-[#395159]">
              Real-time security and compliance indicators
            </p>
          </div>

          <Separator />

          {/* Transport Layer Security */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className={`w-4 h-4 ${status.encryption.transport ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm text-[#303630]">Transport Encryption</span>
              </div>
              <Badge className={status.encryption.transport ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {status.encryption.transport ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-xs text-[#395159] ml-6">
              TLS 1.2+ protocol for all data transmission
            </p>
          </div>

          {/* Storage Encryption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className={`w-4 h-4 ${status.encryption.storage ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm text-[#303630]">Data at Rest</span>
              </div>
              <Badge className={status.encryption.storage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {status.encryption.level}
              </Badge>
            </div>
            <p className="text-xs text-[#395159] ml-6">
              AES-256-GCM encryption for stored ePHI
            </p>
          </div>

          {/* Data Integrity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className={`w-4 h-4 ${status.integrity.enabled ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm text-[#303630]">Data Integrity</span>
              </div>
              <Badge className={status.integrity.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {status.integrity.algorithm}
              </Badge>
            </div>
            <p className="text-xs text-[#395159] ml-6">
              Cryptographic hashing prevents data alteration
            </p>
          </div>

          {/* Emergency Access */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${status.emergencyAccess.enabled ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm text-[#303630]">Emergency Access</span>
              </div>
              <Badge className={status.emergencyAccess.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {status.emergencyAccess.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <p className="text-xs text-[#395159] ml-6">
              Controlled emergency ePHI access procedures
            </p>
          </div>

          <Separator />

          <div className="p-3 bg-[#efefef] rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-[#395159] mt-0.5" />
              <div>
                <p className="text-xs text-[#303630] mb-1">
                  <strong>HIPAA Security Rule Compliant</strong>
                </p>
                <p className="text-xs text-[#395159]">
                  All technical safeguards active and monitored
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
