
import React from "react";
import { ContentField } from "@/types/component-types";
import ApiFieldBadge from "./ApiFieldBadge";

interface ApiFieldsListProps {
  contentFields: ContentField[];
  onAddPlaceholder: (placeholder: string) => void;
}

const ApiFieldsList: React.FC<ApiFieldsListProps> = ({ contentFields, onAddPlaceholder }) => {
  if (!contentFields || contentFields.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {contentFields.map((field, idx) => (
        <ApiFieldBadge 
          key={idx} 
          field={field} 
          onAddPlaceholder={onAddPlaceholder} 
        />
      ))}
    </div>
  );
};

export default ApiFieldsList;
