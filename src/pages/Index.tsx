import { useState } from "react";
import WidgetBuilder from "@/components/widget-builder/WidgetBuilder";
import ComponentLibrary from "@/components/widget-builder/ComponentLibrary";
import WidgetPreview from "@/components/widget-builder/WidgetPreview";
import ApiManager from "@/components/widget-builder/ApiManager";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WidgetComponent, ApiConfig, extractFieldPaths } from "@/types/widget-types";

const Index = () => {
  const { toast } = useToast();
  const [widgetComponents, setWidgetComponents] = useState<WidgetComponent[]>([
    // Default template with header
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
  const [activeTab, setActiveTab] = useState<string>("components");

  const handleAddComponent = (component: WidgetComponent) => {
    setWidgetComponents([...widgetComponents, {...component, id: `${component.type}-${Date.now()}`}]);
    toast({
      title: "Component Added",
      description: `Added ${component.type} component to your widget.`
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
    setWidgetComponents(reorderedComponents);
  };

  const handleAddApi = (api: ApiConfig) => {
    // Process sample response if provided to extract possible fields
    let processedApi = {...api};
    if (api.sampleResponse) {
      try {
        const jsonData = JSON.parse(api.sampleResponse);
        processedApi.possibleFields = extractFieldPaths(jsonData);
      } catch (error) {
        // If JSON parsing fails, just keep the API as is
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
    // Process sample response if provided to extract possible fields
    let processedApi = {...updatedApi};
    if (updatedApi.sampleResponse) {
      try {
        const jsonData = JSON.parse(updatedApi.sampleResponse);
        processedApi.possibleFields = extractFieldPaths(jsonData);
      } catch (error) {
        // If JSON parsing fails, just keep the API as is
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
    // Check if any components use this API
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
    // In a real application, this would save to a backend
    const widgetConfig = {
      components: widgetComponents,
      apis: apis
    };
    
    localStorage.setItem('savedWidget', JSON.stringify(widgetConfig));
    
    toast({
      title: "Widget Saved",
      description: "Your widget configuration has been saved."
    });
  };

  const handleLoadWidget = () => {
    // In a real application, this would load from a backend
    const savedWidget = localStorage.getItem('savedWidget');
    
    if (savedWidget) {
      const widgetConfig = JSON.parse(savedWidget);
      setWidgetComponents(widgetConfig.components || []);
      setApis(widgetConfig.apis || []);
      
      toast({
        title: "Widget Loaded",
        description: "Your saved widget configuration has been loaded."
      });
    } else {
      toast({
        title: "No Saved Widget",
        description: "No previously saved widget configuration was found.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-widget-blue">EdTech Widget Builder</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r border-gray-200 bg-white p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
              <TabsTrigger value="apis" className="flex-1">APIs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="mt-4">
              <ComponentLibrary onAddComponent={handleAddComponent} />
            </TabsContent>
            
            <TabsContent value="apis" className="mt-4">
              <ApiManager 
                apis={apis} 
                onAddApi={handleAddApi} 
                onRemoveApi={handleRemoveApi} 
                onUpdateApi={handleUpdateApi}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-2/5 p-4 bg-widget-gray overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Widget Builder</h2>
            <div className="space-x-2">
              <button
                onClick={handleSaveWidget}
                className="px-3 py-1 bg-widget-blue text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleLoadWidget}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Load
              </button>
            </div>
          </div>
          
          <WidgetBuilder
            components={widgetComponents}
            apis={apis}
            onUpdateComponent={handleUpdateComponent}
            onRemoveComponent={handleRemoveComponent}
            onReorderComponents={handleReorderComponents}
          />
        </div>
        
        <div className="w-1/3 p-4 bg-gray-200 overflow-y-auto flex flex-col items-center">
          <h2 className="text-xl font-semibold self-start mb-6">Preview</h2>
          <WidgetPreview components={widgetComponents} apis={apis} />
        </div>
      </div>
    </div>
  );
};

export default Index;
