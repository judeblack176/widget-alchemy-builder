
import React, { useEffect } from "react";
import { WidgetComponent } from "@/types/widget-types";
import FormattedTextEditor from "./FormattedTextEditor";

interface ContentFieldsManagerProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  customLabel?: string; // Optional custom label
}

const ContentFieldsManager: React.FC<ContentFieldsManagerProps> = ({
  component,
  onUpdateComponent,
  customLabel
}) => {
  // For header components, use single line input
  const singleLine = component.type === 'header';
  
  // Update function for handling changes
  const handleContentUpdate = (updatedComponent: WidgetComponent) => {
    // For header components, synchronize the formattedContent to name prop
    if (updatedComponent.type === 'header' && updatedComponent.formattedContent) {
      // We'll update both formattedContent and name
      const withUpdatedName = {
        ...updatedComponent,
        props: {
          ...updatedComponent.props,
          name: updatedComponent.formattedContent,
        }
      };
      onUpdateComponent(withUpdatedName);
    } else {
      onUpdateComponent(updatedComponent);
    }
  };
  
  // If header, ensure formattedContent is initialized from name
  useEffect(() => {
    if (component.type === 'header' && component.props?.name && !component.formattedContent) {
      onUpdateComponent({
        ...component,
        formattedContent: component.props.name
      });
    }
  }, [component, onUpdateComponent]);
  
  return (
    <FormattedTextEditor 
      component={component} 
      onUpdateComponent={handleContentUpdate}
      singleLine={singleLine}
      customLabel={customLabel}
    />
  );
};

export default ContentFieldsManager;

