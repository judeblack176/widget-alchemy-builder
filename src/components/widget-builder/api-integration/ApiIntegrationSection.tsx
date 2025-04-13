
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Database } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ApiDetailsView from "./ApiDetailsView";

interface ApiIntegrationSectionProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRequestApiTemplate: () => void;
}

const ApiIntegrationSection: React.FC<ApiIntegrationSectionProps> = ({
  component,
  apis,
  onUpdateComponent,
  onRequestApiTemplate
}) => {
  const selectedApi = component.apiConfig ? apis.find(api => api.id === component.apiConfig?.apiId) : undefined;

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

  // Prevent event propagation to stop container from closing
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden" onClick={handleClick}>
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
      
      <div className="p-3" onClick={handleClick}>
        {component.apiConfig ? (
          <ApiDetailsView 
            component={component} 
            selectedApi={selectedApi} 
            onUpdateComponent={onUpdateComponent} 
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect this component to an API to get dynamic data.
            </p>
            
            {apis.length > 0 ? (
              <div className="space-y-4">
                <Select onValueChange={handleApiSelection}>
                  <SelectTrigger className="w-full" onClick={handleClick}>
                    <SelectValue placeholder="Select an API" />
                  </SelectTrigger>
                  <SelectContent onClick={handleClick}>
                    {apis.map((api) => (
                      <SelectItem key={api.id} value={api.id} onClick={handleClick}>
                        {api.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-center space-y-2 py-4">
                <p className="text-sm text-gray-500">No APIs available</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestApiTemplate();
                  }}
                >
                  Create API Template
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiIntegrationSection;
