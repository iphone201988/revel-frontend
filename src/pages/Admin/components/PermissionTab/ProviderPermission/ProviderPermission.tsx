import React, { useState, useEffect } from 'react';
import { AppHeader } from '../../../../../components/AppHeader';
import { ArrowLeft, Shield, Save, User, Lock } from 'lucide-react';
import { Button } from '../../../../../components/Button';
import { Card } from '../../../../../components/Card';
import { Label } from '../../../../../components/Label';
import { Switch } from '../../../../../components/Switch';
// import { Screen } from '../types/navigation';
import { toast } from 'react-toastify';
import { Badge } from '../../../../../components/Badge';
import { Alert, AlertDescription } from '../../../../../components/Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import { useViewPermissionsQuery } from '../../../../../redux/api/provider';

interface ProviderPermissionsScreenProps {
  providerId: string | null;
  onNavigate: (screen: Screen, providerId?: string) => void;
  onLogout: () => void;
}

interface ProviderPermissions {
  id: string;
  name: string;
  credential: string;
  clinicRole: string;
  systemRole: string;
  permissions: {
    viewAssignedClients: boolean;
    viewAllClients: boolean;
    addEditClients: boolean;
    deleteClients: boolean;
    viewSessionData: boolean;
    viewAllSessions: boolean;
    enterSessionData: boolean;
    collectFEDCData: boolean;
    generateAINotes: boolean;
    editSignedNotes: boolean;
    editNarrativeReports: boolean;
    accessAdminPanel: boolean;
    manageProviders: boolean;
    addClientGoals: boolean;
    editClientGoals: boolean;
    editMasteryCriteria: boolean;
    viewGoalBank: boolean;
    editGoalBank: boolean;
    scheduleSessions: boolean;
    viewProgressReports: boolean;
    exportData: boolean;
    managePermissions: boolean;
  };
}



const permissionCategories = [
  {
    category: 'Client Management',
    permissions: [
      { key: 'viewAssignedClients' as const, label: 'View Assigned Clients', description: 'View only clients assigned to this provider' },
      { key: 'viewAllClients' as const, label: 'View All Clients', description: 'View all clients in the organization' },
      { key: 'addEditClients' as const, label: 'Add/Edit Clients', description: 'Create and modify client records' },
      { key: 'deleteClients' as const, label: 'Delete Clients', description: 'Remove client records from system' },
    ],
  },
  {
    category: 'Session Data',
    permissions: [
      { key: 'viewSessionData' as const, label: 'View Session Data', description: 'Access session notes and data' },
      { key: 'viewAllSessions' as const, label: 'View All Sessions', description: 'View all providers\' sessions (not just own)' },
      { key: 'enterSessionData' as const, label: 'Enter Session Data', description: 'Record session data and observations' },
      { key: 'collectFEDCData' as const, label: 'Collect FEDC Data', description: 'Access FEDC observation data collection' },
      { key: 'generateAINotes' as const, label: 'Generate AI Notes', description: 'Use AI to generate clinical notes' },
      { key: 'editSignedNotes' as const, label: 'Edit Signed Notes', description: 'Modify and re-sign session notes after they have been signed (note text only, not session data)' },
      { key: 'editNarrativeReports' as const, label: 'Edit Narrative Reports', description: 'Edit and modify generated narrative progress reports' },
    ],
  },
  {
    category: 'Goal Management',
    permissions: [
      { key: 'addClientGoals' as const, label: 'Add Client Goals', description: 'Add new goals to client treatment plans' },
      { key: 'editClientGoals' as const, label: 'Edit Client Goals', description: 'Modify existing goals for clients' },
      { key: 'editMasteryCriteria' as const, label: 'Edit Mastery Criteria', description: 'Modify goal mastery criteria and baseline data' },
      { key: 'viewGoalBank' as const, label: 'View Goal Bank', description: 'Access goal templates and bank' },
      { key: 'editGoalBank' as const, label: 'Edit Goal Bank', description: 'Modify and create goal templates' },
    ],
  },
  {
    category: 'Scheduling & Reports',
    permissions: [
      { key: 'scheduleSessions' as const, label: 'Schedule Sessions', description: 'Create and manage session appointments' },
      { key: 'viewProgressReports' as const, label: 'View Progress Reports', description: 'Access client progress analytics and FEDC tracking' },
      { key: 'exportData' as const, label: 'Export Data', description: 'Export reports and data files' },
    ],
  },
  {
    category: 'Administration',
    permissions: [
      { key: 'accessAdminPanel' as const, label: 'Access Admin', description: 'View administrative interface' },
      { key: 'manageProviders' as const, label: 'Manage Providers', description: 'Add, edit, and remove providers' },
      { key: 'managePermissions' as const, label: 'Manage Permissions', description: 'Configure provider permissions (Super Admin only)' },
    ],
  },
];

