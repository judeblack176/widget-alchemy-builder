
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import PropertyField from "./PropertyField";
import { getPropertyDefinitions } from "../propertyDefinitions";

interface HeaderPropertiesProps {
  component: WidgetComponent;
  onUpdateComponent: (updatedComponent: WidgetComponent) => void;
}

const HeaderProperties: React.FC<HeaderPropertiesProps> = ({
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
  // Extract the properties we want to show
  const iconProperty = propertyDefinitions.find(p => p.name === 'icon');
  const nameProperty = propertyDefinitions.find(p => p.name === 'name');
  const otherProperties = propertyDefinitions.filter(p => !['icon', 'name'].includes(p.name));
  
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Properties</h3>
      <div className="space-y-1">
        {/* Always show icon first */}
        {iconProperty && (
          <PropertyField 
            property={iconProperty} 
            value={component.props?.[iconProperty.name]} 
            onChange={handlePropertyChange} 
          />
        )}
        
        {/* Then show name */}
        {nameProperty && (
          <PropertyField 
            property={nameProperty} 
            value={component.props?.[nameProperty.name]} 
            onChange={handlePropertyChange} 
          />
        )}
        
        {/* Then show other properties */}
        {otherProperties.map(property => (
          <PropertyField 
            key={property.name}
            property={property} 
            value={component.props?.[property.name]} 
            onChange={handlePropertyChange} 
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderProperties;
