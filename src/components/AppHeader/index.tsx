
import { LogOut, HelpCircle, Settings } from 'lucide-react';

// import { Screen } from '../App';


import { HIPAAComplianceIndicator } from '../HIPPA';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/api/provider';
import { handleError } from '../../utils/helper';
import { showSuccess } from '../CustomToast';
import logo from '../../assets/20b7e623cc990aeea0ffd948678d4d0e46e1aa8d.png';

export function AppHeader() {
  
  const [logout] = useLogoutMutation()
    const navigate = useNavigate();


    const handleLogout = async()=>{
     await logout().unwrap().catch((error)=> handleError(error))
     showSuccess('Logout Successfully')
     navigate('/login')
    }
  return (
    <header className="bg-[#395159] text-white shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="DIR DataFlow by Infinity Therapy LLC" style={{ height: '120px', width: 'auto' }} />
          </div>

          <div className="flex items-center gap-4">
            <HIPAAComplianceIndicator />
            
              <>
                <Button 
                  onClick={() => navigate('/account-management')}  /// add  path here
                  className="bg-white/10 text-white border border-white/30 hover:bg-white hover:text-[#395159]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account
                </Button>
                <Button  
                  onClick={() => navigate('/help')} // Parth hereej
                  className="bg-white/10 text-white border border-white/30 hover:bg-white hover:text-[#395159]"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help
                </Button>
              </>
            
            <Button 
              onClick={()=>handleLogout()}
              className="bg-white/10 text-white border border-white/30 hover:bg-white hover:text-[#395159]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}