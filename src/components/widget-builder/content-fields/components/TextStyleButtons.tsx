
import React from "react";
import { Bold, Italic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextStyleButtonsProps {
  onStyleClick: (style: string) => void;
  onWeightClick: (weight: string) => void;
  disabled: boolean;
}

const TextStyleButtons: React.FC<TextStyleButtonsProps> = ({
  onStyleClick,
  onWeightClick,
  disabled
}) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={() => onWeightClick("bold")}
        disabled={disabled}
      >
        <Bold size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={() => onStyleClick("italic")}
        disabled={disabled}
      >
        <Italic size={16} />
      </Button>
    </>
  );
};

export default TextStyleButtons;
