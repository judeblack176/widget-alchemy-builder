
import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Database, ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApiDetailsView from "./ApiDetailsView";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [showDetails, setShowDetails] = useState(false);
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
        
        {component.apiConfig && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        )}
      </div>
      
      <div className="p-3" onClick={handleClick}>
        {component.apiConfig ? (
          <>
            {showDetails ? (
              <ScrollArea className="max-h-[400px]">
                <ApiDetailsView 
                  component={component} 
                  selectedApi={selectedApi} 
                  onUpdateComponent={onUpdateComponent} 
                />
              </ScrollArea>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Connected to:</span>
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    {selectedApi?.name || "Unknown API"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    className="text-xs"
                  >
                    View Details
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const updatedComponent = { ...component };
                      delete updatedComponent.apiConfig;
                      onUpdateComponent(updatedComponent);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <X size={12} className="mr-1" />
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </>
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
                        <div className="flex items-center">
                          <span>{api.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`
                              ml-2 text-xs
                              ${api.method === 'GET' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                              ${api.method === 'POST' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}
                              ${api.method === 'PUT' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : ''}
                              ${api.method === 'DELETE' ? 'border-red-500 bg-red-50 text-red-700' : ''}
                            `}
                          >
                            {api.method}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="text-xs text-gray-500">
                  Select an API to connect to this component and map data fields.
                </div>
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
