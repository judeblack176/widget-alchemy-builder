
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import PropertyEditor from "../../../property-editor/PropertyEditor";
import TooltipSelector from "../../../tooltip/TooltipSelector";

interface ImageSectionRendererProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
}

const ImageSectionRenderer: React.FC<ImageSectionRendererProps> = ({
  component,
  onUpdateComponent,
  onApplyTooltip,
  customTooltips = [],
}) => {
  return (
    <>
      <PropertyEditor 
        component={component}
        onUpdateComponent={onUpdateComponent}
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

export default ImageSectionRenderer;
