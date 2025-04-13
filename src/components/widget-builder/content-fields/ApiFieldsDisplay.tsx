
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WidgetComponent } from "@/types/widget-types";

interface ApiFieldsDisplayProps {
  component: WidgetComponent;
  onInputClick: (e: React.MouseEvent) => void;
  onAddPlaceholder: (placeholder: string) => void;
}

const ApiFieldsDisplay: React.FC<ApiFieldsDisplayProps> = ({
  component,
  onInputClick,
  onAddPlaceholder
}) => {
  if (!component.contentFields || component.contentFields.length === 0) {
    return null;
  }

  return (
    <div className="mt-3" onClick={onInputClick}>
      <Label className="text-xs font-medium mb-1 block">Available API Fields</Label>
      <div className="flex flex-wrap gap-2">
        {component.contentFields.map((field, idx) => (
          <Badge 
            key={idx} 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              const placeholder = `{{${field.label}}}`;
              onAddPlaceholder(placeholder);
            }}
          >
            {field.label} 
            <span className="text-gray-500 ml-1">({field.apiField})</span>
            {field.mapping && (
              <span className="text-green-600 ml-1">→ {field.mapping}</span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ApiFieldsDisplay;
