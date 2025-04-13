
import React, { useState } from "react";
import { 
  Type, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TextFormattingToolbarProps {
  selectedText: { start: number, end: number } | null;
  onFormatText: (format: string, value: string) => void;
  onInputClick: (e: React.MouseEvent) => void;
}

const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
  selectedText,
  onFormatText,
  onInputClick
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  
  // Colors for the color picker
  const colors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#3b82f6", // Primary (Blue)
    "#6b7280", // Secondary (Gray)
    "#9ca3af", // Muted
    "#8b5cf6", // Accent (Purple)
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ec4899", // Pink
    "#f97316"  // Orange
  ];

  // Map color to named color for class name
  const getColorName = (colorHex: string) => {
    const colorMap: Record<string, string> = {
      "#000000": "black",
      "#FFFFFF": "white",
      "#3b82f6": "primary",
      "#6b7280": "secondary",
      "#9ca3af": "muted",
      "#8b5cf6": "accent",
      "#ef4444": "red",
      "#10b981": "green",
      "#f59e0b": "yellow",
      "#ec4899": "pink",
      "#f97316": "orange"
    };
    
    return colorMap[colorHex] || colorHex.replace('#', '');
  };

  // Handle color selection
  const handleColorSelect = (color: string, isBackground: boolean = false) => {
    if (selectedText) {
      onFormatText(isBackground ? "background-color" : "color", getColorName(color));
    }
    setShowColorPicker(false);
    setShowBackgroundColorPicker(false);
  };

  return (
    <div className="mb-2 flex flex-wrap gap-1 border-b pb-2">
      <Label className="w-full text-xs mb-1">Formatting Toolbar</Label>
      <div className="flex flex-wrap gap-1 w-full">
        <ToggleGroup type="single" className="justify-start" onValueChange={(val) => val && onFormatText("size", val)}>
          <ToggleGroupItem value="small" size="sm" disabled={!selectedText}>
            <Type size={12} />
          </ToggleGroupItem>
          <ToggleGroupItem value="medium" size="sm" disabled={!selectedText}>
            <Type size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value="large" size="sm" disabled={!selectedText}>
            <Type size={20} />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="border-r h-8 mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0" 
          onClick={() => selectedText && onFormatText("weight", "bold")}
          disabled={!selectedText}
        >
          <Bold size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0" 
          onClick={() => selectedText && onFormatText("style", "italic")}
          disabled={!selectedText}
        >
          <Italic size={16} />
        </Button>
        
        <div className="border-r h-8 mx-1"></div>
        
        <ToggleGroup type="single" className="justify-start" onValueChange={(val) => val && onFormatText("align", val)}>
          <ToggleGroupItem value="left" size="sm" disabled={!selectedText}>
            <AlignLeft size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" size="sm" disabled={!selectedText}>
            <AlignCenter size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" size="sm" disabled={!selectedText}>
            <AlignRight size={16} />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="border-r h-8 mx-1"></div>
        
        <DropdownMenu open={showColorPicker} onOpenChange={setShowColorPicker}>
          <DropdownMenuTrigger asChild onClick={onInputClick}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              disabled={!selectedText}
              title="Text Color"
            >
              <Palette size={16} color="#3b82f6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="p-2 bg-white border rounded-md shadow-md" 
            onClick={onInputClick}
            sideOffset={5}
          >
            <div className="w-[220px]">
              <p className="text-xs mb-2 font-medium">Select text color</p>
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
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

        <DropdownMenu open={showBackgroundColorPicker} onOpenChange={setShowBackgroundColorPicker}>
          <DropdownMenuTrigger asChild onClick={onInputClick}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              disabled={!selectedText}
              title="Background Color"
            >
              <Palette size={16} color="#8b5cf6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="p-2 bg-white border rounded-md shadow-md" 
            onClick={onInputClick}
            sideOffset={5}
          >
            <div className="w-[220px]">
              <p className="text-xs mb-2 font-medium">Select background color</p>
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <div 
                    key={color}
                    className="w-8 h-8 rounded-md cursor-pointer border border-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color, true)}
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
      </div>
      <p className="text-xs text-muted-foreground mt-1 w-full">
        {selectedText ? "Select formatting to apply to text" : "Select text to format it"}
      </p>
    </div>
  );
};

export default TextFormattingToolbar;
