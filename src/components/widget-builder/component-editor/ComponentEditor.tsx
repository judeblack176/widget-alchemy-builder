
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { Tooltip as CustomTooltip } from "../TooltipManager";
import ApiIntegrationSection from "../api-integration/ApiIntegrationSection";
import ComponentHeader from "../component-header/ComponentHeader";
import ContentFieldsManager from "../content-fields/ContentFieldsManager";
import TooltipSelector from "../tooltip/TooltipSelector";
import PropertyEditor from "../property-editor/PropertyEditor";
import { useComponentVisibility } from "./useComponentVisibility";
import ActionButtons from "./ActionButtons";
import { componentTypeLabels } from "./IconMapping";
import { Trash2 } from "lucide-react";

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
  showActionButtons?: boolean;
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
  customTooltips = [],
  showActionButtons = true
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { shouldShowDataIntegration, shouldShowContentEditor } = useComponentVisibility(component.type);

  return (
    <div className="w-full">
      <div 
        className="cursor-pointer w-full relative" 
        onClick={onToggleExpand}
      >
        <ComponentHeader 
          component={component}
          componentTypeLabels={componentTypeLabels}
          isExpanded={isExpanded} 
          onRemove={onRemoveComponent}
        />
        
        {/* Only show the remove button when component is not expanded and not disabled */}
        {!isExpanded && !disableRemove && showActionButtons && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveComponent(component.id);
            }}
            className="absolute top-3 right-3 h-8 w-8 p-0 text-gray-500 hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Add PropertyEditor component for all components */}
          <PropertyEditor 
            component={component}
            onUpdateComponent={onUpdateComponent}
          />
          
          {/* Tooltip selector at top of expanded view */}
          {onApplyTooltip && (
            <TooltipSelector 
              component={component}
              customTooltips={customTooltips}
              onApplyTooltip={onApplyTooltip}
            />
          )}

          {/* API Integration Section - Always at the top */}
          {shouldShowDataIntegration() && (
            <ApiIntegrationSection 
              component={component}
              apis={apis}
              onUpdateComponent={onUpdateComponent}
              onRequestApiTemplate={onRequestApiTemplate}
            />
          )}

          {/* Content Fields Manager - Show for components that support formatted content */}
          {shouldShowContentEditor() && (
            <ContentFieldsManager 
              component={component}
              onUpdateComponent={onUpdateComponent}
            />
          )}

          {/* Action Buttons */}
          {showActionButtons && (
            <ActionButtons
              componentId={component.id}
              onRemoveComponent={onRemoveComponent}
              disableRemove={disableRemove}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentEditor;
