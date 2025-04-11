
import React, { useState } from "react";
import { ApiConfig } from "@/types/widget-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Globe } from "lucide-react";

interface ApiManagerProps {
  apis: ApiConfig[];
  onAddApi: (api: ApiConfig) => void;
  onRemoveApi: (apiId: string) => void;
}

const ApiManager: React.FC<ApiManagerProps> = ({ apis, onAddApi, onRemoveApi }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newApi, setNewApi] = useState<Partial<ApiConfig>>({
    name: "",
    endpoint: "",
    method: "GET",
    headers: {},
    parameters: {}
  });
  
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [paramKey, setParamKey] = useState("");
  const [paramValue, setParamValue] = useState("");

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

  const handleSubmit = () => {
    if (newApi.name && newApi.endpoint && newApi.method) {
      onAddApi({
        id: `api-${Date.now()}`,
        name: newApi.name,
        endpoint: newApi.endpoint,
        method: newApi.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
        headers: newApi.headers,
        parameters: newApi.parameters
      });
      
      setNewApi({
        name: "",
        endpoint: "",
        method: "GET",
        headers: {},
        parameters: {}
      });
      
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700">API Configurations</h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-widget-blue hover:bg-blue-600">
              <Plus size={16} className="mr-1" /> Add API
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New API Integration</DialogTitle>
              <DialogDescription>
                Configure an API endpoint to use with your widget components.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
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
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-widget-blue" onClick={handleSubmit}>
                Add API
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {apis.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg">
          <Globe className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-500">No APIs configured yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add API" to create your first API integration</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apis.map((api) => (
            <Card key={api.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{api.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => onRemoveApi(api.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
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
                    <span className="font-mono text-xs truncate">{api.endpoint}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Headers:</span>
                    <span className="text-xs">{api.headers ? Object.keys(api.headers).length : 0} defined</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Parameters:</span>
                    <span className="text-xs">{api.parameters ? Object.keys(api.parameters).length : 0} defined</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiManager;
