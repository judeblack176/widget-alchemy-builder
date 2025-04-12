
import React, { useState, useEffect } from "react";
import { ApiConfig, extractFieldPaths } from "@/types/widget-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  RotateCw, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkPlus,
  Settings,
  Link as LinkIcon
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ApiManagerProps {
  apis: ApiConfig[];
  onAddApi: (api: ApiConfig) => void;
  onRemoveApi: (apiId: string) => void;
  onUpdateApi: (apiId: string, updatedApi: ApiConfig) => void;
}

const generateUniqueId = () => `api-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const DEFAULT_API_CONFIG: ApiConfig = {
  id: "",
  name: "",
  endpoint: "",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  parameters: {},
  bodyData: "",
  sampleResponse: "",
  possibleFields: [],
};

// Sample API templates that users can choose from
const API_TEMPLATES = [
  {
    name: "Weather API",
    endpoint: "https://api.openweathermap.org/data/2.5/weather",
    method: "GET",
    parameters: {
      q: "London",
      appid: "YOUR_API_KEY",
    },
    headers: {
      "Content-Type": "application/json",
    },
    sampleResponse: `{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 291.15,
    "feels_like": 290.07,
    "temp_min": 288.71,
    "temp_max": 292.59,
    "pressure": 1013,
    "humidity": 58
  },
  "visibility": 10000,
  "wind": {
    "speed": 4.63,
    "deg": 270
  },
  "clouds": {
    "all": 0
  },
  "dt": 1619432400,
  "sys": {
    "type": 1,
    "id": 1414,
    "country": "GB",
    "sunrise": 1619411720,
    "sunset": 1619463799
  },
  "timezone": 3600,
  "id": 2643743,
  "name": "London",
  "cod": 200
}`,
  },
  {
    name: "Sample Users API",
    endpoint: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    sampleResponse: `[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },
  {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
      "street": "Victor Plains",
      "suite": "Suite 879",
      "city": "Wisokyburgh",
      "zipcode": "90566-7771",
      "geo": {
        "lat": "-43.9509",
        "lng": "-34.4618"
      }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
      "name": "Deckow-Crist",
      "catchPhrase": "Proactive didactic contingency",
      "bs": "synergize scalable supply-chains"
    }
  }
]`,
  },
  {
    name: "Products API",
    endpoint: "https://dummyjson.com/products",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    sampleResponse: `{
  "products": [
    {
      "id": 1,
      "title": "iPhone 9",
      "description": "An apple mobile which is nothing like apple",
      "price": 549,
      "discountPercentage": 12.96,
      "rating": 4.69,
      "stock": 94,
      "brand": "Apple",
      "category": "smartphones",
      "thumbnail": "https://dummyjson.com/image/i/products/1/thumbnail.jpg",
      "images": [
        "https://dummyjson.com/image/i/products/1/1.jpg",
        "https://dummyjson.com/image/i/products/1/2.jpg",
        "https://dummyjson.com/image/i/products/1/3.jpg",
        "https://dummyjson.com/image/i/products/1/4.jpg",
        "https://dummyjson.com/image/i/products/1/thumbnail.jpg"
      ]
    },
    {
      "id": 2,
      "title": "iPhone X",
      "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip",
      "price": 899,
      "discountPercentage": 17.94,
      "rating": 4.44,
      "stock": 34,
      "brand": "Apple",
      "category": "smartphones",
      "thumbnail": "https://dummyjson.com/image/i/products/2/thumbnail.jpg",
      "images": [
        "https://dummyjson.com/image/i/products/2/1.jpg",
        "https://dummyjson.com/image/i/products/2/2.jpg",
        "https://dummyjson.com/image/i/products/2/3.jpg",
        "https://dummyjson.com/image/i/products/2/thumbnail.jpg"
      ]
    }
  ],
  "total": 100,
  "skip": 0,
  "limit": 2
}`,
  },
];

const ApiManager: React.FC<ApiManagerProps> = ({
  apis,
  onAddApi,
  onRemoveApi,
  onUpdateApi,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApi, setNewApi] = useState<ApiConfig>({ ...DEFAULT_API_CONFIG, id: generateUniqueId() });
  const [editingApiId, setEditingApiId] = useState<string | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [expandedHeaders, setExpandedHeaders] = useState<Record<string, boolean>>({});
  const [expandedParams, setExpandedParams] = useState<Record<string, boolean>>({});
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [paramKey, setParamKey] = useState("");
  const [paramValue, setParamValue] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [isSaveAsTemplateDialogOpen, setIsSaveAsTemplateDialogOpen] = useState(false);
  const [savedApiTemplates, setSavedApiTemplates] = useState<ApiConfig[]>([]);
  const [currentTemplateApi, setCurrentTemplateApi] = useState<ApiConfig | null>(null);
  const { toast } = useToast();
  const [shouldAutoFill, setShouldAutoFill] = useState(true);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResponse, setTestResponse] = useState<{
    status: "success" | "error" | null;
    data: any;
    error?: string;
  }>({ status: null, data: null });
  const [fieldsVisibility, setFieldsVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const templates = localStorage.getItem("savedApiTemplates");
      if (templates) {
        setSavedApiTemplates(JSON.parse(templates));
      }
    } catch (error) {
      console.error("Failed to load saved API templates", error);
    }
  }, []);

  const handleAddClick = () => {
    setNewApi({ ...DEFAULT_API_CONFIG, id: generateUniqueId() });
    setActiveTab("editor");
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (api: ApiConfig) => {
    setEditingApiId(api.id);
    setNewApi({ ...api });
    setActiveTab("editor");
    setIsAddDialogOpen(true);
  };

  const handleSaveApi = () => {
    if (!newApi.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the API.",
        variant: "destructive",
      });
      return;
    }

    if (!newApi.endpoint.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an endpoint URL for the API.",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(newApi.endpoint);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL for the API endpoint.",
        variant: "destructive",
      });
      return;
    }

    if (editingApiId) {
      onUpdateApi(editingApiId, newApi);
      setEditingApiId(null);
      toast({
        title: "API Updated",
        description: `The API "${newApi.name}" has been updated.`,
      });
    } else {
      onAddApi(newApi);
      toast({
        title: "API Added",
        description: `The API "${newApi.name}" has been added to your configuration.`,
      });
    }

    setIsAddDialogOpen(false);
  };

  const handleRemoveApi = (apiId: string) => {
    onRemoveApi(apiId);
  };

  const handleApiInputChange = (field: keyof ApiConfig, value: any) => {
    setNewApi({
      ...newApi,
      [field]: value,
    });
  };

  const handleAddHeader = () => {
    if (!headerKey.trim()) return;

    setNewApi({
      ...newApi,
      headers: {
        ...newApi.headers,
        [headerKey]: headerValue,
      },
    });

    setHeaderKey("");
    setHeaderValue("");
  };

  const handleRemoveHeader = (key: string) => {
    const { [key]: _, ...remainingHeaders } = newApi.headers;
    setNewApi({
      ...newApi,
      headers: remainingHeaders,
    });
  };

  const handleAddParameter = () => {
    if (!paramKey.trim()) return;

    setNewApi({
      ...newApi,
      parameters: {
        ...(newApi.parameters || {}),
        [paramKey]: paramValue,
      },
    });

    setParamKey("");
    setParamValue("");
  };

  const handleRemoveParameter = (key: string) => {
    const { [key]: _, ...remainingParams } = newApi.parameters || {};
    setNewApi({
      ...newApi,
      parameters: remainingParams,
    });
  };

  const handleUseTemplate = (template: ApiConfig) => {
    setNewApi({
      ...template,
      id: newApi.id,
    });
    setIsTemplateDialogOpen(false);

    toast({
      title: "Template Applied",
      description: `The sample ${template.name} has been added to your configuration.`,
    });
  };

  const toggleHeaders = (apiId: string) => {
    setExpandedHeaders({
      ...expandedHeaders,
      [apiId]: !expandedHeaders[apiId],
    });
  };

  const toggleParams = (apiId: string) => {
    setExpandedParams({
      ...expandedParams,
      [apiId]: !expandedParams[apiId],
    });
  };

  const toggleFields = (apiId: string) => {
    setExpandedFields({
      ...expandedFields,
      [apiId]: !expandedFields[apiId],
    });
  };

  const handleToggleFieldsVisibility = (apiId: string) => {
    setFieldsVisibility(prev => ({
      ...prev,
      [apiId]: !prev[apiId]
    }));
  };

  const handleDuplicateApi = (api: ApiConfig) => {
    const duplicatedApi = {
      ...api,
      id: generateUniqueId(),
      name: `${api.name} (Copy)`,
    };
    onAddApi(duplicatedApi);
    toast({
      title: "API Duplicated",
      description: `A copy of "${api.name}" has been created.`,
    });
  };

  const handleSaveAsTemplate = () => {
    if (!currentTemplateApi) return;

    const templateToSave = {
      ...currentTemplateApi,
      id: generateUniqueId(),
    };

    const updatedTemplates = [...savedApiTemplates, templateToSave];
    setSavedApiTemplates(updatedTemplates);
    localStorage.setItem("savedApiTemplates", JSON.stringify(updatedTemplates));

    setIsSaveAsTemplateDialogOpen(false);
    setCurrentTemplateApi(null);

    toast({
      title: "Template Saved",
      description: `"${templateToSave.name}" has been saved as a template for future use.`,
    });
  };

  const handleOpenSaveTemplateDialog = (api: ApiConfig) => {
    setCurrentTemplateApi(api);
    setIsSaveAsTemplateDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = savedApiTemplates.filter(
      (template) => template.id !== templateId
    );
    setSavedApiTemplates(updatedTemplates);
    localStorage.setItem("savedApiTemplates", JSON.stringify(updatedTemplates));

    toast({
      title: "Template Deleted",
      description: "The template has been removed from your saved templates.",
    });
  };

  const extractFieldsFromSampleResponse = (responseText: string) => {
    try {
      const jsonData = JSON.parse(responseText);
      const fields = extractFieldPaths(jsonData);
      return fields;
    } catch (error) {
      console.error("Failed to parse sample response:", error);
      return [];
    }
  };

  const handleSampleResponseChange = (value: string) => {
    if (shouldAutoFill) {
      const fields = extractFieldsFromSampleResponse(value);
      setNewApi({
        ...newApi,
        sampleResponse: value,
        possibleFields: fields,
      });
    } else {
      setNewApi({
        ...newApi,
        sampleResponse: value,
      });
    }
  };

  const handleTestApi = async () => {
    if (!newApi.endpoint) {
      toast({
        title: "Missing Endpoint",
        description: "Please enter an API endpoint to test.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingApi(true);
    setTestResponse({ status: null, data: null });

    try {
      // Prepare the URL with query parameters
      let url = newApi.endpoint;
      
      if (newApi.parameters && Object.keys(newApi.parameters).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(newApi.parameters).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        
        // Check if the URL already has parameters
        url += url.includes('?') ? '&' : '?';
        url += queryParams.toString();
      }
      
      const response = await fetch(url, {
        method: newApi.method,
        headers: newApi.headers,
        body: (newApi.method === 'POST' || newApi.method === 'PUT' || newApi.method === 'PATCH') && newApi.bodyData 
          ? newApi.bodyData 
          : undefined,
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      
      setTestResponse({
        status: "success",
        data,
      });
      
      if (shouldAutoFill) {
        const fields = extractFieldPaths(data);
        setNewApi({
          ...newApi,
          possibleFields: fields,
          sampleResponse: JSON.stringify(data, null, 2),
        });
      }
      
      toast({
        title: "API Test Successful",
        description: "The API request was completed successfully.",
      });
    } catch (error) {
      console.error("API test failed:", error);
      setTestResponse({
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
      
      toast({
        title: "API Test Failed",
        description: error instanceof Error ? error.message : "Failed to test the API",
        variant: "destructive",
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">APIs</h2>
        <Button onClick={handleAddClick} className="flex items-center gap-1">
          <Plus size={16} />
          <span>Add API</span>
        </Button>
      </div>

      {apis.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <Database className="mx-auto text-gray-400 mb-2" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No APIs Added Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Add an API to connect dynamic data to your widget components
          </p>
          <div className="flex flex-col items-center gap-2">
            <Button onClick={handleAddClick} className="flex items-center gap-1">
              <Plus size={16} />
              <span>Add API</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <BookmarkPlus size={16} />
              <span>Use API Template</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {apis.map((api) => (
            <Card key={api.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col space-y-2">
                  <CardTitle className="text-lg flex items-start justify-between">
                    <span className="font-semibold break-all">{api.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {api.method}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDuplicateApi(api)}
                          title="Duplicate API"
                        >
                          <Copy size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditClick(api)}
                          title="Edit API"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveApi(api.id)}
                          title="Delete API"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="font-semibold w-24 pt-1">Endpoint:</span>
                    <div className="flex flex-col">
                      <div className="font-mono text-xs max-w-[400px] break-all" title={api.endpoint}>
                        {api.endpoint}
                      </div>
                      <a 
                        href={api.endpoint} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 mt-1"
                      >
                        <ExternalLink size={12} />
                        <span>Open URL</span>
                      </a>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-8 text-xs font-semibold flex items-center justify-start w-full"
                      onClick={() => toggleHeaders(api.id)}
                    >
                      {expandedHeaders[api.id] ? (
                        <ChevronUp size={16} className="mr-1" />
                      ) : (
                        <ChevronDown size={16} className="mr-1" />
                      )}{" "}
                      Headers ({Object.keys(api.headers || {}).length})
                    </Button>
                    {expandedHeaders[api.id] && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-100">
                        {Object.keys(api.headers || {}).length > 0 ? (
                          <div className="space-y-1">
                            {Object.entries(api.headers || {}).map(([key, value]) => (
                              <div
                                key={key}
                                className="flex items-start text-xs py-1 border-b border-gray-100"
                              >
                                <div className="font-medium w-1/3 truncate">{key}:</div>
                                <div className="w-2/3 break-all">{value}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic">No headers defined</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-8 text-xs font-semibold flex items-center justify-start w-full"
                      onClick={() => toggleParams(api.id)}
                    >
                      {expandedParams[api.id] ? (
                        <ChevronUp size={16} className="mr-1" />
                      ) : (
                        <ChevronDown size={16} className="mr-1" />
                      )}{" "}
                      Parameters ({Object.keys(api.parameters || {}).length})
                    </Button>
                    {expandedParams[api.id] && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-100">
                        {Object.keys(api.parameters || {}).length > 0 ? (
                          <div className="space-y-1">
                            {Object.entries(api.parameters || {}).map(([key, value]) => (
                              <div
                                key={key}
                                className="flex items-start text-xs py-1 border-b border-gray-100"
                              >
                                <div className="font-medium w-1/3 truncate">{key}:</div>
                                <div className="w-2/3 break-all">{value}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic">No parameters defined</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-8 text-xs font-semibold flex items-center justify-start w-full"
                      onClick={() => {
                        toggleFields(api.id);
                        handleToggleFieldsVisibility(api.id);
                      }}
                    >
                      {expandedFields[api.id] ? (
                        <ChevronUp size={16} className="mr-1" />
                      ) : (
                        <ChevronDown size={16} className="mr-1" />
                      )}{" "}
                      Fields ({api.possibleFields?.length || 0})
                    </Button>
                    {expandedFields[api.id] && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-100">
                        {api.possibleFields && api.possibleFields.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {api.possibleFields.map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic">No fields detected</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleOpenSaveTemplateDialog(api)}
                    >
                      <Bookmark size={14} className="mr-1" />
                      Save as Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {editingApiId ? "Edit API Configuration" : "Add New API"}
            </DialogTitle>
            <DialogDescription>
              Configure the API endpoint and parameters for your widget.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="editor" className="flex-1">
                API Editor
              </TabsTrigger>
              <TabsTrigger value="test" className="flex-1">
                Test API
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-name" className="text-right">
                      API Name
                    </Label>
                    <Input
                      id="api-name"
                      value={newApi.name}
                      onChange={(e) => handleApiInputChange("name", e.target.value)}
                      placeholder="My API Service"
                    />
                  </div>

                  <div>
                    <Label htmlFor="api-endpoint" className="text-right">
                      API Endpoint URL
                    </Label>
                    <Input
                      id="api-endpoint"
                      value={newApi.endpoint}
                      onChange={(e) => handleApiInputChange("endpoint", e.target.value)}
                      placeholder="https://api.example.com/data"
                    />
                  </div>

                  <div>
                    <Label htmlFor="api-method" className="text-right">
                      HTTP Method
                    </Label>
                    <Select
                      value={newApi.method}
                      onValueChange={(value) => handleApiInputChange("method", value)}
                    >
                      <SelectTrigger id="api-method">
                        <SelectValue placeholder="Select HTTP method" />
                      </SelectTrigger>
                      <SelectContent>
                        {HTTP_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(newApi.method === "POST" || newApi.method === "PUT" || newApi.method === "PATCH") && (
                    <div>
                      <Label htmlFor="api-body" className="text-right">
                        Request Body
                      </Label>
                      <Textarea
                        id="api-body"
                        value={newApi.bodyData || ""}
                        onChange={(e) => handleApiInputChange("bodyData", e.target.value)}
                        placeholder='{"key": "value"}'
                        className="font-mono text-sm"
                        rows={4}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Accordion type="single" collapsible defaultValue="headers">
                    <AccordionItem value="headers">
                      <AccordionTrigger>Headers</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                            <div>
                              <Label htmlFor="header-key" className="text-sm">
                                Key
                              </Label>
                              <Input
                                id="header-key"
                                value={headerKey}
                                onChange={(e) => setHeaderKey(e.target.value)}
                                placeholder="Content-Type"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="header-value" className="text-sm">
                                Value
                              </Label>
                              <Input
                                id="header-value"
                                value={headerValue}
                                onChange={(e) => setHeaderValue(e.target.value)}
                                placeholder="application/json"
                                className="text-sm"
                              />
                            </div>
                            <Button type="button" size="sm" onClick={handleAddHeader}>
                              Add
                            </Button>
                          </div>

                          <div className="border rounded divide-y max-h-[150px] overflow-auto">
                            {Object.keys(newApi.headers || {}).length > 0 ? (
                              Object.entries(newApi.headers || {}).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between px-3 py-2 text-sm"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="font-medium">{key}:</div>
                                    <div className="text-gray-600">{value}</div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveHeader(key)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-sm text-gray-500 text-center">
                                No headers added
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="parameters">
                      <AccordionTrigger>Query Parameters</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                            <div>
                              <Label htmlFor="param-key" className="text-sm">
                                Key
                              </Label>
                              <Input
                                id="param-key"
                                value={paramKey}
                                onChange={(e) => setParamKey(e.target.value)}
                                placeholder="apiKey"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="param-value" className="text-sm">
                                Value
                              </Label>
                              <Input
                                id="param-value"
                                value={paramValue}
                                onChange={(e) => setParamValue(e.target.value)}
                                placeholder="your-api-key"
                                className="text-sm"
                              />
                            </div>
                            <Button type="button" size="sm" onClick={handleAddParameter}>
                              Add
                            </Button>
                          </div>

                          <div className="border rounded divide-y max-h-[150px] overflow-auto">
                            {Object.keys(newApi.parameters || {}).length > 0 ? (
                              Object.entries(newApi.parameters || {}).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between px-3 py-2 text-sm"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="font-medium">{key}:</div>
                                    <div className="text-gray-600">{value}</div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveParameter(key)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-sm text-gray-500 text-center">
                                No parameters added
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sample-response" className="text-right">
                        Sample Response
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="auto-extract" className="text-xs order-2">
                          Auto-extract fields
                        </Label>
                        <Switch
                          id="auto-extract"
                          checked={shouldAutoFill}
                          onCheckedChange={setShouldAutoFill}
                        />
                      </div>
                    </div>
                    <Textarea
                      id="sample-response"
                      value={newApi.sampleResponse || ""}
                      onChange={(e) => handleSampleResponseChange(e.target.value)}
                      placeholder='{
  "data": {
    "id": 1,
    "name": "Sample",
    "properties": {
      "color": "blue"
    }
  }
}'
                      className="font-mono text-sm h-[200px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <h3 className="text-sm font-medium mb-2">API Configuration Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                      <span className="font-medium">Endpoint:</span>
                      <span className="font-mono text-xs break-all">{newApi.endpoint}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                      <span className="font-medium">Method:</span>
                      <span className="font-mono">{newApi.method}</span>
                    </div>
                    {Object.keys(newApi.parameters || {}).length > 0 && (
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="font-medium">Parameters:</span>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(newApi.parameters || {}).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs px-1 py-0">
                              {key}={value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button 
                    onClick={handleTestApi} 
                    disabled={isTestingApi} 
                    className="flex items-center gap-1"
                  >
                    {isTestingApi ? (
                      <>
                        <RotateCw size={16} className="animate-spin" />
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        <span>Test API</span>
                      </>
                    )}
                  </Button>
                  
                  {testResponse.status && (
                    <div className="flex items-center">
                      {testResponse.status === "success" ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm">Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle size={16} className="mr-1" />
                          <span className="text-sm">Error</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                    <h3 className="font-medium text-sm">Response</h3>
                    {testResponse.status === "success" && shouldAutoFill && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Fields Auto-Extracted
                      </Badge>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-auto">
                    {testResponse.status === null ? (
                      <div className="p-4 text-center text-gray-500">
                        Click "Test API" to see results here
                      </div>
                    ) : testResponse.status === "error" ? (
                      <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={16} className="mt-1" />
                          <div>
                            <h3 className="font-medium">Error Testing API</h3>
                            <p className="text-sm mt-1">{testResponse.error}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                        {JSON.stringify(testResponse.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-3">Sample API Templates</h3>
                  <ScrollArea className="h-[300px] border rounded-md p-2">
                    <div className="space-y-2">
                      {API_TEMPLATES.map((template, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <h4 className="font-medium text-blue-600">{template.name}</h4>
                          <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                            <Badge variant="outline" className="px-1 py-0">
                              {template.method}
                            </Badge>
                            <span className="truncate">{template.endpoint}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Your Saved Templates</h3>
                  {savedApiTemplates.length > 0 ? (
                    <ScrollArea className="h-[300px] border rounded-md p-2">
                      <div className="space-y-2">
                        {savedApiTemplates.map((template) => (
                          <div
                            key={template.id}
                            className="border rounded-md p-3 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{template.name}</h4>
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUseTemplate(template);
                                  }}
                                  title="Use Template"
                                >
                                  <Settings size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500 hover:text-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTemplate(template.id);
                                  }}
                                  title="Delete Template"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                              <Badge variant="outline" className="px-1 py-0">
                                {template.method}
                              </Badge>
                              <span className="truncate">{template.endpoint}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="border rounded-md h-[300px] flex items-center justify-center">
                      <div className="text-center p-4">
                        <Bookmark className="mx-auto text-gray-400 mb-2" size={24} />
                        <h4 className="text-gray-600 font-medium">No saved templates</h4>
                        <p className="text-gray-500 text-sm mt-1">
                          Save APIs as templates for reuse
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveApi}>
              {editingApiId ? "Update API" : "Add API"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use API Template</DialogTitle>
            <DialogDescription>
              Select a pre-configured API template to get started quickly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {API_TEMPLATES.map((template, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:border-blue-200 transition-colors"
                onClick={() => {
                  setNewApi({
                    ...template,
                    id: generateUniqueId(),
                  });
                  setIsTemplateDialogOpen(false);
                  setIsAddDialogOpen(true);
                  
                  toast({
                    title: "Template Selected",
                    description: `The ${template.name} template has been loaded into the editor.`,
                  });
                }}
              >
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Method:</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {template.method}
                      </Badge>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="font-medium">URL:</span>
                      <span className="text-xs break-all">{template.endpoint}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSaveAsTemplateDialogOpen}
        onOpenChange={setIsSaveAsTemplateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              This API configuration will be saved as a template for future use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {currentTemplateApi && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={currentTemplateApi.name}
                    onChange={(e) =>
                      setCurrentTemplateApi({
                        ...currentTemplateApi,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Endpoint:</span>
                      <span className="text-xs truncate">{currentTemplateApi.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Method:</span>
                      <Badge variant="outline" className="text-xs">{currentTemplateApi.method}</Badge>
                    </div>
                    {Object.keys(currentTemplateApi.headers || {}).length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Headers:</span>
                        <span className="text-xs">{Object.keys(currentTemplateApi.headers || {}).length} defined</span>
                      </div>
                    )}
                    {Object.keys(currentTemplateApi.parameters || {}).length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Parameters:</span>
                        <span className="text-xs">{Object.keys(currentTemplateApi.parameters || {}).length} defined</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveAsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAsTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiManager;
