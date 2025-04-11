
import React from "react";
import { PREDEFINED_COLORS, COLOR_PALETTE } from "@/types/widget-types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPalettePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors?: string[];
  className?: string;
}

const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  label,
  value,
  onChange,
  colors = PREDEFINED_COLORS,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => val && onChange(val)}
        className="flex flex-wrap gap-1.5 max-w-full"
      >
        {colors.map((color) => (
          <ToggleGroupItem
            key={color}
            value={color}
            className="w-7 h-7 rounded-md relative border border-gray-200 p-0"
            style={{ backgroundColor: color }}
            aria-label={color}
          >
            {value === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check 
                  size={16} 
                  className={
                    color === "transparent" || color === "#FFFFFF" || color.toLowerCase() === "#fff" 
                      ? "text-black" 
                      : "text-white"
                  } 
                />
              </div>
            )}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default ColorPalettePicker;
