
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
  // For header components, we want a specific order: Widget Name, Icon, then Tooltip
  if (isHeader) {
    return (
      <>
        {/* Widget Name (Content Fields) first */}
        {shouldShowContentEditor() && (
          <ContentFieldsManager 
            component={component}
            onUpdateComponent={onUpdateComponent}
            customLabel="Widget Name"
          />
        )}
        
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
      </>
    );
  }
  
  // Special handling for alert components: API Integration first, then PropertyEditor (Title & Type),
  // then ContentFieldsManager (Alert Message), then Tooltip Selector
  if (component.type === 'alert') {
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
        
        {/* Property editor for title and type - This includes the Alert Title and Alert Type */}
        <PropertyEditor 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
        
        {/* Content Fields Manager (for formatted Alert Message) - Now positioned directly after Title & Type */}
        {shouldShowContentEditor() && (
          <ContentFieldsManager 
            component={component}
            onUpdateComponent={onUpdateComponent}
            customLabel="Alert Message"
          />
        )}
        
        {/* Tooltip selector - Moved to the end of the alert settings */}
        {onApplyTooltip && (
          <TooltipSelector 
            component={component}
            customTooltips={customTooltips}
            onApplyTooltip={onApplyTooltip}
          />
        )}
      </>
    );
  }

  // For other non-header, non-alert components, use the original order
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
