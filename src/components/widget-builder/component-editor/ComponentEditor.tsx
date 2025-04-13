
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip as CustomTooltip } from "../TooltipManager";
import PropertyEditor from "../property-editor/PropertyEditor";
import { useComponentVisibility } from "./useComponentVisibility";
import ActionButtons from "./ActionButtons";
import { componentTypeLabels } from "./IconMapping";
import HeaderSection from "./components/HeaderSection";
import EditorSection from "./components/EditorSection";
import { cleanHtmlContent } from "../component-renderers/renderComponentWithoutTooltip";

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
  
  // Clean the component title for display in the editor
  let displayComponent = { ...component };
  if (component.formattedContent) {
    const cleanContent = cleanHtmlContent(component.formattedContent);
    
    // For header, also update the name property to show clean content
    if (isHeader && displayComponent.props) {
      displayComponent = {
        ...displayComponent,
        props: {
          ...displayComponent.props,
          name: cleanContent
        }
      };
    }
  }

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
        <div className="p-4 space-y-6">
          {/* For header components, use EditorSection with specific order */}
          <EditorSection 
            component={component}
            apis={apis}
            onUpdateComponent={onUpdateComponent}
            onRequestApiTemplate={onRequestApiTemplate}
            onApplyTooltip={onApplyTooltip}
            customTooltips={customTooltips}
            isHeader={isHeader}
            shouldShowDataIntegration={shouldShowDataIntegration}
            shouldShowContentEditor={shouldShowContentEditor}
          />
          
          {/* For non-header components, show PropertyEditor */}
          {!isHeader && (
            <PropertyEditor 
              component={component}
              onUpdateComponent={onUpdateComponent}
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
