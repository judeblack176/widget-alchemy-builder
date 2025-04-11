import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  Link as LinkIcon, 
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
  X
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
      content: tooltip.content
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

  const shouldShowDataIntegration = () => {
    const dataIntegrationComponents = ['calendar', 'chart', 'table', 'dropdown', 'alert', 'searchbar'];
    return dataIntegrationComponents.includes(component.type);
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
                      {component.tooltipId && validCustomTooltips.some(t => t.id === component.tooltipId) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {validCustomTooltips.find(t => t.id === component.tooltipId)?.content}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {(apis.length > 0 || shouldShowDataIntegration()) && (
            <Accordion type="single" collapsible>
              <AccordionItem value="api">
                <AccordionTrigger className="text-sm font-medium">Data & API Integration</AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onRequestApiTemplate}
                      className="w-full"
                    >
                      {component.apiConfig ? 'Change API Connection' : 'Connect to API'}
                    </Button>
                    
                    {shouldShowDataIntegration() && !component.apiConfig && (
                      <div className="mt-3 text-sm text-gray-500">
                        <p>This component can be connected to external data sources. Click the button above to set up an API connection.</p>
                        {component.type === 'calendar' && (
                          <p className="mt-2">Calendar components can sync with Google, Microsoft, or custom calendar services.</p>
                        )}
                        {component.type === 'chart' && (
                          <p className="mt-2">Charts can visualize data from API endpoints or static sources.</p>
                        )}
                        {component.type === 'table' && (
                          <p className="mt-2">Tables can display dynamic data from API endpoints with sorting, filtering, and pagination.</p>
                        )}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentEditor;
