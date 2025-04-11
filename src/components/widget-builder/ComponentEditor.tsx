
import React from "react";
import { WidgetComponent, ApiConfig } from "@/types/widget-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ColorPalettePicker from "./ColorPalettePicker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Settings, HelpCircle } from "lucide-react";

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

  // Define component type mappings for the UI
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

  // Mock property definitions for UI rendering
  // In a real app, these would come from a schema or component definition
  const mockPropertyDefinitions = [
    { name: "title", type: "text", label: "Title" },
    { name: "content", type: "text", label: "Content" },
    { name: "color", type: "color", label: "Color", options: ["#FF0000", "#00FF00", "#0000FF"] }
  ];

  // Mock tooltips for the UI
  const tooltipOptions = [
    { id: "none", label: "No Tooltip" },  // Changed from empty string to "none"
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
              onValueChange={(val) => handlePropertyChange(property.name, val)}
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
      // Add more property types as needed
      default:
        return null;
    }
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onRemoveComponent(component.id)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          {/* Basic properties section */}
          <Accordion type="single" collapsible defaultValue="properties">
            <AccordionItem value="properties">
              <AccordionTrigger className="text-sm font-medium">Component Properties</AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 space-y-3">
                  {mockPropertyDefinitions.map(prop => 
                    component.props[prop.name] !== undefined && renderPropertyEditor(prop)
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* API integration section */}
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

          {/* Tooltip section (renamed from Settings) */}
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
                        value={component.tooltipId || "none"}  // Default to "none" instead of empty string
                        onValueChange={(val) => onApplyTooltip(val === "none" ? "" : val)}  // Convert "none" back to empty string
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
