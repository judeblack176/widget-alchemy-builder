
import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  WidgetComponent, 
  ApiConfig, 
  WidgetSubmission, 
  ComponentType, 
  Tooltip 
} from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

interface WidgetContextType {
  widgetComponents: WidgetComponent[];
  apis: ApiConfig[];
  tooltips: Tooltip[];
  selectedComponentId: string | null;
  isEditing: boolean;
  isApiTemplateModalOpen: boolean;
  isTooltipListModalOpen: boolean;
  savedApiTemplates: ApiConfig[];
  setWidgetComponents: React.Dispatch<React.SetStateAction<WidgetComponent[]>>;
  setApis: React.Dispatch<React.SetStateAction<ApiConfig[]>>;
  setTooltips: React.Dispatch<React.SetStateAction<Tooltip[]>>;
  setSelectedComponentId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsApiTemplateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTooltipListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSavedApiTemplates: React.Dispatch<React.SetStateAction<ApiConfig[]>>;
  handleAddComponent: (component: WidgetComponent | string) => void;
  handleUpdateComponent: (updatedComponent: WidgetComponent) => void;
  handleRemoveComponent: (componentId: string) => void;
  handleReorderComponents: (reorderedComponents: WidgetComponent[]) => void;
  handleAddApi: (api: ApiConfig) => void;
  handleUpdateApi: (apiId: string, updatedApi: ApiConfig) => void;
  handleRemoveApi: (apiId: string) => void;
  handleAddTooltip: (tooltip: Tooltip) => void;
  handleUpdateTooltip: (tooltipId: string, updatedTooltip: Tooltip) => void;
  handleRemoveTooltip: (tooltipId: string) => void;
  handleApplyTooltip: (componentId: string, tooltipId: string) => void;
  openApiTemplateModal: (componentId: string) => void;
  applyApiTemplateToComponent: (template: ApiConfig) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const widgetId = queryParams.get('widgetId');

  const [widgetComponents, setWidgetComponents] = useState<WidgetComponent[]>([
    {
      id: "header-1",
      type: "header",
      props: {
        icon: "BookOpen",
        title: "Learning Module",
        actions: ["Edit", "More"]
      }
    }
  ]);
  
