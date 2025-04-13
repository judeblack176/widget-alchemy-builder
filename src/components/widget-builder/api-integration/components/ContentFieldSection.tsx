
import React from "react";
import { WidgetComponent, ContentField } from "@/types/component-types";
import ContentFieldForm from "./ContentFieldForm";
import ContentFieldList from "./ContentFieldList";

interface ContentFieldSectionProps {
  component: WidgetComponent;
  availableApiFields: string[];
  availableMappings: string[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ContentFieldSection: React.FC<ContentFieldSectionProps> = ({
  component,
  availableApiFields,
  availableMappings,
  onUpdateComponent
}) => {
  const addContentField = (label: string, apiField: string, mapping: string) => {
    const newContentFields = [
      ...(component.contentFields || []),
      { label, apiField, mapping }
    ];

    // Update the component with the new content field
    const updatedComponent = {
      ...component,
      contentFields: newContentFields
    };

    onUpdateComponent(updatedComponent);
  };

  const removeContentField = (index: number) => {
    const currentFields = [...(component.contentFields || [])];
    currentFields.splice(index, 1);

    const updatedComponent = {
      ...component,
      contentFields: currentFields
    };

    onUpdateComponent(updatedComponent);
  };
  
  const updateContentField = (index: number, updatedField: ContentField) => {
    const currentFields = [...(component.contentFields || [])];
    currentFields[index] = updatedField;
    
    const updatedComponent = {
      ...component,
      contentFields: currentFields
    };
    
    onUpdateComponent(updatedComponent);
  };

  return (
    <div className="mt-3 border-t pt-3">
      <h5 className="text-sm font-medium mb-2">Add Content Fields</h5>
      
      <ContentFieldForm 
        availableApiFields={availableApiFields}
        availableMappings={availableMappings}
        onAddContentField={addContentField}
      />

      <ContentFieldList 
        contentFields={component.contentFields || []}
        onRemoveContentField={removeContentField}
        onUpdateContentField={updateContentField}
        availableApiFields={availableApiFields}
        availableMappings={availableMappings}
      />
    </div>
  );
};

export default ContentFieldSection;
