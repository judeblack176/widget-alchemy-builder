import React, { useState, useEffect } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip as CustomTooltip } from "./TooltipManager";
import PropertyEditor from "./editor/PropertyEditor";
import ApiIntegration from "./editor/ApiIntegration";
import ComponentHeader from "./editor/ComponentHeader";
import TooltipSelector from "./editor/TooltipSelector";

interface ComponentEditorProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  disableRemove?: boolean;
  customTooltips?: CustomTooltip[];
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  apis,
  isExpanded,
  onToggleExpand,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  disableRemove = false,
  customTooltips = []
}) => {
  // Check if tooltip is valid
  const validCustomTooltips = customTooltips.filter(tooltip => tooltip && tooltip.id);
  const defaultTooltipIds = ["none", "help", "info", "warning", "tip"];
  const isTooltipValid = !component.tooltipId || 
    defaultTooltipIds.includes(component.tooltipId) || 
    validCustomTooltips.some(t => t.id === component.tooltipId);
  
  // Clear invalid tooltip
  useEffect(() => {
    if (component.tooltipId && !isTooltipValid && onApplyTooltip) {
      onApplyTooltip("");
    }
  }, [component.tooltipId, isTooltipValid, onApplyTooltip]);

  const shouldShowDataIntegration = () => {
    const dataIntegrationComponents = ['calendar', 'chart', 'table', 'dropdown', 'alert', 'searchbar'];
    return dataIntegrationComponents.includes(component.type);
  };

  const componentTypeLabels: Record<string, string> = {
    header: "Header",
    text: "Text",
    image: "Image",
    button: "Button",
    video: "Video",
    chart: "Chart",
    form: "Form",
    calendar: "Calendar",
    dropdown: "Dropdown",
    link: "Link",
    "multi-text": "Multi-Text",
    filter: "Filter",
    alert: "Alert",
    table: "Table",
    searchbar: "Search Bar"
  };

  const isHeader = component.type === 'header';
  const shouldDisableRemove = disableRemove || isHeader;

  return (
    <div 
      className="p-4 border rounded-lg mb-3 bg-white relative cursor-pointer"
      onClick={(e) => {
        // Only trigger if the clicked element is the container itself
        if (e.currentTarget === e.target) {
          onToggleExpand();
        }
      }}
    >
      <div onClick={onToggleExpand}>
        <ComponentHeader 
          title={componentTypeLabels[component.type] || component.type}
          tooltipId={component.tooltipId}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          onApplyTooltip={onApplyTooltip}
          onRemoveComponent={() => onRemoveComponent(component.id)}
          customTooltips={customTooltips}
          disableRemove={shouldDisableRemove}
        />
      </div>
      
      {isExpanded && (
        <div 
          className="space-y-4"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from triggering the container's click
        >
          {/* Tooltip selector at the top when expanded */}
          {onApplyTooltip && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Component Tooltip</label>
              <TooltipSelector 
                tooltipId={component.tooltipId} 
                onApplyTooltip={onApplyTooltip} 
                customTooltips={customTooltips}
              />
            </div>
          )}
          
          <PropertyEditor 
            component={component} 
            onUpdateComponent={onUpdateComponent} 
          />
          
          {component.tooltipId && component.tooltipId !== "none" && validCustomTooltips.some(t => t.id === component.tooltipId) && (
            <div className="mt-4 p-3 bg-gray-50 border rounded-md">
              <h3 className="text-sm font-medium mb-1">Tooltip Preview:</h3>
              <div className="text-sm">
                {validCustomTooltips.find(t => t.id === component.tooltipId)?.content || ""}
              </div>
            </div>
          )}
          
          {shouldShowDataIntegration() && (
            <ApiIntegration 
              component={component} 
              apis={apis} 
              onUpdateComponent={onUpdateComponent} 
              onRequestApiTemplate={onRequestApiTemplate} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentEditor;
