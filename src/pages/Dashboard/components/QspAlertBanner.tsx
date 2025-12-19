
import { AlertCircle, FileSignature } from 'lucide-react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';


interface QSPAlert {
  criticalCount: number;
  warningCount: number;
  totalPending: number;
}

interface QSPAlertBannerProps {
  alert: QSPAlert;
  onReviewClick: () => void;
}

export function QSPAlertBanner({ alert, onReviewClick }: QSPAlertBannerProps) {
  // Don't show if no pending notes
  if (alert.totalPending === 0) return null;

  // Determine banner styling based on urgency
  const hasCritical = alert.criticalCount > 0;
  const hasWarning = alert.warningCount > 0;

  const borderColor = hasCritical 
    ? 'border-red-500' 
    : hasWarning 
    ? 'border-yellow-400' 
    : 'border-blue-400';

  const bgColor = hasCritical 
    ? 'bg-red-50' 
    : hasWarning 
    ? 'bg-yellow-50' 
    : 'bg-blue-50';

  return (
    <Card className={`p-4 mb-6 border-2 ${borderColor} ${bgColor} ${hasCritical ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-5 h-5 mt-0.5 ${hasCritical ? 'text-red-600' : hasWarning ? 'text-yellow-600' : 'text-blue-600'}`} />
          <div>
            <h3 className="text-[#303630] mb-1">
              {hasCritical ? 'URGENT: ' : ''}QSP Signatures Required
            </h3>
            <p className="text-sm text-[#395159]">
              <strong>{alert.totalPending} session note{alert.totalPending !== 1 ? 's' : ''}</strong> {alert.totalPending === 1 ? 'is' : 'are'} pending your review and signature.
              {alert.criticalCount > 0 && (
                <span className="text-red-600 ml-1">
                  ({alert.criticalCount} critical - 5+ business days overdue)
                </span>
              )}
              {alert.warningCount > 0 && alert.criticalCount === 0 && (
                <span className="text-yellow-700 ml-1">
                  ({alert.warningCount} overdue 3+ business days)
                </span>
              )}
            </p>
          </div>
        </div>
        <Button
          onClick={onReviewClick}
          className={`${hasCritical ? 'bg-red-600 hover:bg-red-700' : 'bg-[#395159] hover:bg-[#303630]'} text-white`}
        >
          <FileSignature className="w-4 h-4 mr-2" />
          Review & Sign {alert.totalPending} Note{alert.totalPending !== 1 ? 's' : ''}
        </Button>
      </div>
    </Card>
  );
}
