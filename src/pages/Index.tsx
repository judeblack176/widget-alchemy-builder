import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import WidgetBuilder from "@/components/widget-builder/WidgetBuilder";
import ComponentLibrary from "@/components/widget-builder/ComponentLibrary";
import WidgetPreview from "@/components/widget-builder/WidgetPreview";
import ApiManager from "@/components/widget-builder/ApiManager";
import TooltipManager, { Tooltip } from "@/components/widget-builder/TooltipManager";
import WidgetSubmissionForm from "@/components/widget-builder/WidgetSubmissionForm";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Library, User, Bookmark, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WidgetComponent, ApiConfig, WidgetSubmission } from "@/types/widget-types";

const Index = () => {
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const widgetId = queryParams.get('widgetId');
  const MAX_COMPONENTS = 6;

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

  useEffect(() => {
    if (widgetId) {
      if (widgetId) {
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

  const handleAddComponent = (component: WidgetComponent) => {
    if (widgetComponents.length >= MAX_COMPONENTS) {
      toast({
        title: "Component Limit Reached",
        description: `Widgets are limited to ${MAX_COMPONENTS} components. Please remove a component first.`,
        variant: "destructive"
      });
      return;
    }
    
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
    const savedWidget = localStorage.getItem('savedWidget');
    
    if (savedWidget) {
      const widgetConfig = JSON.parse(savedWidget);
      setWidgetComponents(widgetConfig.components || []);
      setApis(widgetConfig.apis || []);
      setTooltips(widgetConfig.tooltips || []);
      
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4 w-full">
        <div className="container mx-auto flex justify-between items-center">
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
              <TabsTrigger value="tooltips" className="flex-1">Tooltips</TabsTrigger>
              <TabsTrigger value="apis" className="flex-1">APIs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="mt-4">
              <ComponentLibrary onAddComponent={handleAddComponent} />
            </TabsContent>
            
            <TabsContent value="tooltips" className="mt-4">
              <TooltipManager
                tooltips={tooltips}
                onAddTooltip={handleAddTooltip}
                onUpdateTooltip={handleUpdateTooltip}
                onRemoveTooltip={handleRemoveTooltip}
              />
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
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => setIsApiTemplateModalOpen(true)}
              >
                <Bookmark size={16} />
                API Templates
              </Button>
            </div>
          </div>
          
          <WidgetBuilder
            components={widgetComponents}
            apis={apis}
            onUpdateComponent={handleUpdateComponent}
            onRemoveComponent={handleRemoveComponent}
            onReorderComponents={handleReorderComponents}
            onRequestApiTemplate={openApiTemplateModal}
            onApplyTooltip={handleApplyTooltip}
          />
        </div>
        
        <div className="w-1/3 p-4 bg-gray-200 overflow-y-auto flex flex-col items-center">
          <div className="flex justify-between items-center self-stretch mb-6">
            <h2 className="text-xl font-semibold">Preview</h2>
            <div className="space-x-2">
              <Button
                onClick={handleSaveWidget}
                variant="default"
                size="default"
                className="bg-widget-blue hover:bg-blue-600 transition-colors"
              >
                Save
              </Button>
              <Button
                onClick={handleLoadWidget}
                variant="outline"
                size="default"
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                Load
              </Button>
            </div>
          </div>
          <WidgetPreview components={widgetComponents} apis={apis} />
        </div>
      </div>
      
      <Dialog open={isApiTemplateModalOpen} onOpenChange={setIsApiTemplateModalOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Select API Template</DialogTitle>
          </DialogHeader>
          
          {savedApiTemplates.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No saved API templates yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Save your APIs as templates from the API tab to reuse them
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
                {savedApiTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:border-widget-blue transition-colors"
                    onClick={() => applyApiTemplateToComponent(template)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <div className="flex">
                          <span className="font-semibold w-20">Method:</span>
                          <span className="font-mono text-widget-blue">{template.method}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-20">Endpoint:</span>
                          <span className="font-mono text-xs truncate" title={template.endpoint}>
                            {template.endpoint}
                          </span>
                        </div>
                        {template.possibleFields && template.possibleFields.length > 0 && (
                          <div className="mt-2">
                            <span className="font-semibold text-xs block mb-1">Available Fields:</span>
                            <div className="flex flex-wrap gap-1">
                              {template.possibleFields.slice(0, 3).map((field, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{field}</Badge>
                              ))}
                              {template.possibleFields.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.possibleFields.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiTemplateModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTooltipListModalOpen} onOpenChange={setIsTooltipListModalOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Available Tooltips</DialogTitle>
          </DialogHeader>
          
          {tooltips.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No tooltips created yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create tooltips from the Tooltips tab to use them in your components
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 gap-4 p-1">
                {tooltips.map((tooltip) => (
                  <Card key={tooltip.id} className="overflow-hidden">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-base font-medium">{tooltip.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <p className="text-sm">{tooltip.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTooltipListModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
