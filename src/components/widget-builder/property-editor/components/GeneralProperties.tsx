
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

  const propertyDefinitions = getPropertyDefinitions(component.type);
  
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Properties</h3>
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
