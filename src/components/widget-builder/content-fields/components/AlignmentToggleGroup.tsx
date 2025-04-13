
import React from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AlignmentToggleGroupProps {
  onValueChange: (val: string) => void;
  disabled: boolean;
}

const AlignmentToggleGroup: React.FC<AlignmentToggleGroupProps> = ({
  onValueChange,
  disabled
}) => {
  return (
    <ToggleGroup 
      type="single" 
      className="justify-start" 
      onValueChange={(val) => val && onValueChange(val)}
    >
      <ToggleGroupItem value="left" size="sm" disabled={disabled}>
        <AlignLeft size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" size="sm" disabled={disabled}>
        <AlignCenter size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" size="sm" disabled={disabled}>
        <AlignRight size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default AlignmentToggleGroup;
