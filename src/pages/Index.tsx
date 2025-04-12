
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WidgetComponent, ApiConfig, Tooltip } from "@/types/widget-types";
import { DragDropContext } from 'react-beautiful-dnd';
import WidgetBuilderHeader from "@/components/widget-builder/page-components/WidgetBuilderHeader";
import ComponentLibraryPanel from "@/components/widget-builder/page-components/ComponentLibraryPanel";
import WidgetBuilderPanel from "@/components/widget-builder/page-components/WidgetBuilderPanel";
import WidgetPreviewPanel from "@/components/widget-builder/page-components/WidgetPreviewPanel";
import ApiTemplateModal from "@/components/widget-builder/modals/ApiTemplateModal";
import TooltipListModal from "@/components/widget-builder/modals/TooltipListModal";

const Index = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
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
  const [activeTab, setActiveTab] = useState<string>("components");
  const [isApiTemplateModalOpen, setIsApiTemplateModalOpen] = useState(false);
  const [isTooltipListModalOpen, setIsTooltipListModalOpen] = useState(false);
  const [savedApiTemplates, setSavedApiTemplates] = useState<ApiConfig[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (widgetId) {
      setIsEditing(true);
      if (widgetId) {
        try {
          const savedSubmissions = localStorage.getItem('widgetSubmissions');
          if (savedSubmissions) {
            const submissions = JSON.parse(savedSubmissions);
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
          type: component as any,
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

  const handleSaveWidget = () => {
    const widgetConfig = {
      components: widgetComponents,
      apis: apis,
      tooltips: tooltips
    };
    
    localStorage.setItem('savedWidget', JSON.stringify(widgetConfig));
    
    toast({
      title: "Widget Saved",
      description: "Your widget configuration has been saved."
    });
  };

  const handleLoadWidget = () => {
    navigate('/library?mode=select');
    setIsEditing(false);
  };

  const handleNewWidget = () => {
    setWidgetComponents([{
      id: "header-1",
      type: "header",
      props: {
        icon: "BookOpen",
        title: "Learning Module",
        actions: ["Edit", "More"]
      }
    }]);
    setApis([]);
    setIsEditing(false);
    
    navigate('/');
    
    toast({
      title: "New Widget Started",
      description: "You can now start building a new widget from scratch."
    });
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    navigate('/');
    toast({
      title: "Editing Cancelled",
      description: "Changes to the widget have been discarded."
    });
  };

  const handleSubmitSuccess = () => {
    setIsEditing(false);
    toast({
      title: "Widget Submitted",
      description: "Your widget has been submitted to the library for approval",
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    if (result.source.droppableId === 'component-library' && result.destination.droppableId === 'widget-builder') {
      const componentType = result.draggableId;
      const componentLibraryItem = document.querySelector(`[data-component-type="${componentType}"]`);
      
      if (componentLibraryItem && componentLibraryItem instanceof HTMLElement) {
        componentLibraryItem.click();
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gray-100">
        <WidgetBuilderHeader
          onLoadWidget={handleLoadWidget}
          onNewWidget={handleNewWidget}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <ComponentLibraryPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddComponent={handleAddComponent}
            widgetComponents={widgetComponents}
            apis={apis}
            tooltips={tooltips}
            onAddApi={handleAddApi}
            onRemoveApi={handleRemoveApi}
            onUpdateApi={handleUpdateApi}
            onAddTooltip={handleAddTooltip}
            onUpdateTooltip={handleUpdateTooltip}
            onRemoveTooltip={handleRemoveTooltip}
          />
          
          <WidgetBuilderPanel
            widgetComponents={widgetComponents}
            apis={apis}
            tooltips={tooltips}
            onUpdateComponent={handleUpdateComponent}
            onRemoveComponent={handleRemoveComponent}
            onReorderComponents={handleReorderComponents}
            onRequestApiTemplate={openApiTemplateModal}
            onApplyTooltip={handleApplyTooltip}
            onNewWidget={handleNewWidget}
            onLoadWidget={handleLoadWidget}
          />
          
          <WidgetPreviewPanel
            widgetComponents={widgetComponents}
            apis={apis}
            isEditing={isEditing}
            widgetId={widgetId}
            onSaveWidget={handleSaveWidget}
            onCancelEditing={handleCancelEditing}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </div>
        
        <ApiTemplateModal
          isOpen={isApiTemplateModalOpen}
          onOpenChange={setIsApiTemplateModalOpen}
          apiTemplates={savedApiTemplates}
          onApplyTemplate={applyApiTemplateToComponent}
        />

        <TooltipListModal
          isOpen={isTooltipListModalOpen}
          onOpenChange={setIsTooltipListModalOpen}
          tooltips={tooltips}
        />
      </div>
    </DragDropContext>
  );
};

export default Index;