export function ProviderPermissionsScreen() {


    const {data: permissions} = useViewPermissionsQuery();
    const location = useLocation()

    // const provider = location?.state?.provider
    const navigate = useNavigate()
  const [provider, setProvider] = useState<ProviderPermissions | null>(null);

  useEffect(() => {
    if (provider) {
      const foundProvider = provider.find(p => p.id === providerId);
      if (foundProvider) {
        // If provider is Super Admin, ensure all permissions are enabled
        if (foundProvider.role === 'Super Admin') {
          const allPermissionsEnabled = Object.keys(foundProvider.permissions).reduce((acc, key) => {
            acc[key as keyof ProviderPermissions['permissions']] = true;
            return acc;
          }, {} as ProviderPermissions['permissions']);
          
          setProvider({
            ...foundProvider,
            permissions: allPermissionsEnabled,
          });
        } else {
          setProvider(foundProvider);
        }
      }
    }
  }, [provider]);

  const handlePermissionToggle = (permissionKey: keyof ProviderPermissions['permissions']) => {
    if (!provider) return;
    
    // Don't allow toggling permissions for Super Admins
    if (provider.systemRole === '1') {
      return;
    }
    
    setProvider({
      ...provider,
      permissions: {
        ...provider.permissions,
        [permissionKey]: !provider.permissions[permissionKey],
      },
    });
  };

  const handleSavePermissions = () => {
    if (provider?.role === 'Super Admin') {
      toast.error('Super Admin permissions cannot be modified');
      return;
    }
    toast.success(`Permissions updated for ${provider?.name}`);
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#efefef]">
        <AppHeader title="Provider Permissions" onLogout={onLogout} onNavigate={onNavigate} />
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <p className="text-[#395159]">Provider not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader  onLogout={()=>{}}  />
      
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate('/permissions')}
            variant="outline"
            className="border-[#395159] text-[#395159]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Permissions
          </Button>

          <Button
            onClick={handleSavePermissions}
            className="bg-[#395159] hover:bg-[#303630] text-white"
            disabled={provider.systemRole === 'Super Admin'}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="mb-6 p-4 bg-white border-l-4 border-[#395159] rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#395159] mt-0.5" />
            <div>
              <h3 className="text-[#303630] mb-1">Super Admin Access Only</h3>
              <p className="text-[#395159] text-sm">
                Configure what this provider can do within the system. 
                Changes take effect immediately upon saving.
              </p>
            </div>
          </div>
        </div>

        {provider.systemRole === 'Super Admin' && (
          <Alert className="mb-6 border-[#395159] bg-[#395159]/5">
            <Lock className="h-4 w-4 text-[#395159]" />
            <AlertDescription className="text-[#303630]">
              <strong>Super Admin Permissions Locked:</strong> Super Admins automatically have all permissions enabled. 
              To modify permissions, first change this provider's role to Admin or User in the Provider Edit screen.
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6 bg-white mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#395159] flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-[#303630] mb-2">{provider.name}</h2>
              <div className="flex gap-4 text-sm text-[#395159] mb-3">
                <span>{provider.credential}</span>
                <span>• {provider.clinicRole}</span>
              </div>
              <Badge 
                className={
                  provider.systemRole === 'Super Admin' 
                    ? 'bg-[#395159] text-white' 
                    : provider.systemRole === 'Admin'
                    ? 'bg-[#303630] text-white'
                    : 'bg-[#ccc9c0] text-[#303630]'
                }
              >
                {provider.systemRole}
              </Badge>
            </div>
          </div>
        </Card>

        <h2 className="text-[#303630] mb-6">Permissions</h2>

        <div className="space-y-6">
          {permissionCategories.map((category) => (
            <Card key={category.category} className="p-6 bg-white">
              <h3 className="text-[#303630] mb-4">{category.category}</h3>
              <div className="space-y-4">
                {category.permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className="flex items-start justify-between p-4 bg-[#efefef] rounded-lg"
                  >
                    <div className="flex-1">
                      <Label htmlFor={`${provider.id}-${permission.key}`} className="text-[#303630] cursor-pointer">
                        {permission.label}
                      </Label>
                      <p className="text-sm text-[#395159] mt-1">{permission.description}</p>
                    </div>
                    <Switch
                      id={`${provider.id}-${permission.key}`}
                      checked={provider.permissions[permission.key]}
                      onCheckedChange={() => handlePermissionToggle(permission.key)}
                      className="data-[state=checked]:bg-[#395159]"
                      disabled={provider.systemRole === 'Super Admin'}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSavePermissions}
            className="bg-[#395159] hover:bg-[#303630] text-white h-12 px-8"
            disabled={provider.systemRole === 'Super Admin'}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
