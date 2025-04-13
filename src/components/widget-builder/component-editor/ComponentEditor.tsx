
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip as CustomTooltip } from "../TooltipManager";
import { useComponentVisibility } from "./useComponentVisibility";
import { componentTypeLabels } from "./IconMapping";
import HeaderSection from "./components/HeaderSection";
import EditorContent from "./components/EditorContent";
import useComponentDisplay from "./hooks/useComponentDisplay";

interface ComponentEditorProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  disableRemove?: boolean;
  customTooltips?: CustomTooltip[];
  showActionButtons?: boolean;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  apis,
  isExpanded,
  onToggleExpand,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  disableRemove = false,
  customTooltips = [],
  showActionButtons = true
}) => {
  const { shouldShowDataIntegration, shouldShowContentEditor } = useComponentVisibility(component.type);
  const { isHeader, getDisplayComponent } = useComponentDisplay(component);
  
  // Get cleaned display component for header display
  const displayComponent = getDisplayComponent();

  return (
    <div className="w-full">
      <HeaderSection 
        component={displayComponent}
        componentTypeLabels={componentTypeLabels}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        onRemove={onRemoveComponent}
        showActionButtons={showActionButtons}
        disableRemove={disableRemove}
      />

      {isExpanded && (
        <EditorContent
          component={component}
          apis={apis}
          onUpdateComponent={onUpdateComponent}
          onRemoveComponent={onRemoveComponent}
          onRequestApiTemplate={onRequestApiTemplate}
          onApplyTooltip={onApplyTooltip}
          customTooltips={customTooltips}
          showActionButtons={showActionButtons}
          disableRemove={disableRemove}
          isHeader={isHeader}
          shouldShowDataIntegration={shouldShowDataIntegration}
          shouldShowContentEditor={shouldShowContentEditor}
        />
      )}
    </div>
  );
};

export default ComponentEditor;
