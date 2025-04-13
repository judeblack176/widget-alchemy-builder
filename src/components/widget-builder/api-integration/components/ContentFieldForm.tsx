
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentFieldFormProps {
  availableApiFields: string[];
  availableMappings: string[];
  onAddContentField: (label: string, apiField: string, mapping: string) => void;
}

const ContentFieldForm: React.FC<ContentFieldFormProps> = ({ 
  availableApiFields, 
  availableMappings, 
  onAddContentField 
}) => {
  const [newFieldLabel, setNewFieldLabel] = useState<string>("");
  const [newFieldApiField, setNewFieldApiField] = useState<string>("");
  const [newFieldMapping, setNewFieldMapping] = useState<string>("");

  const handleAddField = () => {
    if (!newFieldLabel.trim() || !newFieldApiField.trim()) return;
    
    onAddContentField(
      newFieldLabel,
      newFieldApiField,
      newFieldMapping || newFieldLabel.toLowerCase()
    );
    
    // Reset form
    setNewFieldLabel("");
    setNewFieldApiField("");
    setNewFieldMapping("");
  };

  // Prevent event propagation to stop container from closing
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleClick}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <Label htmlFor="field-label" className="text-xs">Field Label</Label>
          <Input 
            id="field-label" 
            value={newFieldLabel} 
            onChange={(e) => setNewFieldLabel(e.target.value)}
            placeholder="Enter field label"
            className="h-8 text-sm"
            onClick={handleClick}
          />
        </div>
        
        <div>
          <Label htmlFor="api-field" className="text-xs">API Field</Label>
          <Select value={newFieldApiField} onValueChange={setNewFieldApiField}>
            <SelectTrigger id="api-field" className="h-8 text-sm" onClick={handleClick}>
              <SelectValue placeholder="Select API field" />
            </SelectTrigger>
            <SelectContent onClick={handleClick}>
              {availableApiFields.map((field) => (
                <SelectItem key={field} value={field} onClick={handleClick}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="field-mapping" className="text-xs">Mapping</Label>
          <Select value={newFieldMapping} onValueChange={setNewFieldMapping}>
            <SelectTrigger id="field-mapping" className="h-8 text-sm" onClick={handleClick}>
              <SelectValue placeholder="Select mapping" />
            </SelectTrigger>
            <SelectContent onClick={handleClick}>
              {availableMappings.map((field) => (
                <SelectItem key={field} value={field} onClick={handleClick}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleAddField();
          }}
          disabled={!newFieldLabel || !newFieldApiField}
          className="h-8 px-3"
        >
          <Plus size={14} className="mr-1" /> Add Field
        </Button>
      </div>
    </div>
  );
};

export default ContentFieldForm;
