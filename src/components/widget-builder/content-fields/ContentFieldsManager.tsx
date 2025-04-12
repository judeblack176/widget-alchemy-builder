
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ContentFieldsManagerProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ContentFieldsManager: React.FC<ContentFieldsManagerProps> = ({
  component,
  onUpdateComponent
}) => {
  const handleFormattedContentChange = (value: string) => {
    const updatedComponent = {
      ...component,
      formattedContent: value
    };
    onUpdateComponent(updatedComponent);
  };

  // Don't render anything if there are no content fields and no formatted content
  if (!component.contentFields?.length && !component.formattedContent) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Formatted Content</h3>
      <div className="border rounded-md p-3 bg-gray-50">
        <textarea
          className="w-full h-32 border rounded p-2 text-sm"
          value={component.formattedContent || ""}
          onChange={(e) => handleFormattedContentChange(e.target.value)}
          placeholder="Enter formatted content or use API fields..."
        />
        
        {component.contentFields && component.contentFields.length > 0 && (
          <div className="mt-3">
            <Label className="text-xs font-medium mb-1 block">Available API Fields</Label>
            <div className="flex flex-wrap gap-2">
              {component.contentFields.map((field, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    const placeholder = `{{${field.label}}}`;
                    const currentContent = component.formattedContent || "";
                    handleFormattedContentChange(currentContent + placeholder);
                  }}
                >
                  {field.label} <span className="text-gray-500 ml-1">({field.apiField})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentFieldsManager;
