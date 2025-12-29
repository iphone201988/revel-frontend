import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "../../../components/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/AlertDailog";

interface SessionHeaderProps {
  clientName?: string;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onBackConfirm: () => void;
}

export function SessionHeader({
  clientName,
  elapsedTime,
  formatTime,
  isTimerRunning,
  onToggleTimer,
  onBackConfirm,
}: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[#395159] text-[#395159] hover:bg-[#395159] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Abandon Session?</AlertDialogTitle>
              <AlertDialogDescription>
                This session has not been completed. If you return to the
                dashboard now, all data collected will be lost and the session
                will be deleted. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Session</AlertDialogCancel>
              <AlertDialogAction
                onClick={onBackConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Abandon & Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div>
          <h2 className="text-[#303630]">{clientName}</h2>
          <p className="text-[#395159]">Session in Progress</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#ccc9c0]">
          <Clock className="w-5 h-5 text-[#395159]" />
          <span className="text-[#303630] text-lg">
            {formatTime(elapsedTime)}
          </span>
        </div>
        <Button
          onClick={onToggleTimer}
          variant="outline"
          className="border-[#395159] text-[#395159]"
        >
          {isTimerRunning ? "Pause" : "Resume"}
        </Button>
      </div>
    </div>
  );
}
