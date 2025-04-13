
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

// Define an extended type for alert components with section property
interface AlertComponentWithSection extends WidgetComponent {
  alertPropertiesSection?: 'initial' | 'end' | 'title' | 'type';
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
  // 2. Alert Type via PropertyEditor with type section for API fields
  // 3. Alert Title via PropertyEditor with title section for API fields
  // 4. Alert Message via ContentFieldsManager
  // 5. Dismissible & Auto Close via PropertyEditor with end section
  // 6. Tooltip at the end
  if (component.type === 'alert') {
    // Create a component with the type section for type properties
    const typeProps: AlertComponentWithSection = { 
      ...component, 
      props: { ...component.props },
      alertPropertiesSection: 'type' // Will show alert type with API fields
    };
    
    // For the alert title, we'll use a separate section for PropertyEditor
    const titleComponent: AlertComponentWithSection = { 
      ...component, 
      props: { ...component.props },
      alertPropertiesSection: 'title' // Title section for API fields
    };
    
    // For the alert message, we'll use the standard content fields manager
    const messageComponent = { ...component };
    
    // For dismissible and autoClose settings
    const endProps: AlertComponentWithSection = { 
      ...component, 
      props: { ...component.props },
      alertPropertiesSection: 'end' // Will show dismissible & autoClose
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
        
        {/* Alert Type with API Fields - Second */}
        <PropertyEditor 
          component={typeProps}
          onUpdateComponent={onUpdateComponent}
        />
        
        {/* Alert Title with API Fields - Third */}
        <PropertyEditor 
          component={titleComponent}
          onUpdateComponent={onUpdateComponent}
        />
        
        {/* Content Fields Manager - Alert Message - Fourth */}
        {shouldShowContentEditor() && (
          <ContentFieldsManager 
            component={component}
            onUpdateComponent={onUpdateComponent}
            customLabel="Alert Message"
          />
        )}
        
        {/* Property editor for dismissible and autoClose - End properties - Fifth */}
        <PropertyEditor 
          component={endProps}
          onUpdateComponent={onUpdateComponent}
        />
        
        {/* Tooltip selector - Very end of alert settings - Sixth */}
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
      
      {/* Property Editor */}
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
        />
      )}
    </>
  );
};

export default EditorSection;
