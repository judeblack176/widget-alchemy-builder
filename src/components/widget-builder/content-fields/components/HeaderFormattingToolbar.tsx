
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { getColorName } from "./colorUtils";
import TextStyleButtons from "./TextStyleButtons";
import ColorPicker from "./ColorPicker";

interface HeaderFormattingToolbarProps {
  selectedText: { start: number, end: number } | null;
  onFormatText: (format: string, value: string) => void;
  onInputClick: (e: React.MouseEvent) => void;
}

const HeaderFormattingToolbar: React.FC<HeaderFormattingToolbarProps> = ({
  selectedText,
  onFormatText,
  onInputClick
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  
  // Handle color selection
  const handleColorSelect = (color: string, isBackground: boolean = false) => {
    if (selectedText) {
      onFormatText(isBackground ? "background-color" : "color", getColorName(color));
    }
  };

  return (
    <div className="mb-2 flex flex-wrap gap-1 border-b pb-2">
      <Label className="w-full text-xs mb-1">Formatting Options</Label>
      <div className="flex flex-wrap gap-1 w-full">
        <TextStyleButtons 
          onStyleClick={(style) => onFormatText("style", style)} 
          onWeightClick={(weight) => onFormatText("weight", weight)}
          disabled={false}
        />
        
        <div className="border-r h-8 mx-1"></div>
        
        <ColorPicker 
          isOpen={showColorPicker}
          onOpenChange={setShowColorPicker}
          onColorSelect={handleColorSelect}
          onInputClick={onInputClick}
          disabled={false}
        />

        <ColorPicker 
          isOpen={showBackgroundColorPicker}
          onOpenChange={setShowBackgroundColorPicker}
          onColorSelect={handleColorSelect}
          onInputClick={onInputClick}
          isBackground={true}
          disabled={false}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1 w-full">
        {selectedText ? "Select formatting to apply to text" : "Select text to format it"}
      </p>
    </div>
  );
};

export default HeaderFormattingToolbar;
