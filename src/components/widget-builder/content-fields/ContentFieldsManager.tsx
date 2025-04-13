
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import FormattedTextEditor from "./FormattedTextEditor";

interface ContentFieldsManagerProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ContentFieldsManager: React.FC<ContentFieldsManagerProps> = ({
  component,
  onUpdateComponent
}) => {
  // For header components, use single line input
  const singleLine = component.type === 'header';
  
  return (
    <FormattedTextEditor 
      component={component} 
      onUpdateComponent={onUpdateComponent}
      singleLine={singleLine}
    />
  );
};

export default ContentFieldsManager;
