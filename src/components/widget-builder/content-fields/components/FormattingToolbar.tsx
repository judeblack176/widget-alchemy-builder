
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { getColorName } from "./colorUtils";
import SizeToggleGroup from "./SizeToggleGroup";
import TextStyleButtons from "./TextStyleButtons";
import AlignmentToggleGroup from "./AlignmentToggleGroup";
import ColorPicker from "./ColorPicker";

interface FormattingToolbarProps {
  selectedText: { start: number, end: number } | null;
  onFormatText: (format: string, value: string) => void;
  onInputClick: (e: React.MouseEvent) => void;
}

const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
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
      <Label className="w-full text-xs mb-1">Formatting Toolbar</Label>
      <div className="flex flex-wrap gap-1 w-full">
        <SizeToggleGroup 
          onValueChange={(val) => onFormatText("size", val)}
          disabled={!selectedText}
        />
        
        <div className="border-r h-8 mx-1"></div>
        
        <TextStyleButtons 
          onStyleClick={(style) => onFormatText("style", style)} 
          onWeightClick={(weight) => onFormatText("weight", weight)}
          disabled={!selectedText}
        />
        
        <div className="border-r h-8 mx-1"></div>
        
        <AlignmentToggleGroup 
          onValueChange={(align) => onFormatText("align", align)}
          disabled={!selectedText}
        />
        
        <div className="border-r h-8 mx-1"></div>
        
        <ColorPicker 
          isOpen={showColorPicker}
          onOpenChange={setShowColorPicker}
          onColorSelect={handleColorSelect}
          onInputClick={onInputClick}
          disabled={!selectedText}
        />

        <ColorPicker 
          isOpen={showBackgroundColorPicker}
          onOpenChange={setShowBackgroundColorPicker}
          onColorSelect={handleColorSelect}
          onInputClick={onInputClick}
          isBackground={true}
          disabled={!selectedText}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1 w-full">
        {selectedText ? "Select formatting to apply to text" : "Select text to format it"}
      </p>
    </div>
  );
};

export default FormattingToolbar;
