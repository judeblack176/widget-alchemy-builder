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
  Star
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComponentEditorProps {
  component: WidgetComponent;
  apis: ApiConfig[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
  onRemoveComponent: (componentId: string) => void;
  onRequestApiTemplate: () => void;
  onApplyTooltip?: (tooltipId: string) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  apis,
  isExpanded,
  onToggleExpand,
  onUpdateComponent,
  onRemoveComponent,
  onRequestApiTemplate,
  onApplyTooltip
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
    table: "Table"
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
          { name: "variant", type: "select", label: "Style", options: ["default", "outline", "secondary"] }
        ];
      case 'image':
        return [
          { name: "source", type: "text", label: "Image URL" },
          { name: "altText", type: "text", label: "Alt Text" },
          { name: "caption", type: "text", label: "Caption" }
        ];
      case 'alert':
        return [
          { name: "title", type: "text", label: "Title" },
          { name: "message", type: "text", label: "Message" },
          { name: "type", type: "select", label: "Alert Type", options: ["info", "success", "warning", "error"] },
          { name: "backgroundColor", type: "color", label: "Background Color" },
          { name: "textColor", type: "color", label: "Text Color" },
          { name: "borderColor", type: "color", label: "Border Color" }
        ];
      default:
        return [
          { name: "title", type: "text", label: "Title" },
          { name: "content", type: "text", label: "Content" },
          { name: "color", type: "color", label: "Color", options: ["#FF0000", "#00FF00", "#0000FF"] }
        ];
    }
  };

  const tooltipOptions = [
    { id: "none", label: "No Tooltip" },
    { id: "help", label: "Help Info" },
    { id: "info", label: "Additional Info" },
    { id: "warning", label: "Warning" },
    { id: "tip", label: "Pro Tip" }
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
          {!isHeader && (
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {apis.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="api">
                <AccordionTrigger className="text-sm font-medium">API Integration</AccordionTrigger>
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {onApplyTooltip && (
            <Accordion type="single" collapsible defaultValue="tooltip">
              <AccordionItem value="tooltip">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} />
                    <span>Tooltip</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 space-y-3">
                    <div className="mb-4">
                      <Label htmlFor="tooltip-select">Tooltip</Label>
                      <Select
                        value={component.tooltipId || "none"}
                        onValueChange={(val) => onApplyTooltip(val === "none" ? "" : val)}
                      >
                        <SelectTrigger id="tooltip-select" className="w-full">
                          <SelectValue placeholder="Select tooltip type" />
                        </SelectTrigger>
                        <SelectContent>
                          {tooltipOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.id !== "none" ? (
                                <div className="flex items-center gap-2">
                                  <HelpCircle size={16} />
                                  <span>{option.label}</span>
                                </div>
                              ) : (
                                option.label
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
