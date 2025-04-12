
import { ApiConfig, WidgetComponent } from "@/types";

export const createApiTemplateHandlers = (
  widgetComponents: WidgetComponent[],
  handleUpdateComponent: (updatedComponent: WidgetComponent) => void,
  apis: ApiConfig[],
  setApis: React.Dispatch<React.SetStateAction<ApiConfig[]>>,
  toast: any
) => {
  const openApiTemplateModal = (componentId: string) => {
    return componentId;
  };

  const applyApiTemplateToComponent = (
    template: ApiConfig, 
    selectedComponentId: string | null,
    setIsApiTemplateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
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
      
      setApis(prev => [...prev, newApi]);
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
    
    handleUpdateComponent(updatedComponent);
    
    toast({
      title: "API Template Applied",
      description: `Applied "${template.name}" API to the selected component.`
    });
    
    setIsApiTemplateModalOpen(false);
  };

  return {
    openApiTemplateModal,
    applyApiTemplateToComponent
  };
};
