
import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig } from '@/types';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PreviewHeader from './preview/PreviewHeader';
import PreviewContent from './preview/PreviewContent';
import { getDisplayComponents, fetchApiData } from './preview/previewUtils';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Get components to display
  const {
    headerComponent,
    displayComponents,
    nonHeaderNonAlertComponents,
    hasExcessComponents,
    MAX_COMPONENTS
  } = getDisplayComponents(components);

  useEffect(() => {
    if (nonHeaderNonAlertComponents.length > MAX_COMPONENTS && !hasExcessComponents) {
      toast({
        title: "Maximum Components Exceeded",
        description: `Widgets can only have ${MAX_COMPONENTS} components (excluding header and alerts). Additional components won't be displayed.`,
        variant: "destructive",
      });
    }
    
    // Fetch API data
    if (apis.length > 0) {
      fetchApiData(apis).then(data => setApiData(data));
    }
  }, [apis, nonHeaderNonAlertComponents.length, toast, hasExcessComponents, MAX_COMPONENTS]);

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
      <PreviewHeader headerComponent={headerComponent} />
      
      <PreviewContent
        displayComponents={displayComponents}
        headerComponent={headerComponent}
        hasExcessComponents={hasExcessComponents}
        nonHeaderNonAlertComponents={nonHeaderNonAlertComponents}
        MAX_COMPONENTS={MAX_COMPONENTS}
        apiData={apiData}
        dismissedAlerts={dismissedAlerts}
        handleAlertDismiss={handleAlertDismiss}
      />
    </Card>
  );
};

export default WidgetPreview;
