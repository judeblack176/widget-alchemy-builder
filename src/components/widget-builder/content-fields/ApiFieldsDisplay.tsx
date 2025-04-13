
import React from "react";
import { Label } from "@/components/ui/label";
import { WidgetComponent } from "@/types/widget-types";
import { AlertCircle } from "lucide-react";
import ApiFieldsList from "./components/ApiFieldsList";

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
      
      <ApiFieldsList 
        contentFields={component.contentFields}
        onAddPlaceholder={onAddPlaceholder}
      />
      
      <div className="mt-2 text-xs text-muted-foreground flex items-center">
        <AlertCircle size={12} className="mr-1" />
        Click on a field to add it to your content
      </div>
    </div>
  );
};

export default ApiFieldsDisplay;
