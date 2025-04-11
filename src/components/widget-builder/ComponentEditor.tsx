
import React from "react";
import { WidgetComponent, ComponentDefinition, ApiConfig } from "@/types/widget-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPalettePicker from "./ColorPalettePicker";

interface ComponentEditorProps {
  component: WidgetComponent;
  componentDefinition: ComponentDefinition;
  apis: ApiConfig[];
  onUpdate: (updatedComponent: WidgetComponent) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  componentDefinition,
  apis,
  onUpdate,
}) => {
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
    <div>
      <h3 className="text-lg font-medium mb-4">Edit {componentDefinition.name}</h3>
      <div className="space-y-2">
        {componentDefinition.availableProps.map((prop) => renderPropertyEditor(prop))}
      </div>
    </div>
  );
};

export default ComponentEditor;
