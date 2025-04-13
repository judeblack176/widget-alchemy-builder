
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WidgetComponent } from "@/types/widget-types";
import { AlertCircle, Database, Calendar, Hash, FileText, Table } from "lucide-react";

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

  // Function to determine field type based on name and add appropriate icon
  const getFieldTypeInfo = (fieldName: string, apiField: string) => {
    const lowerField = fieldName.toLowerCase();
    const lowerApiField = apiField.toLowerCase();
    
    // Check for date/time fields
    if (
      lowerField.includes('date') || 
      lowerField.includes('time') || 
      lowerApiField.includes('date') || 
      lowerApiField.includes('time')
    ) {
      return {
        icon: <Calendar size={12} className="mr-1" />,
        bgClass: "bg-yellow-50 text-yellow-600 border-yellow-200"
      };
    }
    
    // Check for numeric fields
    if (
      lowerField.includes('count') || 
      lowerField.includes('number') || 
      lowerField.includes('amount') || 
      lowerField.includes('total') ||
      lowerField.includes('price') ||
      lowerField.includes('id')
    ) {
      return {
        icon: <Hash size={12} className="mr-1" />,
        bgClass: "bg-purple-50 text-purple-600 border-purple-200"
      };
    }
    
    // Check for array/list fields
    if (
      apiField.includes('[') || 
      lowerField.includes('list') ||
      lowerField.includes('items') ||
      lowerField.includes('array')
    ) {
      return {
        icon: <Table size={12} className="mr-1" />,
        bgClass: "bg-indigo-50 text-indigo-600 border-indigo-200"
      };
    }
    
    // Check for complex/object fields
    if (
      lowerField.includes('object') || 
      apiField.includes('.') ||
      lowerField.includes('data')
    ) {
      return {
        icon: <Database size={12} className="mr-1" />,
        bgClass: "bg-blue-50 text-blue-600 border-blue-200"
      };
    }
    
    // Default for text/string fields
    return {
      icon: <FileText size={12} className="mr-1" />,
      bgClass: "bg-green-50 text-green-600 border-green-200"
    };
  };

  return (
    <div className="mt-3" onClick={onInputClick}>
      <Label className="text-xs font-medium mb-1 block">Available API Fields</Label>
      <div className="flex flex-wrap gap-2">
        {component.contentFields.map((field, idx) => {
          const { icon, bgClass } = getFieldTypeInfo(field.label, field.apiField);
          
          return (
            <Badge 
              key={idx} 
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
        })}
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground flex items-center">
        <AlertCircle size={12} className="mr-1" />
        Click on a field to add it to your content
      </div>
    </div>
  );
};

export default ApiFieldsDisplay;
