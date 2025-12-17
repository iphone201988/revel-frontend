
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '../../../components/Button';
import { AppHeader } from '../../../components/AppHeader';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';


interface ClientHeaderProps {
  clientName: string;
  dob: string;
  age: number;
  diagnosis: string;
  
  onLogout: () => void;
}

export function ClientHeader({ clientName, dob, age, diagnosis, onLogout }: ClientHeaderProps) {
    const navigate = useNavigate()
  return (
    <>
      <AppHeader onLogout={()=>{}} />
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-[#395159] rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-[#303630]">{clientName}</h2>
            <div className="flex gap-4 text-[#395159]">
              <span>DOB: {moment(dob).format('DD-MM-YYYY')}</span>
              <span>Age: {age}</span>
              <span>Dx: {diagnosis}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

