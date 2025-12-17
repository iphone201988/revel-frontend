
import { Card } from '../../../components/Card';
import { Textarea } from '../../../components/Textarea';

interface ObservationsCardProps {
  providerObservations: string;
  onChange: (val: string) => void;
}

export function ObservationsCard({ providerObservations, onChange }: ObservationsCardProps) {
  return (
    <Card className="p-6 bg-white mt-6">
      <h3 className="text-[#303630] mb-4">Provider Observations</h3>
      <Textarea
        placeholder="Document observations, behaviors, clinical impressions, or other relevant information during the session..."
        value={providerObservations}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-32"
      />
    </Card>
  );
}

