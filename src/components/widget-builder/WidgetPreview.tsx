
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { renderComponent } from './component-renderers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const MAX_COMPONENTS = 6;
  const displayComponents = components.slice(0, MAX_COMPONENTS);
  const hasExcessComponents = components.length > MAX_COMPONENTS;

  useEffect(() => {
    const fetchData = async () => {
      const apiDataResults: Record<string, any> = {};

      for (const api of apis) {
        try {
          const response = await fetch(api.endpoint, {
            method: api.method,
            headers: api.headers,
          });

          if (!response.ok) {
            console.error(`Failed to fetch API ${api.name}: ${response.status}`);
            continue;
          }

          const data = await response.json();
          apiDataResults[api.id] = data;
        } catch (error) {
          console.error(`Error fetching API ${api.name}:`, error);
        }
      }

      setApiData(apiDataResults);
    };

    if (apis.length > 0) {
      fetchData();
    }
  }, [apis]);
  
  // Get tooltip content based on tooltipId
  const getTooltipContent = (tooltipId: string) => {
    switch (tooltipId) {
      case "help":
        return "Help information about this feature";
      case "info":
        return "Additional information about this component";
      case "warning":
        return "Warning: Please review this information carefully";
      case "tip":
        return "Pro Tip: This feature can help you save time";
      default:
        return "Information";
    }
  };

  return (
    <Card 
      className="bg-white shadow-md rounded-lg overflow-hidden border-2 border-widget-blue"
      style={{ 
        width: '316px', 
        height: '384px',
        maxWidth: '316px',
        maxHeight: '384px'
      }}
    >
      <div className="p-4 space-y-4 overflow-y-auto" style={{ height: '100%' }}>
        <TooltipProvider>
          {displayComponents.map((component) => (
            <div key={component.id} className="widget-component relative">
              {component.tooltipId && component.tooltipId !== "" ? (
                <div className="relative">
                  <div className="absolute right-0 top-0 z-10">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          <HelpCircle size={16} className="text-gray-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getTooltipContent(component.tooltipId)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {renderComponent(component, component.apiConfig ? apiData[component.apiConfig.apiId] : undefined)}
                </div>
              ) : (
                renderComponent(component, component.apiConfig ? apiData[component.apiConfig.apiId] : undefined)
              )}
            </div>
          ))}
          
          {hasExcessComponents && (
            <Alert variant="destructive" className="mt-2 py-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Only showing {MAX_COMPONENTS} of {components.length} components. 
                Widgets are limited to {MAX_COMPONENTS} components.
              </AlertDescription>
            </Alert>
          )}
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default WidgetPreview;
