
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApiDetailsViewProps {
  component: WidgetComponent;
  selectedApi?: ApiConfig;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const ApiDetailsView: React.FC<ApiDetailsViewProps> = ({
  component,
  selectedApi,
  onUpdateComponent
}) => {
  const [newFieldLabel, setNewFieldLabel] = useState<string>("");
  const [newFieldApiField, setNewFieldApiField] = useState<string>("");

  if (!selectedApi) return null;

  const getAvailableApiFields = () => {
    if (!selectedApi) return [];
    
    // Use possibleFields if available, otherwise extract from sampleResponse
    if (selectedApi.possibleFields && selectedApi.possibleFields.length > 0) {
      return selectedApi.possibleFields;
    }
    
    // Try to parse sampleResponse if available
    if (selectedApi.sampleResponse) {
      try {
        const sampleData = JSON.parse(selectedApi.sampleResponse);
        // Get all top-level keys
        return Object.keys(sampleData);
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  const handleDataMappingChange = (propKey: string, apiField: string) => {
    const updatedComponent = {
      ...component,
      apiConfig: {
        ...component.apiConfig!,
        dataMapping: {
          ...component.apiConfig?.dataMapping,
          [propKey]: apiField
        }
      }
    };
    onUpdateComponent(updatedComponent);
  };

  const handleMultiMappingChange = (propKey: string, apiField: string, isChecked: boolean) => {
    const currentFields = component.apiConfig?.multiMapping?.[propKey] || [];
    
    let updatedFields;
    if (isChecked) {
      updatedFields = [...currentFields, apiField];
    } else {
      updatedFields = currentFields.filter(field => field !== apiField);
    }
    
    const updatedComponent = {
      ...component,
      apiConfig: {
        ...component.apiConfig!,
        multiMapping: {
          ...component.apiConfig?.multiMapping,
          [propKey]: updatedFields
        }
      }
    };
    onUpdateComponent(updatedComponent);
  };

  const isFieldSelected = (propKey: string, apiField: string) => {
    return component.apiConfig?.multiMapping?.[propKey]?.includes(apiField) || false;
  };

  const addContentField = () => {
    if (!newFieldLabel.trim() || !newFieldApiField.trim()) return;

    const newContentFields = [
      ...(component.contentFields || []),
      {
        label: newFieldLabel,
        apiField: newFieldApiField
      }
    ];

    // Update the component with the new content field
    const updatedComponent = {
      ...component,
      contentFields: newContentFields
    };

    onUpdateComponent(updatedComponent);

    // Reset the inputs
    setNewFieldLabel("");
    setNewFieldApiField("");
  };

  const removeContentField = (index: number) => {
    const currentFields = [...(component.contentFields || [])];
    currentFields.splice(index, 1);

    const updatedComponent = {
      ...component,
      contentFields: currentFields
    };

    onUpdateComponent(updatedComponent);
  };

  const availableApiFields = getAvailableApiFields();

  return (
    <div className="space-y-4 mt-4 border rounded-md p-3 bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Connected to: {selectedApi.name}</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            const updatedComponent = { ...component };
            delete updatedComponent.apiConfig;
            onUpdateComponent(updatedComponent);
          }}
          className="h-6 text-red-500 hover:text-red-700"
        >
          <X size={14} className="mr-1" /> Disconnect
        </Button>
      </div>

      {/* Display API details */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium w-20">Endpoint:</span>
          <span className="text-xs overflow-hidden overflow-ellipsis">{selectedApi.endpoint}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium w-20">Method:</span>
          <Badge variant="outline" className="text-xs font-mono">
            {selectedApi.method}
          </Badge>
        </div>
      </div>

      {/* Parameters */}
      {selectedApi.parameters && Object.keys(selectedApi.parameters).length > 0 && (
        <div className="mt-1">
          <Accordion type="single" collapsible>
            <AccordionItem value="parameters">
              <AccordionTrigger className="text-xs font-medium py-1">
                Parameters
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 text-xs">
                  {Object.entries(selectedApi.parameters).map(([key, value], idx) => (
                    <div key={`param-${idx}`} className="flex items-center gap-2">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Content Field Mapping */}
      <div className="mt-3 border-t pt-3">
        <h5 className="text-sm font-medium mb-2">Add Content Fields</h5>
        <div className="flex items-end gap-2 mb-3">
          <div className="flex-1">
            <Label htmlFor="field-label" className="text-xs">Field Label</Label>
            <Input 
              id="field-label" 
              value={newFieldLabel} 
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Enter field label"
              className="h-8 text-sm"
            />
          </div>
          <div className="flex-1">
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addContentField}
            disabled={!newFieldLabel || !newFieldApiField}
            className="h-8 px-2"
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* List of mapped content fields */}
        {component.contentFields && component.contentFields.length > 0 && (
          <div className="mt-2 space-y-2">
            <h6 className="text-xs font-medium">Mapped Fields:</h6>
            <div className="space-y-1">
              {component.contentFields.map((field, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 px-2 bg-white rounded border text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{field.label}:</span>
                    <Badge variant="outline" className="text-xs">
                      {field.apiField}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeContentField(idx)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDetailsView;
