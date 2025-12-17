
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';


interface ActivitiesPanelProps {
    activities: string[];
  activitiesEngaged: string[];
  showActivityOther: boolean;
  activityOtherText: string;
  onToggleActivity: (activity: string) => void;
  onToggleOther: () => void;
  onChangeOtherText: (val: string) => void;
  onAddCustomActivity: () => void;
}

export function ActivitiesPanel({
  activities,
  activitiesEngaged,
  showActivityOther,
  activityOtherText,
  onToggleActivity,
  onToggleOther,
  onChangeOtherText,
  onAddCustomActivity,
}: ActivitiesPanelProps) {
  return (
    <Card className="p-6 bg-white">
      <h3 className="text-[#303630] mb-4">Activities Engaged</h3>
      <div className="flex flex-wrap gap-2">
        {activities.map((activity) => (
          <Button
            key={activity}
            onClick={() => onToggleActivity(activity)}
            size="sm"
            variant={activitiesEngaged.includes(activity) ? 'default' : 'outline'}
            className={
              activitiesEngaged.includes(activity)
                ? 'bg-[#395159] text-white hover:bg-[#303630]'
                : 'border-[#ccc9c0] text-[#303630]'
            }
          >
            {activity}
          </Button>
        ))}
        <Button
          onClick={onToggleOther}
          size="sm"
          variant={showActivityOther ? 'default' : 'outline'}
          className={
            showActivityOther
              ? 'bg-[#395159] text-white hover:bg-[#303630]'
              : 'border-[#ccc9c0] text-[#303630]'
          }
        >
          Other
        </Button>
      </div>
      
      {showActivityOther && (
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Enter custom activity..."
            value={activityOtherText}
            onChange={(e) => onChangeOtherText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddCustomActivity();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={onAddCustomActivity}
            disabled={!activityOtherText.trim()}
            className="bg-[#395159] hover:bg-[#303630] text-white"
          >
            Add
          </Button>
        </div>
      )}
    </Card>
  );
}

