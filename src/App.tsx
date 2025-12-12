
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

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route  path='/' element={<Dashboard/>}/>
        <Route  path='/login' element={<Login/>}/>
        <Route  path='/register' element={<Register/>}/>
        <Route  path='/verify' element={<VerifyOtp/>}/>
        <Route  path='/admin' element={<AdminScreen/>}/>
        <Route  path='/provider-add' element={<ProviderAddScreen/>}/>
        <Route  path='/provider-edit' element={<ProviderEditScreen/>}/>
        <Route  path='/audit-logs' element={<AuditLogScreen/>}/>
        <Route  path='/provider-permissions' element={<ProviderPermissionsScreen/>}/>
        <Route  path='/permissions' element={<PermissionsHomeScreen/>}/>
        <Route  path='/session-initiation' element={<SessionInitiationScreen/>}/>
        <Route  path='/client' element={<ClientScreen/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
