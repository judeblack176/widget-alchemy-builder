
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
  
  // Special handling for alert components: 
  // 1. API Integration
  // 2. Alert Title via ContentFieldsManager
  // 3. Alert Type via PropertyEditor
  // 4. Alert Message via ContentFieldsManager
  // 5. Dismissible & Auto Close via PropertyEditor 
  // 6. Tooltip at the end
  if (component.type === 'alert') {
    // Split the alert properties into initial (type) and end properties (dismissible, autoClose)
    const initialProps = { ...component, props: { ...component.props } };
    const endProps = { ...component, props: { ...component.props } };
    
    // For PropertyEditor rendering pass, we need to tell the component which properties to show
    initialProps.alertPropertiesSection = 'initial'; // Will show type only (title is handled by ContentFieldsManager)
    endProps.alertPropertiesSection = 'end'; // Will show dismissible & autoClose
    
    // Create a special component just for the alert title
    // We'll use "title" as key for the FormattedContent
    const titleComponent = {
      ...component,
      formattedContent: component.props?.title || ""
    };
    
    // Handler to update the title when changed via ContentFieldsManager
    const handleTitleUpdate = (updatedTitleComponent: WidgetComponent) => {
      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          title: updatedTitleComponent.formattedContent
        }
      };
      onUpdateComponent(updatedComponent);
    };
    
    return (
      <>
        {/* API Integration Section - First */}
        {shouldShowDataIntegration() && (
          <ApiIntegrationSection 
            component={component}
            apis={apis}
            onUpdateComponent={onUpdateComponent}
            onRequestApiTemplate={onRequestApiTemplate}
          />
        )}
        
        {/* ContentFieldsManager for Alert Title - Single Line */}
        <ContentFieldsManager 
          component={titleComponent}
          onUpdateComponent={handleTitleUpdate}
          customLabel="Alert Title"
        />
        
        {/* Property editor for type - Initial properties */}
        <PropertyEditor 
          component={initialProps}
          onUpdateComponent={onUpdateComponent}
        />
        
        {/* Content Fields Manager - Alert Message */}
        {shouldShowContentEditor() && (
          <ContentFieldsManager 
            component={component}
            onUpdateComponent={onUpdateComponent}
            customLabel="Alert Message"
          />
        )}
        
        {/* Property editor for dismissible and autoClose - End properties */}
        <PropertyEditor 
          component={endProps}
          onUpdateComponent={onUpdateComponent}
        />
        
        {/* Tooltip selector - Very end of alert settings */}
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
