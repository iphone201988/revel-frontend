
import { AlertTriangle, Bell } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/Alert';
import { Badge } from '../../../components/Badge';

interface ReviewAlert {
  clientId: string;
  clientName: string;
  reviewDate: string;
  daysUntilReview: number;
}

interface ReviewAlertBannerProps {
  alerts: ReviewAlert[];
  onClientClick: (clientId: string) => void;
}

export function ReviewAlertBanner({ alerts, onClientClick }: ReviewAlertBannerProps) {
  if (alerts.length === 0) return null;

  // Separate urgent (30 days or less) and upcoming (60 days or less) alerts
  const urgentAlerts = alerts.filter(a => a.daysUntilReview <=5);
  const upcomingAlerts = alerts.filter(a => a.daysUntilReview > 5 && a.daysUntilReview <= 20);

  return (
    <div className="space-y-3 mb-6">
      {/* Urgent Alerts (30 days or less) - Red and Flashing */}
      {urgentAlerts.map((alert) => (
        <Alert
          key={alert.clientId}
          className="border-red-500 bg-red-50 cursor-pointer hover:bg-red-100 transition-all animate-pulse"
          onClick={() => onClientClick(alert.clientId)}
        >
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 flex items-center gap-2">
            URGENT: Plan Review Due Soon
            <Badge className="bg-red-600 text-white">
              {alert.daysUntilReview} {alert.daysUntilReview === 1 ? 'day' : 'days'} remaining
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-red-700">
            <strong>{alert.clientName}</strong> Individual Treatment Plan review is due on{' '}
            <strong>{alert.reviewDate}</strong> Click to view client chart.
          </AlertDescription>
        </Alert>
      ))}

      {/* Upcoming Alerts (31-60 days) - Yellow */}
      {upcomingAlerts.map((alert) => (
        <Alert
          key={alert.clientId}
          className="border-yellow-500 bg-yellow-50 cursor-pointer hover:bg-yellow-100 transition-all"
          onClick={() => onClientClick(alert.clientId)}
        >
          <Bell className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800 flex items-center gap-2">
            Plan Review Approaching
            <Badge className="bg-yellow-600 text-white">
              {alert.daysUntilReview} days remaining
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            <strong>{alert.clientName}</strong> Individual Treatment Plan review is due on{' '}
            <strong>{alert.reviewDate}</strong> Click to view client chart.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
