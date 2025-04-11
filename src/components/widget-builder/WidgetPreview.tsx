
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { renderComponent } from './component-renderers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});

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
    <Card className="w-full max-w-[400px] bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        <TooltipProvider>
          {components.map((component) => (
            <div key={component.id} className="widget-component relative">
              {component.tooltipId ? (
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
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default WidgetPreview;
