
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { renderComponent } from './component-renderers';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const [tooltips, setTooltips] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load tooltips
    try {
      const savedTooltips = localStorage.getItem('savedTooltips');
      if (savedTooltips) {
        const tooltipArray = JSON.parse(savedTooltips);
        const tooltipMap: Record<string, any> = {};
        tooltipArray.forEach((tooltip: any) => {
          tooltipMap[tooltip.id] = tooltip;
        });
        setTooltips(tooltipMap);
      }
    } catch (error) {
      console.error("Failed to load tooltips", error);
    }
  }, []);

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
  
  const renderComponentWithTooltip = (component: WidgetComponent) => {
    const tooltipId = component.tooltipId;
    const tooltipData = tooltipId ? tooltips[tooltipId] : null;
    
    if (tooltipData) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              {renderComponent(component, component.apiConfig ? apiData[component.apiConfig.apiId] : undefined)}
              <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              <div className="font-medium">{tooltipData.title}</div>
              <div className="text-sm text-gray-500">{tooltipData.content}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    
    return renderComponent(component, component.apiConfig ? apiData[component.apiConfig.apiId] : undefined);
  };
  
  return (
    <Card className="w-full max-w-[400px] bg-white shadow-md rounded-lg overflow-hidden">
      <TooltipProvider>
        <div className="p-4 space-y-4">
          {components.map((component) => (
            <div key={component.id} className="widget-component">
              {renderComponentWithTooltip(component)}
            </div>
          ))}
        </div>
      </TooltipProvider>
    </Card>
  );
};

export default WidgetPreview;
