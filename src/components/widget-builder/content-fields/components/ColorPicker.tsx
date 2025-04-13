
import React from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formattingColors, getColorName } from "./colorUtils";

interface ColorPickerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onColorSelect: (color: string, isBackground: boolean) => void;
  onInputClick: (e: React.MouseEvent) => void;
  isBackground?: boolean;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  onOpenChange,
  onColorSelect,
  onInputClick,
  isBackground = false,
  disabled = false
}) => {
  const handleColorSelect = (color: string) => {
    onColorSelect(color, isBackground);
    onOpenChange(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild onClick={onInputClick}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0" 
          disabled={disabled}
          title={isBackground ? "Background Color" : "Text Color"}
        >
          <Palette size={16} color={isBackground ? "#8b5cf6" : "#3b82f6"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="p-2 bg-white border rounded-md shadow-md" 
        onClick={onInputClick}
        sideOffset={5}
      >
        <div className="w-[220px]">
          <p className="text-xs mb-2 font-medium">
            Select {isBackground ? "background" : "text"} color
          </p>
          <div className="grid grid-cols-5 gap-1">
            {formattingColors.map((color) => (
              <div 
                key={color}
                className="w-8 h-8 rounded-md cursor-pointer border border-gray-200 flex items-center justify-center"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              >
                {color === "#FFFFFF" && (
                  <div className="w-full h-full rounded-md border border-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorPicker;
