
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types/widget-types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import HeaderPreview from './preview/HeaderPreview';
import ContentPreview from './preview/ContentPreview';
import ComponentLimitAlert from './preview/ComponentLimitAlert';
import { useApiDataProcessor } from './preview/useApiDataProcessor';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const { toast } = useToast();
  const { processComponentData } = useApiDataProcessor(components, apis);
  
  // Find components of different types
  const alertComponents = components.filter(c => c.type === 'alert' && !dismissedAlerts.includes(c.id));
  const hasAlertComponent = alertComponents.length > 0;
  const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
  
  const headerComponent = components.find(c => c.type === 'header');
  const nonHeaderNonAlertComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');
  const regularComponentsToDisplay = nonHeaderNonAlertComponents.slice(0, MAX_COMPONENTS);
  
  // Determine which components to display
  const displayComponents = components.filter(component => {
    if (component.type === 'header') {
      return false;
    }
    
    if (component.type === 'alert') {
      return !dismissedAlerts.includes(component.id);
    }
    
    return regularComponentsToDisplay.includes(component);
  });
  
  const hasExcessComponents = nonHeaderNonAlertComponents.length > MAX_COMPONENTS;

  // Show warning toast when exceeding maximum components
  useEffect(() => {
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
      <HeaderPreview headerComponent={headerComponent} />
      
      <ScrollArea className="h-full w-full">
        <div className={headerComponent ? "pt-2" : ""}>
          {displayComponents.map((component, index) => (
            <ContentPreview
              key={component.id}
              component={component}
              index={index}
              componentData={processComponentData(component)}
              onAlertDismiss={handleAlertDismiss}
            />
          ))}
          
          <ComponentLimitAlert 
            hasExcessComponents={hasExcessComponents}
            nonHeaderNonAlertComponentsLength={nonHeaderNonAlertComponents.length}
            maxComponents={MAX_COMPONENTS}
          />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default WidgetPreview;
