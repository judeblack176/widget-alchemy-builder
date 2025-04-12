import React, { useState, useEffect } from 'react';
import { WidgetComponent, ApiConfig, ContentDetails } from '@/types/widget-types.d';
import { Card } from '@/components/ui/card';
import { renderComponent } from './component-renderers';
import { HelpCircle, AlertCircle, Check, Ruler, Palette } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface WidgetPreviewProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ components, apis }) => {
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<WidgetComponent[]>([]);
  const [contentDetails, setContentDetails] = useState<ContentDetails>({
    size: 'medium',
    color: '#3B82F6',
  });
  const { toast } = useToast();
  
  const alertComponents = components.filter(c => c.type === 'alert' && !dismissedAlerts.includes(c.id));
  const hasAlertComponent = alertComponents.length > 0;
  const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
  
  const headerComponent = components.find(c => c.type === 'header');
  
  const nonHeaderNonAlertComponents = components.filter(c => c.type !== 'header' && c.type !== 'alert');
  
  const displayableAlerts = components.filter(c => c.type === 'alert' && !dismissedAlerts.includes(c.id));
  
  const regularComponentsToDisplay = nonHeaderNonAlertComponents.slice(0, MAX_COMPONENTS);
  
  const displayComponents = components.filter(component => {
    if (component.type === 'alert') {
      return !dismissedAlerts.includes(component.id);
    }
    
    if (component.type === 'header') {
      return false;
    }
    
    return regularComponentsToDisplay.includes(component);
  });
  
  const hasExcessComponents = nonHeaderNonAlertComponents.length > MAX_COMPONENTS;

  const processComponentData = (component: WidgetComponent) => {
    if (!component.apiConfig) return undefined;
    
    const apiId = component.apiConfig.apiId;
    const apiResult = apiData[apiId];
    
    if (!apiResult || !component.apiConfig.multiMapping) {
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
    
    return processedData;
  };

  const handleComponentSelect = (component: WidgetComponent) => {
    const isSelected = selectedComponents.some(c => c.id === component.id);
    
    if (isSelected) {
      setSelectedComponents(selectedComponents.filter(c => c.id !== component.id));
    } else {
      setSelectedComponents([...selectedComponents, component]);
    }
  };

  const handleSizeChange = (value: string) => {
    setContentDetails(prev => ({ ...prev, size: value }));
    
    // Apply size to selected components
    applyDetailsToSelectedComponents({ size: value });
  };

  const handleColorChange = (value: string) => {
    setContentDetails(prev => ({ ...prev, color: value }));
    
    // Apply color to selected components
    applyDetailsToSelectedComponents({ color: value });
  };

  const applyDetailsToSelectedComponents = (details: Partial<ContentDetails>) => {
    // This function would implement the actual application of size/color
    // to the selected components. It's a placeholder for now.
    console.log('Applying details to selected components:', details);
    console.log('Selected components:', selectedComponents);
    
    toast({
      title: "Details Applied",
      description: `Applied ${Object.keys(details).join(', ')} to ${selectedComponents.length} selected components.`,
    });
  };

  useEffect(() => {
    if (nonHeaderNonAlertComponents.length > MAX_COMPONENTS && !hasExcessComponents) {
      toast({
        title: "Maximum Components Exceeded",
        description: `Widgets can only have ${MAX_COMPONENTS} components (excluding header and alerts). Additional components won't be displayed.`,
        variant: "destructive",
      });
    }
    
    const fetchData = async () => {
      const apiDataResults: Record<string, any> = {};

      for (const api of apis) {
        try {
          if (!api.endpoint) {
            console.log(`No endpoint defined for API ${api.name}`);
            continue;
          }
          
          if (api.sampleResponse) {
            try {
              apiDataResults[api.id] = JSON.parse(api.sampleResponse);
              continue;
            } catch (error) {
              console.error(`Failed to parse sample response for API ${api.name}:`, error);
            }
          }
          
          const response = await fetch(api.endpoint, {
            method: api.method,
            headers: api.headers || {},
          });

          if (!response.ok) {
            console.error(`Failed to fetch API ${api.name}: ${response.status}`);
            apiDataResults[api.id] = {};
            continue;
          }

          const data = await response.json();
          apiDataResults[api.id] = data;
        } catch (error) {
          console.error(`Error fetching API ${api.name}:`, error);
          apiDataResults[api.id] = {};
        }
      }

      setApiData(apiDataResults);
    };

    if (apis.length > 0) {
      fetchData();
    }
  }, [apis, nonHeaderNonAlertComponents.length, toast, hasExcessComponents]);
  
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
    if (component.type === 'alert' && dismissedAlerts.includes(component.id)) {
      return null;
    }
    
    const componentData = processComponentData(component);
    
    const isSelected = selectedComponents.some(c => c.id === component.id);
    
    const componentContent = (
      <div className="relative">
        {renderComponent(
          component, 
          componentData, 
          component.type === 'alert' ? handleAlertDismiss : undefined
        )}
        <div className="absolute top-2 left-2 z-20">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => handleComponentSelect(component)}
            className="bg-white border-gray-300"
          />
        </div>
      </div>
    );
    
    if (component.tooltipId && component.tooltipId !== "") {
      return (
        <div 
          key={component.id} 
          className={`widget-component relative ${component.type !== 'header' ? 'px-4 pt-4 border-t border-gray-200' : ''} ${index !== 0 && component.type === 'header' ? 'mt-4' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
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
    
    return (
      <div 
        key={component.id} 
        className={`widget-component relative ${component.type !== 'header' ? 'px-4 pt-4 border-t border-gray-200' : ''} ${index !== 0 && component.type === 'header' ? 'mt-4' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
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
      className="bg-white shadow-md rounded-lg overflow-hidden relative mx-auto"
      style={{ 
        width: '316px', 
        height: '384px',
        maxWidth: '316px',
        maxHeight: '384px'
      }}
    >
      {headerComponent && (
        <div className="sticky top-0 z-20">
          {renderComponentWithTooltip(headerComponent, 0)}
        </div>
      )}
      
      {selectedComponents.length > 0 && (
        <div className="sticky top-0 z-10 bg-gray-100 p-2 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Check size={12} /> {selectedComponents.length} selected
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Ruler size={14} className="text-gray-500" />
              <Select value={contentDetails.size} onValueChange={handleSizeChange}>
                <SelectTrigger className="h-7 w-20">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-1">
              <Palette size={14} className="text-gray-500" />
              <Select value={contentDetails.color} onValueChange={handleColorChange}>
                <SelectTrigger className="h-7 w-24">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#3B82F6">Blue</SelectItem>
                  <SelectItem value="#EF4444">Red</SelectItem>
                  <SelectItem value="#10B981">Green</SelectItem>
                  <SelectItem value="#F59E0B">Orange</SelectItem>
                  <SelectItem value="#8B5CF6">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      <ScrollArea className="h-full overflow-x-hidden">
        <div className={headerComponent ? "pt-2" : ""}>
          {displayComponents.map((component, index) => 
            renderComponentWithTooltip(component, index + (headerComponent ? 1 : 0))
          )}
          
          {hasExcessComponents && (
            <Alert variant="destructive" className="mt-2 mx-4 mb-4 py-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Only showing {MAX_COMPONENTS} of {nonHeaderNonAlertComponents.length} components. 
                Widgets are limited to {MAX_COMPONENTS} components (excluding header and alerts).
              </AlertDescription>
            </Alert>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default WidgetPreview;
