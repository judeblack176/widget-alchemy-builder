
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import ContentFieldsManager from "../../../content-fields/ContentFieldsManager";
import PropertyEditor from "../../../property-editor/PropertyEditor";
import TooltipSelector from "../../../tooltip/TooltipSelector";

interface HeaderSectionRendererProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
  shouldShowContentEditor: () => boolean;
}

const HeaderSectionRenderer: React.FC<HeaderSectionRendererProps> = ({
  component,
  onUpdateComponent,
  onApplyTooltip,
  customTooltips = [],
  shouldShowContentEditor,
}) => {
  return (
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
};

export default HeaderSectionRenderer;
