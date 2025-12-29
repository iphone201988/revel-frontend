import { Check, X, Info } from "lucide-react";
import { toast } from "react-toastify";

type ToastType = "success" | "error" | "info";

interface AppToastProps {
  message: string;
  type?: ToastType;
}

export function CustomToast({ message, type = "success" }: AppToastProps) {
  return (
    <div className="exact-toast">
      <div
        className={`exact-toast-icon ${
          type === "error"
            ? "toast-error"
            : type === "info"
            ? "toast-info"
            : "toast-success"
        }`}
      >
        {type === "error" && <X size={14} strokeWidth={3} />}
        {type === "success" && <Check size={14} strokeWidth={3} />}
        {type === "info" && <Info size={14} strokeWidth={3} />}
      </div>

      <span className="exact-toast-text">{message}</span>
    </div>
  );
}

export const showSuccess = (message: string) => {
  toast(<CustomToast message={message} type="success" />);
};

export const showError = (message: string) => {
  toast(<CustomToast message={message} type="error" />);
};

export const showInfo = (message: string) => {
  toast(<CustomToast message={message} type="info" />);
};
