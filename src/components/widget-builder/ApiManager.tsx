import React, { useState, useEffect } from "react";
import { ApiConfig, extractFieldPaths } from "@/types/widget-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Globe, Code, UploadCloud, Save, Copy, Check, Search, SortAsc, SortDesc, ListFilter, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SearchBar from "./SearchBar";

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
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [expandedRows, setExpandedRows] = useState<{[key: string]: boolean}>({});
  const [openPopovers, setOpenPopovers] = useState<{[key: string]: boolean}>({});
  
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

  const createSampleApi = () => {
    const sampleApi: ApiConfig = {
      id: `api-sample-${Date.now()}`,
      name: "Weather API",
      endpoint: "https://api.weatherapi.com/v1/current.json",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer api-key-goes-here"
      },
      parameters: {
        "q": "London",
        "units": "metric"
      },
      responseMapping: {
        "temperature": "current.temp_c",
        "condition": "current.condition.text",
        "location": "location.name",
        "country": "location.country"
      },
      sampleResponse: JSON.stringify({
        "location": {
          "name": "London",
          "region": "City of London, Greater London",
          "country": "United Kingdom",
          "lat": 51.52,
          "lon": -0.11,
          "localtime": "2023-04-12 15:30"
        },
        "current": {
          "temp_c": 18.0,
          "temp_f": 64.4,
          "condition": {
            "text": "Partly cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
          },
          "wind_mph": 6.9,
          "humidity": 73,
          "cloud": 75,
          "feelslike_c": 18.0,
          "uv": 4.0
        }
      }, null, 2),
      possibleFields: [
        "location.name",
        "location.region",
        "location.country",
        "location.lat",
        "location.lon",
        "location.localtime",
        "current.temp_c",
        "current.temp_f",
        "current.condition.text",
        "current.condition.icon",
        "current.wind_mph",
        "current.humidity",
        "current.cloud",
        "current.feelslike_c",
        "current.uv"
      ]
    };
    
    onAddApi(sampleApi);
    
    toast({
      title: "Sample API Added",
      description: "The sample Weather API has been added to your configuration."
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

  const copyApiToClipboard = (api: ApiConfig) => {
    const apiData = {
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      headers: api.headers,
      parameters: api.parameters,
      responseMapping: api.responseMapping
    };
    
    navigator.clipboard.writeText(JSON.stringify(apiData, null, 2))
      .then(() => {
        setCopyStatus({...copyStatus, [api.id]: true});
        setTimeout(() => {
          setCopyStatus({...copyStatus, [api.id]: false});
        }, 2000);
        
        toast({
          title: "API Copied",
          description: "API configuration copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy API configuration",
          variant: "destructive"
        });
      });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleSort = () => {
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };

  const toggleRowExpand = (apiId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [apiId]: !prev[apiId]
    }));
  };

  const handlePopoverOpenChange = (key: string, open: boolean) => {
    setOpenPopovers(prev => ({
      ...prev,
      [key]: open
    }));
  };

  const filteredAndSortedApis = apis
    .filter(api => 
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.method.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else if (sortDirection === 'desc') {
        return b.name.localeCompare(a.name);
      } else {
        return 0;
      }
    });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 pb-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">APIs</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
              onClick={createSampleApi}
            >
              <Globe size={16} className="inline-flex" />
              <span>Add Sample API</span>
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Plus size={16} className="inline-flex" />
                  <span>Add API</span>
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
        
        <div className="flex gap-2 mb-2">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search APIs..." 
            className="flex-1"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={toggleSort}
                  className="flex items-center justify-center"
                >
                  {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort {sortDirection === 'asc' ? 'A to Z' : 'Z to A'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          {apis.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Globe className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No APIs configured yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add API" to create your first API integration or "Add Sample API" to see an example</p>
            </div>
          ) : filteredAndSortedApis.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Search className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No matching APIs found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAndSortedApis.map((api) => (
                <Card key={api.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{api.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${api.method === 'GET' ? 'border-green-500 bg-green-50 text-green-700' : ''}
                            ${api.method === 'POST' ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}
                            ${api.method === 'PUT' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : ''}
                            ${api.method === 'DELETE' ? 'border-red-500 bg-red-50 text-red-700' : ''}
                          `}
                        >
                          {api.method}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => copyApiToClipboard(api)}
                              >
                                {copyStatus[api.id] ? <Check size={16} /> : <Copy size={16} />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy API configuration</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditApi(api.id)}
                              >
                                <Code size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit API</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => onRemoveApi(api.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove API</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start">
                        <span className="font-semibold w-24 pt-1">Endpoint:</span>
                        <div className="flex items-center">
                          <span className="font-mono text-xs max-w-[400px] break-all" title={api.endpoint}>
                            {api.endpoint}
                          </span>
                          <a 
                            href={api.endpoint} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-semibold w-24">Headers:</span>
                        {api.headers && Object.keys(api.headers).length > 0 ? (
                          <div className="flex items-center">
                            <span className="text-xs mr-2">{Object.keys(api.headers).length}</span>
                            {Object.keys(api.headers).length > 0 && (
                              <Popover
                                open={openPopovers[`headers-${api.id}`]}
                                onOpenChange={(open) => handlePopoverOpenChange(`headers-${api.id}`, open)}
                              >
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    + details
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 max-h-[200px] overflow-y-auto p-2">
                                  <div className="space-y-1 text-xs">
                                    <h4 className="font-semibold mb-2">Headers</h4>
                                    {Object.entries(api.headers).map(([key, value]) => (
                                      <div key={key} className="flex justify-between gap-2 py-1 border-b border-gray-100">
                                        <span className="font-semibold">{key}:</span>
                                        <span className="text-gray-700 truncate max-w-[200px]" title={value.toString()}>
                                          {value.toString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-semibold w-24">Parameters:</span>
                        {api.parameters && Object.keys(api.parameters).length > 0 ? (
                          <div className="flex items-center">
                            <span className="text-xs mr-2">{Object.keys(api.parameters).length}</span>
                            {Object.keys(api.parameters).length > 0 && (
                              <Popover
                                open={openPopovers[`params-${api.id}`]}
                                onOpenChange={(open) => handlePopoverOpenChange(`params-${api.id}`, open)}
                              >
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    + details
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 max-h-[200px] overflow-y-auto p-2">
                                  <div className="space-y-1 text-xs">
                                    <h4 className="font-semibold mb-2">Parameters</h4>
                                    {Object.entries(api.parameters).map(([key, value]) => (
                                      <div key={key} className="flex justify-between gap-2 py-1 border-b border-gray-100">
                                        <span className="font-semibold">{key}:</span>
                                        <span className="text-gray-700 truncate max-w-[200px]" title={value.toString()}>
                                          {value.toString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-semibold w-24">Mappings:</span>
                        {api.responseMapping && Object.keys(api.responseMapping).length > 0 ? (
                          <div className="flex items-center">
                            <span className="text-xs mr-2">{Object.keys(api.responseMapping).length}</span>
                            {Object.keys(api.responseMapping).length > 0 && (
                              <Popover
                                open={openPopovers[`mappings-${api.id}`]}
                                onOpenChange={(open) => handlePopoverOpenChange(`mappings-${api.id}`, open)}
                              >
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    + details
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 max-h-[200px] overflow-y-auto p-2">
                                  <div className="space-y-1 text-xs">
                                    <h4 className="font-semibold mb-2">Response Mappings</h4>
                                    {Object.entries(api.responseMapping).map(([key, value]) => (
                                      <div key={key} className="flex justify-between gap-2 py-1 border-b border-gray-100">
                                        <span className="font-semibold">{key}:</span>
                                        <span className="text-gray-700 font-mono truncate max-w-[200px]" title={value.toString()}>
                                          {value.toString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                      
                      {api.possibleFields && api.possibleFields.length > 0 && (
                        <div className="flex items-start">
                          <span className="font-semibold w-24 pt-1">Fields:</span>
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-1 mt-1">
                              {api.possibleFields.slice(0, 3).map((field, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="font-mono text-xs"
                                >
                                  {field}
                                </Badge>
                              ))}
                              {api.possibleFields.length > 3 && (
                                <Popover
                                  open={openPopovers[`fields-${api.id}`]}
                                  onOpenChange={(open) => handlePopoverOpenChange(`fields-${api.id}`, open)}
                                >
                                  <PopoverTrigger asChild>
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs cursor-pointer text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    >
                                      +{api.possibleFields.length - 3} more
                                    </Badge>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 max-h-[300px] overflow-y-auto p-2">
                                    <div className="space-y-1">
                                      <h4 className="font-semibold mb-2 text-sm">Available Fields</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {api.possibleFields.map((field, index) => (
                                          <Badge 
                                            key={index} 
                                            variant="outline" 
                                            className="font-mono text-xs mb-1"
                                          >
                                            {field}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ApiManager;
