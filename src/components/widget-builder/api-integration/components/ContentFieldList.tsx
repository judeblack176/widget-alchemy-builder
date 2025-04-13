
import React from "react";
import { ContentField } from "@/types/component-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface ContentFieldListProps {
  contentFields: ContentField[];
  onRemoveContentField: (index: number) => void;
}

const ContentFieldList: React.FC<ContentFieldListProps> = ({ contentFields, onRemoveContentField }) => {
  if (!contentFields || contentFields.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <h6 className="text-xs font-medium">Mapped Fields:</h6>
      <div className="space-y-1">
        {contentFields.map((field, idx) => (
          <div key={idx} className="flex justify-between items-center py-1 px-2 bg-white rounded border text-sm">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-medium">{field.label}:</span>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                {field.apiField}
              </Badge>
              {field.mapping && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-600 ml-1">
                  Maps to: {field.mapping}
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveContentField(idx)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentFieldList;
