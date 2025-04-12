
import React from 'react';
import { ApiConfig } from '@/types/widget-types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface ApiFieldMappingProps {
  apis: ApiConfig[];
  selectedApiId?: string;
  apiFieldMappings: Array<{
    id: string;
    field: string;
    targetProperty: string;
  }>;
  onAddMapping: () => void;
  onUpdateMapping: (id: string, field: string, value: string) => void;
  onRemoveMapping: (id: string) => void;
  componentProperties: string[];
}

const ApiFieldMapping: React.FC<ApiFieldMappingProps> = ({
  apis,
  selectedApiId,
  apiFieldMappings,
  onAddMapping,
  onUpdateMapping,
  onRemoveMapping,
  componentProperties,
}) => {
  const selectedApi = apis.find(api => api.id === selectedApiId);
  const availableFields = selectedApi?.possibleFields || [];

  return (
    <div className="space-y-4 border rounded-md p-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">API Field Mappings</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddMapping}
          disabled={!selectedApiId || availableFields.length === 0}
        >
          Add Field Mapping
        </Button>
      </div>

      {apiFieldMappings.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-2">
          {!selectedApiId 
            ? "Select an API in the API configuration section to add field mappings" 
            : availableFields.length === 0 
              ? "No fields available in the selected API" 
              : "No mappings added yet. Click 'Add Field Mapping' to create one"}
        </div>
      )}

      {apiFieldMappings.map((mapping) => (
        <div key={mapping.id} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-end">
          <div className="space-y-1">
            <Label htmlFor={`field-${mapping.id}`} className="text-xs">API Field</Label>
            <Select
              value={mapping.field || ""}
              onValueChange={(value) => onUpdateMapping(mapping.id, 'field', value)}
            >
              <SelectTrigger id={`field-${mapping.id}`} className="h-8">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((field) => (
                  <SelectItem key={field} value={field || "dummy-value"}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`property-${mapping.id}`} className="text-xs">Component Property</Label>
            <Select
              value={mapping.targetProperty || ""}
              onValueChange={(value) => onUpdateMapping(mapping.id, 'targetProperty', value)}
            >
              <SelectTrigger id={`property-${mapping.id}`} className="h-8">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {componentProperties.map((prop) => (
                  <SelectItem key={prop} value={prop || "dummy-value"}>
                    {prop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => onRemoveMapping(mapping.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ApiFieldMapping;
