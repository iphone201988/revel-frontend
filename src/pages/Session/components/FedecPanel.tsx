import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { fedcCapacities } from './constant';
import { CheckCircle2 } from 'lucide-react';


interface FedcPanelProps {
  canCollectFEDC: boolean;
  fedcObserved: string[];
  onToggle: (fedcId: string) => void;
}

export function FedcPanel({ canCollectFEDC, fedcObserved,  }: FedcPanelProps) {
  if (!canCollectFEDC) return null;

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-[#303630] mb-4">FEDC Observed</h3>
      <div className="space-y-2">
        {fedcCapacities.map((fedc) => (
          <Button
            key={fedc.id}
            onClick={() => onToggle(fedc?.name)}
            variant={fedcObserved.includes(fedc.name) ? 'default' : 'outline'}
            className={`w-full justify-start h-auto py-3 ${
              fedcObserved.includes(fedc.name) 
                ? 'bg-[#395159] text-white hover:bg-[#303630]' 
                : 'border-[#ccc9c0] text-[#303630]'
            }`}
          >
            <div className="flex items-start gap-2 text-left">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                fedcObserved.includes(fedc.name) ? 'opacity-100' : 'opacity-0'
              }`} />
              <div>
                <div>{fedc.name}</div>
                <div className="text-xs opacity-80">{fedc.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}

