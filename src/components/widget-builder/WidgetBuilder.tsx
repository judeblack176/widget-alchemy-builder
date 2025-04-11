
import React, { useState } from "react";
import { WidgetComponent, ApiConfig, CalendarServiceType, ICSConfig, PREDEFINED_COLORS, FontFamily, COLOR_PALETTE } from "@/types/widget-types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown, Settings, Trash2, Link, Calendar, RefreshCw, Palette, Bold, Italic } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface WidgetBuilderProps {
  components: WidgetComponent[];
  apis: ApiConfig[];
  onUpdateComponent: (component: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onReorderComponents: (components: WidgetComponent[]) => void;
  onRequestApiTemplate?: (componentId: string) => void;
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
  const [isCalendarConfigOpen, setIsCalendarConfigOpen] = useState(false);
  const [isIcsConfigOpen, setIsIcsConfigOpen] = useState(false); 
  const [selectedApiId, setSelectedApiId] = useState<string>("");
  const [apiDataMapping, setApiDataMapping] = useState<Record<string, string>>({});
  const [calendarServiceType, setCalendarServiceType] = useState<CalendarServiceType | 'none'>('none');
  const [icsConfig, setIcsConfig] = useState<ICSConfig>({
    enabled: false,
    importEnabled: false,
    exportEnabled: false,
    allowSubscribe: false,
    icsUrl: '',
    syncInterval: 'daily'
  });
  const [activeColorGroup, setActiveColorGroup] = useState<string>("neutrals");
  const [selectedProperty, setSelectedProperty] = useState<string>("");

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

  const handleOpenCalendarConfig = (component: WidgetComponent) => {
    if (component.type === 'calendar') {
      setEditingComponent(component);
      setCalendarServiceType(component.props.calendarIntegration?.serviceType || 'none');
      setIsCalendarConfigOpen(true);
    }
  };

  const handleOpenIcsConfig = (component: WidgetComponent) => {
    if (component.type === 'calendar') {
      setEditingComponent(component);
      setIcsConfig(component.props.icsConfig || {
        enabled: false,
        importEnabled: false,
        exportEnabled: false,
        allowSubscribe: false,
        icsUrl: '',
        syncInterval: 'daily'
      });
      setIsIcsConfigOpen(true);
    }
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

  const handleSaveCalendarConfig = () => {
    if (editingComponent && editingComponent.type === 'calendar') {
      const updatedComponent = {
        ...editingComponent,
        props: {
          ...editingComponent.props,
          calendarIntegration: {
            serviceType: calendarServiceType,
            syncEnabled: calendarServiceType !== 'none'
          }
        }
      };
      
      onUpdateComponent(updatedComponent);
      setIsCalendarConfigOpen(false);
      setEditingComponent(null);
    }
  };

  const handleSaveIcsConfig = () => {
    if (editingComponent && editingComponent.type === 'calendar') {
      const updatedComponent = {
        ...editingComponent,
        props: {
          ...editingComponent.props,
          icsConfig: icsConfig
        }
      };
      
      onUpdateComponent(updatedComponent);
      setIsIcsConfigOpen(false);
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

  const toggleBold = () => {
    if (editingComponent) {
      handleInputChange('bold', !editingComponent.props.bold);
    }
  };

  const toggleItalic = () => {
    if (editingComponent) {
      handleInputChange('italic', !editingComponent.props.italic);
    }
  };

  const renderPropertyEditor = (propName: string, propValue: any, component: WidgetComponent) => {
    if ((propName === "color" || propName === "backgroundColor" || propName === "textColor" || 
        propName === "borderColor" || propName.includes("Color")) && 
        typeof propValue === "string" && 
        (propValue.startsWith("#") || propValue === "transparent")) {
      return (
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-8 h-8 p-0 border-2" 
                style={{ backgroundColor: propValue }}
              >
                <span className="sr-only">Pick a color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <Tabs defaultValue="palette" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="palette" className="flex-1">Color Palette</TabsTrigger>
                  <TabsTrigger value="custom" className="flex-1">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="palette" className="space-y-3">
                  <div className="flex space-x-2 overflow-x-auto pb-2 mt-2">
                    <Button 
                      variant={activeColorGroup === "neutrals" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("neutrals")}
                      className="whitespace-nowrap"
                    >
                      Neutrals
                    </Button>
                    <Button 
                      variant={activeColorGroup === "reds" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("reds")}
                      className="whitespace-nowrap"
                    >
                      Reds
                    </Button>
                    <Button 
                      variant={activeColorGroup === "oranges" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("oranges")}
                      className="whitespace-nowrap"
                    >
                      Oranges
                    </Button>
                    <Button 
                      variant={activeColorGroup === "yellows" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("yellows")}
                      className="whitespace-nowrap"
                    >
                      Yellows
                    </Button>
                    <Button 
                      variant={activeColorGroup === "greens" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("greens")}
                      className="whitespace-nowrap"
                    >
                      Greens
                    </Button>
                    <Button 
                      variant={activeColorGroup === "blues" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("blues")}
                      className="whitespace-nowrap"
                    >
                      Blues
                    </Button>
                    <Button 
                      variant={activeColorGroup === "purples" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("purples")}
                      className="whitespace-nowrap"
                    >
                      Purples
                    </Button>
                    <Button 
                      variant={activeColorGroup === "pinks" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveColorGroup("pinks")}
                      className="whitespace-nowrap"
                    >
                      Pinks
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-2">
                    {COLOR_PALETTE[activeColorGroup as keyof typeof COLOR_PALETTE].map(color => (
                      <Button
                        key={color}
                        variant="outline"
                        className="w-8 h-8 rounded-md p-0"
                        style={{ 
                          backgroundColor: color, 
                          border: color === propValue ? "2px solid black" : "1px solid #e2e8f0",
                          boxShadow: color === propValue ? "0 0 0 2px rgba(0,0,0,0.1)" : "none"
                        }}
                        onClick={() => handleInputChange(propName, color)}
                      >
                        <span className="sr-only">{color}</span>
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      className="w-8 h-8 rounded-md p-0 bg-transparent"
                      style={{ 
                        backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%, #ccc)",
                        backgroundSize: "6px 6px",
                        backgroundPosition: "0 0, 3px 3px",
                        border: "transparent" === propValue ? "2px solid black" : "1px solid #e2e8f0",
                      }}
                      onClick={() => handleInputChange(propName, "transparent")}
                    >
                      <span className="sr-only">Transparent</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom">
                  <div className="space-y-2">
                    <div className="flex items-center mt-3">
                      <Label htmlFor={`custom-${propName}`} className="mr-2 text-xs">Custom:</Label>
                      <Input
                        id={`custom-${propName}`}
                        value={propValue}
                        onChange={(e) => handleInputChange(propName, e.target.value)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {PREDEFINED_COLORS.slice(0, 10).map(color => (
                        <Button
                          key={color}
                          variant="outline"
                          className="w-8 h-8 rounded-md p-0"
                          style={{ 
                            backgroundColor: color, 
                            border: color === propValue ? "2px solid black" : "1px solid #e2e8f0",
                          }}
                          onClick={() => handleInputChange(propName, color)}
                        >
                          <span className="sr-only">{color}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
          <Input 
            type="text"
            value={propValue}
            onChange={(e) => handleInputChange(propName, e.target.value)}
            className="flex-1"
          />
        </div>
      );
    }
    
    if (propName === "fontFamily") {
      return (
        <Select
          value={propValue}
          onValueChange={(value: FontFamily) => handleInputChange(propName, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Tahoma">Tahoma</SelectItem>
            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
            <SelectItem value="Impact">Impact</SelectItem>
            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Open Sans">Open Sans</SelectItem>
            <SelectItem value="Lato">Lato</SelectItem>
            <SelectItem value="Montserrat">Montserrat</SelectItem>
            <SelectItem value="Poppins">Poppins</SelectItem>
            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
            <SelectItem value="Merriweather">Merriweather</SelectItem>
            <SelectItem value="system-ui">System Default</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    if (propName === "bold" || propName === "italic") {
      return (
        <Select
          value={propValue.toString()}
          onValueChange={(value) => handleInputChange(propName, value === "true")}
        >
          <SelectTrigger>
            <SelectValue placeholder={propName === "bold" ? "Bold" : "Italic"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );
    }

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
    } else if (propName === "colors" && Array.isArray(propValue)) {
      return (
        <Input 
          value={propValue.join(", ")} 
          onChange={(e) => handleInputChange(propName, e.target.value.split(","))}
        />
      );
    } else if (propName === "calendarIntegration.serviceType") {
      return (
        <Select
          value={component.props.calendarIntegration?.serviceType || 'none'}
          onValueChange={(value) => {
            const calendarIntegration = {
              ...(component.props.calendarIntegration || {}),
              serviceType: value as CalendarServiceType | 'none',
              syncEnabled: value !== 'none'
            };
            handleInputChange('calendarIntegration', calendarIntegration);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select calendar service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="google">Google Calendar</SelectItem>
            <SelectItem value="outlook">Outlook Calendar</SelectItem>
            <SelectItem value="apple">Apple Calendar</SelectItem>
            <SelectItem value="custom">Custom Calendar</SelectItem>
          </SelectContent>
        </Select>
      );
    } else if (propName === "allowExternalSync" && typeof propValue === "boolean") {
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
  
  const getSelectedApiFields = () => {
    if (!selectedApiId) return [];
    
    const api = apis.find(api => api.id === selectedApiId);
    return api?.possibleFields || [];
  };
  
  const handleSelectField = (field: string) => {
    if (selectedProperty) {
      setApiDataMapping({
        ...apiDataMapping,
        [selectedProperty]: field
      });
      setSelectedProperty("");
    }
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
                {component.type === 'calendar' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 ${component.props.calendarIntegration?.serviceType !== 'none' ? 'text-green-500' : ''}`}
                      onClick={() => handleOpenCalendarConfig(component)}
                    >
                      <Calendar size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 ${component.props.icsConfig?.enabled ? 'text-orange-500' : ''}`}
                      onClick={() => handleOpenIcsConfig(component)}
                    >
                      <RefreshCw size={16} />
                    </Button>
                  </>
                )}
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
              {component.type === "calendar" && (
                <>
                  {`Calendar: ${component.props.label}`}
                  {component.props.calendarIntegration?.serviceType && component.props.calendarIntegration?.serviceType !== 'none' && (
                    <span className="ml-2 text-xs bg-green-50 text-green-800 p-1 rounded inline-block capitalize">
                      {component.props.calendarIntegration.serviceType}
                    </span>
                  )}
                  {component.props.icsConfig?.enabled && (
                    <span className="ml-2 text-xs bg-orange-50 text-orange-800 p-1 rounded inline-block">
                      ICS
                    </span>
                  )}
                </>
              )}
              {component.type === "dropdown" && `Dropdown: ${component.props.label}`}
              {component.type === "link" && `Link: ${component.props.text}`}
              {component.type === "multi-text" && `Multi-text: ${component.props.label}`}
              {component.type === "alert" && `Alert: ${component.props.title || "Alert"}`}
              {component.type === "filter" && `Filter: ${component.props.label || "Filter"}`}
              {component.type === "table" && `Table: ${component.props.title || "Table"}`}
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
            <DialogDescription>
              Customize the appearance and behavior of the component
            </DialogDescription>
          </DialogHeader>
          
          {editingComponent && (
            <div className="py-4">
              {(editingComponent.type === "text" || editingComponent.type === "header") && (
                <div className="mb-4 flex space-x-2">
                  <Button 
                    variant={editingComponent.props.bold ? "default" : "outline"} 
                    size="sm" 
                    onClick={toggleBold}
                    className="w-10"
                  >
                    <Bold size={16} />
                  </Button>
                  <Button 
                    variant={editingComponent.props.italic ? "default" : "outline"} 
                    size="sm" 
                    onClick={toggleItalic}
                    className="w-10"
                  >
                    <Italic size={16} />
                  </Button>
                  <Select
                    value={editingComponent.props.fontFamily}
                    onValueChange={(value: FontFamily) => handleInputChange('fontFamily', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Font Family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Tahoma">Tahoma</SelectItem>
                      <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                      <SelectItem value="Impact">Impact</SelectItem>
                      <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Merriweather">Merriweather</SelectItem>
                      <SelectItem value="system-ui">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {editingComponent.type === "header" && (
                <div className="mb-4 space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor="header-background">Background Color</Label>
                    {renderPropertyEditor("backgroundColor", editingComponent.props.backgroundColor, editingComponent)}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="header-text-color">Text Color</Label>
                    {renderPropertyEditor("textColor", editingComponent.props.textColor, editingComponent)}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {Object.entries(editingComponent.props).map(([propName, propValue]) => {
                  if (typeof propValue === 'object' && propValue !== null && !Array.isArray(propValue)) {
                    return null;
                  }
                  
                  if (propName === 'bold' || propName === 'italic' || propName === 'fontFamily' ||
                      (editingComponent.type === 'header' && (propName === 'backgroundColor' || propName === 'textColor'))) {
                    return null;
                  }
                  
                  return (
                    <div key={propName} className="grid gap-2">
                      <Label htmlFor={propName} className="capitalize">
                        {propName.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      {renderPropertyEditor(propName, propValue, editingComponent)}
                    </div>
                  );
                })}
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
        <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Configure API Integration</DialogTitle>
            <DialogDescription>
              Connect this component to an API to display dynamic data
            </DialogDescription>
          </DialogHeader>
          
          {editingComponent && (
            <div className="py-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-selection">Select API</Label>
                  <Select
                    value={selectedApiId}
                    onValueChange={(value) => {
                      setSelectedApiId(value);
                      // Reset data mapping when changing APIs
                      if (value !== selectedApiId) {
                        setApiDataMapping(editingComponent.apiConfig?.dataMapping || {});
                      }
                    }}
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
                    <div className="flex justify-between">
                      <h4 className="font-medium">Data Mapping</h4>
                      <span className="text-xs text-gray-500">Map component properties to API data</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium">Component Properties</h5>
                        
                        {editingComponent.type === 'alert' && (
                          <>
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <div>
                                <Label className="text-sm">Title:</Label>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="response.title"
                                  value={apiDataMapping['title'] || ""}
                                  onChange={(e) => setApiDataMapping({
                                    ...apiDataMapping,
                                    'title': e.target.value
                                  })}
                                  className="flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedProperty('title')}
                                  className="whitespace-nowrap"
                                >
                                  Select Field
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <div>
                                <Label className="text-sm">Message:</Label>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="response.message"
                                  value={apiDataMapping['message'] || ""}
                                  onChange={(e) => setApiDataMapping({
                                    ...apiDataMapping,
                                    'message': e.target.value
                                  })}
                                  className="flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedProperty('message')}
                                  className="whitespace-nowrap"
                                >
                                  Select Field
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {editingComponent.type === 'text' && (
                          <div className="grid grid-cols-2 gap-2 items-center">
                            <div>
                              <Label className="text-sm">Content:</Label>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="response.text"
                                value={apiDataMapping['content'] || ""}
                                onChange={(e) => setApiDataMapping({
                                  ...apiDataMapping,
                                  'content': e.target.value
                                })}
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedProperty('content')}
                                className="whitespace-nowrap"
                              >
                                Select Field
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {editingComponent.type === 'header' && (
                          <div className="grid grid-cols-2 gap-2 items-center">
                            <div>
                              <Label className="text-sm">Title:</Label>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="response.title"
                                value={apiDataMapping['title'] || ""}
                                onChange={(e) => setApiDataMapping({
                                  ...apiDataMapping,
                                  'title': e.target.value
                                })}
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedProperty('title')}
                                className="whitespace-nowrap"
                              >
                                Select Field
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {editingComponent.type === 'chart' && (
                          <>
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <div>
                                <Label className="text-sm">Data:</Label>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="response.data"
                                  value={apiDataMapping['data'] || ""}
                                  onChange={(e) => setApiDataMapping({
                                    ...apiDataMapping,
                                    'data': e.target.value
                                  })}
                                  className="flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedProperty('data')}
                                  className="whitespace-nowrap"
                                >
                                  Select Field
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <div>
                                <Label className="text-sm">Labels:</Label>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="response.labels"
                                  value={apiDataMapping['labels'] || ""}
                                  onChange={(e) => setApiDataMapping({
                                    ...apiDataMapping,
                                    'labels': e.target.value
                                  })}
                                  className="flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedProperty('labels')}
                                  className="whitespace-nowrap"
                                >
                                  Select Field
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {editingComponent.type === 'table' && (
                          <div className="grid grid-cols-2 gap-2 items-center">
                            <div>
                              <Label className="text-sm">Data:</Label>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="response.data"
                                value={apiDataMapping['data'] || ""}
                                onChange={(e) => setApiDataMapping({
                                  ...apiDataMapping,
                                  'data': e.target.value
                                })}
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedProperty('data')}
                                className="whitespace-nowrap"
                              >
                                Select Field
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium">API Fields</h5>
                        <ScrollArea className="border rounded h-48 p-2">
                          {getSelectedApiFields().length > 0 ? (
                            <div className="space-y-2">
                              {getSelectedApiFields().map((field) => (
                                <div key={field} className="flex items-center justify-between">
                                  <HoverCard>
                                    <HoverCardTrigger asChild>
                                      <span className="text-xs cursor-help text-blue-600 hover:text-blue-800 truncate max-w-[150px] inline-block">
                                        {field}
                                      </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-auto">
                                      <code className="text-xs">{field}</code>
                                    </HoverCardContent>
                                  </HoverCard>
                                  
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 text-xs"
                                    onClick={() => handleSelectField(field)}
                                    disabled={!selectedProperty}
                                  >
                                    Use
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-gray-500 text-xs">No fields available</p>
                            </div>
                          )}
                        </ScrollArea>
                        <div className="text-xs text-gray-500">
                          {selectedProperty ? (
                            <span className="font-medium text-blue-600">
                              Select a field for: <code>{selectedProperty}</code>
                            </span>
                          ) : (
                            "Click 'Select Field' next to a property first"
                          )}
                        </div>
                      </div>
                    </div>
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
              Save API Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCalendarConfigOpen} onOpenChange={setIsCalendarConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure Calendar Integration</DialogTitle>
            <DialogDescription>
              Connect this calendar to external calendar services
            </DialogDescription>
          </DialogHeader>
          
          {editingComponent && editingComponent.type === 'calendar' && (
            <div className="py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="calendar-service">Calendar Service</Label>
                  <Select
                    value={calendarServiceType}
                    onValueChange={(value: CalendarServiceType | 'none') => setCalendarServiceType(value)}
                  >
                    <SelectTrigger id="calendar-service">
                      <SelectValue placeholder="Select calendar service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="google">Google Calendar</SelectItem>
                      <SelectItem value="outlook">Outlook Calendar</SelectItem>
                      <SelectItem value="apple">Apple Calendar</SelectItem>
                      <SelectItem value="custom">Custom Calendar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {calendarServiceType !== 'none' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">Calendar sync will be enabled</span>
                    </div>
                    
                    <div className="border rounded p-3 text-sm text-gray-500">
                      <p>
                        {calendarServiceType === 'google' && "Google Calendar integration will allow users to sync events with their Google Calendar."}
                        {calendarServiceType === 'outlook' && "Outlook Calendar integration will allow users to sync events with their Outlook Calendar."}
                        {calendarServiceType === 'apple' && "Apple Calendar integration will allow users to sync events with their Apple Calendar."}
                        {calendarServiceType === 'custom' && "Custom Calendar integration will allow users to sync events with a custom calendar service."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalendarConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCalendarConfig}>
              Save Calendar Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isIcsConfigOpen} onOpenChange={setIsIcsConfigOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure ICS Integration</DialogTitle>
            <DialogDescription>
              Set up ICS file imports and exports for calendar events
            </DialogDescription>
          </DialogHeader>
          
          {editingComponent && editingComponent.type === 'calendar' && (
            <div className="py-4">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable-ics"
                    checked={icsConfig.enabled}
                    onChange={(e) => setIcsConfig({...icsConfig, enabled: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="enable-ics">Enable ICS Integration</Label>
                </div>
                
                {icsConfig.enabled && (
                  <>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="enable-import-ics"
                          checked={icsConfig.importEnabled}
                          onChange={(e) => setIcsConfig({...icsConfig, importEnabled: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="enable-import-ics">Allow ICS Import</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="enable-export-ics"
                          checked={icsConfig.exportEnabled}
                          onChange={(e) => setIcsConfig({...icsConfig, exportEnabled: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="enable-export-ics">Allow ICS Export</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allow-subscribe"
                          checked={icsConfig.allowSubscribe}
                          onChange={(e) => setIcsConfig({...icsConfig, allowSubscribe: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="allow-subscribe">Allow Calendar Subscription</Label>
                      </div>
                    </div>
                    
                    {icsConfig.allowSubscribe && (
                      <div className="grid gap-2">
                        <Label htmlFor="ics-url">ICS URL</Label>
                        <Input
                          id="ics-url"
                          placeholder="https://example.com/calendar.ics"
                          value={icsConfig.icsUrl}
                          onChange={(e) => setIcsConfig({...icsConfig, icsUrl: e.target.value})}
                        />
                      </div>
                    )}
                    
                    <div className="grid gap-2">
                      <Label htmlFor="sync-interval">Sync Interval</Label>
                      <Select
                        value={icsConfig.syncInterval}
                        onValueChange={(value) => setIcsConfig({...icsConfig, syncInterval: value as 'hourly' | 'daily' | 'weekly'})}
                      >
                        <SelectTrigger id="sync-interval">
                          <SelectValue placeholder="Select sync interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIcsConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIcsConfig}>
              Save ICS Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WidgetBuilder;
