
import React, { useState } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useApiDataFetcher } from './widget-preview/ApiDataFetcher';
import WidgetPreviewHeader from './widget-preview/WidgetPreviewHeader';
import WidgetComponentList from './widget-preview/WidgetComponentList';
import { Tooltip } from './TooltipManager';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  tooltips?: Tooltip[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ 
  components, 
  apis,
  tooltips = []
}) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const apiData = useApiDataFetcher(apis);
  const { toast } = useToast();
  
  // Get only the first header component to prevent duplicates
  const headerComponent = components.find(c => c.type === 'header');
  
  const alertComponents = components.filter(c => c.type === 'alert' && !dismissedAlerts.includes(c.id));
  const hasAlertComponent = alertComponents.length > 0;
  const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
  
  // Get all non-header and non-alert components
  const nonHeaderNonAlertComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');
  
  const displayableAlerts = components.filter(c => c.type === 'alert' && !dismissedAlerts.includes(c.id));
  
  const regularComponentsToDisplay = nonHeaderNonAlertComponents.slice(0, MAX_COMPONENTS);
  
  // Create display components WITHOUT the header (since it's handled separately)
  const displayComponents = [
    ...displayableAlerts,
    ...regularComponentsToDisplay
  ];
  
  const hasExcessComponents = nonHeaderNonAlertComponents.length > MAX_COMPONENTS;

  const processComponentData = (component: WidgetComponent) => {
    if (!component.apiConfig) return undefined;
    
    const apiId = component.apiConfig.apiId;
    const apiResult = apiData[apiId];
    
    if (!apiResult || !apiResult) {
      console.log(`No API data found for component ${component.id}, API ID: ${apiId}`);
      return undefined;
    }
    
    if (!component.apiConfig.multiMapping) {
      console.log(`Returning API data for component ${component.id}:`, apiResult);
      return apiResult;
    }
    
    const processedData = { ...apiResult };
    
    Object.entries(component.apiConfig.multiMapping).forEach(([propKey, fields]) => {
      if (fields && fields.length > 0) {
        const fieldValues = fields.map(field => {
          return apiResult[field];
        }).filter(val => val !== undefined);
        
        if (fieldValues.length > 0) {
          processedData[`multi_${propKey}`] = fieldValues;
        }
      }
    });
    
    console.log(`Processed API data for component ${component.id}:`, processedData);
    return processedData;
  };

  React.useEffect(() => {
    if (nonHeaderNonAlertComponents.length > MAX_COMPONENTS && !hasExcessComponents) {
      toast({
        title: "Maximum Components Exceeded",
        description: `Widgets can only have ${MAX_COMPONENTS} components (excluding header and alerts). Additional components won't be displayed.`,
        variant: "destructive",
      });
    }
  }, [nonHeaderNonAlertComponents.length, toast, hasExcessComponents, MAX_COMPONENTS]);

  const handleAlertDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  return (
    <Card 
      className="bg-white shadow-md rounded-lg overflow-hidden relative mx-auto"
      style={{ 
        width: '316px', 
        height: '384px',
        maxWidth: '316px',
        maxHeight: '384px'
      }}
    >
      <WidgetPreviewHeader
        headerComponent={headerComponent}
        componentDataProvider={processComponentData}
        tooltips={tooltips}
      />
      
      <ScrollArea className="h-full w-full">
        <WidgetComponentList
          displayComponents={displayComponents}
          headerComponent={headerComponent}
          componentDataProvider={processComponentData}
          hasExcessComponents={hasExcessComponents}
          maxComponents={MAX_COMPONENTS}
          nonHeaderNonAlertComponentsLength={nonHeaderNonAlertComponents.length}
          onAlertDismiss={handleAlertDismiss}
          tooltips={tooltips}
        />
      </ScrollArea>
    </Card>
  );
};

export default WidgetPreview;
