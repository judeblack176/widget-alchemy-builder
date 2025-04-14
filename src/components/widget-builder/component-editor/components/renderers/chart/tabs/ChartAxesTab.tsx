
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartAxesTabProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ChartAxesTab: React.FC<ChartAxesTabProps> = ({
  component,
  onUpdateComponent,
}) => {
  const chartType = component.props.chartType || 'bar';
  const showLegend = component.props.legend === true;

  const handleFieldChange = (field: string, value: string) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        [field]: value,
      },
    });
  };

  const handleToggleChange = (field: string, value: boolean) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        [field]: value,
      },
    });
  };

  const handleLegendPositionChange = (value: string) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        legendPosition: value,
      },
    });
  };

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4">
      {chartType !== 'pie' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="xAxisLabel">X-Axis Label</Label>
            <Input 
              id="xAxisLabel"
              placeholder="X Axis"
              value={component.props.xAxisLabel || ""}
              onChange={(e) => handleFieldChange("xAxisLabel", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
            <Input 
              id="yAxisLabel"
              placeholder="Y Axis"
              value={component.props.yAxisLabel || ""}
              onChange={(e) => handleFieldChange("yAxisLabel", e.target.value)}
            />
          </div>
        </>
      )}
      
      <div className="flex items-center space-x-2 py-2">
        <Button
          type="button"
          variant={showLegend ? "default" : "outline"}
          onClick={() => handleToggleChange("legend", !showLegend)}
          className="flex-1"
        >
          {showLegend ? "Legend On" : "Legend Off"}
        </Button>
      </div>
      
      {showLegend && (
        <>
          <div className="space-y-2">
            <Label htmlFor="labels">Legend Labels</Label>
            <Input 
              id="labels"
              placeholder="Item 1,Item 2,Item 3"
              value={component.props.labels || ""}
              onChange={(e) => handleFieldChange("labels", e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Comma-separated list of labels
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="legendPosition">Legend Position</Label>
            <Select
              value={component.props.legendPosition || "center"}
              onValueChange={handleLegendPositionChange}
            >
              <SelectTrigger id="legendPosition">
                <SelectValue placeholder="Legend Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartAxesTab;
