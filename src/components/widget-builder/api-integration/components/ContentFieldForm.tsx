
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <Label htmlFor="field-label" className="text-xs">Field Label</Label>
          <Input 
            id="field-label" 
            value={newFieldLabel} 
            onChange={(e) => setNewFieldLabel(e.target.value)}
            placeholder="Enter field label"
            className="h-8 text-sm"
          />
        </div>
        
        <div>
          <Label htmlFor="api-field" className="text-xs">API Field</Label>
          <Select value={newFieldApiField} onValueChange={setNewFieldApiField}>
            <SelectTrigger id="api-field" className="h-8 text-sm">
              <SelectValue placeholder="Select API field" />
            </SelectTrigger>
            <SelectContent>
              {availableApiFields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="field-mapping" className="text-xs">Mapping</Label>
          <Select value={newFieldMapping} onValueChange={setNewFieldMapping}>
            <SelectTrigger id="field-mapping" className="h-8 text-sm">
              <SelectValue placeholder="Select mapping" />
            </SelectTrigger>
            <SelectContent>
              {availableMappings.map((field) => (
                <SelectItem key={field} value={field}>
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
          onClick={handleAddField}
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
