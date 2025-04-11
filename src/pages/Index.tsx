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
import { Library, User, Bookmark, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WidgetComponent, ApiConfig, WidgetSubmission } from "@/types/widget-types";

interface TooltipTemplate {
  id: string;
  name: string;
  content: string;
  placement: "top" | "right" | "bottom" | "left";
  backgroundColor: string;
  textColor: string;
  showArrow: boolean;
  triggerStyle: "button" | "text" | "icon" | "custom";
}

const Index = () => {
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
  const [activeTab, setActiveTab] = useState<string>("components");
  const [isApiTemplateModalOpen, setIsApiTemplateModalOpen] = useState(false);
  const [isTooltipTemplateModalOpen, setIsTooltipTemplateModalOpen] = useState(false);
  const [savedApiTemplates, setSavedApiTemplates] = useState<ApiConfig[]>([]);
  const [savedTooltipTemplates, setSavedTooltipTemplates] = useState<TooltipTemplate[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [newTooltipTemplate, setNewTooltipTemplate] = useState<Partial<TooltipTemplate>>({
    name: '',
    content: '',
    placement: 'top',
    backgroundColor: '#1E293B',
    textColor: '#FFFFFF',
    showArrow: true,
    triggerStyle: 'button'
  });

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
    } catch (error) {
      console.error("Failed to load API templates", error);
    }
    
    try {
      const savedTooltips = localStorage.getItem('savedTooltipTemplates');
      if (savedTooltips) {
        setSavedTooltipTemplates(JSON.parse(savedTooltips));
      }
    } catch (error) {
      console.error("Failed to load tooltip templates", error);
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
      apis: apis
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

  const handleAddTooltipTemplate = (template: Partial<TooltipTemplate>) => {
    if (!template.name || !template.content) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and content for your tooltip template",
        variant: "destructive"
      });
      return;
    }
    
    const newTemplate: TooltipTemplate = {
      id: `tooltip-template-${Date.now()}`,
      name: template.name,
      content: template.content,
      placement: template.placement || 'top',
      backgroundColor: template.backgroundColor || '#1E293B',
      textColor: template.textColor || '#FFFFFF',
      showArrow: template.showArrow !== undefined ? template.showArrow : true,
      triggerStyle: template.triggerStyle || 'button'
    };
    
    const updatedTemplates = [...savedTooltipTemplates, newTemplate];
    setSavedTooltipTemplates(updatedTemplates);
    localStorage.setItem('savedTooltipTemplates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "Tooltip Template Saved",
      description: `Saved tooltip template: ${template.name}`
    });
    
    setNewTooltipTemplate({
      name: '',
      content: '',
      placement: 'top',
      backgroundColor: '#1E293B',
      textColor: '#FFFFFF',
      showArrow: true,
      triggerStyle: 'button'
    });
    
    setIsTooltipTemplateModalOpen(false);
  };
  
  const handleDeleteTooltipTemplate = (templateId: string) => {
    const updatedTemplates = savedTooltipTemplates.filter(template => template.id !== templateId);
    setSavedTooltipTemplates(updatedTemplates);
    localStorage.setItem('savedTooltipTemplates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "Tooltip Template Deleted",
      description: "The tooltip template has been deleted"
    });
  };
  
  const applyTooltipTemplateToComponent = (template: TooltipTemplate) => {
    if (!selectedComponentId) return;
    
    const componentToUpdate = widgetComponents.find(c => c.id === selectedComponentId);
    if (!componentToUpdate) return;
    
    if (componentToUpdate.type === 'tooltip') {
      const updatedComponent = {
        ...componentToUpdate,
        props: {
          ...componentToUpdate.props,
          content: template.content,
          placement: template.placement,
          backgroundColor: template.backgroundColor,
          textColor: template.textColor,
          showArrow: template.showArrow,
          triggerStyle: template.triggerStyle
        }
      };
      
      handleUpdateComponent(updatedComponent);
    } else {
      const newTooltipComponent: WidgetComponent = {
        id: `tooltip-${Date.now()}`,
        type: 'tooltip',
        props: {
          content: template.content,
          placement: template.placement,
          backgroundColor: template.backgroundColor,
          textColor: template.textColor,
          showArrow: template.showArrow,
          triggerStyle: template.triggerStyle,
          children: componentToUpdate
        }
      };
      
      const updatedComponents = widgetComponents.map(component => 
        component.id === selectedComponentId ? newTooltipComponent : component
      );
      
      setWidgetComponents(updatedComponents);
    }
    
    toast({
      title: "Tooltip Template Applied",
      description: `Applied "${template.name}" tooltip to the selected component`
    });
    
    setIsTooltipTemplateModalOpen(false);
  };

  const openTooltipTemplateModal = (componentId: string) => {
    setSelectedComponentId(componentId);
    setIsTooltipTemplateModalOpen(true);
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1"
                  >
                    <HelpCircle size={16} />
                    Tooltip Templates
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h3 className="font-medium">Saved Tooltip Templates</h3>
                    
                    {savedTooltipTemplates.length === 0 ? (
                      <p className="text-sm text-gray-500">No saved tooltip templates yet.</p>
                    ) : (
                      <ScrollArea className="h-60">
                        <div className="space-y-2">
                          {savedTooltipTemplates.map((template) => (
                            <div key={template.id} className="border rounded p-2 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{template.name}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{template.content}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => applyTooltipTemplateToComponent(template)}
                                  disabled={!selectedComponentId}
                                >
                                  Apply
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteTooltipTemplate(template.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                    
                    <div className="pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setIsTooltipTemplateModalOpen(true)}
                      >
                        Create New Template
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => setIsApiTemplateModalOpen(true)}
              >
                <Bookmark size={16} />
                API Templates
              </Button>
              
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
            onRequestApiTemplate={openApiTemplateModal}
            onRequestTooltipTemplate={openTooltipTemplateModal}
          />
        </div>
        
        <div className="w-1/3 p-4 bg-gray-200 overflow-y-auto flex flex-col items-center">
          <h2 className="text-xl font-semibold self-start mb-6">Preview</h2>
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
      
      <Dialog open={isTooltipTemplateModalOpen} onOpenChange={setIsTooltipTemplateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedComponentId ? "Apply Tooltip Template" : "Create Tooltip Template"}
            </DialogTitle>
          </DialogHeader>
          
          {savedTooltipTemplates.length === 0 && selectedComponentId ? (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No saved tooltip templates yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create a new tooltip template below
              </p>
            </div>
          ) : selectedComponentId ? (
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-1 gap-4 p-1">
                {savedTooltipTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:border-widget-blue transition-colors"
                    onClick={() => applyTooltipTemplateToComponent(template)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-1">
                        <div className="flex">
                          <span className="font-semibold w-20">Content:</span>
                          <span className="truncate">{template.content}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-20">Position:</span>
                          <span>{template.placement}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-20">Style:</span>
                          <span>{template.triggerStyle}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tooltip-name">Template Name</Label>
                <Input 
                  id="tooltip-name" 
                  value={newTooltipTemplate.name} 
                  onChange={(e) => setNewTooltipTemplate({...newTooltipTemplate, name: e.target.value})}
                  placeholder="e.g., Info Tooltip"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tooltip-content">Content</Label>
                <Input 
                  id="tooltip-content" 
                  value={newTooltipTemplate.content} 
                  onChange={(e) => setNewTooltipTemplate({...newTooltipTemplate, content: e.target.value})}
                  placeholder="Tooltip text content"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tooltip-placement">Placement</Label>
                <select 
                  id="tooltip-placement"
                  className="w-full p-2 border rounded-md"
                  value={newTooltipTemplate.placement}
                  onChange={(e) => setNewTooltipTemplate({
                    ...newTooltipTemplate, 
                    placement: e.target.value as "top" | "right" | "bottom" | "left"
                  })}
                >
                  <option value="top">Top</option>
                  <option value="right">Right</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tooltip-trigger">Trigger Style</Label>
                <select 
                  id="tooltip-trigger"
                  className="w-full p-2 border rounded-md"
                  value={newTooltipTemplate.triggerStyle}
                  onChange={(e) => setNewTooltipTemplate({
                    ...newTooltipTemplate, 
                    triggerStyle: e.target.value as "button" | "text" | "icon" | "custom"
                  })}
                >
                  <option value="button">Button</option>
                  <option value="text">Text</option>
                  <option value="icon">Icon</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tooltip-bg">Background Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="tooltip-bg" 
                      type="color"
                      value={newTooltipTemplate.backgroundColor}
                      onChange={(e) => setNewTooltipTemplate({
                        ...newTooltipTemplate, 
                        backgroundColor: e.target.value
                      })}
                      className="w-10 h-10 p-1"
                    />
                    <Input 
                      type="text"
                      value={newTooltipTemplate.backgroundColor}
                      onChange={(e) => setNewTooltipTemplate({
                        ...newTooltipTemplate, 
                        backgroundColor: e.target.value
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tooltip-text">Text Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="tooltip-text" 
                      type="color"
                      value={newTooltipTemplate.textColor}
                      onChange={(e) => setNewTooltipTemplate({
                        ...newTooltipTemplate, 
                        textColor: e.target.value
                      })}
                      className="w-10 h-10 p-1"
                    />
                    <Input 
                      type="text"
                      value={newTooltipTemplate.textColor}
                      onChange={(e) => setNewTooltipTemplate({
                        ...newTooltipTemplate, 
                        textColor: e.target.value
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="show-arrow"
                  checked={newTooltipTemplate.showArrow}
                  onChange={(e) => setNewTooltipTemplate({
                    ...newTooltipTemplate,
                    showArrow: e.target.checked
                  })}
                />
                <Label htmlFor="show-arrow">Show Arrow</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTooltipTemplateModalOpen(false)}>
              Cancel
            </Button>
            {!selectedComponentId && (
              <Button 
                onClick={() => handleAddTooltipTemplate(newTooltipTemplate)}
                disabled={!newTooltipTemplate.name || !newTooltipTemplate.content}
              >
                Save Template
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
