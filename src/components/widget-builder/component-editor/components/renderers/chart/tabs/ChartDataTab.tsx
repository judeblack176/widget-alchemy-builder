
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ChartDataTabProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ChartDataTab: React.FC<ChartDataTabProps> = ({
  component,
  onUpdateComponent,
}) => {
  const handleDataUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateComponent({
      ...component,
      props: {
        ...component.props,
        dataUrl: e.target.value,
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

  return (
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
  );
};

export default ChartDataTab;
