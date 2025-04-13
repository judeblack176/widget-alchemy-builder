
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ContentField } from "@/types/component-types";
import { getFieldTypeInfo } from "./fieldTypeUtils";

interface ApiFieldBadgeProps {
  field: ContentField;
  onAddPlaceholder: (placeholder: string) => void;
}

const ApiFieldBadge: React.FC<ApiFieldBadgeProps> = ({ field, onAddPlaceholder }) => {
  const { icon, bgClass } = getFieldTypeInfo(field.label, field.apiField);
  
  return (
    <Badge 
      variant="outline" 
      className={`text-xs cursor-pointer hover:opacity-80 flex items-center ${bgClass}`}
      onClick={(e) => {
        e.stopPropagation();
        const placeholder = `{{${field.label}}}`;
        onAddPlaceholder(placeholder);
      }}
    >
      {icon}
      {field.label} 
      <span className="text-gray-500 ml-1 text-xs">({field.apiField})</span>
      {field.mapping && (
        <span className="text-green-600 ml-1 flex items-center">
          → {field.mapping}
        </span>
      )}
    </Badge>
  );
};

export default ApiFieldBadge;
