
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";

interface ApiTemplateHandlerProps {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  selectedComponentId: string | null;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onAddApi: (api: ApiConfig) => void;
  setIsApiTemplateModalOpen: (isOpen: boolean) => void;
}

const ApiTemplateHandler: React.FC<ApiTemplateHandlerProps> = ({
  widgetComponents,
  apis,
  selectedComponentId,
  onUpdateComponent,
  onAddApi,
  setIsApiTemplateModalOpen
}) => {
  const { toast } = useToast();
  
  const applyApiTemplateToComponent = (template: ApiConfig) => {
    if (!selectedComponentId) return;
    
    const componentToUpdate = widgetComponents.find(c => c.id === selectedComponentId);
    if (!componentToUpdate) return;
    
    let apiToUse: ApiConfig;
    const existingApi = apis.find(a => a.name === template.name);
    
    if (existingApi) {
      apiToUse = existingApi;
    } else {
      const newApi = {
        ...template,
        id: `api-${Date.now()}`
      };
      
      onAddApi(newApi);
      apiToUse = newApi;
      
      toast({
        title: "API Added",
        description: `Added API "${template.name}" to your widget.`
      });
    }
    
    const updatedComponent = {
      ...componentToUpdate,
      apiConfig: {
        apiId: apiToUse.id,
        dataMapping: {}
      }
    };
    
    onUpdateComponent(updatedComponent);
    
    toast({
      title: "API Template Applied",
      description: `Applied "${template.name}" API to the selected component.`
    });
    
    setIsApiTemplateModalOpen(false);
  };
  
  // Return null or an empty fragment to make this a valid React component
  return <>{null}</>;
};

// Export both the component and the hook for flexibility
export default ApiTemplateHandler;

// Export the function for direct use
export const useApiTemplateHandler = (
  widgetComponents: WidgetComponent[],
  apis: ApiConfig[],
  selectedComponentId: string | null,
  onUpdateComponent: (updatedComponent: WidgetComponent) => void,
  onAddApi: (api: ApiConfig) => void,
  setIsApiTemplateModalOpen: (isOpen: boolean) => void
) => {
  const { toast } = useToast();
  
  const applyApiTemplateToComponent = (template: ApiConfig) => {
    if (!selectedComponentId) return;
    
    const componentToUpdate = widgetComponents.find(c => c.id === selectedComponentId);
    if (!componentToUpdate) return;
    
    let apiToUse: ApiConfig;
    const existingApi = apis.find(a => a.name === template.name);
    
    if (existingApi) {
      apiToUse = existingApi;
    } else {
      const newApi = {
        ...template,
        id: `api-${Date.now()}`
      };
      
      onAddApi(newApi);
      apiToUse = newApi;
      
      toast({
        title: "API Added",
        description: `Added API "${template.name}" to your widget.`
      });
    }
    
    const updatedComponent = {
      ...componentToUpdate,
      apiConfig: {
        apiId: apiToUse.id,
        dataMapping: {}
      }
    };
    
    onUpdateComponent(updatedComponent);
    
    toast({
      title: "API Template Applied",
      description: `Applied "${template.name}" API to the selected component.`
    });
    
    setIsApiTemplateModalOpen(false);
  };
  
  return { applyApiTemplateToComponent };
};
