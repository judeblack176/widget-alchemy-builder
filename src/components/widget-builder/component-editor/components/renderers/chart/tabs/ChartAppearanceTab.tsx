
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface ChartAppearanceTabProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ChartAppearanceTab: React.FC<ChartAppearanceTabProps> = ({
  component,
  onUpdateComponent,
}) => {
  const handleHeightChange = (value: number[]) => {
    const height = value[0];
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        height,
      },
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        [field]: value,
      },
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        colors: e.target.value,
      },
    });
  };

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Chart Title</Label>
        <Input 
          id="title"
          placeholder="My Chart"
          value={component.props.title || ""}
          onChange={(e) => handleFieldChange("title", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="height">Height (px)</Label>
          <span className="text-sm text-gray-500">
            {component.props.height || 300}px
          </span>
        </div>
        <Slider
          id="height"
          defaultValue={[component.props.height || 300]}
          value={[component.props.height || 300]}
          min={200}
          max={600}
          step={10}
          onValueChange={handleHeightChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="colors">Chart Colors</Label>
        <Input 
          id="colors"
          placeholder="#3B82F6,#EF4444,#10B981,#F59E0B"
          value={component.props.colors || ""}
          onChange={handleColorChange}
        />
        <p className="text-xs text-gray-500">
          Comma-separated list of hex color codes
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input 
          id="backgroundColor"
          placeholder="#FFFFFF"
          value={component.props.backgroundColor || "#FFFFFF"}
          onChange={(e) => handleFieldChange("backgroundColor", e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChartAppearanceTab;
