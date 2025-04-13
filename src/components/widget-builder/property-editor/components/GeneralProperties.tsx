
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import PropertyField from "./PropertyField";
import { getPropertyDefinitions } from "../propertyDefinitions";

interface GeneralPropertiesProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const GeneralProperties: React.FC<GeneralPropertiesProps> = ({
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

  // Get property definitions but reorder for alert components
  let propertyDefinitions = getPropertyDefinitions(component.type);
  
  // For alert components, reorder properties to put title above type
  if (component.type === 'alert') {
    // Find title and type definitions
    const titleDef = propertyDefinitions.find(p => p.name === 'title');
    const typeDef = propertyDefinitions.find(p => p.name === 'type');
    
    // If both exist, reorder them
    if (titleDef && typeDef) {
      propertyDefinitions = propertyDefinitions
        .filter(p => p.name !== 'title' && p.name !== 'type') // Remove both
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort other props
      
      // Add title first, then type, then other properties
      propertyDefinitions = [titleDef, typeDef, ...propertyDefinitions];
    }
  }
  
  // Change header title for alert components to "Alert Settings"
  const headerTitle = component.type === 'alert' ? "Alert Settings" : "Properties";

  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">{headerTitle}</h3>
      <div className="space-y-1">
        {propertyDefinitions.map((property) => {
          // Skip content property as it's in ContentFieldsManager
          if (property.name === "content") {
            return null;
          }
          
          // Skip text-related properties for text components as they're in ContentFieldsManager
          if (component.type === "text" && ["size", "color", "bold", "italic"].includes(property.name)) {
            return null;
          }
          
          return (
            <PropertyField 
              key={property.name}
              property={property} 
              value={component.props?.[property.name]} 
              onChange={handlePropertyChange} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default GeneralProperties;
