
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
  // Only show icon property 
  const iconProperty = propertyDefinitions.find(p => p.name === 'icon');
  
  // Filter out properties we want to remove
  const otherProperties = propertyDefinitions.filter(p => 
    !['icon', 'name', 'backgroundColor', 'textColor', 'fontFamily', 'bold', 'italic'].includes(p.name)
  );
  
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
        
        {/* Show remaining properties */}
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
