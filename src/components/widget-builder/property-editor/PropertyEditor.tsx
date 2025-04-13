
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import HeaderProperties from "./components/HeaderProperties";
import GeneralProperties from "./components/GeneralProperties";
import { cleanHtmlContent } from "../component-renderers/renderComponentWithoutTooltip";

interface PropertyEditorProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent
}) => {
  // Special rendering for header components to ensure icon and name are always displayed
  if (component.type === 'header') {
    // Create a display version of the component with clean content for display
    const displayComponent = { ...component };
    
    if (component.formattedContent && displayComponent.props) {
      const cleanContent = cleanHtmlContent(component.formattedContent);
      displayComponent.props = {
        ...displayComponent.props,
        name: cleanContent
      };
    }
    
    return <HeaderProperties component={displayComponent} onUpdateComponent={onUpdateComponent} />;
  }

  // Remove the duplicate alert properties rendering
  // The alert properties are now handled in EditorSection
  if (component.type !== 'alert') {
    return <GeneralProperties component={component} onUpdateComponent={onUpdateComponent} />;
  }

  return null;
};

export default PropertyEditor;
