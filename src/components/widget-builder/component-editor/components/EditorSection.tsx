
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import ApiIntegrationSection from "../../api-integration/ApiIntegrationSection";
import ContentFieldsManager from "../../content-fields/ContentFieldsManager";
import TooltipSelector from "../../tooltip/TooltipSelector";
import PropertyEditor from "../../property-editor/PropertyEditor";

interface EditorSectionProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
  isHeader: boolean;
  shouldShowDataIntegration: () => boolean;
  shouldShowContentEditor: () => boolean;
}

const EditorSection: React.FC<EditorSectionProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  customTooltips = [],
  isHeader,
  shouldShowDataIntegration,
  shouldShowContentEditor,
}) => {
  // For header components, we want a specific order: Icon, Tooltip, then Content
  if (isHeader) {
    return (
      <>
        {/* Property editor for icons */}
        <PropertyEditor 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
        
        {/* Tooltip selector */}
        {onApplyTooltip && (
          <TooltipSelector 
            component={component}
            customTooltips={customTooltips}
            onApplyTooltip={onApplyTooltip}
            label="Add Tooltip"
          />
        )}
        
        {shouldShowContentEditor() && (
          <ContentFieldsManager 
            component={component}
            onUpdateComponent={onUpdateComponent}
            customLabel="Widget Name"
          />
        )}
      </>
    );
  }

  // For non-header components, use the original order
  return (
    <>
      {/* API Integration Section */}
      {shouldShowDataIntegration() && (
        <ApiIntegrationSection 
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
        />
      )}

      {/* Content Fields Manager */}
      {shouldShowContentEditor() && (
        <ContentFieldsManager 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      )}
      
      {/* Tooltip selector */}
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

export default EditorSection;
