import React, { useState } from "react";
import { WidgetComponent, ComponentDefinition, ApiConfig } from "@/types/widget-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus } from "lucide-react";
import ColorPalettePicker from "./ColorPalettePicker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ComponentEditorProps {
  component: WidgetComponent;
  componentDefinition: ComponentDefinition;
  apis: ApiConfig[];
  onUpdate: (updatedComponent: WidgetComponent) => void;
  onRequestTooltipTemplate?: (componentId: string) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  componentDefinition,
  apis,
  onUpdate,
  onRequestTooltipTemplate,
}) => {
  const [showTooltipEditor, setShowTooltipEditor] = useState(!!component.props.tooltip);

  const handlePropertyChange = (propertyName: string, value: any) => {
    const updatedComponent = {
      ...component,
      props: {
        ...component.props,
        [propertyName]: value,
      },
    };
    onUpdate(updatedComponent);
  };

  const handleTooltipPropertyChange = (propertyName: string, value: any) => {
    const currentTooltip = component.props.tooltip || {
      content: "Tooltip content",
      placement: "top",
      backgroundColor: "#1E293B",
      textColor: "#FFFFFF",
      showArrow: true,
    };

    const updatedTooltip = {
      ...currentTooltip,
      [propertyName]: value,
    };

    handlePropertyChange("tooltip", updatedTooltip);
  };

  const addTooltip = () => {
    if (!showTooltipEditor) {
      setShowTooltipEditor(true);
      handlePropertyChange("tooltip", {
        content: "Tooltip content",
        placement: "top",
        backgroundColor: "#1E293B",
        textColor: "#FFFFFF",
        showArrow: true,
      });
    }
  };

  const removeTooltip = () => {
    setShowTooltipEditor(false);
    const updatedProps = { ...component.props };
    delete updatedProps.tooltip;
    onUpdate({
      ...component,
      props: updatedProps,
    });
  };

  const loadTooltipTemplate = () => {
    if (onRequestTooltipTemplate) {
      onRequestTooltipTemplate(component.id);
    }
  };

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

  const renderTooltipEditor = () => {
    if (!showTooltipEditor) return null;

    const tooltip = component.props.tooltip || {
      content: "Tooltip content",
      placement: "top",
      backgroundColor: "#1E293B",
      textColor: "#FFFFFF",
      showArrow: true,
    };

    return (
      <div className="border rounded-md p-4 mb-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium">Tooltip Settings</h4>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadTooltipTemplate}
              className="h-8"
            >
              <HelpCircle size={14} className="mr-1" />
              Load Template
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={removeTooltip}
              className="h-8 text-red-500 hover:text-red-600"
            >
              Remove
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="tooltip-content">Content</Label>
            <Input
              id="tooltip-content"
              value={tooltip.content || ""}
              onChange={(e) => handleTooltipPropertyChange("content", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="tooltip-placement">Placement</Label>
            <Select
              value={tooltip.placement || "top"}
              onValueChange={(val) => handleTooltipPropertyChange("placement", val)}
            >
              <SelectTrigger id="tooltip-placement">
                <SelectValue placeholder="Select placement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tooltip-bg-color">Background Color</Label>
              <ColorPalettePicker
                label="Background Color"
                value={component.props.tooltip?.backgroundColor || "#1E293B"}
                onChange={(val) => handleTooltipPropertyChange("backgroundColor", val)}
              />
            </div>
            <div>
              <Label htmlFor="tooltip-text-color">Text Color</Label>
              <ColorPalettePicker
                label="Text Color"
                value={component.props.tooltip?.textColor || "#FFFFFF"}
                onChange={(val) => handleTooltipPropertyChange("textColor", val)}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="tooltip-show-arrow"
              checked={tooltip.showArrow !== false}
              onChange={(e) => handleTooltipPropertyChange("showArrow", e.target.checked)}
              className="mr-2"
            />
            <Label htmlFor="tooltip-show-arrow">Show Arrow</Label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Edit {componentDefinition.name}</h3>
      <div className="space-y-2">
        {!showTooltipEditor && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addTooltip} 
            className="mb-4 w-full justify-start"
          >
            <Plus size={16} className="mr-1" />
            Add Tooltip
          </Button>
        )}

        {/* Show tooltip editor if enabled */}
        {renderTooltipEditor()}

        {/* Show accordion for component properties */}
        <Accordion type="single" collapsible defaultValue="properties">
          <AccordionItem value="properties">
            <AccordionTrigger className="text-sm font-medium">Component Properties</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                {componentDefinition.availableProps.map((prop) => renderPropertyEditor(prop))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ComponentEditor;
