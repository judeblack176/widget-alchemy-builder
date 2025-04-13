
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip as CustomTooltip } from "../TooltipManager";
import PropertyEditor from "../property-editor/PropertyEditor";
import { useComponentVisibility } from "./useComponentVisibility";
import ActionButtons from "./ActionButtons";
import { componentTypeLabels } from "./IconMapping";
import HeaderSection from "./components/HeaderSection";
import EditorSection from "./components/EditorSection";

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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { shouldShowDataIntegration, shouldShowContentEditor } = useComponentVisibility(component.type);

  // Is this a header component?
  const isHeader = component.type === 'header';

  return (
    <div className="w-full">
      <HeaderSection 
        component={component}
        componentTypeLabels={componentTypeLabels}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        onRemove={onRemoveComponent}
        showActionButtons={showActionButtons}
        disableRemove={disableRemove}
      />

      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* For header components, show content editor first */}
          {isHeader && shouldShowContentEditor() && (
            <EditorSection 
              component={component}
              apis={apis}
              onUpdateComponent={onUpdateComponent}
              onRequestApiTemplate={onRequestApiTemplate}
              onApplyTooltip={onApplyTooltip}
              customTooltips={customTooltips}
              isHeader={true}
              shouldShowDataIntegration={shouldShowDataIntegration}
              shouldShowContentEditor={shouldShowContentEditor}
            />
          )}
          
          {/* Add PropertyEditor component for all components */}
          <PropertyEditor 
            component={component}
            onUpdateComponent={onUpdateComponent}
          />
          
          {/* For non-header components, use the original order */}
          {!isHeader && (
            <EditorSection 
              component={component}
              apis={apis}
              onUpdateComponent={onUpdateComponent}
              onRequestApiTemplate={onRequestApiTemplate}
              onApplyTooltip={onApplyTooltip}
              customTooltips={customTooltips}
              isHeader={false}
              shouldShowDataIntegration={shouldShowDataIntegration}
              shouldShowContentEditor={shouldShowContentEditor}
            />
          )}

          {/* Action Buttons */}
          {showActionButtons && (
            <ActionButtons
              componentId={component.id}
              onRemoveComponent={onRemoveComponent}
              disableRemove={disableRemove}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentEditor;
