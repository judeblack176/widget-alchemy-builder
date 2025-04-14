
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import PropertyEditor from "../../../property-editor/PropertyEditor";
import ApiIntegrationSection from "../../../api-integration/ApiIntegrationSection";
import TooltipSelector from "../../../tooltip/TooltipSelector";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartPie, BarChart3, LineChart, PieChart, AreaChart } from "lucide-react";

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

  const handleChartTypeChange = (value: string) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        chartType: value,
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
  
  const handleStaticDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        staticData: e.target.value,
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

  const chartType = component.props.chartType || 'bar';
  const showLegend = component.props.legend === true;

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
          <span className="font-medium">Chart Type</span>
        </div>
        <div className="p-4">
          <ToggleGroup 
            type="single" 
            value={chartType}
            onValueChange={(value) => {
              if (value) handleChartTypeChange(value);
            }}
            className="flex justify-center mb-2"
          >
            <ToggleGroupItem value="bar" aria-label="Bar Chart">
              <BarChart3 className="h-4 w-4 mr-1" />
              Bar
            </ToggleGroupItem>
            <ToggleGroupItem value="line" aria-label="Line Chart">
              <LineChart className="h-4 w-4 mr-1" />
              Line
            </ToggleGroupItem>
            <ToggleGroupItem value="pie" aria-label="Pie Chart">
              <PieChart className="h-4 w-4 mr-1" />
              Pie
            </ToggleGroupItem>
            <ToggleGroupItem value="area" aria-label="Area Chart">
              <AreaChart className="h-4 w-4 mr-1" />
              Area
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <Tabs defaultValue="data" className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="axes">Axes & Legend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="space-y-4 pt-4">
          <div className="space-y-4 border border-gray-200 rounded-lg p-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="staticData">Static Data</Label>
              <Textarea 
                id="staticData"
                placeholder='[{"name":"Item 1","value":30},{"name":"Item 2","value":50}]'
                value={component.props.staticData || ""}
                onChange={handleStaticDataChange}
                className="h-24"
              />
              <p className="text-xs text-gray-500">
                Enter JSON data, or CSV format with header row
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryKey">Category Field</Label>
              <Input 
                id="categoryKey"
                placeholder="name"
                value={component.props.categoryKey || "name"}
                onChange={(e) => handleFieldChange("categoryKey", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataKey">Value Field</Label>
              <Input 
                id="dataKey"
                placeholder="value"
                value={component.props.dataKey || "value"}
                onChange={(e) => handleFieldChange("dataKey", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 pt-4">
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
        </TabsContent>
        
        <TabsContent value="axes" className="space-y-4 pt-4">
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
