
import React from "react";
import { WidgetComponent } from "@/types/widget-types";
import { getPropertyDefinitions } from "../propertyDefinitions";
import IconField from "./IconField";

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
  
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Icon</h3>
      <div className="space-y-1">
        {/* Show icon property */}
        {iconProperty && (
          <IconField 
            property={iconProperty} 
            value={component.props?.[iconProperty.name]} 
            onChange={handlePropertyChange} 
          />
        )}
      </div>
    </div>
  );
};

export default HeaderProperties;
