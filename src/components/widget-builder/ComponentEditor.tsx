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
  Palette,
  Bold,
  Italic,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const InfoIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

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
  const [showDisconnectAlert, setShowDisconnectAlert] = useState(false);

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

  const disconnectApi = () => {
    const updatedComponent = { ...component };
    delete updatedComponent.apiConfig;
    onUpdateComponent(updatedComponent);
    setShowDisconnectAlert(false);
  };

  const isFieldSelected = (propKey: string, apiField: string) => {
    return component.apiConfig?.multiMapping?.[propKey]?.includes(apiField) || false;
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
          { name: "icon", type: "icon", label: "Icon" },
          { name: "backgroundColor", type: "color", label: "Background Color" },
          { name: "textColor", type: "color", label: "Text Color" },
          { name: "fontFamily", type: "select", label: "Font Family", options: [
            "system-ui", "Arial", "Helvetica", "Times New Roman", "Georgia"
          ] },
          { name: "bold", type: "select", label: "Bold", options: ["true", "false"] },
          { name: "italic", type: "select", label: "Italic", options: ["true", "false"] }
        ];
      case 'text':
        return [
          { name: "content", type: "text", label: "Content" },
          { name: "size", type: "select", label: "Size", options: ["small", "medium", "large"] },
          { name: "color", type: "color", label: "Text Color" },
          { name: "backgroundColor", type: "color", label: "Background Color" },
          { name: "bold", type: "select", label: "Bold", options: ["true", "false"] },
          { name: "italic", type: "select", label: "Italic", options: ["true", "false"] }
        ];
      case 'button':
        return [
          { name: "label", type: "text", label: "Label" },
          { name: "backgroundColor", type: "color", label: "Background Color" },
          { name: "textColor", type: "color", label: "Text Color" },
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
          { name: "backgroundColor", type: "color", label: "Background Color" },
          { name: "textColor", type: "color", label: "Text Color" },
          { name: "borderColor", type: "color", label: "Border Color" },
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
          { name: "displayType", type: "select", label: "Display Type", options: ["text", "icon", "both"] },
          { name: "icon", type: "select", label: "Icon (if using icon)", options: ["LinkIcon", "ExternalLink", "FileText", "Download", "Info"] },
          { name: "color", type: "color", label: "Text Color" },
          { name: "backgroundColor", type: "color", label: "Background Color (for button style)" }
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
          { name: "exportFormats", type: "select", label: "Export Formats", options: ["csv", "excel", "pdf", "all"] },
          { name: "headerBackgroundColor", type: "color", label: "Header Background Color" },
          { name: "headerTextColor", type: "color", label: "Header Text Color" }
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
          { name: "backgroundColor", type: "color", label: "Background Color" },
          { name: "textColor", type: "color", label: "Text Color" },
          { name: "borderColor", type: "color", label: "Border Color" },
          { name: "width", type: "select", label: "Width", options: ["full", "medium", "small"] },
          { name: "showIcon", type: "select", label: "Show Icon", options: ["true", "false"] }
        ];
      default:
        return [
          { name: "title", type: "text", label: "Title" },
          { name: "content", type: "text", label: "Content" },
          { name: "color", type: "color", label: "Color" }
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
    const value = component.props[property.name];

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

  const renderMultiSelectDropdown = (propKey: string, label: string, apiFields: string[]) => {
    const selectedFields = component.apiConfig?.multiMapping?.[propKey] || [];
    
    return (
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <Label>{label}</Label>
          <Badge variant="outline" className="ml-2">
            {selectedFields.length} selected
          </Badge>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select Fields
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="start">
            <DropdownMenuLabel>API Fields</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[200px]">
              {apiFields.map(field => (
                <DropdownMenuCheckboxItem
                  key={`${propKey}-${field}`}
                  checked={isFieldSelected(propKey, field)}
                  onCheckedChange={(checked) => {
                    handleMultiMappingChange(propKey, field, checked);
                  }}
                >
                  {field}
                </DropdownMenuCheckboxItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {selectedFields.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 p-2 border border-gray-100 rounded-md">
            {selectedFields.map((field, idx) => (
              <Badge 
                key={`selected-${propKey}-${idx}`} 
                variant="secondary"
                className="text-xs flex items-center gap-1 mb-1"
              >
                {field}
                <button 
                  className="ml-1 hover:text-red-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMultiMappingChange(propKey, field, false);
                  }}
                >
                  <X size={10} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderApiDetails = () => {
    if (!selectedApi) return null;

    return (
      <div className="space-y-4 mt-4 border rounded-md p-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm">Connected to: {selectedApi.name}</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDisconnectAlert(true)}
            className="h-6 text-red-500 hover:text-red-700"
          >
            <X size={14} className="mr-1" /> Disconnect
          </Button>
        </div>

        {/* Display API details */}
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

        {/* Headers */}
        {selectedApi.headers && Object.keys(selectedApi.headers).length > 0 && (
          <div className="mt-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="headers">
                <AccordionTrigger className="text-xs font-medium py-1">
                  Headers
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 text-xs">
                    {Object.entries(selectedApi.headers).map(([key, value], idx) => (
                      <div key={`header-${idx}`} className="flex items-center gap-2">
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

        {/* Parameters */}
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

        {/* Data Mapping - Updated Section */}
        <div className="mt-1">
          <Accordion type="single" collapsible defaultValue="data-mapping">
            <AccordionItem value="data-mapping">
              <AccordionTrigger className="text-xs font-medium py-1">
                Single Data Mapping
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Map one API field to each component property:</p>
                  
                  <div className="space-y-4 border rounded-md p-3 bg-white">
                    {getPropertyDefinitions().map((prop) => (
                      <div key={`map-${prop.name}`} className="grid grid-cols-5 gap-2 items-center">
                        <div className="text-xs font-medium col-span-2">{prop.label}:</div>
                        <div className="col-span-3">
                          <Select
                            value={component.apiConfig?.dataMapping?.[prop.name] || ""}
                            onValueChange={(value) => handleDataMappingChange(prop.name, value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-md">
                              <SelectItem value="none">None</SelectItem>
                              {selectedApi.possibleFields?.map((field, idx) => (
                                <SelectItem key={`field-${idx}`} value={field} className="text-xs">
                                  {field}
                                </SelectItem>
                              )) || []}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs mt-2">
                    <p className="text-blue-600 font-medium">
                      <InfoIcon className="inline-block mr-1 h-3 w-3" />
                      Selected fields will be displayed in both widget and preview
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Multiple Data Mapping - Updated Section */}
        <div className="mt-1">
          <Accordion type="single" collapsible defaultValue="multi-mapping">
            <AccordionItem value="multi-mapping">
              <AccordionTrigger className="text-xs font-medium py-1">
                Multiple Data Mapping
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Select multiple API fields for each component property:</p>
                  
                  <div className="border rounded-md p-3 bg-white">
                    {getPropertyDefinitions().map((prop) => (
                      <div key={`multimap-${prop.name}`} className="border-b border-gray-100 py-2 last:border-0 last:pb-0 first:pt-0">
                        {renderMultiSelectDropdown(
                          prop.name, 
                          prop.label, 
                          selectedApi.possibleFields || []
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs mt-2 p-2 bg-blue-50 border border-blue-100 rounded-md">
                    <p className="flex items-start">
                      <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Selected fields will be available in both widget and preview. 
                        Use this for components that display multiple items like tables, lists, or charts.
                      </span>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    {apis.length > 0 ? (
                      apis.map((api) => (
                        <SelectItem key={api.id} value={api.id}>
                          {api.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-apis-available" disabled>
                        No APIs available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRequestApiTemplate}
                  className="w-full"
                >
                  <Code size={16} className="mr-2" />
                  Use API Template
                </Button>

                {shouldShowDataIntegration() && (
                  <div className="mt-3 text-sm text-gray-500">
                    <p>This component can be connected to external data sources.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 ${isExpanded ? 'border-t border-gray-200' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">
          {componentTypeLabels[component.type] || component.type}
        </h3>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleExpand}
          >
            {isExpanded ? 'Collapse' : 'Edit'}
          </Button>
          {!shouldDisableRemove && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRemoveComponent(component.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          {/* API Integration section moved to the top */}
          {renderApiSection()}
          
          <Accordion type="single" collapsible defaultValue="properties">
            <AccordionItem value="properties">
              <AccordionTrigger className="text-sm font-medium">Component Properties</AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 space-y-3">
                  {getPropertyDefinitions().map(prop => 
                    renderPropertyEditor(prop)
                  )}
                </div>
                
                {onApplyTooltip && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle size={16} />
                      <span className="font-medium">Tooltip</span>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="tooltip-select">Select Tooltip</Label>
                      <Select
                        value={isTooltipValid ? (component.tooltipId || "none") : "none"}
                        onValueChange={(val) => onApplyTooltip(val === "none" ? "" : val)}
                      >
                        <SelectTrigger id="tooltip-select" className="w-full">
                          <SelectValue placeholder="Select tooltip type">
                            {component.tooltipId && isTooltipValid ? (
                              <div className="flex items-center gap-2">
                                {getTooltipIcon(component.tooltipId)}
                                <span>
                                  {tooltipOptions.find(o => o.id === component.tooltipId)?.label || component.tooltipId}
                                </span>
                              </div>
                            ) : (
                              "No Tooltip"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {tooltipOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.id !== "none" ? (
                                <div className="flex items-center gap-2">
                                  {getTooltipIcon(option.id)}
                                  <span>{option.label}</span>
                                </div>
                              ) : (
                                option.label
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedTooltip && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mt-1 mb-2">
                            {selectedTooltip.content}
                          </p>
                          {selectedTooltip.tags && selectedTooltip.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedTooltip.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag size={10} className="mr-1" /> {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Disconnect confirmation dialog */}
      <AlertDialog open={showDisconnectAlert} onOpenChange={setShowDisconnectAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect API?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the API connection from this component. Any data mappings will be lost. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={disconnectApi} className="bg-red-500 text-white hover:bg-red-600">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComponentEditor;
