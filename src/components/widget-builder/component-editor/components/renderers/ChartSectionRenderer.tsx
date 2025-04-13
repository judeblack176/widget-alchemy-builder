
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import PropertyEditor from "../../../property-editor/PropertyEditor";
import ApiIntegrationSection from "../../../api-integration/ApiIntegrationSection";
import TooltipSelector from "../../../tooltip/TooltipSelector";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ChartSectionRendererProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
  shouldShowDataIntegration: () => boolean;
  shouldShowContentEditor?: () => boolean;
}

const ChartSectionRenderer: React.FC<ChartSectionRendererProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  customTooltips = [],
  shouldShowDataIntegration,
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

  const handleDataUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        dataUrl: e.target.value,
      },
    });
  };

  return (
    <>
      {shouldShowDataIntegration() && (
        <ApiIntegrationSection
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
        />
      )}

      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3">
          <span className="font-medium">Chart Data Source</span>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataUrl">Data URL</Label>
              <Input 
                id="dataUrl"
                placeholder="https://api.example.com/data"
                value={component.props.dataUrl || ""}
                onChange={handleDataUrlChange}
              />
              <p className="text-xs text-gray-500">
                Enter a URL to fetch JSON data for your chart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3">
          <span className="font-medium">Chart Size</span>
        </div>
        <div className="p-4">
          <div className="space-y-4">
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
                min={200}
                max={600}
                step={10}
                onValueChange={handleHeightChange}
              />
            </div>
          </div>
        </div>
      </div>

      <PropertyEditor
        component={component}
        onUpdateComponent={onUpdateComponent}
        excludeProperties={["height", "dataUrl"]}
      />

      {onApplyTooltip && (
        <TooltipSelector
          component={component}
          customTooltips={customTooltips}
          onApplyTooltip={onApplyTooltip}
        />
      )}
    </>
  );
};

export default ChartSectionRenderer;