  const [apis, setApis] = useState<ApiConfig[]>([]);
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApiTemplateModalOpen, setIsApiTemplateModalOpen] = useState(false);
  const [isTooltipListModalOpen, setIsTooltipListModalOpen] = useState(false);
  const [savedApiTemplates, setSavedApiTemplates] = useState<ApiConfig[]>([]);

  useEffect(() => {
    if (widgetId) {
      setIsEditing(true);
      try {
        const savedSubmissions = localStorage.getItem('widgetSubmissions');
        if (savedSubmissions) {
          const submissions: WidgetSubmission[] = JSON.parse(savedSubmissions);
          const submission = submissions.find(s => s.id === widgetId);
          
          if (submission) {
            setWidgetComponents(submission.config.components);
            setApis(submission.config.apis || []);
            
            toast({
              title: `Loaded: ${submission.name}`,
              description: `Status: ${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}`
            });
          }
        }
      } catch (error) {
        console.error("Failed to load widget from ID", error);
      }
    }
    
    try {
      const saved = localStorage.getItem('savedApiTemplates');
      if (saved) {
        setSavedApiTemplates(JSON.parse(saved));
      }
      
      const savedTooltips = localStorage.getItem('savedTooltips');
      if (savedTooltips) {
        setTooltips(JSON.parse(savedTooltips));
      }
    } catch (error) {
      console.error("Failed to load saved data", error);
    }
  }, [widgetId, toast]);

  const handleAddComponent = (component: WidgetComponent | string) => {
    const componentToAdd = typeof component === 'string' 
      ? {
          id: `${component}-${Date.now()}`,
          type: component as ComponentType,
          props: {}
        } 
      : component;
    
    // Check if trying to add an Alert when one already exists
    if (componentToAdd.type === 'alert' && widgetComponents.some(c => c.type === 'alert')) {
      toast({
        title: "Alert Already Exists",
        description: "Only one alert component is allowed per widget.",
        variant: "destructive"
      });
      return;
    }
    
    const hasAlertComponent = widgetComponents.some(c => c.type === 'alert') || componentToAdd.type === 'alert';
    const MAX_COMPONENTS = hasAlertComponent ? 7 : 6;
    
    const nonHeaderNonAlertCount = widgetComponents.filter(
      c => c.type !== 'header' && c.type !== 'alert'
    ).length;
    
    if (nonHeaderNonAlertCount >= MAX_COMPONENTS && componentToAdd.type !== 'header' && componentToAdd.type !== 'alert') {
      toast({
        title: "Component Limit Reached",
        description: `Widgets are limited to ${MAX_COMPONENTS} components (excluding header and alerts). Please remove a component first.`,
        variant: "destructive"
      });
      return;
    }
    
    setWidgetComponents([...widgetComponents, componentToAdd]);
    toast({
      title: "Component Added",
      description: `Added ${componentToAdd.type} component to your widget.`
    });
  };

  const handleUpdateComponent = (updatedComponent: WidgetComponent) => {
    setWidgetComponents(widgetComponents.map(comp => 
      comp.id === updatedComponent.id ? updatedComponent : comp
    ));
  };

  const handleRemoveComponent = (componentId: string) => {
    setWidgetComponents(widgetComponents.filter(comp => comp.id !== componentId));
    toast({
      title: "Component Removed",
      description: "The component has been removed from your widget."
    });
  };

  const handleReorderComponents = (reorderedComponents: WidgetComponent[]) => {
    const headerComponent = reorderedComponents.find(c => c.type === 'header');
    const alertComponents = widgetComponents.filter(c => c.type === 'alert');
    const otherComponents = reorderedComponents.filter(c => c.type !== 'header' && c.type !== 'alert');
    
    let finalOrderComponents = [];
    
    if (headerComponent) {
      finalOrderComponents.push(headerComponent);
    }
    
    if (alertComponents.length > 0) {
      finalOrderComponents = [...finalOrderComponents, ...alertComponents];
    }
    
    finalOrderComponents = [...finalOrderComponents, ...otherComponents];
    
    setWidgetComponents(finalOrderComponents);
  };

  const handleAddApi = (api: ApiConfig) => {
    let processedApi = {...api};
    if (api.sampleResponse) {
      try {
        const jsonData = JSON.parse(api.sampleResponse);
        const extractFieldPaths = (obj: any, prefix = ''): string[] => {
          if (!obj || typeof obj !== 'object') return [];
          
          let paths: string[] = [];
          
          Object.entries(obj).forEach(([key, value]) => {
            const newPath = prefix ? `${prefix}.${key}` : key;
            paths.push(newPath);
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              paths = [...paths, ...extractFieldPaths(value, newPath)];
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
              paths.push(`${newPath}[0]`);
              paths = [...paths, ...extractFieldPaths(value[0], `${newPath}[0]`)];
            }
          });
          
          return paths;
        };
        processedApi.possibleFields = extractFieldPaths(jsonData);
      } catch (error) {
        console.error("Failed to parse sample response", error);
      }
    }
    
    setApis([...apis, processedApi]);
    toast({
      title: "API Added",
      description: `Added API: ${api.name}`
    });
  };

  const handleUpdateApi = (apiId: string, updatedApi: ApiConfig) => {
    let processedApi = {...updatedApi};
    if (updatedApi.sampleResponse) {
      try {
        const jsonData = JSON.parse(updatedApi.sampleResponse);
        const extractFieldPaths = (obj: any, prefix = ''): string[] => {
          if (!obj || typeof obj !== 'object') return [];
          
          let paths: string[] = [];
          
          Object.entries(obj).forEach(([key, value]) => {
            const newPath = prefix ? `${prefix}.${key}` : key;
            paths.push(newPath);
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              paths = [...paths, ...extractFieldPaths(value, newPath)];
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
              paths.push(`${newPath}[0]`);
              paths = [...paths, ...extractFieldPaths(value[0], `${newPath}[0]`)];
            }
          });
          
          return paths;
        };
        processedApi.possibleFields = extractFieldPaths(jsonData);
      } catch (error) {
        console.error("Failed to parse sample response", error);
      }
    }
    
    setApis(apis.map(api => api.id === apiId ? processedApi : api));
    
    toast({
      title: "API Updated",
      description: `Updated API: ${updatedApi.name}`
    });
  };

  const handleRemoveApi = (apiId: string) => {
    const componentsUsingApi = widgetComponents.filter(comp => comp.apiConfig?.apiId === apiId);
    
    if (componentsUsingApi.length > 0) {
      toast({
        title: "Cannot Remove API",
        description: `This API is being used by ${componentsUsingApi.length} component(s). Please remove the API integration from these components first.`,
        variant: "destructive"
      });
      return;
    }
    
    setApis(apis.filter(api => api.id !== apiId));
    toast({
      title: "API Removed",
      description: "The API has been removed from your widget."
    });
  };

  const handleAddTooltip = (tooltip: Tooltip) => {
    const updatedTooltips = [...tooltips, tooltip];
    setTooltips(updatedTooltips);
    localStorage.setItem('savedTooltips', JSON.stringify(updatedTooltips));
  };

  const handleUpdateTooltip = (tooltipId: string, updatedTooltip: Tooltip) => {
    const updatedTooltips = tooltips.map(tooltip => 
      tooltip.id === tooltipId ? updatedTooltip : tooltip
    );
    setTooltips(updatedTooltips);
    localStorage.setItem('savedTooltips', JSON.stringify(updatedTooltips));
  };

  const handleRemoveTooltip = (tooltipId: string) => {
    const componentsUsingTooltip = widgetComponents.filter(comp => comp.tooltipId === tooltipId);
    
    if (componentsUsingTooltip.length > 0) {
      toast({
        title: "Cannot Remove Tooltip",
        description: `This tooltip is being used by ${componentsUsingTooltip.length} component(s). Please remove the tooltip from these components first.`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedTooltips = tooltips.filter(tooltip => tooltip.id !== tooltipId);
    setTooltips(updatedTooltips);
    localStorage.setItem('savedTooltips', JSON.stringify(updatedTooltips));
  };

  const handleApplyTooltip = (componentId: string, tooltipId: string) => {
    setWidgetComponents(widgetComponents.map(comp => 
      comp.id === componentId ? { ...comp, tooltipId } : comp
    ));
    
    toast({
      title: tooltipId ? "Tooltip Applied" : "Tooltip Removed",
      description: tooltipId ? 
        "Tooltip has been applied to the component." : 
        "Tooltip has been removed from the component."
    });
  };

  const openApiTemplateModal = (componentId: string) => {
    setSelectedComponentId(componentId);
    setIsApiTemplateModalOpen(true);
  };

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

  const value = {
    widgetComponents,
    apis,
    tooltips,
    selectedComponentId,
    isEditing,
    isApiTemplateModalOpen,
    isTooltipListModalOpen,
    savedApiTemplates,
    setWidgetComponents,
    setApis,
    setTooltips,
    setSelectedComponentId,
    setIsEditing,
    setIsApiTemplateModalOpen,
    setIsTooltipListModalOpen,
    setSavedApiTemplates,
    handleAddComponent,
    handleUpdateComponent,
    handleRemoveComponent,
    handleReorderComponents,
    handleAddApi,
    handleUpdateApi,
    handleRemoveApi,
    handleAddTooltip,
    handleUpdateTooltip,
    handleRemoveTooltip,
    handleApplyTooltip,
    openApiTemplateModal,
    applyApiTemplateToComponent
  };

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
