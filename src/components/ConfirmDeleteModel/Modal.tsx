import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../Dailog";
import { Button } from "../Button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (clientId: string) => void;
  clientName: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  clientName,
}) => {
  const handleConfirm = () => {
    onConfirm(clientName); // Pass client._id instead of name in actual usage
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#303630] flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete Client
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            client and all associated data from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 font-medium">
              Are you sure you want to delete this Client?
            </p>
            <p className="text-sm text-red-900 font-semibold bg-white px-2 py-1 rounded mt-1 inline-block">
              {clientName}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500"
          >
            Delete Client
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;


interface ConfirmDeleteGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (goalId: string) => void;
  goalName: string;
}

export const ConfirmDeleteGoalDialog: React.FC<ConfirmDeleteGoalDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  goalName,
}) => {
  const handleConfirm = () => {
    onConfirm(goalName); // ⚠️ Replace with goalId in real usage
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#303630] flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete Goal
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the goal
            and all associated data from the system.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 font-medium">
              Are you sure you want to Delete this Goal?
            </p>
            <p className="text-sm text-red-900 font-semibold bg-white px-2 py-1 rounded mt-1 inline-block">
              {goalName}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500"
          >
            Delete Goal
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

