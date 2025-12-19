
import { Card } from '../../../components/Card'; 
import { Button } from '../../../components/Button'; 
import { Sparkles, PenTool } from 'lucide-react';

interface NoteGenerateCardProps {
  onGenerate: () => void;
  onManual: () => void;
   isLoading: boolean
}

export function NoteGenerateCard({ onGenerate, onManual , isLoading}: NoteGenerateCardProps) {
  return (
    <Card className="p-8 bg-white text-center">
      <div className="max-w-md mx-auto">
        <div className="p-4 bg-[#efefef] rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#395159]" />
        </div>
        <h3 className="text-[#303630] mb-3">Generate Clinical Note</h3>
        <p className="text-[#395159] mb-6">
          Click below to automatically generate a comprehensive clinical progress note based on the session data collected, client profile, and ITP goals.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={onGenerate}
            className="h-14 bg-[#395159] hover:bg-[#303630] text-white px-8"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isLoading ? "Genrating..." : " Generate AI Note"}
           
          </Button>
          <Button
            onClick={onManual}
            variant="outline"
            className="h-14 border-[#395159] text-[#395159] hover:bg-[#efefef] px-8"
          >
            <PenTool className="w-5 h-5 mr-2" />
            Complete Note Manually
          </Button>
        </div>
      </div>
    </Card>
  );
}

