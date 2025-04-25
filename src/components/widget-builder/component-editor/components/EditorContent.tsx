
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Tooltip } from "@/components/widget-builder/TooltipManager";
import EditorSection from "../EditorSection";
import ActionButtons from "../ActionButtons";
import PropertyEditor from "@/components/widget-builder/property-editor/PropertyEditor";
import TextOptionsAccordion from "@/components/widget-builder/content-fields/TextOptionsAccordion";

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
  // Handle property change for custom options
  const handlePropertyChange = (propertyName: string, value: any) => {
    const updatedComponent = {
      ...component,
      props: {
        ...component.props,
        [propertyName]: value,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  // Prevent event propagation for nested components
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Render component-specific custom options
  const renderCustomOptions = () => {
    switch (component.type) {
      case 'text':
        return (
          <TextOptionsAccordion 
            component={component} 
            onPropertyChange={handlePropertyChange}
            onInputClick={handleInputClick}
          />
        );
      case 'button':
        return (
          <div className="mt-4 border-t pt-4 border-gray-200">
            <h3 className="text-sm font-medium mb-2">Button Options</h3>
            <PropertyEditor 
              component={component}
              onUpdateComponent={onUpdateComponent}
            />
          </div>
        );
      case 'image':
        return (
          <div className="mt-4 border-t pt-4 border-gray-200">
            <h3 className="text-sm font-medium mb-2">Image Settings</h3>
            <PropertyEditor 
              component={component}
              onUpdateComponent={onUpdateComponent}
            />
          </div>
        );
      default:
        if (component.type !== 'header' && !isHeader) {
          return (
            <div className="mt-4 border-t pt-4 border-gray-200">
              <PropertyEditor 
                component={component}
                onUpdateComponent={onUpdateComponent}
              />
            </div>
          );
        }
        return null;
    }
  };

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
      
      {/* Custom Options for each component type */}
      {renderCustomOptions()}
      
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
