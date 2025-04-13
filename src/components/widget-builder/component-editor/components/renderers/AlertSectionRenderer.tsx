
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import ApiIntegrationSection from "../../../api-integration/ApiIntegrationSection";
import ContentFieldsManager from "../../../content-fields/ContentFieldsManager";
import PropertyEditor from "../../../property-editor/PropertyEditor";
import TooltipSelector from "../../../tooltip/TooltipSelector";

interface AlertSectionRendererProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
  shouldShowDataIntegration: () => boolean;
  shouldShowContentEditor: () => boolean;
}

const AlertSectionRenderer: React.FC<AlertSectionRendererProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  customTooltips = [],
  shouldShowDataIntegration,
  shouldShowContentEditor,
}) => {
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
      {shouldShowDataIntegration() && (
        <ApiIntegrationSection 
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
        />
      )}
      
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

export default AlertSectionRenderer;
