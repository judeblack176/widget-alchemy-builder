
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import WidgetBuilder from "@/components/widget-builder/WidgetBuilder";
import ComponentLibrary from "@/components/widget-builder/ComponentLibrary";
import WidgetPreview from "@/components/widget-builder/WidgetPreview";
import ApiManager from "@/components/widget-builder/ApiManager";
import WidgetSubmissionForm from "@/components/widget-builder/WidgetSubmissionForm";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Library, User } from "lucide-react";
import type { WidgetComponent, ApiConfig, WidgetSubmission } from "@/types/widget-types";

const Index = () => {
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const widgetId = queryParams.get('widgetId');

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

  useEffect(() => {
    if (widgetId) {
      // If a widget ID is provided in the URL, try to load that widget
      try {
        const savedSubmissions = localStorage.getItem('widgetSubmissions');
        if (savedSubmissions) {
          const submissions: WidgetSubmission[] = JSON.parse(savedSubmissions);
          const submission = submissions.find(s => s.id === widgetId);
          
          if (submission) {
            setWidgetComponents(submission.config.components);
            setApis(submission.config.apis);
            
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
  }, [widgetId, toast]);

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
        const extractFieldPaths = (obj: any, prefix = ''): string[] => {
          if (!obj || typeof obj !== 'object') return [];
          
          let paths: string[] = [];
          
          Object.entries(obj).forEach(([key, value]) => {
            const newPath = prefix ? `${prefix}.${key}` : key;
            paths.push(newPath);
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              // For nested objects, recurse deeper
              paths = [...paths, ...extractFieldPaths(value, newPath)];
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
              // For arrays of objects, show array notation and recurse into the first item
              paths.push(`${newPath}[0]`);
              paths = [...paths, ...extractFieldPaths(value[0], `${newPath}[0]`)];
            }
          });
          
          return paths;
        };
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
        const extractFieldPaths = (obj: any, prefix = ''): string[] => {
          if (!obj || typeof obj !== 'object') return [];
          
          let paths: string[] = [];
          
          Object.entries(obj).forEach(([key, value]) => {
            const newPath = prefix ? `${prefix}.${key}` : key;
            paths.push(newPath);
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              // For nested objects, recurse deeper
              paths = [...paths, ...extractFieldPaths(value, newPath)];
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
              // For arrays of objects, show array notation and recurse into the first item
              paths.push(`${newPath}[0]`);
              paths = [...paths, ...extractFieldPaths(value[0], `${newPath}[0]`)];
            }
          });
          
          return paths;
        };
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

  const handleSubmitSuccess = () => {
    // Handle successful widget submission
    toast({
      title: "Widget Submitted",
      description: "Your widget has been submitted to the library for approval",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-widget-blue">EdTech Widget Builder</h1>
          <div className="flex space-x-2">
            <Link to="/admin/login">
              <Button variant="outline">
                <User size={16} className="mr-2" /> Admin
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="outline">
                <Library size={16} className="mr-2" /> Widget Library
              </Button>
            </Link>
            <WidgetSubmissionForm
              widgetComponents={widgetComponents}
              apis={apis}
              onSubmitSuccess={handleSubmitSuccess}
            />
          </div>
        </div>
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
