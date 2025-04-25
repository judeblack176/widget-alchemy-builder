
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import EditorSection from "../EditorSection";
import ActionButtons from "../ActionButtons";

interface EditorContentProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  customTooltips?: Tooltip[];
  showActionButtons?: boolean;
  disableRemove?: boolean;
  isHeader: boolean;
  shouldShowDataIntegration: () => boolean;
  shouldShowContentEditor: () => boolean;
  isTemplate?: boolean;
  onToggleVisibility?: () => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  customTooltips = [],
  showActionButtons = true,
  disableRemove = false,
  isHeader,
  shouldShowDataIntegration,
  shouldShowContentEditor,
  isTemplate,
  onToggleVisibility
}) => {
  return (
    <div className="p-4 space-y-6">
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
      
      {/* Action Buttons */}
      {showActionButtons && (
        <ActionButtons
          componentId={component.id}
          onRemoveComponent={onRemoveComponent}
          disableRemove={disableRemove}
        />
      )}

      {/* Visibility Toggle */}
      {onToggleVisibility && (
        <div className="mt-4 flex items-center">
          <button
            onClick={onToggleVisibility}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center"
          >
            {component.visible !== false ? 'Hide Component' : 'Show Component'} in Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default EditorContent;
