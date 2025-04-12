
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { ApiFieldMapping } from '@/types/widget-types';

interface ApiFieldMappingProps {
  availableFields?: string[];
  onAddField: (field: ApiFieldMapping) => void;
  onRemoveField: (index: number) => void;
  fields: ApiFieldMapping[];
}

const ApiFieldMappingEditor: React.FC<ApiFieldMappingProps> = ({
  availableFields = [],
  onAddField,
  onRemoveField,
  fields,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [newApiField, setNewApiField] = useState('');

  const handleAddField = () => {
    if (newLabel.trim() && newApiField) {
      onAddField({
        label: newLabel.trim(),
        apiField: newApiField,
      });
      setNewLabel('');
      setNewApiField('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="font-medium text-sm">Content Field Mappings</div>
      
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <div className="flex-1">
              <span className="text-sm font-medium">{field.label}</span>
              <span className="text-xs text-muted-foreground ml-2">→</span>
              <span className="text-xs text-muted-foreground ml-2">{field.apiField}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRemoveField(index)}
            >
              <X size={14} />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="labelField" className="text-xs">Label</Label>
          <Input
            id="labelField"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Field label"
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="apiField" className="text-xs">API Field</Label>
          {availableFields.length > 0 ? (
            <Select value={newApiField} onValueChange={setNewApiField}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="apiField"
              value={newApiField}
              onChange={(e) => setNewApiField(e.target.value)}
              placeholder="API field"
              className="h-8"
            />
          )}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddField}
        disabled={!newLabel.trim() || !newApiField}
      >
        <Plus size={14} className="mr-1" /> Add Field Mapping
      </Button>
    </div>
  );
};

export default ApiFieldMappingEditor;
