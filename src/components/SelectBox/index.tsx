import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select";
import { Label } from "../Label";

type SelectBoxProps = {
  label: string;
  htmlFor: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
};

export const SelectBox = ({
  label,
  htmlFor,
  value,
  onChange,
  options,
  placeholder = "Select option",
  error,
}: SelectBoxProps) => {
  return (
    <>
      <Label htmlFor={htmlFor}>{label}</Label>

      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger className="h-12">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </>
  );
};




import { Textarea } from "../Textarea";
import { AlertTriangle } from "lucide-react";
import type { ClientProfileFields } from "../../Constant";

type ClientProfileTextareaProps = {
  field: typeof ClientProfileFields[number];
  value: any;
  onChange: (val: string) => void;
  placeholder:string
};

export const ClientProfileTextarea = ({ field, value, onChange , placeholder}: ClientProfileTextareaProps) => {
  const isSafety = field.key === "safetyConsiderations";

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className={isSafety ? "flex items-center gap-2" : ""}>
        {isSafety && <AlertTriangle className="w-4 h-4 text-amber-600" />}
        {field.label}
      </Label>
      <Textarea
        id={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-20 border-amber-200 focus:border-amber-400"
        placeholder={placeholder}
      />
    </div>
  );
};
