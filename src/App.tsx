
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOtp from './pages/auth/OTP'
import { AdminScreen } from './pages/Admin'
import { ProviderAddScreen } from './pages/Admin/components/ProviderManagement/AddProvider'
import { ProviderEditScreen } from './pages/Admin/components/ProviderManagement/EditProvider'
import { SessionInitiationScreen } from './pages/Session/StartSession'
import { ClientScreen } from './pages/Client'
import { PermissionsHomeScreen } from './pages/Admin/components/PermissionTab/PermissionsHomeScreen'
import { ProviderPermissionsScreen } from './pages/Admin/components/PermissionTab/ProviderPermission/ProviderPermission'
import { AuditLogScreen } from './pages/Admin/components/Audit/AuditLogs'
import { SessionDataCollectionScreen } from './pages/Session/SessionDataCollection/SessionDataCollection'
import { AINoteSummaryScreen } from './pages/AiNoteSummery/AiNoteSummery'
import { HelpScreen } from './pages/Help'
import { GoalReviewScreen } from './pages/Client/components/GoalReview'
import { ReportsScreen } from './pages/ReportScreen/ReportScreen'
import { AccountManagementScreen } from './pages/AccountManagement'
import { ProtectedRoute } from './components/ProtectedRoute'
import { QSPSignatureReviewScreen } from './pages/Dashboard/components/QSPSignatureReviewScreen'


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify' element={<VerifyOtp />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute permission="accessAdminPanel" />}>
            <Route path='/admin' element={<AdminScreen />} />
            <Route path='/audit-logs' element={<AuditLogScreen />} />
          </Route>

          <Route element={<ProtectedRoute permission="manageProviders" />}>
            <Route path='/provider-add' element={<ProviderAddScreen />} />
            <Route path='/provider-edit' element={<ProviderEditScreen />} />
          </Route>

          <Route element={<ProtectedRoute permission="managePermissions" />}>
            <Route path='/provider-permissions' element={<ProviderPermissionsScreen />} />
            <Route path='/permissions' element={<PermissionsHomeScreen />} />
          </Route>

          {/* Session Routes */}
          <Route element={<ProtectedRoute permission="enterSessionData" />}>
            <Route path='/session-initiation' element={<SessionInitiationScreen />} />
            <Route path='/session-data-collection' element={<SessionDataCollectionScreen />} />
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute permission="viewAssignedClients" />}>
            <Route path='/client' element={<ClientScreen />} />
          </Route>

          {/* Feature Routes */}
          <Route element={<ProtectedRoute permission="generateAINotes" />}>
            <Route path='/ai-note-summery' element={<AINoteSummaryScreen />} />
          </Route>

          <Route element={<ProtectedRoute permission="viewProgressReports" />}>
            <Route path='/goal-review' element={<GoalReviewScreen />} />
            <Route path='/reports' element={<ReportsScreen />} />
          </Route>

          <Route path='/help' element={<HelpScreen />} />
          <Route path='/account-management' element={<AccountManagementScreen />} />
          <Route path='/qspSignature' element={<QSPSignatureReviewScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
