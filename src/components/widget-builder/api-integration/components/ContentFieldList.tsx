
import React, { useState } from "react";
import { ContentField } from "@/types/component-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentFieldListProps {
  contentFields: ContentField[];
  onRemoveContentField: (index: number) => void;
  onUpdateContentField?: (index: number, updatedField: ContentField) => void;
  availableApiFields?: string[];
  availableMappings?: string[];
}

const ContentFieldList: React.FC<ContentFieldListProps> = ({ 
  contentFields, 
  onRemoveContentField,
  onUpdateContentField,
  availableApiFields = [],
  availableMappings = []
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editField, setEditField] = useState<ContentField | null>(null);

  if (!contentFields || contentFields.length === 0) {
    return null;
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditField({...contentFields[index]});
  };

  const handleSave = (index: number) => {
    if (editField && onUpdateContentField) {
      onUpdateContentField(index, editField);
    }
    setEditingIndex(null);
    setEditField(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditField(null);
  };

  // Prevent event propagation to stop container from closing
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="mt-4 space-y-2">
      <h6 className="text-xs font-medium">Mapped Fields:</h6>
      <div className="space-y-1">
        {contentFields.map((field, idx) => (
          <div key={idx} className="flex justify-between items-center py-1 px-2 bg-white rounded border text-sm">
            {editingIndex === idx && editField ? (
              <div className="flex flex-col sm:flex-row w-full gap-2" onClick={handleClick}>
                <div className="flex-1">
                  <p className="text-xs mb-1">Field Label: <span className="font-medium">{field.label}</span></p>
                </div>
                <div className="flex-1">
                  <p className="text-xs mb-1">API Field:</p>
                  <Select
                    value={editField.apiField}
                    onValueChange={(val) => setEditField({...editField, apiField: val})}
                  >
                    <SelectTrigger className="h-8 text-xs" onClick={handleClick}>
                      <SelectValue placeholder="Select API field" />
                    </SelectTrigger>
                    <SelectContent onClick={handleClick}>
                      {availableApiFields.map((apiField) => (
                        <SelectItem key={apiField} value={apiField} className="text-xs">
                          {apiField}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <p className="text-xs mb-1">Mapping:</p>
                  <Select
                    value={editField.mapping || ""}
                    onValueChange={(val) => setEditField({...editField, mapping: val})}
                  >
                    <SelectTrigger className="h-8 text-xs" onClick={handleClick}>
                      <SelectValue placeholder="Select mapping" />
                    </SelectTrigger>
                    <SelectContent onClick={handleClick}>
                      {availableMappings.map((mapping) => (
                        <SelectItem key={mapping} value={mapping} className="text-xs">
                          {mapping}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-1 mb-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSave(idx)}
                    className="h-8 w-8 p-0 text-green-500 hover:text-green-700"
                  >
                    <Save size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancel}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-medium">{field.label}:</span>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                    {field.apiField}
                  </Badge>
                  {field.mapping && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-600 ml-1">
                      → {field.mapping}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {onUpdateContentField && (
                    <Button 
                      variant="ghost"
                      size="sm" 
                      onClick={() => handleEdit(idx)}
                      className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={14} />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveContentField(idx)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentFieldList;
