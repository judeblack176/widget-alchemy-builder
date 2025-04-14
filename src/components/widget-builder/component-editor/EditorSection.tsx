
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import {
  HeaderSectionRenderer,
  AlertSectionRenderer,
  TextSectionRenderer,
  ButtonSectionRenderer,
  ImageSectionRenderer,
  ChartSectionRenderer,
  DefaultSectionRenderer
} from "./components/renderers";

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
  if (isHeader) {
    return (
      <HeaderSectionRenderer
        component={component}
        onUpdateComponent={onUpdateComponent}
        onApplyTooltip={onApplyTooltip}
        customTooltips={customTooltips}
        shouldShowContentEditor={shouldShowContentEditor}
      />
    );
  }
  
  switch (component.type) {
    case 'alert':
      return (
        <AlertSectionRenderer
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
          onApplyTooltip={onApplyTooltip}
          customTooltips={customTooltips}
          shouldShowDataIntegration={shouldShowDataIntegration}
          shouldShowContentEditor={shouldShowContentEditor}
        />
      );
    case 'text':
      return (
        <TextSectionRenderer
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
          onApplyTooltip={onApplyTooltip}
          customTooltips={customTooltips}
          shouldShowDataIntegration={shouldShowDataIntegration}
          shouldShowContentEditor={shouldShowContentEditor}
        />
      );
    case 'button':
      return (
        <ButtonSectionRenderer
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
          onApplyTooltip={onApplyTooltip}
          customTooltips={customTooltips}
          shouldShowDataIntegration={shouldShowDataIntegration}
        />
      );
    case 'image':
      return (
        <ImageSectionRenderer
          component={component}
          onUpdateComponent={onUpdateComponent}
          onApplyTooltip={onApplyTooltip}
          customTooltips={customTooltips}
        />
      );
    case 'chart':
      return (
        <ChartSectionRenderer
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
          onApplyTooltip={onApplyTooltip}
          customTooltips={customTooltips}
          shouldShowDataIntegration={shouldShowDataIntegration}
        />
      );
    default:
      return (
        <DefaultSectionRenderer
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRequestApiTemplate={onRequestApiTemplate}
          onApplyTooltip={onApplyTooltip}
          customTooltips={customTooltips}
          shouldShowDataIntegration={shouldShowDataIntegration}
          shouldShowContentEditor={shouldShowContentEditor}
        />
      );
  }
};

export default EditorSection;
