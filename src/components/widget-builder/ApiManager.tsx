import React, { useState, useEffect } from "react";
import { ApiConfig, extractFieldPaths } from "@/types/widget-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Globe, Code, List, UploadCloud, Save, BookmarkIcon, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ApiManagerProps {
  apis: ApiConfig[];
  onAddApi: (api: ApiConfig) => void;
  onRemoveApi: (apiId: string) => void;
  onUpdateApi?: (apiId: string, updatedApi: ApiConfig) => void;
}

const ApiManager: React.FC<ApiManagerProps> = ({ apis, onAddApi, onRemoveApi, onUpdateApi }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedApiForEdit, setSelectedApiForEdit] = useState<string | null>(null);
  const [savedApiTemplates, setSavedApiTemplates] = useState<ApiConfig[]>([]);
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);
  
  const [newApi, setNewApi] = useState<Partial<ApiConfig>>({
    name: "",
    endpoint: "",
    method: "GET",
    headers: {},
    parameters: {},
    responseMapping: {},
    sampleResponse: "",
    possibleFields: []
  });
  
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [paramKey, setParamKey] = useState("");
  const [paramValue, setParamValue] = useState("");
  const [mappingKey, setMappingKey] = useState("");
  const [mappingValue, setMappingValue] = useState("");

  useEffect(() => {
    const loadSavedTemplates = () => {
      try {
        const saved = localStorage.getItem('savedApiTemplates');
        if (saved) {
          setSavedApiTemplates(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load API templates", error);
      }
    };
    
    loadSavedTemplates();
  }, []);

  const saveApiTemplate = (api: ApiConfig) => {
    const updatedTemplates = [...savedApiTemplates];
    
    const existingIndex = updatedTemplates.findIndex(template => template.id === api.id);
    
    if (existingIndex >= 0) {
      updatedTemplates[existingIndex] = api;
    } else {
      const templateApi = {
        ...api,
        id: `template-${Date.now()}`
      };
      updatedTemplates.push(templateApi);
    }
    
    setSavedApiTemplates(updatedTemplates);
    localStorage.setItem('savedApiTemplates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "API Template Saved",
      description: `"${api.name}" is now available as a template.`
    });
  };
  
  const useApiTemplate = (template: ApiConfig) => {
    const apiFromTemplate = {
      ...template,
      id: `api-${Date.now()}`,
      name: `${template.name}`
    };
    
    onAddApi(apiFromTemplate);
    setIsTemplatesDialogOpen(false);
    
    toast({
      title: "Template Applied",
      description: `Added "${template.name}" to your widget.`
    });
  };
  
  const deleteApiTemplate = (templateId: string) => {
    const updatedTemplates = savedApiTemplates.filter(template => template.id !== templateId);
    setSavedApiTemplates(updatedTemplates);
    localStorage.setItem('savedApiTemplates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "Template Deleted",
      description: "The API template has been removed."
    });
  };

  const resetForm = () => {
    setNewApi({
      name: "",
      endpoint: "",
      method: "GET",
      headers: {},
      parameters: {},
      responseMapping: {},
      sampleResponse: "",
      possibleFields: []
    });
    setHeaderKey("");
    setHeaderValue("");
    setParamKey("");
    setParamValue("");
    setMappingKey("");
    setMappingValue("");
    setActiveTab("general");
    setSelectedApiForEdit(null);
  };

  const handleAddHeader = () => {
    if (headerKey && headerValue) {
      setNewApi({
        ...newApi,
        headers: { ...(newApi.headers || {}), [headerKey]: headerValue }
      });
      setHeaderKey("");
      setHeaderValue("");
    }
  };

  const handleAddParam = () => {
    if (paramKey && paramValue) {
      setNewApi({
        ...newApi,
        parameters: { ...(newApi.parameters || {}), [paramKey]: paramValue }
      });
      setParamKey("");
      setParamValue("");
    }
  };
  
  const handleAddMapping = () => {
    if (mappingKey && mappingValue) {
      setNewApi({
        ...newApi,
        responseMapping: { ...(newApi.responseMapping || {}), [mappingKey]: mappingValue }
      });
      setMappingKey("");
      setMappingValue("");
    }
  };

  const handleEditApi = (apiId: string) => {
    const apiToEdit = apis.find(api => api.id === apiId);
    if (apiToEdit) {
      setNewApi(apiToEdit);
      setSelectedApiForEdit(apiId);
      setIsOpen(true);
    }
  };

  const processSampleResponse = () => {
    if (!newApi.sampleResponse) return;
    
    try {
      const jsonData = JSON.parse(newApi.sampleResponse);
      const extractedFields = extractFieldPaths(jsonData);
      
      setNewApi({
        ...newApi,
        possibleFields: extractedFields
      });
      
      toast({
        title: "Fields Extracted",
        description: `Successfully extracted ${extractedFields.length} possible fields from the sample response.`
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON for the sample response.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    if (newApi.name && newApi.endpoint && newApi.method) {
      if (selectedApiForEdit) {
        onUpdateApi && onUpdateApi(selectedApiForEdit, {
          id: selectedApiForEdit,
          name: newApi.name as string,
          endpoint: newApi.endpoint as string,
          method: newApi.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
          headers: newApi.headers,
          parameters: newApi.parameters,
          responseMapping: newApi.responseMapping,
          sampleResponse: newApi.sampleResponse,
          possibleFields: newApi.possibleFields
        });
      } else {
        onAddApi({
          id: `api-${Date.now()}`,
          name: newApi.name as string,
          endpoint: newApi.endpoint as string,
          method: newApi.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
          headers: newApi.headers,
          parameters: newApi.parameters,
          responseMapping: newApi.responseMapping,
          sampleResponse: newApi.sampleResponse,
          possibleFields: newApi.possibleFields
        });
      }
      
      resetForm();
      setIsOpen(false);
    }
  };

  const handleCloseDialog = () => {
    resetForm();
    setIsOpen(false);
  };

  const renderTemplatesList = () => {
    if (savedApiTemplates.length === 0) {
      return (
        <div className="text-center p-6 border border-dashed rounded-lg">
          <BookmarkIcon className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-500">No saved API templates yet</p>
          <p className="text-sm text-gray-400 mt-1">Save your APIs as templates to reuse them</p>
        </div>
      );
    }
    
    return (
      <ScrollArea className="h-[350px] pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedApiTemplates.map((template) => (
            <Card key={template.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base truncate" title={template.name}>
                    {template.name}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => useApiTemplate(template)}
                      title="Use template"
                    >
                      <Plus size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => deleteApiTemplate(template.id)}
                      title="Delete template"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div className="flex">
                    <span className="font-semibold w-16">Method:</span>
                    <span className="font-mono text-widget-blue">{template.method}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-16">Endpoint:</span>
                    <span className="font-mono text-xs truncate" title={template.endpoint}>
                      {template.endpoint}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-16">Headers:</span>
                    <span className="text-xs">{template.headers ? Object.keys(template.headers).length : 0} defined</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700">API Configurations</h3>
        
        <div className="flex gap-2">
          <Dialog open={isTemplatesDialogOpen} onOpenChange={setIsTemplatesDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex gap-1 items-center">
                <BookmarkIcon size={16} />
                API Templates
                {savedApiTemplates.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{savedApiTemplates.length}</Badge>
                )}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Saved API Templates</DialogTitle>
                <DialogDescription>
                  Reuse previously configured APIs in your widgets
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 overflow-hidden">
                {renderTemplatesList()}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplatesDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-widget-blue hover:bg-blue-600">
                <Plus size={16} className="mr-1" /> Add API
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedApiForEdit ? "Edit API Integration" : "Add New API Integration"}</DialogTitle>
                <DialogDescription>
                  Configure an API endpoint to use with your widget components.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="params">Parameters</TabsTrigger>
                  <TabsTrigger value="sample">Sample Response</TabsTrigger>
                  <TabsTrigger value="mapping">Response Mapping</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="api-name">API Name</Label>
                    <Input
                      id="api-name"
                      value={newApi.name}
                      onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
                      placeholder="Enter a descriptive name"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="api-endpoint">Endpoint URL</Label>
                    <Input
                      id="api-endpoint"
                      value={newApi.endpoint}
                      onChange={(e) => setNewApi({ ...newApi, endpoint: e.target.value })}
                      placeholder="https://api.example.com/data"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="api-method">HTTP Method</Label>
                    <Select
                      value={newApi.method}
                      onValueChange={(value) => setNewApi({ ...newApi, method: value as any })}
                    >
                      <SelectTrigger id="api-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="headers" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Headers</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Key"
                        value={headerKey}
                        onChange={(e) => setHeaderKey(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={headerValue}
                        onChange={(e) => setHeaderValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={handleAddHeader} 
                        disabled={!headerKey || !headerValue}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {newApi.headers && Object.keys(newApi.headers).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                        {Object.entries(newApi.headers).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1">
                            <span className="font-mono">{key}: {value}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newHeaders = { ...newApi.headers };
                                delete newHeaders[key];
                                setNewApi({ ...newApi, headers: newHeaders });
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="params" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Parameters</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Key"
                        value={paramKey}
                        onChange={(e) => setParamKey(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={paramValue}
                        onChange={(e) => setParamValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={handleAddParam} 
                        disabled={!paramKey || !paramValue}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {newApi.parameters && Object.keys(newApi.parameters).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                        {Object.entries(newApi.parameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1">
                            <span className="font-mono">{key}: {value}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newParams = { ...newApi.parameters };
                                delete newParams[key];
                                setNewApi({ ...newApi, parameters: newParams });
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="sample" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Sample API Response</Label>
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={processSampleResponse}
                        variant="outline"
                      >
                        <UploadCloud size={14} className="mr-1" /> Process Response
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Paste a sample JSON response from this API"
                      value={newApi.sampleResponse || ''}
                      onChange={(e) => setNewApi({ ...newApi, sampleResponse: e.target.value })}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    
                    {newApi.possibleFields && newApi.possibleFields.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label>Available Fields</Label>
                        <ScrollArea className="h-[150px] border rounded-md p-2">
                          <div className="flex flex-wrap gap-2">
                            {newApi.possibleFields.map((field, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="font-mono text-xs cursor-pointer hover:bg-slate-100"
                                onClick={() => {
                                  setMappingValue(field);
                                  setActiveTab("mapping");
                                }}
                              >
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </ScrollArea>
                        <p className="text-xs text-gray-500">
                          Click on a field to use it in response mapping
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="mapping" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Response Data Mapping</Label>
                      <span className="text-xs text-gray-500">Map component properties to API response data</span>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Component Property"
                        value={mappingKey}
                        onChange={(e) => setMappingKey(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="API Response Field"
                        value={mappingValue}
                        onChange={(e) => setMappingValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={handleAddMapping} 
                        disabled={!mappingKey || !mappingValue}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {newApi.possibleFields && newApi.possibleFields.length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md">
                        <Label className="text-xs mb-1">Available Fields (click to use)</Label>
                        <ScrollArea className="h-[100px]">
                          <div className="flex flex-wrap gap-1">
                            {newApi.possibleFields.map((field, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="font-mono text-xs cursor-pointer hover:bg-slate-100"
                                onClick={() => setMappingValue(field)}
                              >
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    
                    {newApi.responseMapping && Object.keys(newApi.responseMapping).length > 0 && (
                      <div className="mt-4 p-2 bg-gray-50 rounded-md text-sm">
                        <Label className="text-xs mb-1">Current Mappings</Label>
                        {Object.entries(newApi.responseMapping).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1">
                            <span className="font-mono">{key} → {value}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newMapping = { ...newApi.responseMapping };
                                delete newMapping[key];
                                setNewApi({ ...newApi, responseMapping: newMapping });
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (newApi.name && newApi.endpoint) {
                        saveApiTemplate({
                          ...newApi,
                          id: selectedApiForEdit || `api-${Date.now()}`,
                          name: newApi.name as string,
                          endpoint: newApi.endpoint as string,
                          method: newApi.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
                          headers: newApi.headers || {},
                          parameters: newApi.parameters || {},
                          responseMapping: newApi.responseMapping || {},
                          sampleResponse: newApi.sampleResponse || "",
                          possibleFields: newApi.possibleFields || []
                        });
                      } else {
                        toast({
                          title: "Missing Information",
                          description: "Please provide at least a name and endpoint to save as template",
                          variant: "destructive"
                        });
                      }
                    }}
                    disabled={!newApi.name || !newApi.endpoint}
                    className="gap-1"
                  >
                    <Save size={14} />
                    Save as Template
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button className="bg-widget-blue" onClick={handleSubmit}>
                      {selectedApiForEdit ? "Update API" : "Add API"}
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {apis.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg">
          <Globe className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-500">No APIs configured yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add API" to create your first API integration</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {apis.map((api) => (
            <Card key={api.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base truncate" title={api.name}>{api.name}</CardTitle>
                  <div className="flex space-x-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                        >
                          <Code size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditApi(api.id)}>
                          Edit API
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => saveApiTemplate(api)}>
                          <Bookmark size={14} className="mr-2" />
                          Save as Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => onRemoveApi(api.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div className="flex">
                    <span className="font-semibold w-20">Method:</span>
                    <span className="font-mono text-widget-blue">{api.method}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Endpoint:</span>
                    <span className="font-mono text-xs truncate" title={api.endpoint}>
                      {api.endpoint}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Headers:</span>
                    <span className="text-xs">{api.headers ? Object.keys(api.headers).length : 0} defined</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Parameters:</span>
                    <span className="text-xs">{api.parameters ? Object.keys(api.parameters).length : 0} defined</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Mapping:</span>
                    <span className="text-xs">{api.responseMapping ? Object.keys(api.responseMapping).length : 0} defined</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Fields:</span>
                    <span className="text-xs">{api.possibleFields ? api.possibleFields.length : 0} available</span>
                  </div>
                </div>
                
                {api.possibleFields && api.possibleFields.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <Label className="text-xs mb-1">Available Fields</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {api.possibleFields.slice(0, 5).map((field, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="font-mono text-xs"
                        >
                          {field}
                        </Badge>
                      ))}
                      {api.possibleFields.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{api.possibleFields.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiManager;
