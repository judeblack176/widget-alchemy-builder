import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown, Settings, Trash2, Link } from "lucide-react";

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (component: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (components: WidgetComponent[]) => void;
}

const WidgetBuilder: React.FC<WidgetBuilderProps> = ({
  components,
  apis,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents
}) => {
  const [editingComponent, setEditingComponent] = useState<WidgetComponent | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [selectedApiId, setSelectedApiId] = useState<string>("");
  const [apiDataMapping, setApiDataMapping] = useState<Record<string, string>>({});

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newComponents = [...components];
      [newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]];
      onReorderComponents(newComponents);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < components.length - 1) {
      const newComponents = [...components];
      [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
      onReorderComponents(newComponents);
    }
  };

  const handleOpenSettings = (component: WidgetComponent) => {
    setEditingComponent(component);
    setIsSettingsOpen(true);
  };

  const handleOpenApiConfig = (component: WidgetComponent) => {
    setEditingComponent(component);
    setSelectedApiId(component.apiConfig?.apiId || "");
    setApiDataMapping(component.apiConfig?.dataMapping || {});
    setIsApiConfigOpen(true);
  };

  const handleSaveSettings = () => {
    if (editingComponent) {
      onUpdateComponent(editingComponent);
      setIsSettingsOpen(false);
      setEditingComponent(null);
    }
  };

  const handleSaveApiConfig = () => {
    if (editingComponent) {
      const updatedComponent = {
        ...editingComponent,
        apiConfig: selectedApiId ? {
          apiId: selectedApiId,
          dataMapping: apiDataMapping
        } : undefined
      };
      
      onUpdateComponent(updatedComponent);
      setIsApiConfigOpen(false);
      setEditingComponent(null);
    }
  };

  const handleInputChange = (propName: string, value: any) => {
    if (editingComponent) {
      setEditingComponent({
        ...editingComponent,
        props: {
          ...editingComponent.props,
          [propName]: value
        }
      });
    }
  };

  const renderPropertyEditor = (propName: string, propValue: any, component: WidgetComponent) => {
    if (propName === "actions" && Array.isArray(propValue)) {
      return (
        <Select 
          value={propValue.length > 0 ? propValue.join(",") : "None"}
          onValueChange={(value) => {
            const actions = value === "None" ? [] : 
                           value === "Both" ? ["Edit", "More"] : 
                           [value];
            handleInputChange(propName, actions);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Edit">Edit</SelectItem>
            <SelectItem value="More">More</SelectItem>
            <SelectItem value="Both">Both (Edit & More)</SelectItem>
          </SelectContent>
        </Select>
      );
    } else if (propName === "icon") {
      return (
        <Select 
          value={propValue}
          onValueChange={(value) => handleInputChange(propName, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BookOpen">BookOpen</SelectItem>
            <SelectItem value="Type">Type</SelectItem>
            <SelectItem value="Image">Image</SelectItem>
            <SelectItem value="Video">Video</SelectItem>
            <SelectItem value="FileText">FileText</SelectItem>
            <SelectItem value="BarChart">BarChart</SelectItem>
            <SelectItem value="FormInput">FormInput</SelectItem>
          </SelectContent>
        </Select>
      );
    } else if (propName === "content" || propName === "question") {
      return (
        <Textarea 
          value={propValue} 
          onChange={(e) => handleInputChange(propName, e.target.value)}
          className="min-h-[100px]"
        />
      );
    } else if (propName === "options" && Array.isArray(propValue)) {
      return (
        <Input 
          value={propValue.join(", ")} 
          onChange={(e) => handleInputChange(propName, e.target.value.split(", "))}
        />
      );
    } else if (propName === "data" && Array.isArray(propValue)) {
      return (
        <Input 
          value={propValue.join(", ")} 
          onChange={(e) => {
            const values = e.target.value.split(",").map(v => Number(v.trim()));
            handleInputChange(propName, values);
          }}
        />
      );
    } else if (propName === "labels" && Array.isArray(propValue)) {
      return (
        <Input 
          value={propValue.join(", ")} 
          onChange={(e) => handleInputChange(propName, e.target.value.split(",").map(v => v.trim()))}
        />
      );
    } else if (typeof propValue === "boolean") {
      return (
        <Select
          value={propValue.toString()}
          onValueChange={(value) => handleInputChange(propName, value === "true")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );
    } else if (typeof propValue === "string") {
      return (
        <Input 
          value={propValue} 
          onChange={(e) => handleInputChange(propName, e.target.value)}
        />
      );
    } else if (typeof propValue === "number") {
      return (
        <Input 
          type="number" 
          value={propValue} 
          onChange={(e) => handleInputChange(propName, Number(e.target.value))}
        />
      );
    }
    
    return <Input value={JSON.stringify(propValue)} disabled />;
  };

  return (
    <div className="space-y-3">
      {components.length === 0 ? (
        <div className="border border-dashed rounded-lg p-10 text-center">
          <p className="text-gray-500">Add components from the library</p>
        </div>
      ) : (
        components.map((component, index) => (
          <Card key={component.id} className="p-3 relative">
            <div className="flex justify-between items-center">
              <div className="font-medium">{component.type.charAt(0).toUpperCase() + component.type.slice(1)}</div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleMoveDown(index)}
                  disabled={index === components.length - 1}
                >
                  <ArrowDown size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleOpenSettings(component)}
                >
                  <Settings size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 w-8 p-0 ${component.apiConfig ? 'text-widget-blue' : ''}`}
                  onClick={() => handleOpenApiConfig(component)}
                >
                  <Link size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500" 
                  onClick={() => onRemoveComponent(component.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {component.type === "header" && `Title: ${component.props.title}`}
              {component.type === "text" && `Text: ${component.props.content?.substring(0, 30)}...`}
              {component.type === "button" && `Button: ${component.props.label}`}
              {component.type === "image" && "Image"}
              {component.type === "video" && "Video"}
              {component.type === "chart" && `Chart: ${component.props.type}`}
              {component.type === "form" && `Form: ${component.props.label}`}
              {component.type === "calendar" && `Calendar: ${component.props.label}`}
              {component.type === "dropdown" && `Dropdown: ${component.props.label}`}
              {component.type === "link" && `Link: ${component.props.text}`}
              {component.type === "multi-text" && `Multi-text: ${component.props.label}`}
            </div>
            {component.apiConfig && (
              <div className="mt-1 text-xs bg-blue-50 text-blue-800 p-1 rounded inline-block">
                API: {apis.find(api => api.id === component.apiConfig?.apiId)?.name || 'Unknown API'}
              </div>
            )}
          </Card>
        ))
      )}
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Component Settings</DialogTitle>
          </DialogHeader>
          
          {editingComponent && (
            <div className="py-4">
              <div className="space-y-4">
                {Object.entries(editingComponent.props).map(([propName, propValue]) => (
                  <div key={propName} className="grid gap-2">
                    <Label htmlFor={propName} className="capitalize">
                      {propName.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    {renderPropertyEditor(propName, propValue, editingComponent)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isApiConfigOpen} onOpenChange={setIsApiConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure API Integration</DialogTitle>
          </DialogHeader>
          
          {editingComponent && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-selection">Select API</Label>
                  <Select
                    value={selectedApiId}
                    onValueChange={(value) => setSelectedApiId(value)}
                  >
                    <SelectTrigger id="api-selection">
                      <SelectValue placeholder="Select an API" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {apis.map((api) => (
                        <SelectItem key={api.id} value={api.id}>
                          {api.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedApiId && (
                  <div className="border rounded p-3 space-y-3">
                    <h4 className="font-medium">Data Mapping</h4>
                    <p className="text-sm text-gray-500">
                      Map component properties to API response data
                    </p>
                    
                    {Object.keys(editingComponent.props).map((propName) => (
                      <div key={propName} className="grid grid-cols-2 gap-2 items-center">
                        <div>
                          <Label className="text-sm capitalize">
                            {propName.replace(/([A-Z])/g, ' $1').trim()}:
                          </Label>
                        </div>
                        <Input
                          placeholder="response.data.field"
                          value={apiDataMapping[propName] || ""}
                          onChange={(e) => setApiDataMapping({
                            ...apiDataMapping,
                            [propName]: e.target.value
                          })}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiConfig}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WidgetBuilder;
