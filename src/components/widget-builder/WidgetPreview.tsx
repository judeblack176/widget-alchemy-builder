import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { renderComponent } from './component-renderers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Get maximum component count based on alert presence
  const alertComponents = components.filter(c => c.type === 'alert' && !dismissedAlerts.includes(c.id));
  const MAX_COMPONENTS = alertComponents.length > 0 ? 7 : 6;
  
  // Extract header component and non-header components
  const headerComponent = components.find(c => c.type === 'header');
  
  // Filter out header from regular components so it doesn't count against the limit
  const nonHeaderComponents = components.filter(c => c.type !== 'header');
  
  // Display all non-header components up to the limit
  const displayComponents = nonHeaderComponents.slice(0, MAX_COMPONENTS);
  
  // Check if we have more components than allowed (excluding header)
  const hasExcessComponents = nonHeaderComponents.length > MAX_COMPONENTS;

  useEffect(() => {
    // Show error toast when component limit is exceeded
    if (nonHeaderComponents.length > MAX_COMPONENTS && !hasExcessComponents) {
      toast({
        title: "Maximum Components Exceeded",
        description: `Widgets can only have ${MAX_COMPONENTS} components (excluding header). Additional components won't be displayed.`,
        variant: "destructive",
      });
    }
    
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
  }, [apis, nonHeaderComponents.length, toast, hasExcessComponents]);
  
  const getTooltipContent = (tooltipId: string) => {
    switch (tooltipId) {
      case "help":
        return (
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-blue-500 mt-0.5" />
            <span>Help information about this feature</span>
          </div>
        );
      case "info":
        return (
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-green-500 mt-0.5" />
            <span>Additional information about this component</span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-500 mt-0.5" />
            <span>Warning: Please review this information carefully</span>
          </div>
        );
      case "tip":
        return (
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-purple-500 mt-0.5" />
            <span>Pro Tip: This feature can help you save time</span>
          </div>
        );
      default:
        return "Information";
    }
  };

  const handleAlertDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const renderComponentWithTooltip = (component: WidgetComponent, index: number) => {
    // Skip rendering dismissed alerts
    if (component.type === 'alert' && dismissedAlerts.includes(component.id)) {
      return null;
    }
    
    const componentContent = renderComponent(component, component.apiConfig ? apiData[component.apiConfig.apiId] : undefined, component.type === 'alert' ? handleAlertDismiss : undefined);
    
    // If component has a tooltip, render it with hover card
    if (component.tooltipId && component.tooltipId !== "") {
      return (
        <div 
          key={component.id} 
          className={`widget-component relative ${component.type !== 'header' ? 'px-4 pt-4 border-t border-gray-200' : ''} ${index !== 0 && component.type === 'header' ? 'mt-4' : ''}`}
          style={{
            borderTop: component.type !== 'header' && index !== 0 ? '1px solid #E5E7EB' : 'none',
          }}
        >
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="relative cursor-help">
                {componentContent}
                <div className="absolute right-0 top-0 z-10">
                  <HelpCircle size={16} className="text-gray-500" />
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-3">
              {getTooltipContent(component.tooltipId)}
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    }
    
    // Otherwise render the component normally
    return (
      <div 
        key={component.id} 
        className={`widget-component relative ${component.type !== 'header' ? 'px-4 pt-4 border-t border-gray-200' : ''} ${index !== 0 && component.type === 'header' ? 'mt-4' : ''}`}
        style={{
          borderTop: component.type !== 'header' && index !== 0 ? '1px solid #E5E7EB' : 'none',
        }}
      >
        {componentContent}
      </div>
    );
  };

  return (
    <Card 
      className="bg-white shadow-md rounded-lg overflow-hidden relative"
      style={{ 
        width: '316px', 
        height: '384px',
        maxWidth: '316px',
        maxHeight: '384px'
      }}
    >
      {/* Render header component fixed at the top */}
      {headerComponent && (
        <TooltipProvider>
          <div className="sticky top-0 z-20">
            {renderComponentWithTooltip(headerComponent, 0)}
          </div>
        </TooltipProvider>
      )}
      
      <ScrollArea className="h-full overflow-x-hidden">
        <TooltipProvider>
          {/* Apply padding top if header exists to prevent content from being hidden */}
          <div className={headerComponent ? "pt-2" : ""}>
            {displayComponents.map((component, index) => 
              renderComponentWithTooltip(component, index + (headerComponent ? 1 : 0))
            )}
            
            {hasExcessComponents && (
              <Alert variant="destructive" className="mt-2 mx-4 mb-4 py-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Only showing {MAX_COMPONENTS} of {nonHeaderComponents.length} components. 
                  Widgets are limited to {MAX_COMPONENTS} components (excluding header).
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TooltipProvider>
      </ScrollArea>
    </Card>
  );
};

export default WidgetPreview;
