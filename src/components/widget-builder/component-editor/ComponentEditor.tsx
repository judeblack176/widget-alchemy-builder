
import React, { useState, useEffect } from "react";
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
  
  // Auto-expand for header components
  useEffect(() => {
    if (component.type === 'header' && !isExpanded) {
      onToggleExpand();
    }
  }, [component.type, isExpanded, onToggleExpand]);

  return (
    <div className="w-full">
      <div 
        className="cursor-pointer w-full" 
        onClick={onToggleExpand}
      >
        <ComponentHeader 
          component={component}
          componentTypeLabels={componentTypeLabels}
          isExpanded={isExpanded} 
          onRemove={showActionButtons ? onRemoveComponent : undefined}
        />
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
