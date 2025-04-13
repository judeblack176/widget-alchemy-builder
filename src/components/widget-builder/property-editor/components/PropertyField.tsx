
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPalettePicker from "../../ColorPalettePicker";
import IconSelector from "./IconSelector";
import { PropertyDefinition } from "../propertyDefinitions";

interface PropertyFieldProps {
  property: PropertyDefinition;
  value: any;
  onChange: (propertyName: string, value: any) => void;
}

const PropertyField: React.FC<PropertyFieldProps> = ({
  property,
  value,
  onChange
}) => {
  switch (property.type) {
    case "icon":
      return (
        <IconSelector
          value={value || ""}
          label={property.label}
          onChange={(newValue) => onChange(property.name, newValue)}
        />
      );
    case "color":
      return (
        <ColorPalettePicker
          key={property.name}
          label={property.label}
          value={value || "#FFFFFF"}
          onChange={(newValue) => onChange(property.name, newValue)}
          className="mb-4"
        />
      );
    case "text":
      return (
        <div className="mb-4">
          <Label htmlFor={`prop-${property.name}`}>{property.label}</Label>
          <Input
            id={`prop-${property.name}`}
            value={value || ""}
            onChange={(e) => onChange(property.name, e.target.value)}
          />
        </div>
      );
    case "select":
      return (
        <div className="mb-4">
          <Label htmlFor={`prop-${property.name}`}>{property.label}</Label>
          <Select
            value={String(value)}
            onValueChange={(val) => {
              // Convert string values to appropriate types
              let finalValue: string | boolean | number = val;
              if (val === "true") finalValue = true;
              else if (val === "false") finalValue = false;
              else if (property.name === "autoClose" && val !== "false") {
                finalValue = parseInt(val, 10);
              }
              onChange(property.name, finalValue);
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

export default PropertyField;
