
import React from "react";
import { Type } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SizeToggleGroupProps {
  onValueChange: (val: string) => void;
  disabled: boolean;
}

const SizeToggleGroup: React.FC<SizeToggleGroupProps> = ({
  onValueChange,
  disabled
}) => {
  return (
    <ToggleGroup 
      type="single" 
      className="justify-start" 
      onValueChange={(val) => val && onValueChange(val)}
    >
      <ToggleGroupItem value="small" size="sm" disabled={disabled}>
        <Type size={12} />
      </ToggleGroupItem>
      <ToggleGroupItem value="medium" size="sm" disabled={disabled}>
        <Type size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="large" size="sm" disabled={disabled}>
        <Type size={20} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SizeToggleGroup;
