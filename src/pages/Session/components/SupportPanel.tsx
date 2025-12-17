
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';

interface SupportsPanelProps {
  supports: string[];
  supportsObserved: string[];
  showSupportOther: boolean;
  supportOtherText: string;
  onToggleSupport: (support: string) => void;
  onToggleOther: () => void;
  onChangeOtherText: (val: string) => void;
  onAddCustomSupport: () => void;
}

export function SupportsPanel({
  supports,
  supportsObserved,
  showSupportOther,
  supportOtherText,
  onToggleSupport,
  onToggleOther,
  onChangeOtherText,
  onAddCustomSupport,
}: SupportsPanelProps) {
  return (
    <Card className="p-6 bg-white">
      <h3 className="text-[#303630] mb-4">Supports Observed</h3>
      <div className="flex flex-wrap gap-2">
        {supports.map((support) => (
          <Button
            key={support}
            onClick={() => onToggleSupport(support)}
            size="sm"
            variant={supportsObserved.includes(support) ? 'default' : 'outline'}
            className={
              supportsObserved.includes(support)
                ? 'bg-[#395159] text-white hover:bg-[#303630]'
                : 'border-[#ccc9c0] text-[#303630]'
            }
          >
            {support}
          </Button>
        ))}
        <Button
          onClick={onToggleOther}
          size="sm"
          variant={showSupportOther ? 'default' : 'outline'}
          className={
            showSupportOther
              ? 'bg-[#395159] text-white hover:bg-[#303630]'
              : 'border-[#ccc9c0] text-[#303630]'
          }
        >
          Other
        </Button>
      </div>
      
      {showSupportOther && (
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Enter custom support..."
            value={supportOtherText}
            onChange={(e:any) => onChangeOtherText(e.target.value)}
            onKeyDown={(e:any) => {
              if (e.key === 'Enter') {
                onAddCustomSupport();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={onAddCustomSupport}
            disabled={!supportOtherText.trim()}
            className="bg-[#395159] hover:bg-[#303630] text-white"
          >
            Add
          </Button>
        </div>
      )}
    </Card>
  );
}

