import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import ApiIntegrationSection from "../api-integration/ApiIntegrationSection";
import ContentFieldsManager from "../content-fields/ContentFieldsManager";
import TooltipSelector from "../tooltip/TooltipSelector";
import PropertyEditor from "../property-editor/PropertyEditor";

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
  const renderHeaderSection = () => (
    <>
      {shouldShowContentEditor() && (
        <ContentFieldsManager 
          component={component}
          onUpdateComponent={onUpdateComponent}
          customLabel="Widget Name"
        />
      )}
      
      <PropertyEditor 
        component={component}
        onUpdateComponent={onUpdateComponent}
      />
      
      {renderTooltipSelector()}
    </>
  );

  const renderAlertSection = () => {
    const titleComponent = {
      ...component,
      formattedContent: component.props?.title || ""
    };
    
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
        {shouldShowDataIntegration() && renderApiIntegration()}
        
        <ContentFieldsManager 
          component={titleComponent}
          onUpdateComponent={handleTitleUpdate}
          customLabel="Alert Title"
          singleLine={true}
        />
        
        {shouldShowContentEditor() && (
          <ContentFieldsManager 
            component={component}
            onUpdateComponent={onUpdateComponent}
            customLabel="Alert Message"
          />
        )}
        
        <PropertyEditor 
          component={component}
          onUpdateComponent={onUpdateComponent}
          excludeProperties={['title']} 
        />
        
        {renderTooltipSelector()}
      </>
    );
  };

  const renderTextSection = () => (
    <>
      {shouldShowDataIntegration() && renderApiIntegration()}
      
      {shouldShowContentEditor() && (
        <ContentFieldsManager 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      )}
      
      {renderTooltipSelector()}
    </>
  );

  const renderButtonSection = () => (
    <>
      {shouldShowDataIntegration() && renderApiIntegration()}
      
      <PropertyEditor 
        component={component}
        onUpdateComponent={onUpdateComponent}
      />
      
      {renderTooltipSelector()}
    </>
  );

  const renderImageSection = () => (
    <>
      <PropertyEditor 
        component={component}
        onUpdateComponent={onUpdateComponent}
      />
      
      {renderTooltipSelector()}
    </>
  );

  const renderDefaultSection = () => (
    <>
      {shouldShowDataIntegration() && renderApiIntegration()}
      
      {shouldShowContentEditor() && (
        <ContentFieldsManager 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      )}
      
      <PropertyEditor 
        component={component}
        onUpdateComponent={onUpdateComponent}
      />
      
      {renderTooltipSelector()}
    </>
  );

  const renderApiIntegration = () => (
    <ApiIntegrationSection 
      component={component}
      apis={apis}
      onUpdateComponent={onUpdateComponent}
      onRequestApiTemplate={onRequestApiTemplate}
    />
  );

  const renderTooltipSelector = () => {
    if (!onApplyTooltip) return null;
    
    return (
      <TooltipSelector 
        component={component}
        customTooltips={customTooltips}
        onApplyTooltip={onApplyTooltip}
        label={isHeader ? "Add Tooltip" : undefined}
      />
    );
  };

  if (isHeader) {
    return renderHeaderSection();
  }
  
  switch (component.type) {
    case 'alert':
      return renderAlertSection();
    case 'text':
      return renderTextSection();
    case 'button':
      return renderButtonSection();
    case 'image':
      return renderImageSection();
    default:
      return renderDefaultSection();
  }
};

export default EditorSection;
