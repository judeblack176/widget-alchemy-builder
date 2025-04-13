
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ColorPalettePicker from "../ColorPalettePicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Library,
  Bell,
  Bookmark,
  FileText,
  User,
  Info,
  Globe,
  Home,
  Mail,
  Map,
  Phone,
  ShoppingBag,
  Star,
  Coffee
} from 'lucide-react';
import { getPropertyDefinitions } from "./propertyDefinitions";

interface PropertyEditorProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent
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
    // Skip content property as we've moved it to ContentFieldsManager
    if (property.name === "content") {
      return null;
    }
    
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
        // Skip text-related properties for text components as they're in ContentFieldsManager
        if (component.type === "text" && ["size", "color", "bold", "italic"].includes(property.name)) {
          return null;
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
        // Skip text-related properties for text components as they're in ContentFieldsManager
        if (component.type === "text" && ["size", "bold", "italic"].includes(property.name)) {
          return null;
        }
        return (
          <div key={property.name} className="mb-4">
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

  const propertyDefinitions = getPropertyDefinitions(component.type);

  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Properties</h3>
      <div className="space-y-1">
        {/* For header components, explicitly force icon to be first in order and name second */}
        {component.type === 'header' ? (
          <>
            {propertyDefinitions
              .filter(property => property.name === 'icon')
              .map(property => renderPropertyEditor(property))}
              
            {propertyDefinitions
              .filter(property => property.name === 'name')
              .map(property => renderPropertyEditor(property))}
              
            {propertyDefinitions
              .filter(property => !['icon', 'name'].includes(property.name))
              .map(property => renderPropertyEditor(property))}
          </>
        ) : (
          propertyDefinitions.map((property) => renderPropertyEditor(property))
        )}
      </div>
    </div>
  );
};

export default PropertyEditor;
