
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import ApiIntegrationSection from "../../../api-integration/ApiIntegrationSection";
import ContentFieldsManager from "../../../content-fields/ContentFieldsManager";
import TooltipSelector from "../../../tooltip/TooltipSelector";

interface TextSectionRendererProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
  shouldShowDataIntegration: () => boolean;
  shouldShowContentEditor: () => boolean;
}

const TextSectionRenderer: React.FC<TextSectionRendererProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  customTooltips = [],
  shouldShowDataIntegration,
  shouldShowContentEditor,
}) => {
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
      
      {shouldShowContentEditor() && (
        <ContentFieldsManager 
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      )}
      
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

export default TextSectionRenderer;
