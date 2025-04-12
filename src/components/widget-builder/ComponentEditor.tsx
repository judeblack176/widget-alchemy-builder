import React, { useState } from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ColorPalettePicker from "./ColorPalettePicker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Settings, 
  HelpCircle, 
  BookOpen, 
  Type, 
  Image, 
  Video, 
  BarChart, 
  MousePointer, 
  FormInput, 
  CalendarDays, 
  List, 
  LinkIcon, 
  Text,
  Filter,
  AlertTriangle,
  Table2,
  Search,
  Library,
  Bookmark,
  User,
  Info,
  Coffee,
  Bell,
  FileText,
  Globe,
  Home,
  Mail,
  Map,
  Phone,
  ShoppingBag,
  Star,
  X,
  Tag,
  ChevronDown,
  ChevronUp,
  Code,
  Database,
  Plus,
  Trash2
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Tooltip as CustomTooltip } from "./TooltipManager";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ComponentEditorProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
  disableRemove?: boolean;
  customTooltips?: CustomTooltip[];
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  apis,
  isExpanded,
  onToggleExpand,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip,
  disableRemove = false,
  customTooltips = []
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<Record<string, string[]>>({});
  const [newFieldLabel, setNewFieldLabel] = useState<string>("");
  const [newFieldApiField, setNewFieldApiField] = useState<string>("");

  const handlePropertyChange = (propertyName: string, value: any) => {
    const updatedComponent = {
      ...component,
      props: {
        ...component.props,
        [propertyName]: value,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  const handleApiSelection = (apiId: string) => {
    const updatedComponent = {
      ...component,
      apiConfig: {
        apiId,
        dataMapping: component.apiConfig?.dataMapping || {},
        multiMapping: component.apiConfig?.multiMapping || {}
      }
    };
    onUpdateComponent(updatedComponent);
  };

  const handleDataMappingChange = (propKey: string, apiField: string) => {
    const updatedComponent = {
      ...component,
      apiConfig: {
        ...component.apiConfig!,
        dataMapping: {
          ...component.apiConfig?.dataMapping,
          [propKey]: apiField
        }
      }
    };
    onUpdateComponent(updatedComponent);
  };

  const handleMultiMappingChange = (propKey: string, apiField: string, isChecked: boolean) => {
    const currentFields = component.apiConfig?.multiMapping?.[propKey] || [];
    
    let updatedFields;
    if (isChecked) {
      updatedFields = [...currentFields, apiField];
    } else {
      updatedFields = currentFields.filter(field => field !== apiField);
    }
    
    const updatedComponent = {
      ...component,
      apiConfig: {
        ...component.apiConfig!,
        multiMapping: {
          ...component.apiConfig?.multiMapping,
          [propKey]: updatedFields
        }
      }
    };
    onUpdateComponent(updatedComponent);
  };

  const isFieldSelected = (propKey: string, apiField: string) => {
    return component.apiConfig?.multiMapping?.[propKey]?.includes(apiField) || false;
  };

  const addContentField = () => {
    if (!newFieldLabel.trim() || !newFieldApiField.trim()) return;

    const newContentFields = [
      ...(component.contentFields || []),
      {
        label: newFieldLabel,
        apiField: newFieldApiField
      }
    ];

    const updatedComponent = {
      ...component,
      contentFields: newContentFields
    };

    onUpdateComponent(updatedComponent);

    setNewFieldLabel("");
    setNewFieldApiField("");
  };

  const removeContentField = (index: number) => {
    const currentFields = [...(component.contentFields || [])];
    currentFields.splice(index, 1);

    const updatedComponent = {
      ...component,
      contentFields: currentFields
    };

    onUpdateComponent(updatedComponent);
  };

  const handleFormattedContentChange = (value: string) => {
    const updatedComponent = {
      ...component,
      formattedContent: value
    };
    onUpdateComponent(updatedComponent);
  };

  const componentTypeLabels: Record<string, string> = {
    header: "Header",
    text: "Text",
    image: "Image",
    button: "Button",
    video: "Video",
    chart: "Chart",
    form: "Form",
    calendar: "Calendar",
    dropdown: "Dropdown",
    link: "Link",
    "multi-text": "Multi-Text",
    filter: "Filter",
    alert: "Alert",
    table: "Table",
    searchbar: "Search Bar"
  };

  const availableIcons = [
    { name: "BookOpen", component: <BookOpen size={18} /> },
    { name: "Library", component: <Library size={18} /> },
    { name: "Bell", component: <Bell size={18} /> },
    { name: "Bookmark", component: <Bookmark size={18} /> },
    { name: "FileText", component: <FileText size={18} /> },
    { name: "User", component: <User size={18} /> },
    { name: "Info", component: <Info size={18} /> },
    { name: "Globe", component: <Globe size={18} /> },
    { name: "Home", component: <Home size={18} /> },
    { name: "Mail", component: <Mail size={18} /> },
    { name: "Map", component: <Map size={18} /> },
    { name: "Phone", component: <Phone size={18} /> },
    { name: "ShoppingBag", component: <ShoppingBag size={18} /> },
    { name: "Star", component: <Star size={18} /> },
    { name: "Coffee", component: <Coffee size={18} /> }
  ];

  const getPropertyDefinitions = () => {
    switch (component.type) {
      case 'header':
        return [
          { name: "title", type: "text", label: "Title" },
          { name: "icon", type: "icon", label: "Icon" }
        ];
      case 'text':
        return [
          { name: "content", type: "text", label: "Content" }
        ];
      case 'button':
        return [
          { name: "label", type: "text", label: "Label" },
          { name: "variant", type: "select", label: "Style", options: ["default", "outline", "secondary"] },
          { name: "linkUrl", type: "text", label: "Link URL (Optional)" },
          { name: "openInNewTab", type: "select", label: "Open in New Tab", options: ["true", "false"] }
        ];
      case 'image':
        return [
          { name: "source", type: "text", label: "Image URL" },
          { name: "altText", type: "text", label: "Alt Text" },
          { name: "caption", type: "text", label: "Caption" },
          { name: "width", type: "select", label: "Width", options: ["auto", "25%", "50%", "75%", "100%"] },
          { name: "height", type: "select", label: "Height", options: ["auto", "small", "medium", "large"] },
          { name: "borderRadius", type: "select", label: "Border Radius", options: ["none", "small", "medium", "large", "circle"] },
          { name: "objectFit", type: "select", label: "Object Fit", options: ["contain", "cover", "fill", "none"] }
        ];
      case 'alert':
        return [
          { name: "title", type: "text", label: "Title" },
          { name: "message", type: "text", label: "Message" },
          { name: "type", type: "select", label: "Alert Type", options: ["info", "success", "warning", "error"] },
          { name: "dismissible", type: "select", label: "Dismissible", options: ["true", "false"] },
          { name: "autoClose", type: "select", label: "Auto Close", options: ["false", "3000", "5000", "10000"] },
          { name: "notificationType", type: "select", label: "Notification Type", options: ["inline", "toast"] }
        ];
      case 'calendar':
        return [
          { name: "label", type: "text", label: "Label" },
          { name: "placeholder", type: "text", label: "Placeholder" },
          { name: "calendarType", type: "select", label: "Calendar Type", options: ["date-picker", "event-calendar"] },
          { name: "calendarProvider", type: "select", label: "Calendar Provider", options: ["none", "google", "microsoft", "apple", "custom"] },
          { name: "apiKey", type: "text", label: "API Key (if using provider)" },
          { name: "calendarId", type: "text", label: "Calendar ID (if using provider)" },
          { name: "showControls", type: "select", label: "Show Controls", options: ["true", "false"] },
          { name: "allowEditing", type: "select", label: "Allow Editing", options: ["true", "false"] },
          { name: "startDate", type: "text", label: "Start Date (YYYY-MM-DD)" },
          { name: "endDate", type: "text", label: "End Date (YYYY-MM-DD)" }
        ];
      case 'chart':
        return [
          { name: "chartType", type: "select", label: "Chart Type", options: ["bar", "line", "pie", "doughnut", "area", "radar"] },
          { name: "title", type: "text", label: "Chart Title" },
          { name: "dataSource", type: "select", label: "Data Source", options: ["static", "api", "url"] },
          { name: "dataUrl", type: "text", label: "Data URL (if using URL)" },
          { name: "staticData", type: "text", label: "Static Data (comma-separated)" },
          { name: "labels", type: "text", label: "Labels (comma-separated)" },
          { name: "legend", type: "select", label: "Show Legend", options: ["true", "false"] },
          { name: "legendPosition", type: "select", label: "Legend Position", options: ["top", "bottom", "left", "right"] },
          { name: "colors", type: "text", label: "Colors (comma-separated hex values)" },
          { name: "height", type: "text", label: "Chart Height (px)" }
        ];
      case 'dropdown':
        return [
          { name: "label", type: "text", label: "Label" },
          { name: "placeholder", type: "text", label: "Placeholder" },
          { name: "options", type: "text", label: "Options (comma separated)" },
          { name: "multiple", type: "select", label: "Allow Multiple Selection", options: ["true", "false"] },
          { name: "searchable", type: "select", label: "Searchable", options: ["true", "false"] },
          { name: "required", type: "select", label: "Required", options: ["true", "false"] },
          { name: "dynamicOptions", type: "select", label: "Dynamic Options", options: ["true", "false"] },
          { name: "optionsUrl", type: "text", label: "Options URL (if using dynamic)" },
          { name: "defaultValue", type: "text", label: "Default Value" }
        ];
      case 'link':
        return [
          { name: "text", type: "text", label: "Link Text" },
          { name: "url", type: "text", label: "URL" },
          { name: "openInNewTab", type: "select", label: "Open in New Tab", options: ["true", "false"] },
          { name: "style", type: "select", label: "Style", options: ["default", "button", "underlined"] },
          { name: "icon", type: "select", label: "Icon", options: ["LinkIcon", "ExternalLink", "FileText", "Download", "Info"] }
        ];
      case 'table':
        return [
          { name: "dataSource", type: "select", label: "Data Source", options: ["static", "api", "url"] },
          { name: "staticData", type: "text", label: "Static Data (JSON string)" },
          { name: "dataUrl", type: "text", label: "Data URL (if using URL)" },
          { name: "columns", type: "text", label: "Columns (JSON string)" },
          { name: "striped", type: "select", label: "Striped Rows", options: ["true", "false"] },
          { name: "hoverable", type: "select", label: "Hoverable Rows", options: ["true", "false"] },
          { name: "bordered", type: "select", label: "Bordered", options: ["true", "false"] },
          { name: "pagination", type: "select", label: "Pagination", options: ["true", "false"] },
          { name: "pageSize", type: "select", label: "Items Per Page", options: ["5", "10", "20", "50", "100"] },
          { name: "searchable", type: "select", label: "Searchable", options: ["true", "false"] },
          { name: "sortable", type: "select", label: "Sortable", options: ["true", "false"] },
          { name: "exportable", type: "select", label: "Exportable", options: ["true", "false"] },
          { name: "exportFormats", type: "select", label: "Export Formats", options: ["csv", "excel", "pdf", "all"] }
        ];
      case 'searchbar':
        return [
          { name: "placeholder", type: "text", label: "Placeholder" },
          { name: "searchTarget", type: "select", label: "Search Target", options: ["widget", "external", "api"] },
          { name: "targetComponent", type: "text", label: "Target Component ID (if searching widget)" },
          { name: "searchApiUrl", type: "text", label: "Search API URL (if using API)" },
          { name: "searchField", type: "text", label: "Search Field (if searching widget)" },
          { name: "debounceTime", type: "select", label: "Debounce Time (ms)", options: ["0", "300", "500", "1000"] },
          { name: "minChars", type: "select", label: "Min Characters", options: ["1", "2", "3", "4"] },
          { name: "width", type: "select", label: "Width", options: ["full", "medium", "small"] },
          { name: "showIcon", type: "select", label: "Show Icon", options: ["true", "false"] }
        ];
      case 'form':
        return [
          { name: "fields", type: "text", label: "Fields (JSON string)" },
          { name: "submitText", type: "text", label: "Submit Button Text" },
          { name: "formMethod", type: "select", label: "Form Method", options: ["GET", "POST"] },
          { name: "formAction", type: "text", label: "Form Action URL" },
          { name: "redirectUrl", type: "text", label: "Redirect URL (on success)" }
        ];
      case 'multi-text':
        return [
          { name: "items", type: "text", label: "Text Items (JSON array)" },
          { name: "layout", type: "select", label: "Layout", options: ["vertical", "horizontal", "grid"] }
        ];
      case 'filter':
        return [
          { name: "options", type: "text", label: "Filter Options (comma separated)" },
          { name: "defaultSelected", type: "text", label: "Default Selected Option" },
          { name: "filterType", type: "select", label: "Filter Type", options: ["button", "checkbox", "dropdown", "radio"] }
        ];
      case 'video':
        return [
          { name: "source", type: "text", label: "Video URL" },
          { name: "title", type: "text", label: "Title" },
          { name: "poster", type: "text", label: "Poster Image URL" },
          { name: "controls", type: "select", label: "Show Controls", options: ["true", "false"] },
          { name: "autoplay", type: "select", label: "Autoplay", options: ["true", "false"] },
          { name: "loop", type: "select", label: "Loop", options: ["true", "false"] },
          { name: "muted", type: "select", label: "Muted", options: ["true", "false"] }
        ];
      default:
        return [
          { name: "title", type: "text", label: "Title" },
          { name: "content", type: "text", label: "Content" }
        ];
    }
  };

  const defaultTooltipOptions = [
    { id: "none", label: "No Tooltip" },
    { id: "help", label: "Help Info" },
    { id: "info", label: "Additional Info" },
    { id: "warning", label: "Warning" },
    { id: "tip", label: "Pro Tip" }
  ];

  const validCustomTooltips = customTooltips.filter(tooltip => tooltip && tooltip.id);

  const tooltipOptions = [
    ...defaultTooltipOptions,
    ...validCustomTooltips.map(tooltip => ({
      id: tooltip.id,
      label: tooltip.title,
      content: tooltip.content,
      tags: tooltip.tags
    }))
  ];

  const renderPropertyEditor = (property: {
    name: string;
    type: string;
    label: string;
    options?: string[];
  }) => {
    const value = component.props && component.props[property.name];

    switch (property.type) {
      case "icon":
        return (
          <div key={property.name} className="mb-4">
            <Label htmlFor={`prop-${property.name}`}>{property.label}</Label>
            <ScrollArea className="h-[180px] border rounded-md p-2 mt-1">
              <div className="grid grid-cols-5 gap-2">
                {availableIcons.map((icon) => (
                  <div
                    key={icon.name}
                    className={`flex flex-col items-center justify-center p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                      value === icon.name ? "bg-blue-100 border-blue-300" : ""
                    }`}
                    onClick={() => handlePropertyChange(property.name, icon.name)}
                  >
                    {icon.component}
                    <span className="text-xs mt-1 text-center">{icon.name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      case "color":
        return (
          <ColorPalettePicker
            key={property.name}
            label={property.label}
            value={value || "#FFFFFF"}
            onChange={(newValue) => handlePropertyChange(property.name, newValue)}
            className="mb-4"
          />
        );
      case "text":
        if (property.name === "content" && (component.contentFields?.length || component.formattedContent !== undefined)) {
          return (
            <div key={property.name} className="mb-4">
              <div className="mt-2 border rounded-md p-3 bg-gray-50">
                <div className="mb-2">
                  <textarea
                    id={`prop-${property.name}`}
                    className="w-full h-32 border rounded p-2 text-sm font-mono resize-none"
                    value={component.formattedContent || ""}
                    onChange={(e) => handleFormattedContentChange(e.target.value)}
                    placeholder="Enter formatted content or use API fields..."
                  />
                </div>
                
                <div className="mt-1 mb-2">
                  <p className="text-xs text-gray-500">
                    Use <code className="bg-gray-200 px-1 rounded">{"{{Field Name}}"}</code> to insert dynamic content
                  </p>
                </div>
                
                {component.contentFields && component.contentFields.length > 0 && (
                  <div className="mt-2">
                    <Label className="text-xs font-medium mb-1 block">Available API Fields</Label>
                    <div className="flex flex-wrap gap-2">
                      {component.contentFields.map((field, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            const placeholder = `{{${field.label}}}`;
                            const currentContent = component.formattedContent || "";
                            handleFormattedContentChange(currentContent + placeholder);
                          }}>
                          {field.label} <span className="text-gray-500 ml-1">({field.apiField})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }
        
        return (
          <div key={property.name} className="mb-4">
            <Label htmlFor={`prop-${property.name}`}>{property.label}</Label>
            <Input
              id={`prop-${property.name}`}
              value={value || ""}
              onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            />
          </div>
        );
      case "select":
        return (
          <div key={property.name} className="mb-4">
            <Label htmlFor={`prop-${property.name}`}>{property.label}</Label>
            <Select
              value={String(value)}
              onValueChange={(val) => handlePropertyChange(property.name, val === "true" ? true : val === "false" ? false : val)}
            >
              <SelectTrigger id={`prop-${property.name}`}>
                <SelectValue placeholder={`Select ${property.label}`} />
              </SelectTrigger>
              <SelectContent>
                {property.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  const isHeader = component.type === 'header';
  const shouldDisableRemove = disableRemove || isHeader;

  const getTooltipIcon = (tooltipId: string) => {
    switch(tooltipId) {
      case "help": return <HelpCircle size={16} className="text-blue-500" />;
      case "info": return <Info size={16} className="text-green-500" />;
      case "warning": return <AlertTriangle size={16} className="text-amber-500" />;
      case "tip": return <Star size={16} className="text-purple-500" />;
      default: 
        return validCustomTooltips.some(t => t.id === tooltipId) ? 
          <Info size={16} className="text-indigo-500" /> : 
          null;
    }
  };

  const isTooltipValid = component.tooltipId ? 
    tooltipOptions.some(option => option.id === component.tooltipId) : 
    true;
  
  if (component.tooltipId && !isTooltipValid && onApplyTooltip) {
    setTimeout(() => {
      onApplyTooltip("");
    }, 0);
  }

  const selectedTooltip = component.tooltipId ? 
    validCustomTooltips.find(t => t.id === component.tooltipId) : 
    null;

  const shouldShowDataIntegration = () => {
    const dataIntegrationComponents = ['calendar', 'chart', 'table', 'dropdown', 'alert', 'searchbar'];
    return dataIntegrationComponents.includes(component.type);
  };

  const selectedApi = component.apiConfig ? apis.find(api => api.id === component.apiConfig?.apiId) : undefined;

  const getAvailableApiFields = () => {
    if (!selectedApi) return [];
    
    if (selectedApi.possibleFields && selectedApi.possibleFields.length > 0) {
      return selectedApi.possibleFields;
    }
    
    if (selectedApi.sampleResponse) {
      try {
        const sampleData = JSON.parse(selectedApi.sampleResponse);
        return Object.keys(sampleData);
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  const renderApiDetails = () => {
    if (!selectedApi) return null;
    const availableApiFields = getAvailableApiFields();

    return (
      <div className="space-y-4 mt-4 border rounded-md p-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm">Connected to: {selectedApi.name}</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              const updatedComponent = { ...component };
              delete updatedComponent.apiConfig;
              onUpdateComponent(updatedComponent);
            }}
            className="h-6 text-red-500 hover:text-red-700"
          >
            <X size={14} className="mr-1" /> Disconnect
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium w-20">Endpoint:</span>
            <span className="text-xs overflow-hidden overflow-ellipsis">{selectedApi.endpoint}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium w-20">Method:</span>
            <Badge variant="outline" className="text-xs font-mono">
              {selectedApi.method}
            </Badge>
          </div>
        </div>

        {selectedApi.parameters && Object.keys(selectedApi.parameters).length > 0 && (
          <div className="mt-1">
            <Accordion type="single" collapsible>
              <AccordionItem value="parameters">
                <AccordionTrigger className="text-xs font-medium py-1">
                  Parameters
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 text-xs">
                    {Object.entries(selectedApi.parameters).map(([key, value], idx) => (
                      <div key={`param-${idx}`} className="flex items-center gap-2">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        <div className="mt-3 border-t pt-3">
          <h5 className="text-sm font-medium mb-2">Add Content Fields</h5>
          <div className="flex items-end gap-2 mb-3">
            <div className="flex-1">
              <Label htmlFor="field-label" className="text-xs">Field Label</Label>
              <Input 
                id="field-label" 
                value={newFieldLabel} 
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="Enter field label"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="api-field" className="text-xs">API Field</Label>
              <Select value={newFieldApiField} onValueChange={setNewFieldApiField}>
                <SelectTrigger id="api-field" className="h-8 text-sm">
                  <SelectValue placeholder="Select API field" />
                </SelectTrigger>
                <SelectContent>
                  {availableApiFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addContentField}
              disabled={!newFieldLabel || !newFieldApiField}
              className="h-8 px-2"
            >
              <Plus size={14} />
            </Button>
          </div>

          {component.contentFields && component.contentFields.length > 0 && (
            <div className="mt-2 space-y-2">
              <h6 className="text-xs font-medium">Mapped Fields:</h6>
              <div className="space-y-1">
                {component.contentFields.map((field, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 px-2 bg-white rounded border text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{field.label}:</span>
                      <Badge variant="outline" className="text-xs">
                        {field.apiField}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeContentField(idx)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApiSection = () => {
    return (
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <Database size={16} className="mr-2 text-blue-500" />
            <span className="font-medium">API Integration</span>
            {component.apiConfig && (
              <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-600 border-green-200">
                Connected
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-3">
          {component.apiConfig ? (
            renderApiDetails()
          ) : (
            <div>
              <div className="mb-4">
                <Label htmlFor="api-select" className="mb-1 block">Select API</Label>
                <Select onValueChange={handleApiSelection}>
                  <SelectTrigger id="api-select">
                    <SelectValue placeholder="Select an API to connect" />
                  </SelectTrigger>
                  <SelectContent>
                    {apis.length > 0 ? (
                      apis.map((api) => (
                        <SelectItem key={api.id} value={api.id}>
                          {api.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No APIs available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4 text-center text-sm text-gray-500">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRequestApiTemplate}
                  className="mb-2"
                >
                  <Bookmark size={14} className="mr-1" /> Choose from API Templates
                </Button>
                <p className="text-xs">
                  Or create a new API from the APIs tab
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative rounded-lg overflow-hidden border bg-white">
      <div 
        className={`flex items-center justify-between px-4 py-3 border-b cursor-pointer ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 mr-3">
            {component.type === 'header' && <BookOpen size={18} className="text-blue-600" />}
            {component.type === 'text' && <Text size={18} />}
            {component.type === 'image' && <Image size={18} />}
            {component.type === 'button' && <MousePointer size={18} />}
            {component.type === 'video' && <Video size={18} />}
            {component.type === 'chart' && <BarChart size={18} />}
            {component.type === 'form' && <FormInput size={18} />}
            {component.type === 'calendar' && <CalendarDays size={18} />}
            {component.type === 'dropdown' && <ChevronDown size={18} />}
            {component.type === 'link' && <LinkIcon size={18} />}
            {component.type === 'multi-text' && <List size={18} />}
            {component.type === 'filter' && <Filter size={18} />}
            {component.type === 'alert' && <AlertTriangle size={18} />}
            {component.type === 'table' && <Table2 size={18} />}
            {component.type === 'searchbar' && <Search size={18} />}
          </div>
          <div>
            <h3 className="font-medium text-sm">
              {componentTypeLabels[component.type] || component.type}
              {component.props?.title && <span className="ml-2 opacity-70">({component.props.title})</span>}
              {component.props?.label && <span className="ml-2 opacity-70">({component.props.label})</span>}
              {component.tooltipId && (
                <span className="ml-2">
                  {getTooltipIcon(component.tooltipId)}
                </span>
              )}
            </h3>
            {component.apiConfig && (
              <Badge variant="outline" className="mt-1 text-xs bg-blue-50 text-blue-600 border-blue-200">
                API: {apis.find(api => api.id === component.apiConfig?.apiId)?.name || "Connected"}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {shouldDisableRemove ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="opacity-50 cursor-not-allowed">
                    <Trash2 size={14} className="text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">This component cannot be removed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              className="text-red-500 hover:text-red-700 transition-colors p-1"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveComponent(component.id);
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="ml-2 w-5 flex justify-center">
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {component.type === 'alert' && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              <h4 className="font-medium flex items-center text-yellow-800">
                <AlertTriangle size={16} className="mr-2" />
                Alert Component
              </h4>
              <p className="mt-1 text-yellow-700">
                This component will be displayed at the top of your widget, regardless of its position in the component list.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {onApplyTooltip && (
              <div className="mb-4">
                <Label htmlFor="tooltip-select" className="mb-1 block">Tooltip</Label>
                <Select 
                  value={component.tooltipId || "none"} 
                  onValueChange={(value) => onApplyTooltip(value === "none" ? "" : value)}
                >
                  <SelectTrigger id="tooltip-select">
                    <SelectValue placeholder="Select tooltip" />
                  </SelectTrigger>
                  <SelectContent>
                    {tooltipOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTooltip && (
                  <div className="mt-2 text-sm">
                    <div className="border rounded-md p-3 bg-gray-50">
                      <span className="block font-medium text-xs">{selectedTooltip.title}</span>
                      <p className="mt-1 text-xs text-gray-600">{selectedTooltip.content}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-3">Content</h3>
              <div className="space-y-1">
                {getPropertyDefinitions().map(renderPropertyEditor)}
              </div>
            </div>
            
            {shouldShowDataIntegration() && renderApiSection()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentEditor;
