
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import PropertyEditor from "../../../../property-editor/PropertyEditor";
import ApiIntegrationSection from "../../../../api-integration/ApiIntegrationSection";
import TooltipSelector from "../../../../tooltip/TooltipSelector";
import ChartTypeSelector from "./ChartTypeSelector";
import ChartDataTab from "./tabs/ChartDataTab";
import ChartAppearanceTab from "./tabs/ChartAppearanceTab";
import ChartAxesTab from "./tabs/ChartAxesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <ChartTypeSelector 
        component={component} 
        onUpdateComponent={onUpdateComponent} 
      />
      
      <Tabs defaultValue="data" className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="axes">Axes & Legend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="space-y-4 pt-4">
          <ChartDataTab 
            component={component} 
            onUpdateComponent={onUpdateComponent} 
          />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 pt-4">
          <ChartAppearanceTab 
            component={component} 
            onUpdateComponent={onUpdateComponent} 
          />
        </TabsContent>
        
        <TabsContent value="axes" className="space-y-4 pt-4">
          <ChartAxesTab 
            component={component} 
            onUpdateComponent={onUpdateComponent} 
          />
        </TabsContent>
      </Tabs>

      <PropertyEditor
        component={component}
        onUpdateComponent={onUpdateComponent}
        excludeProperties={[
          "height", "dataUrl", "chartType", "title", "colors", 
          "staticData", "backgroundColor", "categoryKey", "dataKey",
          "xAxisLabel", "yAxisLabel", "legend", "labels", "legendPosition"
        ]}
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
