
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPalettePicker from "../ColorPalettePicker";
import { BookOpen, Library, Bell, Bookmark, FileText, User, Info, Globe, Home, Mail, Map, Phone, ShoppingBag, Star, Coffee } from 'lucide-react';

interface PropertyEditorProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({ component, onUpdateComponent }) => {
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

  const handleFormattedContentChange = (value: string) => {
    const updatedComponent = {
      ...component,
      formattedContent: value
    };
    onUpdateComponent(updatedComponent);
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
        if (property.name === "content" && (component.contentFields?.length || component.formattedContent)) {
          return (
            <div key={property.name} className="mb-4">
              <Label htmlFor={`prop-${property.name}`}>{property.label}</Label>
              <div className="mt-2 border rounded-md p-3 bg-gray-50 min-h-[100px]">
                <textarea
                  className="w-full h-32 border rounded p-2 text-sm"
                  value={component.formattedContent || ""}
                  onChange={(e) => handleFormattedContentChange(e.target.value)}
                  placeholder="Enter formatted content or use API fields..."
                />
                
                {component.contentFields && component.contentFields.length > 0 && (
                  <div className="mt-3">
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
              onValueChange={(val) => {
                let finalValue: string | boolean | number = val;
                if (val === "true") finalValue = true;
                else if (val === "false") finalValue = false;
                else if (property.name === "autoClose" && val !== "false") {
                  finalValue = parseInt(val);
                }
                handlePropertyChange(property.name, finalValue);
              }}
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

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Component Properties</h3>
      {getPropertyDefinitions(component.type).map(renderPropertyEditor)}
    </div>
  );
};

export default PropertyEditor;

// Helper function to get property definitions based on component type
const getPropertyDefinitions = (componentType: string) => {
  switch (componentType) {
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
