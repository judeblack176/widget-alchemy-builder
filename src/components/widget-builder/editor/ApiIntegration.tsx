
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Database, X, Plus, Trash2 } from 'lucide-react';

interface ApiIntegrationProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRequestApiTemplate: () => void;
}

const ApiIntegration: React.FC<ApiIntegrationProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRequestApiTemplate
}) => {
  const [newFieldLabel, setNewFieldLabel] = useState<string>("");
  const [newFieldApiField, setNewFieldApiField] = useState<string>("");

  const handleApiSelection = (apiId: string) => {
    const updatedComponent = {
      ...component,
      apiConfig: {
        apiId,
        dataMapping: component.apiConfig?.dataMapping || {},
        multiMapping: component.apiConfig?.multiMapping || {}
      }
    };
    onUpdateComponent(updatedComponent);
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

    const updatedComponent = {
      ...component,
      contentFields: newContentFields
    };

    onUpdateComponent(updatedComponent);

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

  const selectedApi = component.apiConfig ? apis.find(api => api.id === component.apiConfig?.apiId) : undefined;

  const getAvailableApiFields = () => {
    if (!selectedApi) return [];
    
    if (selectedApi.possibleFields && selectedApi.possibleFields.length > 0) {
      return selectedApi.possibleFields;
    }
    
    if (selectedApi.sampleResponse) {
      try {
        const sampleData = JSON.parse(selectedApi.sampleResponse);
        return Object.keys(sampleData);
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  const renderApiDetails = () => {
    if (!selectedApi) return null;
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

        <div className="mt-3 border-t pt-3">
          <h5 className="text-sm font-medium mb-2">Add Content Fields</h5>
          <div className="flex items-end gap-2 mb-3">
            <div className="flex-1">
              <Label htmlFor="field-label" className="text-xs">Field Label</Label>
              <Input 
                id="field-label" 
                size="sm"
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

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Database size={16} className="mr-2 text-blue-500" />
          <span className="font-medium">API Integration</span>
          {component.apiConfig && (
            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-600 border-green-200">
              Connected
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-3">
        {component.apiConfig ? (
          renderApiDetails()
        ) : (
          <div>
            <div className="mb-4">
              <Label htmlFor="api-select" className="text-sm">Select API</Label>
              <Select onValueChange={handleApiSelection}>
                <SelectTrigger id="api-select">
                  <SelectValue placeholder="Choose an API to connect" />
                </SelectTrigger>
                <SelectContent>
                  {apis.map((api) => (
                    <SelectItem key={api.id} value={api.id}>
                      {api.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">No API connected</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRequestApiTemplate}
                className="text-xs"
              >
                <Plus size={14} className="mr-1" /> Create API Template
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiIntegration;
